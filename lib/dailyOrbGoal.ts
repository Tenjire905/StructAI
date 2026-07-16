export const DAILY_ORB_GOAL_PRESETS = [25, 50, 75, 100] as const;

export const DEFAULT_DAILY_ORB_GOAL = 50;

export function getTodayDateKey(date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export function normalizeDailyOrbProgress(
  orbsEarnedToday: number,
  dailyGoalDateKey: string | undefined,
  todayKey = getTodayDateKey(),
): { orbsEarnedToday: number; dailyGoalDateKey: string } {
  if (dailyGoalDateKey !== todayKey) {
    return { orbsEarnedToday: 0, dailyGoalDateKey: todayKey };
  }

  return {
    orbsEarnedToday: Math.max(0, orbsEarnedToday),
    dailyGoalDateKey: todayKey,
  };
}

export function dailyGoalProgressRatio(orbsEarnedToday: number, dailyOrbGoal: number): number {
  if (dailyOrbGoal <= 0) {
    return 0;
  }

  return Math.min(1, Math.max(0, orbsEarnedToday / dailyOrbGoal));
}

export function isBelowDailyGoal(orbsEarnedToday: number, dailyOrbGoal: number): boolean {
  return dailyOrbGoal > 0 && orbsEarnedToday < dailyOrbGoal;
}
