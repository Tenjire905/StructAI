export type StreakSnapshot = {
  currentStreak: number;
  streakDays: boolean[];
};

type ApplyLessonCompletionStreakOptions = {
  now?: Date;
  isNewCompletion: boolean;
};

/** Monday = 0 … Sunday = 6 (matches streakWeekdayCopyKeys / StreakTracker). */
export function getStreakWeekdayIndex(date: Date): number {
  const day = date.getDay();

  return day === 0 ? 6 : day - 1;
}

export function applyLessonCompletionStreak(
  snapshot: StreakSnapshot,
  { now = new Date(), isNewCompletion }: ApplyLessonCompletionStreakOptions,
): StreakSnapshot {
  if (!isNewCompletion) {
    return {
      currentStreak: snapshot.currentStreak,
      streakDays: [...snapshot.streakDays],
    };
  }

  const todayIndex = getStreakWeekdayIndex(now);
  const streakDays = [...snapshot.streakDays];

  while (streakDays.length < 7) {
    streakDays.push(false);
  }

  if (streakDays[todayIndex]) {
    return {
      currentStreak: snapshot.currentStreak,
      streakDays,
    };
  }

  const yesterdayIndex = (todayIndex + 6) % 7;
  const wasYesterdayActive = streakDays[yesterdayIndex];

  streakDays[todayIndex] = true;

  return {
    currentStreak: wasYesterdayActive ? snapshot.currentStreak + 1 : 1,
    streakDays,
  };
}
