import { initializeDevSession } from '@/lib/devSession';
import { useProgressStore } from '@/store/progressStore';

let bootstrapStarted = false;

/** Einmal pro Client-Laufzeit: Dev-Reset + Store-Hydration. */
export function runBootstrap(): void {
  if (bootstrapStarted) {
    return;
  }

  bootstrapStarted = true;
  initializeDevSession();
  useProgressStore.getState().hydrate();
}

runBootstrap();
