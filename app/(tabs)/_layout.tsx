import { Redirect, Tabs } from 'expo-router';
import { Beaker, BookOpen, Home, User } from 'lucide-react-native';

import { isOnboardingCompleted } from '@/lib/appStorage';
import { useThemeMode } from '@/theme';

export default function TabLayout() {
  const { tokens, t } = useThemeMode();
  const onboarded = isOnboardingCompleted();

  if (!onboarded) {
    return <Redirect href="/onboarding" />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: tokens.colors.background.elevated,
        },
        headerTintColor: tokens.colors.text.primary,
        headerTitleStyle: {
          fontFamily: tokens.typography.fontFamily.heading,
        },
        tabBarStyle: {
          backgroundColor: tokens.colors.background.elevated,
          borderTopColor: tokens.colors.border.subtle,
        },
        tabBarActiveTintColor: tokens.colors.accent.primary,
        tabBarInactiveTintColor: tokens.colors.text.secondary,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: t('tabs.home'),
          tabBarIcon: ({ color, size }) => (
            <Home color={color} size={size} strokeWidth={tokens.icons.strokeWidth} />
          ),
        }}
      />
      <Tabs.Screen
        name="lernpfade"
        options={{
          title: t('tabs.paths'),
          tabBarIcon: ({ color, size }) => (
            <BookOpen color={color} size={size} strokeWidth={tokens.icons.strokeWidth} />
          ),
        }}
      />
      <Tabs.Screen
        name="prompt-lab"
        options={{
          title: t('tabs.promptLab'),
          tabBarIcon: ({ color, size }) => (
            <Beaker color={color} size={size} strokeWidth={tokens.icons.strokeWidth} />
          ),
        }}
      />
      <Tabs.Screen
        name="profil"
        options={{
          title: t('tabs.profile'),
          tabBarIcon: ({ color, size }) => (
            <User color={color} size={size} strokeWidth={tokens.icons.strokeWidth} />
          ),
        }}
      />
    </Tabs>
  );
}
