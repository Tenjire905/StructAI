import { Pressable, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { getShadow, useThemeMode } from '@/theme';

export type SegmentedOptionItem = {
  key: string;
  label: string;
};

type SegmentedControlProps = {
  options: SegmentedOptionItem[];
  value: string;
  onChange: (key: string) => void;
  style?: StyleProp<ViewStyle>;
  /** Allow wrapping (e.g. 4 language chips). */
  wrap?: boolean;
};

/**
 * Inset track + raised white thumb — Linear/Apple Settings pattern.
 * Keeps accent scarce: selected uses card surface + strong text, not dual CTAs.
 */
export function SegmentedControl({
  options,
  value,
  onChange,
  style,
  wrap = false,
}: SegmentedControlProps) {
  const { tokens } = useThemeMode();
  const isLight = tokens.appearance === 'light';

  return (
    <View
      style={[
        {
          backgroundColor: tokens.colors.surface.inset,
          borderColor: isLight ? tokens.colors.border.subtle : tokens.colors.border.subtle,
          borderRadius: tokens.radius.md,
          borderWidth: isLight ? 1 : 0,
          flexDirection: 'row',
          flexWrap: wrap ? 'wrap' : 'nowrap',
          gap: tokens.spacing.space1,
          padding: tokens.spacing.space1,
        },
        style,
      ]}>
      {options.map((option) => {
        const isActive = option.key === value;
        return (
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ selected: isActive }}
            key={option.key}
            onPress={() => onChange(option.key)}
            style={[
              isActive && isLight ? getShadow(1, tokens.appearance) : null,
              {
                backgroundColor: isActive
                  ? tokens.colors.surface.card
                  : 'transparent',
                borderRadius: tokens.radius.sm,
                flexGrow: 1,
                flexBasis: wrap ? '47%' : 0,
                minWidth: wrap ? '40%' : undefined,
                paddingHorizontal: tokens.spacing.space3,
                paddingVertical: tokens.spacing.space3,
              },
            ]}>
            <Text
              style={{
                color: isActive
                  ? tokens.colors.text.primary
                  : tokens.colors.text.secondary,
                fontFamily: isActive
                  ? tokens.typography.fontFamily.bodyMedium
                  : tokens.typography.fontFamily.body,
                fontSize: tokens.typography.fontSize.bodyMd,
                textAlign: 'center',
              }}>
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
