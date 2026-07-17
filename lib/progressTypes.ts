import { getTodayDateKey } from '@/lib/dailyOrbGoal';

export type PathProgressRecord = {
  completedLessonIds: string[];
  failedLessonIds: string[];
  currentLessonId: string;
  lastTouchedLessonId: string;
  progress: number;
};

export type PromptScoreHistoryEntry = {
  score: number;
  recordedAt: string;
};

export type ProgressSnapshot = {
  orbCount: number;
  /** @deprecated Legacy cap for removed focus ring — migrated to dailyOrbGoal. */
  orbMax?: number;
  dailyOrbGoal: number;
  orbsEarnedToday: number;
  dailyGoalDateKey: string;
  dailyGoalNotificationsEnabled: boolean;
  /** Orbs earned per calendar day (`YYYY-MM-DD`). */
  dailyOrbHistory: Record<string, number>;
  completedLessons: number;
  currentStreak: number;
  streakDays: boolean[];
  pathProgress: Record<string, PathProgressRecord>;
  completedPathIds: string[];
  pathCompletedAt: Record<string, string>;
  promptScoreHistory: PromptScoreHistoryEntry[];
};

const DEFAULT_STREAK_DAYS: boolean[] = [false, false, false, false, false, false, false];

export const DEFAULT_PROGRESS: ProgressSnapshot = {
  orbCount: 0,
  dailyOrbGoal: 0,
  orbsEarnedToday: 0,
  dailyGoalDateKey: getTodayDateKey(),
  dailyGoalNotificationsEnabled: false,
  dailyOrbHistory: {},
  completedLessons: 0,
  currentStreak: 0,
  streakDays: [...DEFAULT_STREAK_DAYS],
  pathProgress: {},
  completedPathIds: [],
  pathCompletedAt: {},
  promptScoreHistory: [],
};

export const DEFAULT_STREAK_DAY_FLAGS = DEFAULT_STREAK_DAYS;
