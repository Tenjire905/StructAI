import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

const API_KEY_STORAGE_KEY = 'structai.byok.apiKey';

// expo-secure-store existiert nicht im Web – dort nur In-Memory-Fallback
// für die Dev-Preview. Echte Keys landen ausschließlich im nativen Secure Store.
const webMemoryStore = new Map<string, string>();

export async function saveApiKey(value: string): Promise<void> {
  if (Platform.OS === 'web') {
    webMemoryStore.set(API_KEY_STORAGE_KEY, value);
    return;
  }

  await SecureStore.setItemAsync(API_KEY_STORAGE_KEY, value);
}

export async function getApiKey(): Promise<string | null> {
  if (Platform.OS === 'web') {
    return webMemoryStore.get(API_KEY_STORAGE_KEY) ?? null;
  }

  return SecureStore.getItemAsync(API_KEY_STORAGE_KEY);
}

export async function deleteApiKey(): Promise<void> {
  if (Platform.OS === 'web') {
    webMemoryStore.delete(API_KEY_STORAGE_KEY);
    return;
  }

  await SecureStore.deleteItemAsync(API_KEY_STORAGE_KEY);
}
