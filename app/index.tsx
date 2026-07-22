import { ActivityIndicator, View } from 'react-native';

import { useAuth } from '@/providers/AuthProvider';
import { useThemeMode } from '@/theme';

/** Entry route – routing is handled by AuthNavigationController. */
export default function AppEntryScreen() {
  const { isLoading } = useAuth();
  const { tokens } = useThemeMode();

  if (isLoading) {
    return (
      <View
        style={{
          alignItems: 'center',
          backgroundColor: tokens.colors.background.base,
          flex: 1,
          justifyContent: 'center',
        }}>
        <ActivityIndicator color={tokens.colors.accent.primary} size="large" />
      </View>
    );
  }

  return null;
}
