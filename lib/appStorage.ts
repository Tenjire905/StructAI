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

export async function hydrateAppStorage(): Promise<void> {
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

    const entries = await AsyncStorage.getMany(prefixedKeys);

    for (const fullKey of prefixedKeys) {
      const value = entries[fullKey];

      if (value != null) {
        asyncStorageMemory.set(fullKey.slice(STORAGE_PREFIX.length), value);
      }
    }
  } catch {
    // Fall back to empty in-memory cache when AsyncStorage is unavailable.
  }
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

export function isOnboardingCompleted(): boolean {
  return appStorage.getString(ONBOARDING_COMPLETED_KEY) === 'true';
}

export function setOnboardingCompleted(): void {
  appStorage.set(ONBOARDING_COMPLETED_KEY, 'true');
}

export function clearOnboardingCompleted(): void {
  appStorage.delete(ONBOARDING_COMPLETED_KEY);
}

export function isExpoGoMemoryStorage(): boolean {
  return appStorage.isMemoryOnly;
}
