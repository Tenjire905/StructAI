import {
  optimizePrompt,
  type OptimizeResponse,
} from '../../../src/features/PromptLab/api/optimizer';

const mockResponse: OptimizeResponse = {
  optimizedPrompt: 'Verbesserter Prompt',
  score: 87,
  rationale: 'Klarere Struktur und konkretere Anweisungen.',
};

describe('optimizePrompt', () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
    jest.restoreAllMocks();
  });

  it('gibt optimierten Prompt bei erfolgreicher Antwort zurück', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    }) as jest.Mock;

    const result = await optimizePrompt({
      rawPrompt: 'Schreibe einen Blogpost',
      provider: 'openai',
    });

    expect(result).toEqual(mockResponse);
    expect(global.fetch).toHaveBeenCalledWith(
      'https://api.structai.app/v1/prompt/optimize',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
        }),
      }),
    );
  });

  it('sendet BYOK-Header wenn apiKey gesetzt ist', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    }) as jest.Mock;

    await optimizePrompt({
      rawPrompt: 'Test',
      provider: 'anthropic',
      apiKey: 'sk-test-key',
    });

    const callArgs = (global.fetch as jest.Mock).mock.calls[0];
    const headers = callArgs[1].headers as Record<string, string>;
    expect(headers['X-API-Key']).toBe('sk-test-key');
    expect(headers.Authorization).toBe('Bearer sk-test-key');
  });

  it('fällt bei HTTP-Fehler auf lokale Demo-Optimierung zurück', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 503,
    }) as jest.Mock;

    const result = await optimizePrompt({ rawPrompt: 'Test', provider: 'google' });

    expect(result.optimizedPrompt).toContain('## Rolle');
    expect(result.optimizedPrompt).toContain('Test');
    expect(result.score).toBeGreaterThan(0);
    expect(result.rationale).toContain('Lokale Demo-Optimierung');
  });

  it('fällt bei ungültigem Response-Schema auf lokale Demo zurück', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ optimizedPrompt: 'nur Text' }),
    }) as jest.Mock;

    const result = await optimizePrompt({ rawPrompt: 'Test', provider: 'grok' });

    expect(result.optimizedPrompt).toContain('## Aufgabe');
    expect(result.optimizedPrompt).toContain('Test');
    expect(typeof result.score).toBe('number');
    expect(result.rationale).toContain('Lokale Demo-Optimierung');
  });

  it('fällt bei Netzwerkfehler auf lokale Demo zurück', async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error('Network down')) as jest.Mock;

    const result = await optimizePrompt({ rawPrompt: 'Test', provider: 'openai' });

    expect(result.optimizedPrompt).toContain('StructAI');
    expect(result.optimizedPrompt).toContain('Test');
    expect(result.score).toBe(35);
    expect(result.rationale).toContain('Lokale Demo-Optimierung');
  });
});
