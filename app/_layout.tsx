import 'react-native-gesture-handler';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { ThemeModeProvider, colors } from '@/theme';

export { ErrorBoundary } from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(tabs)',
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
    <ThemeModeProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background.base },
        }}>
        <Stack.Screen name="(tabs)" />
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
    </ThemeModeProvider>
  );
}
