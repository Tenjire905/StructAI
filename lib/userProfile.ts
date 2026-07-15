import { isSupabaseConfigured, supabase } from '@/lib/supabase';

/** Ages below 15 strongly recommend Playful mode (see onboarding/profile screen). */
export const PLAYFUL_RECOMMENDED_MAX_AGE = 14;

export async function updateAuthenticatedUserDisplayName(name: string): Promise<void> {
  if (!isSupabaseConfigured) {
    return;
  }

  const trimmed = name.trim();

  if (trimmed.length === 0) {
    return;
  }

  const { error } = await supabase.auth.updateUser({
    data: { full_name: trimmed },
  });

  if (error) {
    throw error;
  }
}

export function isPlayfulModeRecommended(age: number | null): boolean {
  return age !== null && age <= PLAYFUL_RECOMMENDED_MAX_AGE;
}

export function parseProfileAgeInput(value: string): number | null {
  const trimmed = value.trim();

  if (trimmed.length === 0) {
    return null;
  }

  const parsed = Number.parseInt(trimmed, 10);

  if (!Number.isFinite(parsed)) {
    return null;
  }

  return parsed;
}

export function isValidProfileAge(age: number): boolean {
  return age >= 1 && age <= 120;
}
