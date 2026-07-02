import * as SecureStore from 'expo-secure-store';

export interface ApiKeyEntry {
  provider: string;
  key: string;
}

const PROVIDER_INDEX_KEY = 'structai-api-key-providers';
const providerKeyId = (provider: string) => `structai-api-key-${provider}`;

async function readProviderIndex(): Promise<string[]> {
  try {
    const raw = await SecureStore.getItemAsync(PROVIDER_INDEX_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw) as string[];
    return Array.isArray(parsed) ? parsed : [];
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'Unbekannter Fehler';
    console.error('[secureKeyStore] Index lesen fehlgeschlagen:', message);
    return [];
  }
}

async function writeProviderIndex(providers: string[]): Promise<void> {
  try {
    await SecureStore.setItemAsync(
      PROVIDER_INDEX_KEY,
      JSON.stringify(providers),
    );
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'Unbekannter Fehler';
    throw new Error(`Provider-Index konnte nicht gespeichert werden: ${message}`);
  }
}

export async function saveApiKey(provider: string, key: string): Promise<void> {
  try {
    await SecureStore.setItemAsync(providerKeyId(provider), key);
    const providers = await readProviderIndex();
    if (!providers.includes(provider)) {
      providers.push(provider);
      await writeProviderIndex(providers);
    }
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'Unbekannter Fehler';
    throw new Error(`API-Key speichern fehlgeschlagen: ${message}`);
  }
}

export async function getApiKey(provider: string): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync(providerKeyId(provider));
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'Unbekannter Fehler';
    console.error('[secureKeyStore] API-Key lesen fehlgeschlagen:', message);
    return null;
  }
}

export async function removeApiKey(provider: string): Promise<void> {
  try {
    await SecureStore.deleteItemAsync(providerKeyId(provider));
    const providers = await readProviderIndex();
    const next = providers.filter((entry) => entry !== provider);
    await writeProviderIndex(next);
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'Unbekannter Fehler';
    throw new Error(`API-Key entfernen fehlgeschlagen: ${message}`);
  }
}

export async function listApiKeyProviders(): Promise<string[]> {
  try {
    return await readProviderIndex();
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'Unbekannter Fehler';
    console.error('[secureKeyStore] Provider-Liste fehlgeschlagen:', message);
    return [];
  }
}
