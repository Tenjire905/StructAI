import { Tabs } from 'expo-router';
import { Beaker, BookOpen, Home, User, type LucideIcon } from 'lucide-react-native';
import { View } from 'react-native';

import { useThemeMode } from '@/theme';

type TabIconProps = {
  Icon: LucideIcon;
  color: string;
  focused: boolean;
  size: number;
  strokeWidth: number;
  indicatorColor: string;
};

function asColorString(color: string | { toString(): string }): string {
  return typeof color === 'string' ? color : String(color);
}

function TabBarGlyph({
  Icon,
  color,
  focused,
  size,
  strokeWidth,
  indicatorColor,
}: TabIconProps) {
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <Icon color={color} size={size} strokeWidth={strokeWidth} />
      <View
        style={{
          backgroundColor: focused ? indicatorColor : 'transparent',
          borderRadius: 999,
          height: 2,
          marginTop: 4,
          width: 16,
        }}
      />
    </View>
  );
}

export default function TabLayout() {
  const { tokens, t } = useThemeMode();

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
        headerShadowVisible: false,
        sceneStyle: {
          backgroundColor: tokens.colors.background.base,
        },
        tabBarStyle: {
          backgroundColor: tokens.colors.background.elevated,
          borderTopColor: tokens.colors.border.subtle,
        },
        tabBarActiveTintColor: tokens.colors.accent.primary,
        tabBarInactiveTintColor: tokens.colors.text.tertiary,
        tabBarActiveBackgroundColor: tokens.colors.accent.primarySoft,
        tabBarLabelStyle: {
          fontFamily: tokens.typography.fontFamily.bodyMedium,
          fontSize: tokens.typography.fontSize.bodySm,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: t('tabs.home'),
          tabBarIcon: ({ color, size, focused }) => (
            <TabBarGlyph
              Icon={Home}
              color={asColorString(color)}
              focused={focused}
              indicatorColor={tokens.colors.accent.primary}
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
          tabBarIcon: ({ color, size, focused }) => (
            <TabBarGlyph
              Icon={BookOpen}
              color={asColorString(color)}
              focused={focused}
              indicatorColor={tokens.colors.accent.primary}
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
          tabBarIcon: ({ color, size, focused }) => (
            <TabBarGlyph
              Icon={Beaker}
              color={asColorString(color)}
              focused={focused}
              indicatorColor={tokens.colors.accent.primary}
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
          tabBarIcon: ({ color, size, focused }) => (
            <TabBarGlyph
              Icon={User}
              color={asColorString(color)}
              focused={focused}
              indicatorColor={tokens.colors.accent.primary}
              size={size}
              strokeWidth={tokens.icons.strokeWidth}
            />
          ),
        }}
      />
    </Tabs>
  );
}
