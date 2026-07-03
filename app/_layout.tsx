import 'react-native-gesture-handler';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';

import '@/lib/bootstrap';
import { AuthNavigationController } from '@/components/AuthNavigationController';
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
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <AuthProvider>
      <AuthNavigationController />
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
            <Stack.Screen
              name="dev-auth-preview"
              options={{
                headerShown: true,
                title: 'Auth Preview',
                headerStyle: { backgroundColor: colors.background.elevated },
                headerTintColor: colors.text.primary,
              }}
            />
          <Stack.Screen
            name="dev-preview"
            options={{
              headerShown: true,
              title: 'Dev Preview',
              headerStyle: { backgroundColor: colors.background.elevated },
              headerTintColor: colors.text.primary,
            }}
          />
          </Stack>
        </CelebrationProvider>
      </ThemeModeProvider>
    </AuthProvider>
  );
}
