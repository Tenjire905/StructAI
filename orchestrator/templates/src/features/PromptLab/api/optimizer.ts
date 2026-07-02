export interface OptimizeRequest {
  rawPrompt: string;
  provider: 'openai' | 'anthropic' | 'google' | 'grok';
  apiKey?: string;
}

export interface OptimizeResponse {
  optimizedPrompt: string;
  score: number;
  rationale: string;
}

export interface OptimizerError {
  code: string;
  message: string;
  provider: string;
}

const OPTIMIZER_ENDPOINT =
  'https://api.structai.app/v1/prompt/optimize';

export async function optimizePrompt(
  request: OptimizeRequest,
): Promise<OptimizeResponse> {
  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };

    if (request.apiKey) {
      headers['X-API-Key'] = request.apiKey;
      headers.Authorization = `Bearer ${request.apiKey}`;
    }

    const response = await fetch(OPTIMIZER_ENDPOINT, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        rawPrompt: request.rawPrompt,
        provider: request.provider,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const payload = (await response.json()) as OptimizeResponse;

    if (
      typeof payload.optimizedPrompt !== 'string' ||
      typeof payload.score !== 'number' ||
      typeof payload.rationale !== 'string'
    ) {
      throw new Error('Ungültige Antwort vom Optimizer-Service');
    }

    return payload;
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'Unbekannter Fehler';
    throw {
      code: 'OPTIMIZER_ERROR',
      message,
      provider: request.provider,
    } as OptimizerError;
  }
}
