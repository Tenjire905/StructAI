import { clearOnboardingCompleted } from '@/lib/appStorage';
import { clearPersistedProgress } from '@/store/progressStore';

/**
 * Dev-only opt-in: reset local mock state on launch when no real user is signed in.
 * Set to true manually when you need a fresh guest state for testing.
 * Gated by __DEV__ in shouldRunDevFreshSession() — never active in production builds.
 */
export const DEV_FRESH_SESSION_ON_LAUNCH = false;

export function resetDevAccountSession(): void {
  clearPersistedProgress();
  void clearOnboardingCompleted();
}

export function shouldRunDevFreshSession(hasAuthenticatedSession: boolean): boolean {
  return __DEV__ && DEV_FRESH_SESSION_ON_LAUNCH && !hasAuthenticatedSession;
}

export function initializeDevSession(hasAuthenticatedSession: boolean): void {
  if (!shouldRunDevFreshSession(hasAuthenticatedSession)) {
    return;
  }

  resetDevAccountSession();
}
