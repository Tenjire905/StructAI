import {
  clearAllOnboardingAndProfilePrefs,
} from '@/lib/appStorage';
import { clearSpendingData } from '@/lib/byokSpending';
import { syncDailyGoalReminder } from '@/lib/dailyGoalNotifications';
import {
  cancelQueuedProgressSync,
  clearProgressSyncUserId,
  deleteRemoteProgressForCurrentUser,
  pushProgressSnapshotNow,
} from '@/lib/progressSync';
import { deleteApiKey } from '@/lib/secureKeyStore';
import { DEFAULT_PROGRESS, useProgressStore } from '@/store/progressStore';

/**
 * Clears lesson/path/orb progress only. Stays in the app (onboarding flags kept).
 * When signed in, pushes an empty snapshot so login hydrate does not restore old data.
 */
export async function resetAllLearningProgress(options?: {
  isSignedIn?: boolean;
}): Promise<void> {
  cancelQueuedProgressSync();
  useProgressStore.getState().reset();

  if (options?.isSignedIn) {
    try {
      await pushProgressSnapshotNow(DEFAULT_PROGRESS);
    } catch {
      // Local reset still succeeded; remote may catch up later.
    }
  }
}

/**
 * Full local wipe → back to welcome onboarding.
 * Guest: deletes all local learning + profile prefs.
 * Signed-in: also deletes remote progress and signs out.
 * Note: Supabase Auth user deletion needs a server function; we wipe app data + session.
 */
export async function wipeAccountDataForOnboarding(options?: {
  isSignedIn?: boolean;
  signOut?: () => Promise<void>;
}): Promise<void> {
  cancelQueuedProgressSync();

  if (options?.isSignedIn) {
    try {
      await deleteRemoteProgressForCurrentUser();
    } catch {
      // Continue local wipe even if remote delete fails.
    }
  } else {
    await clearProgressSyncUserId();
  }

  useProgressStore.getState().reset();
  await clearAllOnboardingAndProfilePrefs();
  await clearSpendingData();
  await deleteApiKey().catch(() => undefined);
  await syncDailyGoalReminder(false).catch(() => undefined);

  if (options?.signOut) {
    await options.signOut().catch(() => undefined);
  }
}
