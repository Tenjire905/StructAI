import type { Href } from 'expo-router';

import { isDailyGoalSetupCompleted } from '@/lib/appStorage';

/**
 * Resolves the home destination, inserting the daily-goal setup screen
 * after the first completed lesson when setup has not been done yet.
 */
export function resolveHomeRoute(completedLessons: number): Href {
  if (completedLessons >= 1 && !isDailyGoalSetupCompleted()) {
    return '/onboarding/tagesziel';
  }

  return '/(tabs)';
}
