import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { useThemeMode } from '@/theme';

type BadgeTone = 'primary' | 'structure' | 'warning' | 'success';

type BadgeProps = {
  label: string;
  tone?: BadgeTone;
  /** Solid fill — rare emphasis. Default is soft wash + accent text (premium light). */
  emphasis?: 'soft' | 'solid';
  style?: StyleProp<ViewStyle>;
};

export function Badge({ label, tone = 'primary', emphasis, style }: BadgeProps) {
  const { tokens } = useThemeMode();
  const isLight = tokens.appearance === 'light';
  const resolvedEmphasis = emphasis ?? (isLight ? 'soft' : 'solid');

  const solidFill = {
    primary: tokens.colors.accent.primary,
    structure: tokens.colors.accent.structure,
    warning: tokens.colors.accent.warning,
    success: tokens.colors.accent.success,
  }[tone];

  const softFill = {
    primary: tokens.colors.accent.primarySoft,
    structure: tokens.colors.accent.structureSoft,
    warning: tokens.colors.accent.warningSoft,
    success: tokens.colors.accent.successSoft,
  }[tone];

  const softInk = {
    primary: tokens.colors.accent.primary,
    structure: tokens.colors.accent.structure,
    warning: tokens.colors.accent.warning,
    success: tokens.colors.accent.success,
  }[tone];

  const isSoft = resolvedEmphasis === 'soft';

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: isSoft ? softFill : solidFill,
          borderRadius: tokens.radius.sm,
          paddingHorizontal: tokens.spacing.space2,
          paddingVertical: tokens.spacing.space1,
        },
        style,
      ]}>
      <Text
        style={{
          color: isSoft ? softInk : tokens.colors.text.onAccent,
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
