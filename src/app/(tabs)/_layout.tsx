import { NativeTabs } from 'expo-router/unstable-native-tabs';
import { theme } from 'src/shared/theme/index';

export default function TabsLayout() {
  return (
    <NativeTabs tintColor={theme.colors.accent.everyday}>
      <NativeTabs.Trigger name="akademie">
        <NativeTabs.Trigger.Label>Akademie</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={{ default: 'book', selected: 'book.fill' }}
          md="menu_book"
        />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="lab">
        <NativeTabs.Trigger.Label>Prompt Lab</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={{ default: 'flask', selected: 'flask.fill' }}
          md="science"
        />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="profil">
        <NativeTabs.Trigger.Label>Profil</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={{ default: 'person', selected: 'person.fill' }}
          md="person"
        />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
