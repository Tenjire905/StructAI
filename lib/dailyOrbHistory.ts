import { getTodayDateKey } from '@/lib/dailyOrbGoal';

export const ACTIVITY_CHART_DAY_COUNT = 14;

export type DailyOrbDayEntry = {
  dateKey: string;
  label: string;
  orbs: number;
};

export function syncDailyOrbState(
  history: Record<string, number>,
  orbsEarnedToday: number,
  dailyGoalDateKey: string | undefined,
  todayKey = getTodayDateKey(),
): {
  dailyOrbHistory: Record<string, number>;
  orbsEarnedToday: number;
  dailyGoalDateKey: string;
} {
  const nextHistory = { ...history };
  let nextOrbs = Math.max(0, orbsEarnedToday);
  let nextKey = dailyGoalDateKey ?? todayKey;

  if (nextKey !== todayKey) {
    if (nextOrbs > 0) {
      nextHistory[nextKey] = Math.max(nextHistory[nextKey] ?? 0, nextOrbs);
    }

    nextOrbs = 0;
    nextKey = todayKey;
  }

  if (nextOrbs > 0) {
    nextHistory[todayKey] = Math.max(nextHistory[todayKey] ?? 0, nextOrbs);
  }

  return {
    dailyOrbHistory: nextHistory,
    orbsEarnedToday: nextOrbs,
    dailyGoalDateKey: nextKey,
  };
}

export function mergeDailyOrbHistory(
  local: Record<string, number> | undefined,
  remote: Record<string, number> | undefined,
): Record<string, number> {
  const merged: Record<string, number> = { ...(local ?? {}) };

  for (const [dateKey, remoteOrbs] of Object.entries(remote ?? {})) {
    merged[dateKey] = Math.max(merged[dateKey] ?? 0, remoteOrbs);
  }

  return merged;
}

export function getRecentDailyOrbEntries(
  history: Record<string, number>,
  dayCount = ACTIVITY_CHART_DAY_COUNT,
  referenceDate = new Date(),
  locale = 'de-DE',
): DailyOrbDayEntry[] {
  const entries: DailyOrbDayEntry[] = [];

  for (let offset = dayCount - 1; offset >= 0; offset -= 1) {
    const date = new Date(referenceDate);
    date.setHours(12, 0, 0, 0);
    date.setDate(date.getDate() - offset);

    const dateKey = getTodayDateKey(date);

    entries.push({
      dateKey,
      label: date.toLocaleDateString(locale, { day: 'numeric' }),
      orbs: history[dateKey] ?? 0,
    });
  }

  return entries;
}

export function computeProductivityPercent(
  entries: DailyOrbDayEntry[],
  dailyOrbGoal: number,
): number {
  if (entries.length === 0) {
    return 0;
  }

  if (dailyOrbGoal > 0) {
    const averageRatio =
      entries.reduce(
        (sum, entry) => sum + Math.min(1, entry.orbs / dailyOrbGoal),
        0,
      ) / entries.length;

    return Math.round(averageRatio * 100);
  }

  const activeDays = entries.filter((entry) => entry.orbs > 0).length;
  return Math.round((activeDays / entries.length) * 100);
}
