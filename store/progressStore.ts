import { create } from 'zustand';

import { appStorage, deleteAppStorageValue, persistAppStorageValue } from '@/lib/appStorage';
import {
  detectNewlyCompletedPathId,
  reconcileCompletedPathIds,
} from '@/lib/pathCompletion';
import { normalizeProgressSnapshot } from '@/lib/progressMerge';
import { getTodayDateKey } from '@/lib/dailyOrbGoal';
import { syncDailyOrbState } from '@/lib/dailyOrbHistory';
import { syncDailyGoalReminder } from '@/lib/dailyGoalNotifications';
import {
  DEFAULT_PROGRESS,
  DEFAULT_STREAK_DAY_FLAGS,
  type PathProgressRecord,
  type ProgressSnapshot,
  type PromptScoreHistoryEntry,
} from '@/lib/progressTypes';
import { applyLessonCompletionStreak } from '@/lib/streak';
import {
  getFirstLessonIdForPath,
  getNextLessonId,
  getPathIdForLesson,
  getPathTemplate,
} from '@/lib/pathLessonUtils';

export const PROGRESS_STORAGE_KEY = 'structai.progress.v1';

export type {
  PathProgressRecord,
  ProgressSnapshot,
  PromptScoreHistoryEntry,
} from '@/lib/progressTypes';
export { DEFAULT_PROGRESS } from '@/lib/progressTypes';

type ProgressActions = {
  hydrate: () => void;
  reset: () => void;
  persistSnapshot: (snapshot: ProgressSnapshot) => void;
  getSnapshot: () => ProgressSnapshot;
  recordLessonOpened: (lessonId: string) => void;
  recordLessonFailed: (lessonId: string) => void;
  completeLesson: (lessonId: string, orbsEarned: number) => string | null;
  setDailyOrbGoal: (dailyOrbGoal: number, notificationsEnabled: boolean) => void;
  addPromptScore: (score: number, prompt?: string) => void;
  getResumeLessonId: (pathId: string) => string | undefined;
  getActivePaths: () => Array<{
    id: string;
    titleKey: string;
    currentChapter: number;
    totalChapters: number;
    progress: number;
    resumeLessonId: string;
  }>;
};

type ProgressStore = ProgressSnapshot & ProgressActions;

function readProgressSnapshot(): ProgressSnapshot {
  const raw = appStorage.getString(PROGRESS_STORAGE_KEY);

  if (!raw) {
    return { ...DEFAULT_PROGRESS, streakDays: [...DEFAULT_STREAK_DAY_FLAGS] };
  }

  try {
    const parsed = JSON.parse(raw) as Partial<ProgressSnapshot>;
    return normalizeProgressSnapshot(parsed);
  } catch {
    return { ...DEFAULT_PROGRESS, streakDays: [...DEFAULT_STREAK_DAY_FLAGS] };
  }
}

function writeProgressSnapshot(snapshot: ProgressSnapshot): void {
  const serialized = JSON.stringify(snapshot);
  appStorage.set(PROGRESS_STORAGE_KEY, serialized);
  void persistAppStorageValue(PROGRESS_STORAGE_KEY, serialized);
}

function scheduleProgressSync(snapshot: ProgressSnapshot): void {
  void import('@/lib/progressSync').then(({ queueProgressSync }) => {
    queueProgressSync(snapshot);
  });
}

function persistAndSync(snapshot: ProgressSnapshot): void {
  writeProgressSnapshot(snapshot);
  scheduleProgressSync(snapshot);
}

function toProgressSnapshot(state: ProgressStore): ProgressSnapshot {
  return {
    orbCount: state.orbCount,
    dailyOrbGoal: state.dailyOrbGoal,
    orbsEarnedToday: state.orbsEarnedToday,
    dailyGoalDateKey: state.dailyGoalDateKey,
    dailyGoalNotificationsEnabled: state.dailyGoalNotificationsEnabled,
    dailyOrbHistory: state.dailyOrbHistory,
    completedLessons: state.completedLessons,
    currentStreak: state.currentStreak,
    streakDays: state.streakDays,
    pathProgress: state.pathProgress,
    completedPathIds: state.completedPathIds,
    pathCompletedAt: state.pathCompletedAt,
    promptScoreHistory: state.promptScoreHistory,
  };
}

function withFreshDailyProgress(state: ProgressStore): Pick<
  ProgressSnapshot,
  'dailyOrbHistory' | 'orbsEarnedToday' | 'dailyGoalDateKey'
> {
  return syncDailyOrbState(
    state.dailyOrbHistory ?? {},
    state.orbsEarnedToday,
    state.dailyGoalDateKey,
    getTodayDateKey(),
  );
}

function pathTitleKey(pathId: string): string {
  return `paths.title.${pathId.replace(/-/g, '_')}`;
}

function ensurePathProgress(
  pathProgress: Record<string, PathProgressRecord>,
  pathId: string,
  lessonId: string,
): PathProgressRecord {
  const existing = pathProgress[pathId];

  if (existing) {
    return {
      ...existing,
      failedLessonIds: existing.failedLessonIds ?? [],
    };
  }

  const template = getPathTemplate(pathId);
  const firstLesson = getFirstLessonIdForPath(pathId) ?? lessonId;

  return {
    completedLessonIds: [],
    failedLessonIds: [],
    currentLessonId: firstLesson,
    lastTouchedLessonId: lessonId,
    progress: 0,
  };
}

function computePathProgressRatio(pathId: string, completedIds: string[]): number {
  const template = getPathTemplate(pathId);

  if (!template || template.totalChapters === 0) {
    return 0;
  }

  return Math.min(1, completedIds.length / template.totalChapters);
}

export const useProgressStore = create<ProgressStore>((set, get) => ({
  ...DEFAULT_PROGRESS,
  streakDays: [...DEFAULT_STREAK_DAY_FLAGS],

  hydrate: () => {
    const snapshot = readProgressSnapshot();
    const dailyProgress = syncDailyOrbState(
      snapshot.dailyOrbHistory ?? {},
      snapshot.orbsEarnedToday,
      snapshot.dailyGoalDateKey,
      getTodayDateKey(),
    );

    set({
      ...snapshot,
      ...dailyProgress,
    });
  },

  reset: () => {
    const fresh = {
      ...DEFAULT_PROGRESS,
      streakDays: [...DEFAULT_STREAK_DAY_FLAGS],
    };
    writeProgressSnapshot(fresh);
    set(fresh);
  },

  persistSnapshot: (snapshot) => {
    writeProgressSnapshot(snapshot);
    set(snapshot);
  },

  getSnapshot: () => toProgressSnapshot(get()),

  recordLessonFailed: (lessonId) => {
    const pathId = getPathIdForLesson(lessonId);

    if (!pathId) {
      return;
    }

    set((state) => {
      const pathRecord = ensurePathProgress(state.pathProgress, pathId, lessonId);
      const failedSet = new Set(pathRecord.failedLessonIds);

      if (!pathRecord.completedLessonIds.includes(lessonId)) {
        failedSet.add(lessonId);
      }

      const nextLessonId = getNextLessonId(pathId, lessonId);
      const resumeLessonId = nextLessonId ?? lessonId;

      const nextPathProgress = {
        ...state.pathProgress,
        [pathId]: {
          ...pathRecord,
          failedLessonIds: [...failedSet],
          lastTouchedLessonId: resumeLessonId,
          currentLessonId: resumeLessonId,
        },
      };

      const snapshot: ProgressSnapshot = {
        ...toProgressSnapshot(state),
        pathProgress: nextPathProgress,
      };

      persistAndSync(snapshot);

      return snapshot;
    });
  },

  recordLessonOpened: (lessonId) => {
    const pathId = getPathIdForLesson(lessonId);

    if (!pathId) {
      return;
    }

    set((state) => {
      const pathRecord = ensurePathProgress(state.pathProgress, pathId, lessonId);
      const nextPathProgress = {
        ...state.pathProgress,
        [pathId]: {
          ...pathRecord,
          lastTouchedLessonId: lessonId,
          currentLessonId: pathRecord.currentLessonId || lessonId,
        },
      };

      const snapshot: ProgressSnapshot = {
        ...toProgressSnapshot(state),
        pathProgress: nextPathProgress,
      };

      writeProgressSnapshot(snapshot);

      return snapshot;
    });
  },

  completeLesson: (lessonId, orbsEarned) => {
    const pathId = getPathIdForLesson(lessonId);

    if (!pathId) {
      return null;
    }

    let newlyCompletedPathId: string | null = null;

    set((state) => {
      const pathRecord = ensurePathProgress(state.pathProgress, pathId, lessonId);
      const completedSet = new Set(pathRecord.completedLessonIds);

      if (!completedSet.has(lessonId)) {
        completedSet.add(lessonId);
      }

      const completedLessonIds = [...completedSet];
      const failedLessonIds = pathRecord.failedLessonIds.filter((id) => id !== lessonId);
      const nextLessonId = getNextLessonId(pathId, lessonId) ?? lessonId;
      const progress = computePathProgressRatio(pathId, completedLessonIds);
      const wasAlreadyCompleted = pathRecord.completedLessonIds.includes(lessonId);
      const awardedOrbs = wasAlreadyCompleted ? 0 : orbsEarned;

      const nextPathRecord: PathProgressRecord = {
        completedLessonIds,
        failedLessonIds,
        currentLessonId: nextLessonId,
        lastTouchedLessonId: lessonId,
        progress,
      };

      newlyCompletedPathId = detectNewlyCompletedPathId(
        pathId,
        nextPathRecord,
        state.completedPathIds,
      );

      const completedPathIds =
        newlyCompletedPathId !== null
          ? [...state.completedPathIds, newlyCompletedPathId]
          : state.completedPathIds;

      const pathCompletedAt =
        newlyCompletedPathId !== null
          ? {
              ...state.pathCompletedAt,
              [newlyCompletedPathId]: new Date().toISOString(),
            }
          : state.pathCompletedAt;

      const streakUpdate = applyLessonCompletionStreak(
        {
          currentStreak: state.currentStreak,
          streakDays: state.streakDays,
        },
        { isNewCompletion: !wasAlreadyCompleted },
      );

      const dailyProgress = withFreshDailyProgress(state);
      const orbsEarnedToday =
        awardedOrbs > 0 ? dailyProgress.orbsEarnedToday + awardedOrbs : dailyProgress.orbsEarnedToday;
      const syncedDaily = syncDailyOrbState(
        dailyProgress.dailyOrbHistory,
        orbsEarnedToday,
        dailyProgress.dailyGoalDateKey,
      );

      const snapshot: ProgressSnapshot = {
        ...toProgressSnapshot(state),
        orbCount: state.orbCount + awardedOrbs,
        orbsEarnedToday: syncedDaily.orbsEarnedToday,
        dailyGoalDateKey: syncedDaily.dailyGoalDateKey,
        dailyOrbHistory: syncedDaily.dailyOrbHistory,
        completedLessons: wasAlreadyCompleted
          ? state.completedLessons
          : state.completedLessons + 1,
        currentStreak: streakUpdate.currentStreak,
        streakDays: streakUpdate.streakDays,
        pathProgress: {
          ...state.pathProgress,
          [pathId]: nextPathRecord,
        },
        completedPathIds,
        pathCompletedAt,
      };

      persistAndSync(snapshot);

      return snapshot;
    });

    return newlyCompletedPathId;
  },

  setDailyOrbGoal: (dailyOrbGoal, notificationsEnabled) => {
    set((state) => {
      const dailyProgress = withFreshDailyProgress(state);
      const snapshot: ProgressSnapshot = {
        ...toProgressSnapshot(state),
        dailyOrbGoal,
        orbsEarnedToday: dailyProgress.orbsEarnedToday,
        dailyGoalDateKey: dailyProgress.dailyGoalDateKey,
        dailyOrbHistory: dailyProgress.dailyOrbHistory,
        dailyGoalNotificationsEnabled: notificationsEnabled,
      };

      persistAndSync(snapshot);
      void syncDailyGoalReminder(notificationsEnabled);

      return snapshot;
    });
  },

  addPromptScore: (score, prompt) => {
    set((state) => {
      const trimmedPrompt = prompt?.trim();
      const snapshot: ProgressSnapshot = {
        ...state,
        promptScoreHistory: [
          ...state.promptScoreHistory.slice(-9),
          {
            score,
            recordedAt: new Date().toISOString(),
            ...(trimmedPrompt ? { prompt: trimmedPrompt } : {}),
          },
        ],
      };

      writeProgressSnapshot(snapshot);

      return snapshot;
    });
  },

  getResumeLessonId: (pathId) => {
    const record = get().pathProgress[pathId];

    if (!record) {
      return getFirstLessonIdForPath(pathId);
    }

    return record.lastTouchedLessonId || record.currentLessonId;
  },

  getActivePaths: () => {
    const { pathProgress } = get();

    return Object.entries(pathProgress)
      .map(([pathId, record]) => {
        const template = getPathTemplate(pathId);

        if (!template) {
          return null;
        }

        const currentChapter = Math.min(
          template.totalChapters,
          record.completedLessonIds.length + 1,
        );

        return {
          id: pathId,
          titleKey: pathTitleKey(pathId),
          currentChapter,
          totalChapters: template.totalChapters,
          progress: record.progress,
          resumeLessonId: record.lastTouchedLessonId || record.currentLessonId,
        };
      })
      .filter((entry): entry is NonNullable<typeof entry> => entry !== null);
  },
}));

/** Außerhalb von React: Fortschritt löschen (Dev-Reset). */
export function clearPersistedProgress(): void {
  appStorage.delete(PROGRESS_STORAGE_KEY);
  void deleteAppStorageValue(PROGRESS_STORAGE_KEY);
}
