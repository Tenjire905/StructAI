import { Tabs } from 'expo-router';
import { Book, FlaskConical, User } from 'lucide-react-native';
import type { ColorValue } from 'react-native';
import { theme } from 'src/shared/theme/index';

function TabIcon({
  Icon,
  color,
  focused,
}: {
  Icon: typeof Book;
  color: ColorValue;
  focused: boolean;
}) {
  return (
    <Icon
      color={color}
      size={24}
      strokeWidth={focused ? 2.5 : 2}
    />
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.colors.background.primary,
          borderTopColor: theme.colors.border.subtle,
          borderTopWidth: 1,
        },
        tabBarActiveTintColor: theme.colors.accent.everyday,
        tabBarInactiveTintColor: theme.colors.text.muted,
      }}
    >
      <Tabs.Screen
        name="akademie"
        options={{
          title: 'Akademie',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon Icon={Book} color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="lab"
        options={{
          title: 'Prompt Lab',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon Icon={FlaskConical} color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="profil"
        options={{
          title: 'Profil',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon Icon={User} color={color} focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}
