import { clearOnboardingCompleted } from '@/lib/appStorage';
import { clearPersistedProgress } from '@/store/progressStore';

import { appStorage } from './appStorage';

/** Dev-/Musteraccount: bei jedem App-Start frischer Zustand (Fortschritt, Graphen, Onboarding). */
export const DEV_FRESH_SESSION_ON_LAUNCH = true;

const DEV_SESSION_KEYS = [] as const;

export function resetDevAccountSession(): void {
  clearPersistedProgress();
  clearOnboardingCompleted();
}

/**
 * Wird einmal pro App-Start aufgerufen – vor Provider-Hydration.
 * In Expo Go (In-Memory-MMkv) und im Dev-Build: voller Reset des Musteraccounts.
 */
export function initializeDevSession(): void {
  if (!DEV_FRESH_SESSION_ON_LAUNCH) {
    return;
  }

  resetDevAccountSession();
}
