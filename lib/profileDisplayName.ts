import type { User } from '@supabase/supabase-js';

const MOCK_PROFILE_NAME = 'Alex Muster';

export function resolveProfileDisplayName(user: User | null | undefined): string {
  return (
    (user?.user_metadata?.full_name as string | undefined) ??
    (user?.user_metadata?.name as string | undefined) ??
    user?.email?.split('@')[0] ??
    MOCK_PROFILE_NAME
  );
}
