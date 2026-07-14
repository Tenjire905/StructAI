import 'react-native-gesture-handler';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { AuthNavigationController } from '@/components/AuthNavigationController';
import { hydrateAppStorage } from '@/lib/appStorage';
import { AuthProvider } from '@/providers/AuthProvider';
import { ThemeModeProvider, CelebrationProvider, colors } from '@/theme';

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
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <AuthProvider>
      <ThemeModeProvider>
        <CelebrationProvider>
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: colors.background.base },
            }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="auth/index" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="onboarding" />
            {__DEV__ ? <Stack.Screen name="(dev)" options={{ headerShown: false }} /> : null}
          </Stack>
          <AuthNavigationController />
        </CelebrationProvider>
      </ThemeModeProvider>
    </AuthProvider>
  );
}
