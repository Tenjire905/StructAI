import { appStorage } from '@/lib/appStorage';
import {
  isProgressSnapshotEmpty,
  normalizeProgressSnapshot,
} from '@/lib/progressMerge';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';
import {
  DEFAULT_PROGRESS,
  type ProgressSnapshot,
  useProgressStore,
} from '@/store/progressStore';

const PROGRESS_SYNC_USER_KEY = 'structai.progress-sync-user-id';
const SYNC_DEBOUNCE_MS = 400;

type RemoteProgressRow = {
  snapshot: ProgressSnapshot | null;
  updated_at: string | null;
};

let debounceTimer: ReturnType<typeof setTimeout> | null = null;
let pendingSnapshot: ProgressSnapshot | null = null;
let inflightSync: Promise<void> | null = null;

function applySnapshotToStore(snapshot: ProgressSnapshot): void {
  useProgressStore.setState(snapshot);
  useProgressStore.getState().persistSnapshot(snapshot);
}

async function resolveAuthenticatedUserId(): Promise<string | null> {
  if (!isSupabaseConfigured) {
    return null;
  }

  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    return null;
  }

  return data.user.id;
}

async function fetchRemoteProgress(userId: string): Promise<ProgressSnapshot | null> {
  const { data, error } = await supabase
    .from('user_progress')
    .select('snapshot')
    .eq('user_id', userId)
    .maybeSingle<RemoteProgressRow>();

  if (error || !data?.snapshot) {
    return null;
  }

  return normalizeProgressSnapshot(data.snapshot);
}

async function pushRemoteProgress(
  userId: string,
  snapshot: ProgressSnapshot,
): Promise<void> {
  const { error } = await supabase.from('user_progress').upsert(
    {
      user_id: userId,
      snapshot,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'user_id' },
  );

  if (error) {
    throw error;
  }

  appStorage.set(PROGRESS_SYNC_USER_KEY, userId);
}

async function flushQueuedProgressSync(): Promise<void> {
  const snapshot = pendingSnapshot;
  pendingSnapshot = null;

  if (!snapshot) {
    return;
  }

  const userId = await resolveAuthenticatedUserId();

  if (!userId) {
    return;
  }

  await pushRemoteProgress(userId, snapshot);
}

export function queueProgressSync(snapshot: ProgressSnapshot): void {
  if (!isSupabaseConfigured) {
    return;
  }

  pendingSnapshot = snapshot;

  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }

  debounceTimer = setTimeout(() => {
    debounceTimer = null;

    if (inflightSync) {
      inflightSync = inflightSync
        .catch(() => undefined)
        .then(() => flushQueuedProgressSync())
        .catch(() => undefined);
      return;
    }

    inflightSync = flushQueuedProgressSync()
      .catch(() => undefined)
      .finally(() => {
        inflightSync = null;
      });
  }, SYNC_DEBOUNCE_MS);
}

/**
 * Pulls remote progress after login.
 * - New device / empty local cache → apply server snapshot.
 * - Different account than last sync → replace with server (or defaults).
 * - Same account with existing local cache → keep local, push in background.
 * Logout intentionally does NOT clear local MMKV (offline continuation).
 */
export async function hydrateProgressOnLogin(userId: string): Promise<void> {
  if (!isSupabaseConfigured) {
    return;
  }

  const localSnapshot = useProgressStore.getState().getSnapshot();
  const lastSyncedUserId = appStorage.getString(PROGRESS_SYNC_USER_KEY);
  const accountChanged = Boolean(lastSyncedUserId && lastSyncedUserId !== userId);
  const localEmpty = isProgressSnapshotEmpty(localSnapshot);

  if (!accountChanged && !localEmpty) {
    queueProgressSync(localSnapshot);
    appStorage.set(PROGRESS_SYNC_USER_KEY, userId);
    return;
  }

  const remoteSnapshot = await fetchRemoteProgress(userId);

  if (remoteSnapshot && !isProgressSnapshotEmpty(remoteSnapshot)) {
    applySnapshotToStore(remoteSnapshot);
  } else if (accountChanged) {
    applySnapshotToStore({
      ...DEFAULT_PROGRESS,
      streakDays: [...DEFAULT_PROGRESS.streakDays],
    });
  }

  appStorage.set(PROGRESS_SYNC_USER_KEY, userId);

  const snapshotAfterHydrate = useProgressStore.getState().getSnapshot();

  if (!isProgressSnapshotEmpty(snapshotAfterHydrate)) {
    queueProgressSync(snapshotAfterHydrate);
  }
}

export function readLastSyncedUserId(): string | undefined {
  return appStorage.getString(PROGRESS_SYNC_USER_KEY);
}

/** Test hook – bypass auth/debounce and push immediately. */
export async function pushProgressSnapshotNow(snapshot: ProgressSnapshot): Promise<void> {
  const userId = await resolveAuthenticatedUserId();

  if (!userId) {
    return;
  }

  await pushRemoteProgress(userId, snapshot);
}

export async function fetchProgressSnapshotForUser(
  userId: string,
): Promise<ProgressSnapshot | null> {
  if (!isSupabaseConfigured) {
    return null;
  }

  return fetchRemoteProgress(userId);
}
