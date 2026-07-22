import 'react-native-gesture-handler';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { AuthNavigationController } from '@/components/AuthNavigationController';
import { hydrateAppStorage } from '@/lib/appStorage';
import { AuthProvider } from '@/providers/AuthProvider';
import { ThemeModeProvider, CelebrationProvider, useThemeMode } from '@/theme';

export { ErrorBoundary } from 'expo-router';

export const unstable_settings = {
  initialRouteName: 'index',
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    'ClashDisplay-Semibold': require('../assets/fonts/ClashDisplay-Semibold.otf'),
    'ClashDisplay-Medium': require('../assets/fonts/ClashDisplay-Medium.otf'),
    'GeneralSans-Regular': require('../assets/fonts/GeneralSans-Regular.otf'),
    'GeneralSans-Medium': require('../assets/fonts/GeneralSans-Medium.otf'),
    'SpaceMono-Regular': require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (error) {
      throw error;
    }
  }, [error]);

  useEffect(() => {
    void hydrateAppStorage();
  }, []);

  useEffect(() => {
    if (loaded) {
      void SplashScreen.hideAsync();
    }
  }, [loaded]);

  // Always mount Stack/providers so expo-router useLinking can resolve exp:// URLs
  // without triggering "state update on unmounted component" (async getInitialURL).
  return (
    <AuthProvider>
      <ThemeModeProvider>
        <CelebrationProvider>
          <ThemedRootNavigation />
          <AuthNavigationController />
        </CelebrationProvider>
      </ThemeModeProvider>
    </AuthProvider>
  );
}

function ThemedRootNavigation() {
  const { tokens, appearance } = useThemeMode();

  return (
    <>
      <StatusBar style={appearance === 'light' ? 'dark' : 'light'} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: tokens.colors.background.base },
        }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="auth/index" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="tagesziel" />
        <Stack.Screen name="paywall" options={{ presentation: 'modal' }} />
        {__DEV__ ? <Stack.Screen name="(dev)" options={{ headerShown: false }} /> : null}
      </Stack>
    </>
  );
}
