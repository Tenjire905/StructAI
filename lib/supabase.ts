import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';
import 'react-native-url-polyfill/auto';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL ?? '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '';

export const isSupabaseConfigured = supabaseUrl.length > 0 && supabaseAnonKey.length > 0;

function createMemoryAuthStorage() {
  const memory = new Map<string, string>();

  return {
    getItem: async (key: string) => memory.get(key) ?? null,
    setItem: async (key: string, value: string) => {
      memory.set(key, value);
    },
    removeItem: async (key: string) => {
      memory.delete(key);
    },
  };
}

function canUseAsyncStorage(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  if (Platform.OS === 'web' && typeof document === 'undefined') {
    return false;
  }

  return true;
}

function createAuthStorage() {
  if (!canUseAsyncStorage()) {
    return createMemoryAuthStorage();
  }

  // Lazy require avoids SSR crashes from AsyncStorage touching `window` at import time.
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  return require('@react-native-async-storage/async-storage').default as {
    getItem: (key: string) => Promise<string | null>;
    setItem: (key: string, value: string) => Promise<void>;
    removeItem: (key: string) => Promise<void>;
  };
}

function createSupabaseClient(): SupabaseClient {
  const authStorage = createAuthStorage();

  if (!isSupabaseConfigured) {
    return createClient('https://placeholder.supabase.co', 'placeholder-anon-key', {
      auth: {
        storage: authStorage,
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: false,
      },
    });
  }

  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      storage: authStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
      flowType: 'pkce',
    },
  });
}

export const supabase = createSupabaseClient();
