import * as QueryParams from 'expo-auth-session/build/QueryParams';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri } from 'expo-auth-session';
import * as Linking from 'expo-linking';

import { isSupabaseConfigured, supabase } from '@/lib/supabase';

WebBrowser.maybeCompleteAuthSession();

export const authRedirectUri = makeRedirectUri({
  scheme: 'structai',
});

export async function createSessionFromUrl(url: string) {
  const { params, errorCode } = QueryParams.getQueryParams(url);

  if (errorCode) {
    throw new Error(errorCode);
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

  if (result.type !== 'success') {
    return;
  }

  await createSessionFromUrl(result.url);
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
