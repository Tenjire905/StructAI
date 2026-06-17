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

function scorePrompt(prompt: string): number {
  let score = 35;
  if (prompt.length > 40) {
    score += 15;
  }
  if (prompt.length > 120) {
    score += 10;
  }
  if (/ziel|goal|kontext|context|rolle|role/i.test(prompt)) {
    score += 12;
  }
  if (/schritt|step|format|output/i.test(prompt)) {
    score += 10;
  }
  if (prompt.includes('\n')) {
    score += 8;
  }
  return Math.min(98, score);
}

function buildLocalOptimization(rawPrompt: string): OptimizeResponse {
  const trimmed = rawPrompt.trim();
  const optimizedPrompt = [
    '## Rolle',
    'Du bist ein erfahrener Prompt-Engineer für StructAI.',
    '',
    '## Aufgabe',
    trimmed,
    '',
    '## Ausgabeformat',
    '- Klare Struktur mit nummerierten Schritten',
    '- Konkrete Beispiele wo sinnvoll',
    '- Präzise Constraints und Erfolgskriterien',
  ].join('\n');

  return {
    optimizedPrompt,
    score: scorePrompt(trimmed),
    rationale:
      'Lokale Demo-Optimierung — strukturiert deinen Prompt mit Rolle, Aufgabe und Format.',
  };
}

async function optimizeRemote(
  request: OptimizeRequest,
): Promise<OptimizeResponse> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  if (request.apiKey) {
    headers['X-API-Key'] = request.apiKey;
    headers.Authorization = `Bearer ${request.apiKey}`;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    const response = await fetch(OPTIMIZER_ENDPOINT, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        rawPrompt: request.rawPrompt,
        provider: request.provider,
      }),
      signal: controller.signal,
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
  } finally {
    clearTimeout(timeout);
  }
}

export async function optimizePrompt(
  request: OptimizeRequest,
): Promise<OptimizeResponse> {
  try {
    return await optimizeRemote(request);
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'Unbekannter Fehler';
    console.warn('[optimizer] Remote fehlgeschlagen, lokale Demo:', message);
    return buildLocalOptimization(request.rawPrompt);
  }
}
