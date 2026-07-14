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

export function isExpoGoMemoryStorage(): boolean {
  return appStorage.isMemoryOnly;
}
