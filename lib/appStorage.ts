import { createMMKV, type MMKV } from 'react-native-mmkv';

type KeyValueStorage = {
  getString: (key: string) => string | undefined;
  set: (key: string, value: string) => void;
  delete: (key: string) => void;
  contains: (key: string) => boolean;
  isMemoryOnly: boolean;
};

let nativeMmkv: MMKV | null = null;

function createAppStorage(): KeyValueStorage {
  try {
    nativeMmkv = createMMKV({ id: 'structai-storage' });

    return {
      isMemoryOnly: false,
      getString: (key) => nativeMmkv?.getString(key),
      set: (key, value) => {
        nativeMmkv?.set(key, value);
      },
      delete: (key) => {
        nativeMmkv?.remove(key);
      },
      contains: (key) => nativeMmkv?.contains(key) ?? false,
    };
  } catch {
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
}

export const appStorage = createAppStorage();

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
