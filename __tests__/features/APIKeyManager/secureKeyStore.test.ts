import * as SecureStore from 'expo-secure-store';
import {
  getApiKey,
  listApiKeyProviders,
  removeApiKey,
  saveApiKey,
} from '../../../src/features/APIKeyManager/model/secureKeyStore';

const mockGetItem = SecureStore.getItemAsync as jest.Mock;
const mockSetItem = SecureStore.setItemAsync as jest.Mock;
const mockDeleteItem = SecureStore.deleteItemAsync as jest.Mock;

const storage = new Map<string, string>();

describe('secureKeyStore', () => {
  beforeEach(() => {
    storage.clear();
    jest.clearAllMocks();

    mockGetItem.mockImplementation(async (key: string) => storage.get(key) ?? null);
    mockSetItem.mockImplementation(async (key: string, value: string) => {
      storage.set(key, value);
    });
    mockDeleteItem.mockImplementation(async (key: string) => {
      storage.delete(key);
    });
  });

  describe('saveApiKey', () => {
    it('speichert Key und aktualisiert Provider-Index', async () => {
      await saveApiKey('openai', 'sk-secret');

      expect(storage.get('structai-api-key-openai')).toBe('sk-secret');
      const index = JSON.parse(storage.get('structai-api-key-providers') ?? '[]') as string[];
      expect(index).toContain('openai');
    });

    it('fügt Provider nur einmal zum Index hinzu', async () => {
      await saveApiKey('anthropic', 'key-1');
      await saveApiKey('anthropic', 'key-2');

      const index = JSON.parse(storage.get('structai-api-key-providers') ?? '[]') as string[];
      expect(index.filter((p) => p === 'anthropic')).toHaveLength(1);
      expect(storage.get('structai-api-key-anthropic')).toBe('key-2');
    });

    it('wirft bei SecureStore-Fehler', async () => {
      mockSetItem.mockRejectedValueOnce(new Error('Keychain locked'));

      await expect(saveApiKey('openai', 'sk')).rejects.toThrow(
        'API-Key speichern fehlgeschlagen',
      );
    });
  });

  describe('getApiKey', () => {
    it('liest gespeicherten Key', async () => {
      await saveApiKey('google', 'g-key');
      const key = await getApiKey('google');
      expect(key).toBe('g-key');
    });

    it('gibt null zurück wenn kein Key existiert', async () => {
      const key = await getApiKey('missing');
      expect(key).toBeNull();
    });

    it('gibt null zurück bei Lesefehler', async () => {
      mockGetItem.mockRejectedValueOnce(new Error('Read failed'));
      const key = await getApiKey('openai');
      expect(key).toBeNull();
    });
  });

  describe('removeApiKey', () => {
    it('entfernt Key und Provider aus Index', async () => {
      await saveApiKey('openai', 'sk-1');
      await saveApiKey('anthropic', 'sk-2');

      await removeApiKey('openai');

      expect(storage.has('structai-api-key-openai')).toBe(false);
      const index = await listApiKeyProviders();
      expect(index).not.toContain('openai');
      expect(index).toContain('anthropic');
    });

    it('wirft bei Löschfehler', async () => {
      mockDeleteItem.mockRejectedValueOnce(new Error('Delete failed'));

      await expect(removeApiKey('openai')).rejects.toThrow(
        'API-Key entfernen fehlgeschlagen',
      );
    });
  });

  describe('listApiKeyProviders', () => {
    it('listet alle gespeicherten Provider', async () => {
      await saveApiKey('openai', 'a');
      await saveApiKey('grok', 'b');

      const providers = await listApiKeyProviders();
      expect(providers).toEqual(expect.arrayContaining(['openai', 'grok']));
    });

    it('gibt leeres Array bei leerem Index', async () => {
      const providers = await listApiKeyProviders();
      expect(providers).toEqual([]);
    });
  });
});
