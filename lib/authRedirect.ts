import * as QueryParams from 'expo-auth-session/build/QueryParams';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri } from 'expo-auth-session';
import * as Linking from 'expo-linking';

import { isSupabaseConfigured, supabase } from '@/lib/supabase';

WebBrowser.maybeCompleteAuthSession();

/**
 * Must match an entry in Supabase → Authentication → URL Configuration → Redirect URLs.
 * Uses a path segment (not bare structai://) to avoid iOS PKCE redirect corruption.
 */
export const authRedirectUri = makeRedirectUri({
  scheme: 'structai',
  path: 'auth/callback',
  preferLocalhost: true,
});

function parseAuthCallbackParams(url: string) {
  const normalized = url.includes('#') ? url.replace('#', '?') : url;
  return QueryParams.getQueryParams(normalized);
}

function sanitizeAuthCode(code: string | undefined): string | undefined {
  if (!code) {
    return undefined;
  }

  return code.replace(/%23$|#$/, '');
}

export async function createSessionFromUrl(url: string) {
  const { params, errorCode } = parseAuthCallbackParams(url);

  if (errorCode) {
    throw new Error(errorCode);
  }

  const authCode = sanitizeAuthCode(params.code);

  if (authCode) {
    const { data, error } = await supabase.auth.exchangeCodeForSession(authCode);

    if (error) {
      throw error;
    }

    return data.session;
  }

  const accessToken = params.access_token;
  const refreshToken = params.refresh_token;

  if (!accessToken || !refreshToken) {
    return null;
  }

  const { data, error } = await supabase.auth.setSession({
    access_token: accessToken,
    refresh_token: refreshToken,
  });

  if (error) {
    throw error;
  }

  return data.session;
}

export async function signInWithGoogleOAuth(): Promise<void> {
  if (!isSupabaseConfigured) {
    throw new Error('supabase_not_configured');
  }

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: authRedirectUri,
      skipBrowserRedirect: true,
    },
  });

  if (error) {
    throw error;
  }

  if (!data.url) {
    throw new Error('oauth_url_missing');
  }

  const result = await WebBrowser.openAuthSessionAsync(data.url, authRedirectUri);

  if (result.type === 'cancel' || result.type === 'dismiss') {
    throw new Error('oauth_cancelled');
  }

  if (result.type !== 'success') {
    throw new Error('oauth_failed');
  }

  const session = await createSessionFromUrl(result.url);

  if (!session) {
    throw new Error('oauth_session_missing');
  }
}

export function subscribeToAuthDeepLinks(
  onSessionFromUrl: (url: string) => Promise<void>,
): () => void {
  const handleUrl = ({ url }: { url: string }) => {
    void onSessionFromUrl(url);
  };

  void Linking.getInitialURL().then((url) => {
    if (url) {
      void onSessionFromUrl(url);
    }
  });

  const subscription = Linking.addEventListener('url', handleUrl);

  return () => {
    subscription.remove();
  };
}
