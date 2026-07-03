import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

import { detectProvider, type AiProvider } from '@/lib/aiScoring';

export type ByokProvider = AiProvider;

export type ByokKeyEntry = {
  provider: ByokProvider;
  key: string;
};

export const BYOK_PROVIDERS: readonly ByokProvider[] = ['openai', 'anthropic', 'google'];

const API_KEYS_STORAGE_KEY = 'structai.byok.apiKeys.v1';
const LEGACY_API_KEY_STORAGE_KEY = 'structai.byok.apiKey';

// expo-secure-store existiert nicht im Web – dort nur In-Memory-Fallback
// für die Dev-Preview. Echte Keys landen ausschließlich im nativen Secure Store.
const webMemoryStore = new Map<string, string>();

let migrationPromise: Promise<void> | null = null;

function isByokProvider(value: unknown): value is ByokProvider {
  return value === 'openai' || value === 'anthropic' || value === 'google';
}

function dedupeByProvider(entries: ByokKeyEntry[]): ByokKeyEntry[] {
  const byProvider = new Map<ByokProvider, ByokKeyEntry>();

  for (const entry of entries) {
    byProvider.set(entry.provider, entry);
  }

  return BYOK_PROVIDERS.filter((provider) => byProvider.has(provider)).map(
    (provider) => byProvider.get(provider)!,
  );
}

function parseEntries(raw: string | null): ByokKeyEntry[] | null {
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as unknown;

    if (!Array.isArray(parsed)) {
      return null;
    }

    const entries: ByokKeyEntry[] = [];

    for (const item of parsed) {
      if (!item || typeof item !== 'object') {
        continue;
      }

      const record = item as Record<string, unknown>;

      if (!isByokProvider(record.provider) || typeof record.key !== 'string') {
        continue;
      }

      const key = record.key.trim();

      if (key.length === 0) {
        continue;
      }

      entries.push({ provider: record.provider, key });
    }

    return dedupeByProvider(entries);
  } catch {
    return null;
  }
}

async function readRaw(storageKey: string): Promise<string | null> {
  if (Platform.OS === 'web') {
    return webMemoryStore.get(storageKey) ?? null;
  }

  return SecureStore.getItemAsync(storageKey);
}

async function writeRaw(storageKey: string, value: string): Promise<void> {
  if (Platform.OS === 'web') {
    webMemoryStore.set(storageKey, value);
    return;
  }

  await SecureStore.setItemAsync(storageKey, value);
}

async function deleteRaw(storageKey: string): Promise<void> {
  if (Platform.OS === 'web') {
    webMemoryStore.delete(storageKey);
    return;
  }

  await SecureStore.deleteItemAsync(storageKey);
}

async function writeEntries(entries: ByokKeyEntry[]): Promise<void> {
  await writeRaw(API_KEYS_STORAGE_KEY, JSON.stringify(dedupeByProvider(entries)));
}

async function migrateLegacyKeyIfNeeded(): Promise<void> {
  const legacyKey = await readRaw(LEGACY_API_KEY_STORAGE_KEY);

  if (!legacyKey || legacyKey.trim().length === 0) {
    return;
  }

  const trimmed = legacyKey.trim();
  const provider = detectProvider(trimmed);
  const existing = parseEntries(await readRaw(API_KEYS_STORAGE_KEY)) ?? [];

  if (provider) {
    const withoutProvider = existing.filter((entry) => entry.provider !== provider);
    await writeEntries([...withoutProvider, { provider, key: trimmed }]);
  }

  await deleteRaw(LEGACY_API_KEY_STORAGE_KEY);
}

export async function ensureByokKeysMigrated(): Promise<void> {
  if (!migrationPromise) {
    migrationPromise = migrateLegacyKeyIfNeeded();
  }

  await migrationPromise;
}

export async function listApiKeys(): Promise<ByokKeyEntry[]> {
  await ensureByokKeysMigrated();
  return parseEntries(await readRaw(API_KEYS_STORAGE_KEY)) ?? [];
}

export async function getApiKeyForProvider(provider: ByokProvider): Promise<string | null> {
  const entry = (await listApiKeys()).find((item) => item.provider === provider);
  return entry?.key ?? null;
}

export async function upsertApiKey(entry: ByokKeyEntry): Promise<void> {
  await ensureByokKeysMigrated();

  const trimmedKey = entry.key.trim();
  const entries = await listApiKeys();
  const withoutProvider = entries.filter((item) => item.provider !== entry.provider);

  await writeEntries([...withoutProvider, { provider: entry.provider, key: trimmedKey }]);
}

export async function removeApiKey(provider: ByokProvider): Promise<void> {
  await ensureByokKeysMigrated();
  const entries = await listApiKeys();
  await writeEntries(entries.filter((entry) => entry.provider !== provider));
}

/** Erster gespeicherter Key – Prompt Lab nutzt ihn bis Multi-Modell-Vergleich (F2+). */
export async function getApiKey(): Promise<string | null> {
  const entries = await listApiKeys();
  return entries[0]?.key ?? null;
}

/** @deprecated Bitte upsertApiKey mit Provider verwenden. */
export async function saveApiKey(value: string): Promise<void> {
  const provider = detectProvider(value.trim());

  if (!provider) {
    throw new Error('Unknown key format');
  }

  await upsertApiKey({ provider, key: value.trim() });
}

/** @deprecated Bitte removeApiKey(provider) verwenden. */
export async function deleteApiKey(): Promise<void> {
  await ensureByokKeysMigrated();
  await writeEntries([]);
  await deleteRaw(LEGACY_API_KEY_STORAGE_KEY);
}

/** Nur __DEV__ + Web-Screenshots: Keys ohne Validierung setzen. */
export async function seedByokKeysForDev(entries: ByokKeyEntry[]): Promise<void> {
  if (!__DEV__) {
    return;
  }

  await writeEntries(entries);
}
