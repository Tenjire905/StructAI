import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

type KeyValueStorage = {
  getString: (key: string) => string | undefined;
  set: (key: string, value: string) => void;
  delete: (key: string) => void;
  contains: (key: string) => boolean;
  isMemoryOnly: boolean;
};

const STORAGE_PREFIX = '@structai/';

function isClientEnvironment(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  // Expo Router static render runs in Node with Platform.OS === 'web'.
  if (Platform.OS === 'web' && typeof document === 'undefined') {
    return false;
  }

  return true;
}

function isExpoGo(): boolean {
  return Constants.appOwnership === 'expo';
}

function createMemoryStorage(): KeyValueStorage {
  const memory = new Map<string, string>();

  return {
    isMemoryOnly: true,
    getString: (key) => memory.get(key),
    set: (key, value) => {
      memory.set(key, value);
    },
    delete: (key) => {
      memory.delete(key);
    },
    contains: (key) => memory.has(key),
  };
}

let asyncStorageMemory: Map<string, string> | null = null;

function createAsyncStorageBackedStorage(): KeyValueStorage {
  const memory = new Map<string, string>();
  asyncStorageMemory = memory;

  return {
    isMemoryOnly: false,
    getString: (key) => memory.get(key),
    set: (key, value) => {
      memory.set(key, value);
      void AsyncStorage.setItem(STORAGE_PREFIX + key, value).catch(() => undefined);
    },
    delete: (key) => {
      memory.delete(key);
      void AsyncStorage.removeItem(STORAGE_PREFIX + key).catch(() => undefined);
    },
    contains: (key) => memory.has(key),
  };
}

function createMMKVStorage(): KeyValueStorage {
  // Lazy require: react-native-mmkv pulls in NitroModules at import time.
  const { createMMKV } = require('react-native-mmkv') as typeof import('react-native-mmkv');
  const mmkv = createMMKV({ id: 'structai-storage' });

  return {
    isMemoryOnly: false,
    getString: (key) => mmkv.getString(key),
    set: (key, value) => {
      mmkv.set(key, value);
    },
    delete: (key) => {
      mmkv.remove(key);
    },
    contains: (key) => mmkv.contains(key),
  };
}

function createNativeStorage(): KeyValueStorage {
  if (isExpoGo()) {
    return createAsyncStorageBackedStorage();
  }

  try {
    return createMMKVStorage();
  } catch {
    return createAsyncStorageBackedStorage();
  }
}

let storageInstance: KeyValueStorage | null = null;
let serverStorageInstance: KeyValueStorage | null = null;
let hydratePromise: Promise<void> | null = null;

function resolveStorage(): KeyValueStorage {
  if (!isClientEnvironment()) {
    if (!serverStorageInstance) {
      serverStorageInstance = createMemoryStorage();
    }

    return serverStorageInstance;
  }

  if (!storageInstance) {
    storageInstance = createNativeStorage();
  }

  return storageInstance;
}

async function hydrateAppStorageInternal(): Promise<void> {
  resolveStorage();

  if (!asyncStorageMemory) {
    return;
  }

  try {
    const keys = await AsyncStorage.getAllKeys();
    const prefixedKeys = keys.filter((key) => key.startsWith(STORAGE_PREFIX));

    if (prefixedKeys.length === 0) {
      return;
    }

    const entries = await AsyncStorage.multiGet(prefixedKeys);

    for (const [fullKey, value] of entries) {
      if (value != null) {
        asyncStorageMemory.set(fullKey.slice(STORAGE_PREFIX.length), value);
      }
    }
  } catch {
    // Fall back to empty in-memory cache when AsyncStorage is unavailable.
  }
}

export function hydrateAppStorage(): Promise<void> {
  if (!hydratePromise) {
    hydratePromise = hydrateAppStorageInternal();
  }

  return hydratePromise;
}

/** Durable write — awaits AsyncStorage in Expo Go instead of fire-and-forget. */
export async function persistAppStorageValue(key: string, value: string): Promise<void> {
  if (asyncStorageMemory) {
    asyncStorageMemory.set(key, value);
    await AsyncStorage.setItem(STORAGE_PREFIX + key, value);
    return;
  }

  resolveStorage().set(key, value);
}

export async function deleteAppStorageValue(key: string): Promise<void> {
  if (asyncStorageMemory) {
    asyncStorageMemory.delete(key);
    await AsyncStorage.removeItem(STORAGE_PREFIX + key);
    return;
  }

  resolveStorage().delete(key);
}

export const appStorage: KeyValueStorage = {
  get isMemoryOnly() {
    return resolveStorage().isMemoryOnly;
  },
  getString: (key) => resolveStorage().getString(key),
  set: (key, value) => resolveStorage().set(key, value),
  delete: (key) => resolveStorage().delete(key),
  contains: (key) => resolveStorage().contains(key),
};

const ONBOARDING_COMPLETED_KEY = 'structai.onboarding-completed';
const PROGRESS_STORAGE_KEY = 'structai.progress.v1';

function hasPersistedGuestProgress(): boolean {
  const raw = appStorage.getString(PROGRESS_STORAGE_KEY);

  if (!raw) {
    return false;
  }

  try {
    const parsed = JSON.parse(raw) as {
      completedLessons?: number;
      pathProgress?: Record<string, unknown>;
    };

    return (
      (parsed.completedLessons ?? 0) > 0 ||
      Object.keys(parsed.pathProgress ?? {}).length > 0
    );
  } catch {
    return false;
  }
}

export function isOnboardingCompleted(): boolean {
  if (appStorage.getString(ONBOARDING_COMPLETED_KEY) === 'true') {
    return true;
  }

  // Safety net: guests with saved lesson progress already finished onboarding once.
  return hasPersistedGuestProgress();
}

export async function setOnboardingCompleted(): Promise<void> {
  await persistAppStorageValue(ONBOARDING_COMPLETED_KEY, 'true');
}

export async function clearOnboardingCompleted(): Promise<void> {
  await deleteAppStorageValue(ONBOARDING_COMPLETED_KEY);
}

const PROFILE_ONBOARDING_COMPLETED_KEY = 'structai.profile-onboarding-completed';
const PROFILE_ONBOARDING_REQUIRED_KEY = 'structai.profile-onboarding-required';
const GUEST_DISPLAY_NAME_KEY = 'structai.guest-display-name';
const PROFILE_AGE_KEY = 'structai.profile-age';

export function isProfileOnboardingCompleted(): boolean {
  return appStorage.getString(PROFILE_ONBOARDING_COMPLETED_KEY) === 'true';
}

export function isProfileOnboardingRequired(): boolean {
  return appStorage.getString(PROFILE_ONBOARDING_REQUIRED_KEY) === 'true';
}

export async function markProfileOnboardingRequired(): Promise<void> {
  await persistAppStorageValue(PROFILE_ONBOARDING_REQUIRED_KEY, 'true');
}

export async function setProfileOnboardingCompleted(): Promise<void> {
  await persistAppStorageValue(PROFILE_ONBOARDING_COMPLETED_KEY, 'true');
  await deleteAppStorageValue(PROFILE_ONBOARDING_REQUIRED_KEY);
}

export async function clearProfileOnboardingCompleted(): Promise<void> {
  await deleteAppStorageValue(PROFILE_ONBOARDING_COMPLETED_KEY);
  await deleteAppStorageValue(PROFILE_ONBOARDING_REQUIRED_KEY);
}

export async function clearGuestDisplayName(): Promise<void> {
  await deleteAppStorageValue(GUEST_DISPLAY_NAME_KEY);
}

export async function clearProfileAge(): Promise<void> {
  await deleteAppStorageValue(PROFILE_AGE_KEY);
}

/** Profile onboarding is pending only after an explicit first-lesson handoff — not for legacy progress. */
export function isProfileOnboardingPending(): boolean {
  return isProfileOnboardingRequired() && !isProfileOnboardingCompleted();
}

export function getGuestDisplayName(): string | undefined {
  const value = appStorage.getString(GUEST_DISPLAY_NAME_KEY)?.trim();
  return value && value.length > 0 ? value : undefined;
}

export async function setGuestDisplayName(name: string): Promise<void> {
  await persistAppStorageValue(GUEST_DISPLAY_NAME_KEY, name.trim());
}

export function getProfileAge(): number | undefined {
  const raw = appStorage.getString(PROFILE_AGE_KEY);

  if (!raw) {
    return undefined;
  }

  const parsed = Number.parseInt(raw, 10);
  return Number.isFinite(parsed) ? parsed : undefined;
}

export async function setProfileAge(age: number): Promise<void> {
  await persistAppStorageValue(PROFILE_AGE_KEY, String(age));
}

export function isExpoGoMemoryStorage(): boolean {
  return appStorage.isMemoryOnly;
}

const DAILY_GOAL_SETUP_COMPLETED_KEY = 'structai.daily-goal-setup-completed';
const LAST_COMPLETED_LESSON_KEY = 'structai.last-completed-lesson-id';

export function isDailyGoalSetupCompleted(): boolean {
  return appStorage.getString(DAILY_GOAL_SETUP_COMPLETED_KEY) === 'true';
}

/** Most recent lesson completion — used for day-2 skill-named reminders. */
export function getLastCompletedLessonId(): string | undefined {
  const value = appStorage.getString(LAST_COMPLETED_LESSON_KEY)?.trim();
  return value && value.length > 0 ? value : undefined;
}

export async function setLastCompletedLessonId(lessonId: string): Promise<void> {
  await persistAppStorageValue(LAST_COMPLETED_LESSON_KEY, lessonId.trim());
}

export async function setDailyGoalSetupCompleted(): Promise<void> {
  await persistAppStorageValue(DAILY_GOAL_SETUP_COMPLETED_KEY, 'true');
}

export async function clearDailyGoalSetupCompleted(): Promise<void> {
  await deleteAppStorageValue(DAILY_GOAL_SETUP_COMPLETED_KEY);
}

/** Local Pro preview (P3.2 framing) — not a real entitlement / IAP. */
const PRO_PREVIEW_UNLOCKED_KEY = 'structai.pro-preview-unlocked';

export function isProPreviewUnlocked(): boolean {
  return appStorage.getString(PRO_PREVIEW_UNLOCKED_KEY) === 'true';
}

export async function setProPreviewUnlocked(): Promise<void> {
  await persistAppStorageValue(PRO_PREVIEW_UNLOCKED_KEY, 'true');
}

export async function clearProPreviewUnlocked(): Promise<void> {
  await deleteAppStorageValue(PRO_PREVIEW_UNLOCKED_KEY);
}

/** Clears onboarding + profile prefs so the next launch starts at welcome. */
export async function clearAllOnboardingAndProfilePrefs(): Promise<void> {
  await clearOnboardingCompleted();
  await clearProfileOnboardingCompleted();
  await clearGuestDisplayName();
  await clearProfileAge();
  await clearDailyGoalSetupCompleted();
  await clearProPreviewUnlocked();
}
