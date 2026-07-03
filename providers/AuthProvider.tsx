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

import { createSessionFromUrl, subscribeToAuthDeepLinks } from '@/lib/authRedirect';
import { hydrateProgressOnLogin } from '@/lib/progressSync';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';

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

  const runProgressHydration = useCallback((userId: string) => {
    if (lastHydratedUserId.current === userId) {
      return;
    }

    lastHydratedUserId.current = userId;
    void hydrateProgressOnLogin(userId);
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setIsLoading(false);
      return;
    }

    let isMounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (isMounted) {
        setSession(data.session);
        setIsLoading(false);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, nextSession) => {
      setSession(nextSession);
      setIsLoading(false);

      if (!nextSession?.user) {
        lastHydratedUserId.current = null;
        return;
      }

      if (event === 'SIGNED_IN' || event === 'INITIAL_SESSION') {
        runProgressHydration(nextSession.user.id);
      }
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

    const { error } = await supabase.auth.signInWithPassword({ email, password });

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
