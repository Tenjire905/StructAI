import { getPathTemplate } from '@/lib/pathLessonUtils';
import { reconcileCompletedPathIds } from '@/lib/pathCompletion';
import {
  DEFAULT_PROGRESS,
  type PathProgressRecord,
  type PersistedSkillSummary,
  type PersistedSkillTag,
  type ProgressSnapshot,
  type PromptScoreHistoryEntry,
} from '@/lib/progressTypes';
import {
  DEFAULT_DAILY_ORB_GOAL,
  getTodayDateKey,
} from '@/lib/dailyOrbGoal';
import { mergeDailyOrbHistory, syncDailyOrbState } from '@/lib/dailyOrbHistory';

/** Proposed conflict strategy – active on login when local and remote both exist. */
export const PROGRESS_MERGE_STRATEGY = 'max-union-per-field' as const;

export type ProgressMergeStrategy = typeof PROGRESS_MERGE_STRATEGY;

function unionUnique(values: string[]): string[] {
  return [...new Set(values)];
}

function computePathProgressRatio(pathId: string, completedIds: string[]): number {
  const template = getPathTemplate(pathId);

  if (!template || template.totalChapters === 0) {
    return 0;
  }

  return Math.min(1, completedIds.length / template.totalChapters);
}

function mergePathRecord(
  pathId: string,
  local: PathProgressRecord | undefined,
  remote: PathProgressRecord | undefined,
): PathProgressRecord {
  if (!local && remote) {
    return {
      ...remote,
      failedLessonIds: remote.failedLessonIds ?? [],
    };
  }

  if (local && !remote) {
    return {
      ...local,
      failedLessonIds: local.failedLessonIds ?? [],
    };
  }

  if (!local || !remote) {
    return {
      completedLessonIds: [],
      failedLessonIds: [],
      currentLessonId: '',
      lastTouchedLessonId: '',
      progress: 0,
    };
  }

  const completedLessonIds = unionUnique([
    ...local.completedLessonIds,
    ...remote.completedLessonIds,
  ]);
  const failedLessonIds = unionUnique([
    ...local.failedLessonIds,
    ...remote.failedLessonIds,
  ]).filter((lessonId) => !completedLessonIds.includes(lessonId));

  const preferLocalCurrent =
    local.completedLessonIds.length >= remote.completedLessonIds.length;

  return {
    completedLessonIds,
    failedLessonIds,
    currentLessonId: preferLocalCurrent
      ? local.currentLessonId
      : remote.currentLessonId,
    lastTouchedLessonId: preferLocalCurrent
      ? local.lastTouchedLessonId
      : remote.lastTouchedLessonId,
    progress: computePathProgressRatio(pathId, completedLessonIds),
  };
}

function mergeStreakDays(local: boolean[], remote: boolean[]): boolean[] {
  const length = Math.max(local.length, remote.length, 7);

  return Array.from({ length: 7 }, (_, index) =>
    Boolean(local[index] || remote[index]),
  );
}

function mergePathCompletedAt(
  local: Record<string, string>,
  remote: Record<string, string>,
): Record<string, string> {
  const keys = unionUnique([...Object.keys(local), ...Object.keys(remote)]);
  const merged: Record<string, string> = {};

  for (const pathId of keys) {
    const localValue = local[pathId];
    const remoteValue = remote[pathId];

    if (localValue && remoteValue) {
      merged[pathId] =
        new Date(localValue).getTime() <= new Date(remoteValue).getTime()
          ? localValue
          : remoteValue;
      continue;
    }

    merged[pathId] = localValue ?? remoteValue ?? '';
  }

  return merged;
}

function normalizePromptScoreEntry(
  entry: unknown,
  index: number,
  total: number,
): PromptScoreHistoryEntry | null {
  if (typeof entry === 'number' && Number.isFinite(entry)) {
    return {
      score: entry,
      recordedAt: new Date(Date.now() - (total - index) * 60_000).toISOString(),
    };
  }

  if (entry && typeof entry === 'object' && 'score' in entry) {
    const score = Number((entry as PromptScoreHistoryEntry).score);
    const recordedAt = (entry as PromptScoreHistoryEntry).recordedAt;

    if (!Number.isFinite(score)) {
      return null;
    }

    return {
      score,
      recordedAt:
        typeof recordedAt === 'string' && recordedAt.length > 0
          ? recordedAt
          : new Date(Date.now() - (total - index) * 60_000).toISOString(),
    };
  }

  return null;
}

export function normalizePromptScoreHistory(raw: unknown): PromptScoreHistoryEntry[] {
  if (!Array.isArray(raw)) {
    return [];
  }

  return raw
    .map((entry, index) => normalizePromptScoreEntry(entry, index, raw.length))
    .filter((entry): entry is PromptScoreHistoryEntry => entry !== null);
}

export function mergePromptScoreHistory(
  local: PromptScoreHistoryEntry[],
  remote: PromptScoreHistoryEntry[],
): PromptScoreHistoryEntry[] {
  const seen = new Set<string>();

  return [...local, ...remote]
    .filter((entry) => {
      const key = `${entry.recordedAt}|${entry.score}`;
      if (seen.has(key)) {
        return false;
      }

      seen.add(key);
      return true;
    })
    .sort(
      (left, right) =>
        new Date(left.recordedAt).getTime() - new Date(right.recordedAt).getTime(),
    )
    .slice(-10);
}

function normalizeSkillTags(raw: unknown): PersistedSkillTag[] {
  if (!Array.isArray(raw)) {
    return [];
  }

  return raw
    .map((entry) => {
      if (!entry || typeof entry !== 'object') {
        return null;
      }

      const id = (entry as PersistedSkillTag).id;
      const term = (entry as PersistedSkillTag).term;

      if (typeof id !== 'string' || typeof term !== 'string' || !id || !term) {
        return null;
      }

      return { id, term };
    })
    .filter((entry): entry is PersistedSkillTag => entry !== null);
}

export function normalizeLastSkillSummary(raw: unknown): PersistedSkillSummary | null {
  if (!raw || typeof raw !== 'object') {
    return null;
  }

  const record = raw as PersistedSkillSummary;
  const practiced = normalizeSkillTags(record.practiced);

  if (practiced.length === 0) {
    return null;
  }

  return {
    practiced,
    improved: normalizeSkillTags(record.improved),
    missed: normalizeSkillTags(record.missed),
    lessonId: typeof record.lessonId === 'string' ? record.lessonId : '',
    recordedAt:
      typeof record.recordedAt === 'string' && record.recordedAt.length > 0
        ? record.recordedAt
        : new Date().toISOString(),
  };
}

export function mergeLastSkillSummary(
  local: PersistedSkillSummary | null | undefined,
  remote: PersistedSkillSummary | null | undefined,
): PersistedSkillSummary | null {
  const normalizedLocal = normalizeLastSkillSummary(local);
  const normalizedRemote = normalizeLastSkillSummary(remote);

  if (!normalizedLocal) {
    return normalizedRemote;
  }

  if (!normalizedRemote) {
    return normalizedLocal;
  }

  return new Date(normalizedLocal.recordedAt).getTime() >=
    new Date(normalizedRemote.recordedAt).getTime()
    ? normalizedLocal
    : normalizedRemote;
}

export function isProgressSnapshotEmpty(snapshot: ProgressSnapshot): boolean {
  return (
    snapshot.completedLessons === 0 &&
    snapshot.orbCount === 0 &&
    snapshot.promptScoreHistory.length === 0 &&
    Object.keys(snapshot.pathProgress).length === 0
  );
}

/**
 * Union / max merge – proposed for multi-device offline conflicts.
 * Keeps the superset of completed lessons and the higher orb/streak values.
 */
export function mergeProgressSnapshots(
  local: ProgressSnapshot,
  remote: ProgressSnapshot,
): ProgressSnapshot {
  const pathIds = unionUnique([
    ...Object.keys(local.pathProgress),
    ...Object.keys(remote.pathProgress),
  ]);

  const pathProgress = Object.fromEntries(
    pathIds.map((pathId) => [
      pathId,
      mergePathRecord(pathId, local.pathProgress[pathId], remote.pathProgress[pathId]),
    ]),
  );

  const completedLessons = Math.max(local.completedLessons, remote.completedLessons);
  const completedPathIds = reconcileCompletedPathIds(
    pathProgress,
    unionUnique([...(local.completedPathIds ?? []), ...(remote.completedPathIds ?? [])]),
  );
  const pathCompletedAt = mergePathCompletedAt(
    local.pathCompletedAt ?? {},
    remote.pathCompletedAt ?? {},
  );

  return {
    orbCount: Math.max(local.orbCount, remote.orbCount),
    dailyOrbGoal: Math.max(local.dailyOrbGoal, remote.dailyOrbGoal),
    orbsEarnedToday: Math.max(local.orbsEarnedToday, remote.orbsEarnedToday),
    dailyGoalDateKey:
      local.dailyGoalDateKey >= remote.dailyGoalDateKey
        ? local.dailyGoalDateKey
        : remote.dailyGoalDateKey,
    dailyGoalNotificationsEnabled:
      local.dailyGoalNotificationsEnabled || remote.dailyGoalNotificationsEnabled,
    dailyOrbHistory: mergeDailyOrbHistory(local.dailyOrbHistory, remote.dailyOrbHistory),
    completedLessons,
    currentStreak: Math.max(local.currentStreak, remote.currentStreak),
    streakDays: mergeStreakDays(local.streakDays, remote.streakDays),
    pathProgress,
    completedPathIds,
    pathCompletedAt,
    promptScoreHistory: mergePromptScoreHistory(
      normalizePromptScoreHistory(local.promptScoreHistory),
      normalizePromptScoreHistory(remote.promptScoreHistory),
    ),
    lastSkillSummary: mergeLastSkillSummary(local.lastSkillSummary, remote.lastSkillSummary),
  };
}

export function normalizeProgressSnapshot(
  partial: Partial<ProgressSnapshot> | null | undefined,
): ProgressSnapshot {
  if (!partial) {
    return { ...DEFAULT_PROGRESS, streakDays: [...DEFAULT_PROGRESS.streakDays] };
  }

  const todayKey = getTodayDateKey();
  const dailyOrbGoal =
    partial.dailyOrbGoal ??
    (typeof partial.orbMax === 'number' && partial.orbMax > 0 && partial.orbMax <= 500
      ? partial.orbMax
      : DEFAULT_DAILY_ORB_GOAL);
  const dailyProgress = syncDailyOrbState(
    partial.dailyOrbHistory ?? {},
    partial.orbsEarnedToday ?? 0,
    partial.dailyGoalDateKey,
    todayKey,
  );

  return {
    ...DEFAULT_PROGRESS,
    ...partial,
    dailyOrbGoal,
    orbsEarnedToday: dailyProgress.orbsEarnedToday,
    dailyGoalDateKey: dailyProgress.dailyGoalDateKey,
    dailyOrbHistory: dailyProgress.dailyOrbHistory,
    dailyGoalNotificationsEnabled: partial.dailyGoalNotificationsEnabled ?? false,
    streakDays: partial.streakDays ?? [...DEFAULT_PROGRESS.streakDays],
    pathProgress: partial.pathProgress ?? {},
    completedPathIds: partial.completedPathIds ?? [],
    pathCompletedAt: partial.pathCompletedAt ?? {},
    promptScoreHistory: normalizePromptScoreHistory(partial.promptScoreHistory),
    lastSkillSummary: normalizeLastSkillSummary(partial.lastSkillSummary),
  };
}
