# StructAI – Backend-Stubs (bindend)

Server-Anbindung später; Stubs müssen sofort typisieren und kompilieren.

## `backend/src/types/contracts.ts`
- `PromptOptimizeRequest` / `PromptOptimizeResponse` – spiegeln `OptimizeRequest`/`OptimizeResponse` im Frontend
- `ModelCompareRequest` / `ModelCompareResponse` – `prompt`, `providers`, optionale `apiKeys`
- `ModelCompareResultItem`: `provider`, `response`, `error`, `latencyMs`
- `APIError`: `code`, `message`, `statusCode`, `timestamp` (ISO string)
- Kein `any`, keine Implementierung

## `backend/src/health/healthcheck.ts`
- `HealthCheckResult`: `status` 'ok' | 'degraded' | 'error', `version` '1.0.0', `timestamp`, `uptime`
- `runHealthCheck()` async mit try-catch, bei Fehler `status: 'error'`, `uptime: 0`

## API-Konvention (für Frontend `optimizer.ts`)
- POST JSON `{ rawPrompt, provider }`
- Optional Header `Authorization: Bearer {apiKey}` oder `X-API-Key` bei BYOK
- Fehler als strukturiertes JSON mit `code` + `message`
