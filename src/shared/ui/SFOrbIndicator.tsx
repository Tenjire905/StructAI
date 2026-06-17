import { StyleSheet, Text, View } from 'react-native';

import { theme } from '../theme';

interface SFOrbIndicatorProps {
  current: number;
  max: number;
  label?: string;
}

export function SFOrbIndicator({
  current,
  max,
  label,
}: SFOrbIndicatorProps): React.JSX.Element {
  return (
    <View>
      <View style={styles.row}>
        {Array.from({ length: max }).map((_, index) => {
          const filled = index < current;
          return (
            <View
              key={`orb-${index}`}
              style={[
                styles.orb,
                filled ? styles.orbFilled : styles.orbEmpty,
                filled ? { shadowColor: theme.colors.accent.everyday } : null,
              ]}
            />
          );
        })}
      </View>
      {label ? <Text style={styles.label}>{label}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  orb: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  orbFilled: {
    backgroundColor: theme.colors.accent.everyday,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7,
    shadowRadius: 8,
  },
  orbEmpty: {
    backgroundColor: theme.colors.background.card,
    borderWidth: 1,
    borderColor: theme.colors.border.subtle,
  },
  label: {
    marginTop: 8,
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text.muted,
  },
});
