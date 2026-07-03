import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { useThemeMode } from '@/theme';

type BadgeTone = 'primary' | 'structure' | 'warning' | 'success';

type BadgeProps = {
  label: string;
  tone?: BadgeTone;
  style?: StyleProp<ViewStyle>;
};

export function Badge({ label, tone = 'primary', style }: BadgeProps) {
  const { tokens } = useThemeMode();

  const toneColor = {
    primary: tokens.colors.accent.primary,
    structure: tokens.colors.accent.structure,
    warning: tokens.colors.accent.warning,
    success: tokens.colors.accent.success,
  }[tone];

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: toneColor,
          borderRadius: tokens.radius.sm,
          paddingHorizontal: tokens.spacing.space2,
          paddingVertical: tokens.spacing.space1,
        },
        style,
      ]}>
      <Text
        style={{
          color: tokens.colors.text.onAccent,
          fontFamily: tokens.typography.fontFamily.bodyMedium,
          fontSize: tokens.typography.fontSize.bodySm,
        }}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
  },
});
