import { Tabs } from 'expo-router';

import { FloatingTabBar } from 'src/shared/ui';

export default function TabsLayout(): React.JSX.Element {
  return (
    <Tabs
      tabBar={(props) => <FloatingTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="akademie"
        options={{ title: 'Akademie', tabBarLabel: 'Akademie' }}
      />
      <Tabs.Screen
        name="lab"
        options={{ title: 'Prompt Lab', tabBarLabel: 'Lab' }}
      />
      <Tabs.Screen
        name="profil"
        options={{ title: 'Profil', tabBarLabel: 'Profil' }}
      />
    </Tabs>
  );
}
