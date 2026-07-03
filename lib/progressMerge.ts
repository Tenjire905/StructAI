import { getPathTemplate } from '@/lib/pathLessonUtils';
import type { PathProgressRecord, ProgressSnapshot } from '@/store/progressStore';
import { DEFAULT_PROGRESS } from '@/store/progressStore';

/** Proposed conflict strategy – not wired into login until product confirmation. */
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

  return {
    orbCount: Math.max(local.orbCount, remote.orbCount),
    orbMax: Math.max(local.orbMax, remote.orbMax),
    completedLessons,
    currentStreak: Math.max(local.currentStreak, remote.currentStreak),
    streakDays: mergeStreakDays(local.streakDays, remote.streakDays),
    pathProgress,
    promptScoreHistory: [
      ...local.promptScoreHistory,
      ...remote.promptScoreHistory,
    ].slice(-10),
  };
}

export function normalizeProgressSnapshot(
  partial: Partial<ProgressSnapshot> | null | undefined,
): ProgressSnapshot {
  if (!partial) {
    return { ...DEFAULT_PROGRESS, streakDays: [...DEFAULT_PROGRESS.streakDays] };
  }

  return {
    ...DEFAULT_PROGRESS,
    ...partial,
    streakDays: partial.streakDays ?? [...DEFAULT_PROGRESS.streakDays],
    pathProgress: partial.pathProgress ?? {},
    promptScoreHistory: partial.promptScoreHistory ?? [],
  };
}
