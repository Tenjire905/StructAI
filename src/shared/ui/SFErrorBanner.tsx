import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { theme } from '../theme';

interface SFErrorBannerProps {
  message: string;
}

export function SFErrorBanner({ message }: SFErrorBannerProps): React.JSX.Element {
  return (
    <View style={styles.banner}>
      <Ionicons name="warning-outline" size={18} color={theme.colors.feedback.danger} />
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.colors.feedback.danger,
    backgroundColor: theme.colors.background.card,
  },
  text: {
    flex: 1,
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.feedback.danger,
  },
});
