import { createMMKV } from 'react-native-mmkv';

type KeyValueStorage = {
  getString: (key: string) => string | undefined;
  set: (key: string, value: string) => void;
};

// MMKV ist ein natives Modul und in Expo Go nicht verfügbar –
// dort fällt die App auf einen In-Memory-Store zurück
// (kein Persist über App-Neustarts, im Dev-Build wieder echt persistent).
function createAppStorage(): KeyValueStorage {
  try {
    return createMMKV({ id: 'structai-storage' });
  } catch {
    const memory = new Map<string, string>();

    return {
      getString: (key) => memory.get(key),
      set: (key, value) => {
        memory.set(key, value);
      },
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
