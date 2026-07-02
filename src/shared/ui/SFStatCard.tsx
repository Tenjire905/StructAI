import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { theme } from '../theme';

interface SFStatCardProps {
  value: string;
  label: string;
  icon?: keyof typeof Ionicons.glyphMap;
}

export function SFStatCard({
  value,
  label,
  icon,
}: SFStatCardProps): React.JSX.Element {
  return (
    <View style={styles.card}>
      {icon ? (
        <Ionicons name={icon} size={18} color={theme.colors.accent.everyday} />
      ) : null}
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
    paddingVertical: 16,
    borderRadius: 20,
    backgroundColor: theme.colors.background.card,
    borderWidth: 1,
    borderColor: theme.colors.border.subtle,
  },
  value: {
    fontSize: theme.typography.fontSize.xxl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
  },
  label: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.regular,
    color: theme.colors.text.muted,
  },
});
