import {
  optimizePrompt,
  type OptimizerError,
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

  it('wirft OptimizerError bei HTTP-Fehler', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 503,
    }) as jest.Mock;

    await expect(
      optimizePrompt({ rawPrompt: 'Test', provider: 'google' }),
    ).rejects.toMatchObject({
      code: 'OPTIMIZER_ERROR',
      provider: 'google',
    } satisfies Partial<OptimizerError>);
  });

  it('wirft OptimizerError bei ungültigem Response-Schema', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ optimizedPrompt: 'nur Text' }),
    }) as jest.Mock;

    await expect(
      optimizePrompt({ rawPrompt: 'Test', provider: 'grok' }),
    ).rejects.toMatchObject({
      code: 'OPTIMIZER_ERROR',
      message: expect.stringContaining('Ungültige Antwort'),
    });
  });

  it('wirft OptimizerError bei Netzwerkfehler', async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error('Network down')) as jest.Mock;

    await expect(
      optimizePrompt({ rawPrompt: 'Test', provider: 'openai' }),
    ).rejects.toMatchObject({
      code: 'OPTIMIZER_ERROR',
      message: 'Network down',
    });
  });
});
