import {
  optimizePrompt,
  type OptimizeRequest,
} from '../../features/PromptLab/api/optimizer';

export interface ModelComparisonResult {
  provider: string;
  response: string | null;
  error: string | null;
  latencyMs: number;
}

const isOptimizeProvider = (
  provider: string,
): provider is OptimizeRequest['provider'] =>
  provider === 'openai' ||
  provider === 'anthropic' ||
  provider === 'google' ||
  provider === 'grok';

async function compareSingleProvider(
  prompt: string,
  provider: string,
  apiKeys: Record<string, string>,
): Promise<ModelComparisonResult> {
  const started = Date.now();
  try {
    if (!isOptimizeProvider(provider)) {
      throw new Error(`Unbekannter Provider: ${provider}`);
    }

    const apiKey = apiKeys[provider];
    const result = await optimizePrompt({
      rawPrompt: prompt,
      provider,
      apiKey,
    });

    return {
      provider,
      response: result.optimizedPrompt,
      error: null,
      latencyMs: Date.now() - started,
    };
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : typeof error === 'object' &&
            error !== null &&
            'message' in error &&
            typeof (error as { message: unknown }).message === 'string'
          ? (error as { message: string }).message
          : 'Unbekannter Fehler';

    return {
      provider,
      response: null,
      error: message,
      latencyMs: Date.now() - started,
    };
  }
}

export async function runPromptComparison(
  prompt: string,
  providers: string[],
  apiKeys: Record<string, string>,
): Promise<ModelComparisonResult[]> {
  try {
    const tasks = providers.map((provider) =>
      compareSingleProvider(prompt, provider, apiKeys),
    );
    return await Promise.all(tasks);
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'Unbekannter Fehler';
    return providers.map((provider) => ({
      provider,
      response: null,
      error: message,
      latencyMs: 0,
    }));
  }
}
