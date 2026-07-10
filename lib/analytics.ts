import * as Crypto from 'expo-crypto';

import { isSupabaseConfigured, supabase } from '@/lib/supabase';

export const ANALYTICS_EVENT_NAMES = [
  'onboarding_completed',
  'guest_demo_prompt_viewed',
  'byok_key_added_success',
  'first_lesson_completed',
  'account_created_from_guest',
] as const;

export type AnalyticsEventName = (typeof ANALYTICS_EVENT_NAMES)[number];

let currentSessionId: string | null = null;

function getAnonymousSessionId(): string {
  if (!currentSessionId) {
    currentSessionId = Crypto.randomUUID();
  }

  return currentSessionId;
}

async function insertEvent(eventName: AnalyticsEventName, sessionId: string): Promise<void> {
  const { data } = await supabase.auth.getSession();
  const userId = data.session?.user.id ?? null;

  await supabase.from('app_events').insert({
    event_name: eventName,
    session_id: sessionId,
    user_id: userId,
  });
}

/**
 * Sends one explicitly requested activation event without blocking UI work.
 * Failures are intentionally ignored; analytics must never affect app behavior.
 */
export function trackEvent(eventName: AnalyticsEventName): void {
  if (!isSupabaseConfigured) {
    return;
  }

  const sessionId = getAnonymousSessionId();
  void insertEvent(eventName, sessionId).catch(() => undefined);
}
