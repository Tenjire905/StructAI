import { hydrateAppStorage } from '@/lib/appStorage';
import { initializeDevSession } from '@/lib/devSession';
import { migrateLegacyProfileOnboarding } from '@/lib/profileOnboarding';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';
import { useProgressStore } from '@/store/progressStore';

let bootstrapPromise: Promise<void> | null = null;

async function resolveHasAuthenticatedSession(): Promise<boolean> {
  if (!isSupabaseConfigured) {
    return false;
  }

  try {
    const { data } = await supabase.auth.getSession();
    return Boolean(data.session);
  } catch {
    return false;
  }
}

/** Once per client runtime: optional dev reset (never for signed-in users) + store hydration. */
export function runBootstrap(): Promise<void> {
  if (bootstrapPromise) {
    return bootstrapPromise;
  }

  bootstrapPromise = (async () => {
    await hydrateAppStorage();
    const hasAuthenticatedSession = await resolveHasAuthenticatedSession();
    initializeDevSession(hasAuthenticatedSession);
    useProgressStore.getState().hydrate();
    migrateLegacyProfileOnboarding(useProgressStore.getState().getSnapshot());
  })();

  return bootstrapPromise;
}
