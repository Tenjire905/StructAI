import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { theme } from '../theme';

interface SFStreakDotProps {
  label: string;
  active: boolean;
}

export function SFStreakDot({
  label,
  active,
}: SFStreakDotProps): React.JSX.Element {
  return (
    <View style={styles.column}>
      <View
        style={[
          styles.dot,
          active ? styles.dotActive : styles.dotInactive,
        ]}
      >
        {active ? (
          <Ionicons name="checkmark" size={14} color={theme.colors.text.primary} />
        ) : null}
      </View>
      <Text style={[styles.label, active && styles.labelActive]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  column: {
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  dot: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotActive: {
    backgroundColor: theme.colors.accent.everyday,
    borderWidth: 1,
    borderColor: theme.colors.border.glow,
    shadowColor: theme.colors.accent.everyday,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
  },
  dotInactive: {
    backgroundColor: theme.colors.background.card,
    borderWidth: 1,
    borderColor: theme.colors.border.subtle,
  },
  label: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.regular,
    color: theme.colors.text.muted,
  },
  labelActive: {
    color: theme.colors.accent.everyday,
    fontWeight: theme.typography.fontWeight.semibold,
  },
});
