import { isOnboardingCompleted } from '@/lib/appStorage';

export function getPostAuthRoute(): '/onboarding' | '/' {
  return isOnboardingCompleted() ? '/' : '/onboarding';
}
