export interface PromptOptimizeRequest {
  rawPrompt: string;
  provider: 'openai' | 'anthropic' | 'google' | 'grok';
  apiKey?: string;
}

export interface PromptOptimizeResponse {
  optimizedPrompt: string;
  score: number;
  rationale: string;
}

export interface ModelCompareRequest {
  prompt: string;
  providers: string[];
  apiKeys?: Record<string, string>;
}

export interface ModelCompareResultItem {
  provider: string;
  response: string | null;
  error: string | null;
  latencyMs: number;
}

export interface ModelCompareResponse {
  results: ModelCompareResultItem[];
}

export interface APIError {
  code: string;
  message: string;
  statusCode: number;
  timestamp: string;
}
