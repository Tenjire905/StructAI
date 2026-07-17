import type { ProgressSnapshot } from '@/lib/progressTypes';

import {
  isProfileOnboardingCompleted,
  isProfileOnboardingRequired,
  setProfileOnboardingCompleted,
} from './appStorage';

function countCompletedLessonsInPaths(
  pathProgress: ProgressSnapshot['pathProgress'],
): number {
  return Object.values(pathProgress).reduce(
    (total, record) => total + record.completedLessonIds.length,
    0,
  );
}

/**
 * Grandfather profile onboarding for installs that already progressed beyond the
 * first-lesson handoff before the explicit required-flag existed.
 */
export function migrateLegacyProfileOnboarding(snapshot: ProgressSnapshot): void {
  if (isProfileOnboardingCompleted() || isProfileOnboardingRequired()) {
    return;
  }

  const completedInPaths = countCompletedLessonsInPaths(snapshot.pathProgress);

  if (snapshot.completedLessons > 1 || completedInPaths > 1) {
    void setProfileOnboardingCompleted();
  }
}
