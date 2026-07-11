import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PropsWithChildren,
} from 'react';
import type { Session, User } from '@supabase/supabase-js';

import { trackEvent } from '@/lib/analytics';
import { createSessionFromUrl, subscribeToAuthDeepLinks } from '@/lib/authRedirect';
import { runBootstrap } from '@/lib/bootstrap';
import { isProgressSnapshotEmpty } from '@/lib/progressMerge';
import { hydrateProgressOnLogin } from '@/lib/progressSync';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';
import { useProgressStore } from '@/store/progressStore';

type AuthContextValue = {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  isConfigured: boolean;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string) => Promise<'signed_in' | 'confirmation_required'>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const lastHydratedUserId = useRef<string | null>(null);
  const activeSessionUserId = useRef<string | null>(null);

  const runProgressHydration = useCallback((userId: string) => {
    if (lastHydratedUserId.current === userId) {
      return;
    }

    lastHydratedUserId.current = userId;
    void hydrateProgressOnLogin(userId);
  }, []);

  useEffect(() => {
    let isMounted = true;

    void (async () => {
      await runBootstrap();

      if (!isSupabaseConfigured) {
        if (isMounted) {
          setIsLoading(false);
        }
        return;
      }

      const { data } = await supabase.auth.getSession();
      if (isMounted) {
        activeSessionUserId.current = data.session?.user.id ?? null;
        setSession(data.session);
        setIsLoading(false);
      }
    })();

    if (!isSupabaseConfigured) {
      return;
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, nextSession) => {
      const nextUserId = nextSession?.user.id ?? null;
      const shouldTrackGuestConversion =
        event === 'SIGNED_IN' &&
        activeSessionUserId.current === null &&
        nextUserId !== null &&
        !isProgressSnapshotEmpty(useProgressStore.getState().getSnapshot());

      activeSessionUserId.current = nextUserId;

      setTimeout(() => {
        setSession(nextSession);
        setIsLoading(false);

        if (!nextSession?.user) {
          lastHydratedUserId.current = null;
          return;
        }

        if (event === 'SIGNED_IN' || event === 'INITIAL_SESSION') {
          if (shouldTrackGuestConversion) {
            trackEvent('account_created_from_guest');
          }

          runProgressHydration(nextSession.user.id);
        }
      }, 0);
    });

    const unsubscribeDeepLinks = subscribeToAuthDeepLinks(async (url) => {
      try {
        await createSessionFromUrl(url);
      } catch {
        // OAuth callback errors are surfaced on the auth screen when sign-in is retried.
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
      unsubscribeDeepLinks();
    };
  }, [runProgressHydration]);

  const signInWithEmail = useCallback(async (email: string, password: string) => {
    if (!isSupabaseConfigured) {
      throw new Error('supabase_not_configured');
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      throw error;
    }
  }, []);

  const signUpWithEmail = useCallback(async (email: string, password: string) => {
    if (!isSupabaseConfigured) {
      throw new Error('supabase_not_configured');
    }

    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) {
      throw error;
    }

    if (data.session) {
      return 'signed_in';
    }

    return 'confirmation_required';
  }, []);

  const signInWithGoogle = useCallback(async () => {
    const { signInWithGoogleOAuth } = await import('@/lib/authRedirect');
    await signInWithGoogleOAuth();
  }, []);

  const signOut = useCallback(async () => {
    lastHydratedUserId.current = null;
    activeSessionUserId.current = null;

    if (!isSupabaseConfigured) {
      setSession(null);
      return;
    }

    const { error } = await supabase.auth.signOut();

    if (error) {
      throw error;
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      user: session?.user ?? null,
      isLoading,
      isConfigured: isSupabaseConfigured,
      signInWithEmail,
      signUpWithEmail,
      signInWithGoogle,
      signOut,
    }),
    [isLoading, session, signInWithEmail, signInWithGoogle, signOut, signUpWithEmail],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
}
