const DEFAULT_SUPPRESSION_MS = 4_000;

let suppressHomeCelebrationsUntil = 0;

export function suppressHomeCelebrations(durationMs = DEFAULT_SUPPRESSION_MS): void {
  suppressHomeCelebrationsUntil = Date.now() + durationMs;
}

export function shouldSuppressHomeCelebrations(): boolean {
  return Date.now() < suppressHomeCelebrationsUntil;
}
