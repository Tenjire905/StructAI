import { ActivityIndicator, View } from 'react-native';

import { useAuth } from '@/providers/AuthProvider';
import { colors } from '@/theme';

/** Entry route – routing is handled by AuthNavigationController. */
export default function AppEntryScreen() {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <View
        style={{
          alignItems: 'center',
          backgroundColor: colors.background.base,
          flex: 1,
          justifyContent: 'center',
        }}>
        <ActivityIndicator color={colors.accent.primary} size="large" />
      </View>
    );
  }

  return null;
}
