import type { Href } from 'expo-router';

import { isOnboardingCompleted, isProfileOnboardingPending } from '@/lib/appStorage';
import { resolveHomeRoute } from '@/lib/homeNavigation';
import { useProgressStore } from '@/store/progressStore';

export function getPostAuthRoute(): Href {
  const completedLessons = useProgressStore.getState().completedLessons;

  if (isProfileOnboardingPending(completedLessons)) {
    return '/onboarding/profil';
  }

  if (!isOnboardingCompleted()) {
    return '/onboarding';
  }

  return resolveHomeRoute(completedLessons);
}
