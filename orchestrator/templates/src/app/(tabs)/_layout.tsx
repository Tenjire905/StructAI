import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { theme } from 'src/shared/theme/index';

type TabIconName = keyof typeof Ionicons.glyphMap;

function TabIcon({
  name,
  color,
  focused,
}: {
  name: TabIconName;
  color: string;
  focused: boolean;
}) {
  const iconName = focused ? name.replace('-outline', '') as TabIconName : name;
  return <Ionicons name={iconName} size={24} color={color} />;
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
            <TabIcon name="book-outline" color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="lab"
        options={{
          title: 'Prompt Lab',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="flask-outline" color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="profil"
        options={{
          title: 'Profil',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="person-outline" color={color} focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}
