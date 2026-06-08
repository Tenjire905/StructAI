import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import { useEffect } from 'react';
import { ActivityIndicator, StatusBar, StyleSheet, View } from 'react-native';
import { theme } from 'src/shared/theme/index';
import { useGamificationStore } from 'src/features/Gamification/model/store';

export default function RootLayout() {
  const regenOrbs = useGamificationStore((state) => state.regenOrbs);
  const incrementStreak = useGamificationStore((state) => state.incrementStreak);

  const [fontsLoaded, fontError] = useFonts({});

  useEffect(() => {
    regenOrbs();
    incrementStreak();
  }, [regenOrbs, incrementStreak]);

  useEffect(() => {
    if (fontError) {
      const message =
        fontError instanceof Error ? fontError.message : 'Unbekannter Fehler';
      console.error('[RootLayout] Font-Loading fehlgeschlagen:', message);
    }
  }, [fontError]);

  if (!fontsLoaded) {
    return (
      <View style={styles.loading}>
        <StatusBar barStyle="light-content" />
        <ActivityIndicator color={theme.colors.accent.everyday} />
      </View>
    );
  }

  return (
    <>
      <StatusBar barStyle="light-content" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: theme.colors.background.primary },
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
