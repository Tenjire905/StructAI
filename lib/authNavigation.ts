import { isOnboardingCompleted, isProfileOnboardingPending } from '@/lib/appStorage';
import { useProgressStore } from '@/store/progressStore';

export function getPostAuthRoute(): '/onboarding/profil' | '/onboarding' | '/' {
  const completedLessons = useProgressStore.getState().completedLessons;

  if (isProfileOnboardingPending(completedLessons)) {
    return '/onboarding/profil';
  }

  return isOnboardingCompleted() ? '/' : '/onboarding';
}
