import { Tabs } from 'expo-router';
import { Beaker, BookOpen, Home, User, type LucideIcon } from 'lucide-react-native';
import type { ComponentProps } from 'react';

import { FloatingTabBar } from '@/components/ui/FloatingTabBar';
import { useThemeMode } from '@/theme';

type TabIconProps = {
  Icon: LucideIcon;
  color: string;
  size: number;
  strokeWidth: number;
};

function asColorString(color: string | { toString(): string }): string {
  return typeof color === 'string' ? color : String(color);
}

function TabBarGlyph({ Icon, color, size, strokeWidth }: TabIconProps) {
  return <Icon color={color} size={size} strokeWidth={strokeWidth} />;
}

export default function TabLayout() {
  const { tokens, t } = useThemeMode();

  return (
    <Tabs
      tabBar={(props) => (
        <FloatingTabBar {...(props as ComponentProps<typeof FloatingTabBar>)} />
      )}
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: tokens.colors.background.elevated,
        },
        headerTintColor: tokens.colors.text.primary,
        headerTitleStyle: {
          fontFamily: tokens.typography.fontFamily.heading,
        },
        headerShadowVisible: false,
        sceneStyle: {
          backgroundColor: tokens.colors.background.base,
        },
        tabBarActiveTintColor: tokens.colors.accent.primary,
        tabBarInactiveTintColor: tokens.colors.text.tertiary,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: t('tabs.home'),
          tabBarIcon: ({ color, size }) => (
            <TabBarGlyph
              Icon={Home}
              color={asColorString(color)}
              size={size}
              strokeWidth={tokens.icons.strokeWidth}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="lernpfade"
        options={{
          title: t('tabs.paths'),
          tabBarIcon: ({ color, size }) => (
            <TabBarGlyph
              Icon={BookOpen}
              color={asColorString(color)}
              size={size}
              strokeWidth={tokens.icons.strokeWidth}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="prompt-lab"
        options={{
          title: t('tabs.promptLab'),
          tabBarIcon: ({ color, size }) => (
            <TabBarGlyph
              Icon={Beaker}
              color={asColorString(color)}
              size={size}
              strokeWidth={tokens.icons.strokeWidth}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profil"
        options={{
          title: t('tabs.profile'),
          tabBarIcon: ({ color, size }) => (
            <TabBarGlyph
              Icon={User}
              color={asColorString(color)}
              size={size}
              strokeWidth={tokens.icons.strokeWidth}
            />
          ),
        }}
      />
    </Tabs>
  );
}
