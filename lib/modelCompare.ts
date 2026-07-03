import {
  ScoringError,
  getProviderLabel,
  type AiProvider,
  type ScoringErrorReason,
} from '@/lib/aiScoring';

export type CompareModelTarget = {
  provider: AiProvider;
  apiKey: string;
};

export type CompareModelSuccess = {
  status: 'success';
  provider: AiProvider;
  modelId: string;
  modelLabel: string;
  responseText: string;
  latencyMs: number;
  estimatedCostUsd: number;
  inputTokens: number;
  outputTokens: number;
};

export type CompareModelFailure = {
  status: 'error';
  provider: AiProvider;
  modelId: string;
  modelLabel: string;
  reason: ScoringErrorReason;
  latencyMs: number;
};

export type CompareModelResult = CompareModelSuccess | CompareModelFailure;

const PROVIDER_MODELS: Record<AiProvider, string> = {
  openai: 'gpt-4.1-nano',
  anthropic: 'claude-haiku-4-5',
  google: 'gemini-2.5-flash-lite',
};

/**
 * Grobe USD-Kostenschätzung pro Antwort:
 *   cost = (inputTokens / 1_000_000) * inputRate + (outputTokens / 1_000_000) * outputRate
 *
 * Raten (Stand Juli 2026, gleiche Modelle wie lib/aiScoring.ts):
 * - OpenAI gpt-4.1-nano / Google gemini-2.5-flash-lite: $0.10 input / $0.40 output pro 1M Tokens
 * - Anthropic claude-haiku-4-5: $1.00 input / $5.00 output pro 1M Tokens
 *
 * Token-Zahlen: bevorzugt API-usage-Felder; Fallback ≈ ceil(zeichen / 4).
 */
const PRICING_USD_PER_MILLION: Record<AiProvider, { input: number; output: number }> = {
  openai: { input: 0.1, output: 0.4 },
  anthropic: { input: 1, output: 5 },
  google: { input: 0.1, output: 0.4 },
};

const REQUEST_TIMEOUT_MS = 30000;
const MAX_OUTPUT_TOKENS = 512;

function estimateTokensFromText(text: string): number {
  return Math.max(1, Math.ceil(text.length / 4));
}

export function estimateCompareCostUsd(
  provider: AiProvider,
  inputTokens: number,
  outputTokens: number,
): number {
  const rates = PRICING_USD_PER_MILLION[provider];
  return (
    (inputTokens / 1_000_000) * rates.input + (outputTokens / 1_000_000) * rates.output
  );
}

export function getCompareModelLabel(provider: AiProvider): string {
  return `${getProviderLabel(provider)} · ${PROVIDER_MODELS[provider]}`;
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

async function completeWithOpenAi(
  prompt: string,
  apiKey: string,
): Promise<{ text: string; inputTokens: number; outputTokens: number }> {
  const response = await fetchWithTimeout('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: PROVIDER_MODELS.openai,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.4,
      max_tokens: MAX_OUTPUT_TOKENS,
    }),
  });

  if (!response.ok) {
    throw errorFromStatus(response.status, await response.text().catch(() => ''));
  }

  const data = (await response.json()) as {
    choices?: { message?: { content?: string } }[];
    usage?: { prompt_tokens?: number; completion_tokens?: number };
  };

  const text = data.choices?.[0]?.message?.content?.trim() ?? '';
  const inputTokens = data.usage?.prompt_tokens ?? estimateTokensFromText(prompt);
  const outputTokens = data.usage?.completion_tokens ?? estimateTokensFromText(text);

  return { text, inputTokens, outputTokens };
}

async function completeWithAnthropic(
  prompt: string,
  apiKey: string,
): Promise<{ text: string; inputTokens: number; outputTokens: number }> {
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
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  if (!response.ok) {
    throw errorFromStatus(response.status, await response.text().catch(() => ''));
  }

  const data = (await response.json()) as {
    content?: { type: string; text?: string }[];
    usage?: { input_tokens?: number; output_tokens?: number };
  };

  const text = data.content?.find((block) => block.type === 'text')?.text?.trim() ?? '';
  const inputTokens = data.usage?.input_tokens ?? estimateTokensFromText(prompt);
  const outputTokens = data.usage?.output_tokens ?? estimateTokensFromText(text);

  return { text, inputTokens, outputTokens };
}

async function completeWithGoogle(
  prompt: string,
  apiKey: string,
): Promise<{ text: string; inputTokens: number; outputTokens: number }> {
  const response = await fetchWithTimeout(
    `https://generativelanguage.googleapis.com/v1beta/models/${PROVIDER_MODELS.google}:generateContent?key=${encodeURIComponent(apiKey)}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.4,
          maxOutputTokens: MAX_OUTPUT_TOKENS,
        },
      }),
    },
  );

  if (!response.ok) {
    throw errorFromStatus(response.status, await response.text().catch(() => ''));
  }

  const data = (await response.json()) as {
    candidates?: { content?: { parts?: { text?: string }[] } }[];
    usageMetadata?: { promptTokenCount?: number; candidatesTokenCount?: number };
  };

  const text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? '';
  const inputTokens =
    data.usageMetadata?.promptTokenCount ?? estimateTokensFromText(prompt);
  const outputTokens =
    data.usageMetadata?.candidatesTokenCount ?? estimateTokensFromText(text);

  return { text, inputTokens, outputTokens };
}

async function completeWithProvider(
  prompt: string,
  target: CompareModelTarget,
): Promise<CompareModelSuccess> {
  const startedAt = performance.now();
  const modelId = PROVIDER_MODELS[target.provider];
  const modelLabel = getCompareModelLabel(target.provider);

  const completion =
    target.provider === 'openai'
      ? await completeWithOpenAi(prompt, target.apiKey)
      : target.provider === 'anthropic'
        ? await completeWithAnthropic(prompt, target.apiKey)
        : await completeWithGoogle(prompt, target.apiKey);

  const latencyMs = Math.round(performance.now() - startedAt);

  return {
    status: 'success',
    provider: target.provider,
    modelId,
    modelLabel,
    responseText: completion.text,
    latencyMs,
    inputTokens: completion.inputTokens,
    outputTokens: completion.outputTokens,
    estimatedCostUsd: estimateCompareCostUsd(
      target.provider,
      completion.inputTokens,
      completion.outputTokens,
    ),
  };
}

async function runSingleCompare(
  prompt: string,
  target: CompareModelTarget,
): Promise<CompareModelResult> {
  const modelId = PROVIDER_MODELS[target.provider];
  const modelLabel = getCompareModelLabel(target.provider);
  const startedAt = performance.now();

  try {
    return await completeWithProvider(prompt, target);
  } catch (error) {
    const reason =
      error instanceof ScoringError ? error.reason : ('generic' as ScoringErrorReason);

    return {
      status: 'error',
      provider: target.provider,
      modelId,
      modelLabel,
      reason,
      latencyMs: Math.round(performance.now() - startedAt),
    };
  }
}

/** Sendet den Prompt parallel an alle gewählten Modelle (Fehler pro Spalte isoliert). */
export async function comparePromptAcrossModels(
  prompt: string,
  targets: CompareModelTarget[],
): Promise<CompareModelResult[]> {
  return Promise.all(targets.map((target) => runSingleCompare(prompt, target)));
}

const MOCK_RESPONSES: Record<AiProvider, string> = {
  openai:
    'Kurzantwort (Mock): Strukturiere deinen Prompt in Kontext, Aufgabe und klare Output-Vorgaben.',
  anthropic:
    'Kurzantwort (Mock): Nenne Ziel, Zielgruppe und ein messbares Erfolgskriterium im Prompt.',
  google:
    'Kurzantwort (Mock): Formuliere die erwartete Ausgabe als konkretes Beispiel mit Längenlimit.',
};

/** Dev/Screenshots: simulierte Antworten ohne echte API-Calls. */
export async function mockComparePromptAcrossModels(
  prompt: string,
  targets: CompareModelTarget[],
): Promise<CompareModelResult[]> {
  return Promise.all(
    targets.map(async (target, index) => {
      const startedAt = performance.now();
      await new Promise((resolve) => setTimeout(resolve, 180 + index * 120));

      if (__DEV__ && target.provider === 'google' && prompt.includes('__fail_google__')) {
        return {
          status: 'error' as const,
          provider: target.provider,
          modelId: PROVIDER_MODELS[target.provider],
          modelLabel: getCompareModelLabel(target.provider),
          reason: 'quota' as const,
          latencyMs: Math.round(performance.now() - startedAt),
        };
      }

      const responseText = MOCK_RESPONSES[target.provider];
      const inputTokens = estimateTokensFromText(prompt);
      const outputTokens = estimateTokensFromText(responseText);

      return {
        status: 'success' as const,
        provider: target.provider,
        modelId: PROVIDER_MODELS[target.provider],
        modelLabel: getCompareModelLabel(target.provider),
        responseText,
        latencyMs: Math.round(performance.now() - startedAt),
        inputTokens,
        outputTokens,
        estimatedCostUsd: estimateCompareCostUsd(
          target.provider,
          inputTokens,
          outputTokens,
        ),
      };
    }),
  );
}
