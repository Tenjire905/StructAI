import { Ionicons } from '@expo/vector-icons';
import { useMemo } from 'react';
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
} from 'react-native';

import { theme } from '../theme';

interface SFListRowProps {
  label: string;
  onPress?: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
  showChevron?: boolean;
}

export function SFListRow({
  label,
  onPress,
  icon,
  showChevron = true,
}: SFListRowProps): React.JSX.Element {
  const scale = useMemo(() => new Animated.Value(1), []);

  const content = (
    <Animated.View style={[styles.row, { transform: [{ scale }] }]}>
      {icon ? (
        <Ionicons name={icon} size={20} color={theme.colors.accent.everyday} />
      ) : null}
      <Text style={styles.label}>{label}</Text>
      {showChevron ? (
        <Ionicons
          name="chevron-forward"
          size={18}
          color={theme.colors.text.muted}
        />
      ) : null}
    </Animated.View>
  );

  if (!onPress) {
    return content;
  }

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => {
        Animated.spring(scale, {
          toValue: 0.97,
          useNativeDriver: true,
          speed: 50,
          bounciness: 4,
        }).start();
      }}
      onPressOut={() => {
        Animated.spring(scale, {
          toValue: 1,
          useNativeDriver: true,
          speed: 50,
          bounciness: 4,
        }).start();
      }}
      accessibilityRole="button"
    >
      {content}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  label: {
    flex: 1,
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text.primary,
  },
});
