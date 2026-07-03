import { create } from 'zustand';

import { appStorage } from '@/lib/appStorage';
import {
  detectNewlyCompletedPathId,
  reconcileCompletedPathIds,
} from '@/lib/pathCompletion';
import {
  getFirstLessonIdForPath,
  getNextLessonId,
  getPathIdForLesson,
  getPathTemplate,
} from '@/lib/pathLessonUtils';

export const PROGRESS_STORAGE_KEY = 'structai.progress.v1';

export type PathProgressRecord = {
  completedLessonIds: string[];
  failedLessonIds: string[];
  currentLessonId: string;
  lastTouchedLessonId: string;
  progress: number;
};

export type ProgressSnapshot = {
  orbCount: number;
  orbMax: number;
  completedLessons: number;
  currentStreak: number;
  streakDays: boolean[];
  pathProgress: Record<string, PathProgressRecord>;
  completedPathIds: string[];
  pathCompletedAt: Record<string, string>;
  promptScoreHistory: number[];
};

type ProgressActions = {
  hydrate: () => void;
  reset: () => void;
  persistSnapshot: (snapshot: ProgressSnapshot) => void;
  getSnapshot: () => ProgressSnapshot;
  recordLessonOpened: (lessonId: string) => void;
  recordLessonFailed: (lessonId: string) => void;
  completeLesson: (lessonId: string, orbsEarned: number) => string | null;
  addPromptScore: (score: number) => void;
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

const DEFAULT_STREAK_DAYS: boolean[] = [false, false, false, false, false, false, false];

export const DEFAULT_PROGRESS: ProgressSnapshot = {
  orbCount: 0,
  orbMax: 200,
  completedLessons: 0,
  currentStreak: 0,
  streakDays: [...DEFAULT_STREAK_DAYS],
  pathProgress: {},
  completedPathIds: [],
  pathCompletedAt: {},
  promptScoreHistory: [],
};

function readProgressSnapshot(): ProgressSnapshot {
  const raw = appStorage.getString(PROGRESS_STORAGE_KEY);

  if (!raw) {
    return { ...DEFAULT_PROGRESS, streakDays: [...DEFAULT_STREAK_DAYS] };
  }

  try {
    const parsed = JSON.parse(raw) as Partial<ProgressSnapshot>;

    return {
      ...DEFAULT_PROGRESS,
      ...parsed,
      streakDays: parsed.streakDays ?? [...DEFAULT_STREAK_DAYS],
      pathProgress: parsed.pathProgress ?? {},
      completedPathIds: parsed.completedPathIds ?? [],
      pathCompletedAt: parsed.pathCompletedAt ?? {},
      promptScoreHistory: parsed.promptScoreHistory ?? [],
    };
  } catch {
    return { ...DEFAULT_PROGRESS, streakDays: [...DEFAULT_STREAK_DAYS] };
  }
}

function writeProgressSnapshot(snapshot: ProgressSnapshot): void {
  appStorage.set(PROGRESS_STORAGE_KEY, JSON.stringify(snapshot));
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
    orbMax: state.orbMax,
    completedLessons: state.completedLessons,
    currentStreak: state.currentStreak,
    streakDays: state.streakDays,
    pathProgress: state.pathProgress,
    completedPathIds: state.completedPathIds,
    pathCompletedAt: state.pathCompletedAt,
    promptScoreHistory: state.promptScoreHistory,
  };
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
  streakDays: [...DEFAULT_STREAK_DAYS],

  hydrate: () => {
    const snapshot = readProgressSnapshot();
    set(snapshot);
  },

  reset: () => {
    const fresh = {
      ...DEFAULT_PROGRESS,
      streakDays: [...DEFAULT_STREAK_DAYS],
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

      const nextPathProgress = {
        ...state.pathProgress,
        [pathId]: {
          ...pathRecord,
          failedLessonIds: [...failedSet],
          lastTouchedLessonId: lessonId,
          currentLessonId: pathRecord.currentLessonId || lessonId,
        },
      };

      const snapshot: ProgressSnapshot = {
        orbCount: state.orbCount,
        orbMax: state.orbMax,
        completedLessons: state.completedLessons,
        currentStreak: state.currentStreak,
        streakDays: state.streakDays,
        pathProgress: nextPathProgress,
        completedPathIds: state.completedPathIds,
        pathCompletedAt: state.pathCompletedAt,
        promptScoreHistory: state.promptScoreHistory,
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
        orbCount: state.orbCount,
        orbMax: state.orbMax,
        completedLessons: state.completedLessons,
        currentStreak: state.currentStreak,
        streakDays: state.streakDays,
        pathProgress: nextPathProgress,
        completedPathIds: state.completedPathIds,
        pathCompletedAt: state.pathCompletedAt,
        promptScoreHistory: state.promptScoreHistory,
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

      const snapshot: ProgressSnapshot = {
        orbCount: state.orbCount + awardedOrbs,
        orbMax: state.orbMax,
        completedLessons: wasAlreadyCompleted
          ? state.completedLessons
          : state.completedLessons + 1,
        currentStreak: state.currentStreak,
        streakDays: state.streakDays,
        pathProgress: {
          ...state.pathProgress,
          [pathId]: nextPathRecord,
        },
        completedPathIds,
        pathCompletedAt,
        promptScoreHistory: state.promptScoreHistory,
      };

      persistAndSync(snapshot);

      return snapshot;
    });

    return newlyCompletedPathId;
  },

  addPromptScore: (score) => {
    set((state) => {
      const snapshot: ProgressSnapshot = {
        ...state,
        promptScoreHistory: [...state.promptScoreHistory.slice(-9), score],
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
}
