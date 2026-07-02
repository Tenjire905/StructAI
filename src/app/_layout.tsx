import { useEffect } from 'react';
import { StatusBar } from 'react-native';
import { Stack } from 'expo-router';
import { useGamificationStore } from '../features/Gamification/model/store';
import { theme } from '../shared/theme';

export default function RootLayout() {
  const regenOrbs = useGamificationStore((state) => state.regenOrbs);
  const incrementStreak = useGamificationStore((state) => state.incrementStreak);

  useEffect(() => {
    try {
      regenOrbs();
      incrementStreak();
    } catch (error) {
      console.error('[RootLayout] init failed', error);
    }
  }, [regenOrbs, incrementStreak]);

  return (
    <>
      <StatusBar barStyle="light-content" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: theme.colors.background.primary },
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="settings" options={{ presentation: 'modal' }} />
        <Stack.Screen name="paywall" options={{ presentation: 'modal' }} />
      </Stack>
    </>
  );
}