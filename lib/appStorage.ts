import { Platform } from 'react-native';
import { createMMKV, type MMKV } from 'react-native-mmkv';

type KeyValueStorage = {
  getString: (key: string) => string | undefined;
  set: (key: string, value: string) => void;
  delete: (key: string) => void;
  contains: (key: string) => boolean;
  isMemoryOnly: boolean;
};

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

function createNativeStorage(): KeyValueStorage {
  try {
    const mmkv: MMKV = createMMKV({ id: 'structai-storage' });

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
  } catch {
    return createMemoryStorage();
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
