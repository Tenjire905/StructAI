import { clampScore, type PromptScore, type PromptScoreCategory } from './promptScoring';

export type AiProvider = 'openai' | 'anthropic' | 'google';

export type ScoringErrorReason = 'invalidKey' | 'quota' | 'network' | 'generic';

export class ScoringError extends Error {
  readonly reason: ScoringErrorReason;

  constructor(reason: ScoringErrorReason, message: string) {
    super(message);
    this.reason = reason;
  }
}

/**
 * Bewusst die günstigsten tauglichen Modelle pro Provider (Stand Juli 2026):
 * - OpenAI gpt-4.1-nano ($0.10/$0.40 pro 1M Tokens): gpt-5-nano wäre nominal billiger,
 *   ist aber ein Reasoning-Modell, das bei Mini-Tasks ein Vielfaches an Output-Tokens
 *   erzeugt und langsamer antwortet – effektiv teurer.
 * - Anthropic claude-haiku-4-5 ($1/$5 pro 1M Tokens): günstigstes aktuelles Claude-Modell
 * - Google gemini-2.5-flash-lite ($0.10/$0.40 pro 1M Tokens): günstiger als 3.1 Flash-Lite
 * Eine Bewertung kostet damit ~0,001–0,01 Cent (≈300 Input- + ≤120 Output-Tokens).
 */
const PROVIDER_MODELS: Record<AiProvider, string> = {
  openai: 'gpt-4.1-nano',
  anthropic: 'claude-haiku-4-5',
  google: 'gemini-2.5-flash-lite',
};

const REQUEST_TIMEOUT_MS = 20000;
const MAX_OUTPUT_TOKENS = 120;

const SCORING_INSTRUCTION =
  'Du bewertest KI-Prompts. Bewerte den Prompt des Nutzers in drei Kategorien mit je einer Ganzzahl von 0 bis 100: ' +
  '"structure" (klare Gliederung, Trennung von Kontext/Aufgabe/Vorgaben), ' +
  '"goal" (präzise Definition des erwarteten Ergebnisses), ' +
  '"constraints" (konkrete Einschränkungen wie Format, Länge, Zielgruppe, Ton). ' +
  'Antworte ausschließlich mit einem JSON-Objekt der Form {"structure":N,"goal":N,"constraints":N} ohne weiteren Text.';

export function detectProvider(apiKey: string): AiProvider | null {
  if (apiKey.startsWith('sk-ant-')) {
    return 'anthropic';
  }

  if (apiKey.startsWith('sk-')) {
    return 'openai';
  }

  if (apiKey.startsWith('AIza')) {
    return 'google';
  }

  return null;
}

export function getProviderLabel(provider: AiProvider): string {
  return { openai: 'OpenAI', anthropic: 'Anthropic', google: 'Google' }[provider];
}

async function fetchWithTimeout(url: string, init: RequestInit): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new ScoringError('network', 'Request timed out');
    }
    throw new ScoringError('network', 'Network request failed');
  } finally {
    clearTimeout(timeout);
  }
}

function errorFromStatus(status: number, body: string): ScoringError {
  if (status === 401 || status === 403) {
    return new ScoringError('invalidKey', `Auth failed (${status})`);
  }

  if (status === 402 || status === 429 || body.includes('insufficient_quota')) {
    return new ScoringError('quota', `Quota/credit issue (${status})`);
  }

  return new ScoringError('generic', `API error (${status})`);
}

/**
 * Kostenlose Key-Prüfung über die Models-Listen-Endpunkte –
 * verbraucht keine Tokens, validiert nur die Authentifizierung.
 */
export async function validateApiKey(apiKey: string): Promise<AiProvider> {
  const provider = detectProvider(apiKey);

  if (!provider) {
    throw new ScoringError('invalidKey', 'Unknown key format');
  }

  let response: Response;

  if (provider === 'openai') {
    response = await fetchWithTimeout('https://api.openai.com/v1/models', {
      headers: { Authorization: `Bearer ${apiKey}` },
    });
  } else if (provider === 'anthropic') {
    response = await fetchWithTimeout('https://api.anthropic.com/v1/models', {
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
    });
  } else {
    response = await fetchWithTimeout(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${encodeURIComponent(apiKey)}`,
      {},
    );
  }

  if (!response.ok) {
    throw errorFromStatus(response.status, await response.text().catch(() => ''));
  }

  return provider;
}

function parseScorePayload(rawText: string): PromptScore {
  const jsonMatch = rawText.match(/\{[\s\S]*?\}/);

  if (!jsonMatch) {
    throw new ScoringError('generic', 'No JSON in model response');
  }

  let parsed: unknown;

  try {
    parsed = JSON.parse(jsonMatch[0]);
  } catch {
    throw new ScoringError('generic', 'Invalid JSON in model response');
  }

  const record = parsed as Record<string, unknown>;
  const structure = clampScore(Number(record.structure));
  const goal = clampScore(Number(record.goal));
  const constraints = clampScore(Number(record.constraints));

  if ([structure, goal, constraints].some(Number.isNaN)) {
    throw new ScoringError('generic', 'Missing score fields');
  }

  const total = clampScore(structure * 0.35 + goal * 0.35 + constraints * 0.3);

  const categories: Record<PromptScoreCategory, number> = {
    structure,
    goal,
    constraints,
  };
  const weakestCategory = (
    Object.keys(categories) as PromptScoreCategory[]
  ).reduce((weakest, category) =>
    categories[category] < categories[weakest] ? category : weakest,
  );

  return { total, structure, goal, constraints, weakestCategory };
}

async function scoreWithOpenAi(prompt: string, apiKey: string): Promise<string> {
  const response = await fetchWithTimeout('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: PROVIDER_MODELS.openai,
      messages: [
        { role: 'system', content: SCORING_INSTRUCTION },
        { role: 'user', content: prompt },
      ],
      temperature: 0,
      max_tokens: MAX_OUTPUT_TOKENS,
      response_format: { type: 'json_object' },
    }),
  });

  if (!response.ok) {
    throw errorFromStatus(response.status, await response.text().catch(() => ''));
  }

  const data = (await response.json()) as {
    choices?: { message?: { content?: string } }[];
  };

  return data.choices?.[0]?.message?.content ?? '';
}

async function scoreWithAnthropic(prompt: string, apiKey: string): Promise<string> {
  const response = await fetchWithTimeout('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: PROVIDER_MODELS.anthropic,
      max_tokens: MAX_OUTPUT_TOKENS,
      system: SCORING_INSTRUCTION,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  if (!response.ok) {
    throw errorFromStatus(response.status, await response.text().catch(() => ''));
  }

  const data = (await response.json()) as {
    content?: { type: string; text?: string }[];
  };

  return (
    data.content?.find((block) => block.type === 'text')?.text ?? ''
  );
}

async function scoreWithGoogle(prompt: string, apiKey: string): Promise<string> {
  const response = await fetchWithTimeout(
    `https://generativelanguage.googleapis.com/v1beta/models/${PROVIDER_MODELS.google}:generateContent?key=${encodeURIComponent(apiKey)}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: SCORING_INSTRUCTION }] },
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0,
          maxOutputTokens: MAX_OUTPUT_TOKENS,
          responseMimeType: 'application/json',
        },
      }),
    },
  );

  if (!response.ok) {
    throw errorFromStatus(response.status, await response.text().catch(() => ''));
  }

  const data = (await response.json()) as {
    candidates?: { content?: { parts?: { text?: string }[] } }[];
  };

  return data.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
}

export async function scorePromptRemote(
  prompt: string,
  apiKey: string,
): Promise<PromptScore> {
  const provider = detectProvider(apiKey);

  if (!provider) {
    throw new ScoringError('invalidKey', 'Unknown key format');
  }

  const rawText =
    provider === 'openai'
      ? await scoreWithOpenAi(prompt, apiKey)
      : provider === 'anthropic'
        ? await scoreWithAnthropic(prompt, apiKey)
        : await scoreWithGoogle(prompt, apiKey);

  return parseScorePayload(rawText);
}
