import { Pressable, View } from 'react-native';

import { useThemeMode } from '@/theme';

type OnboardingPageDotsProps = {
  count: number;
  index: number;
  onSelect?: (index: number) => void;
};

/** Liftoff-style equal dots — active = accent-primary (same size). */
export function OnboardingPageDots({
  count,
  index,
  onSelect,
}: OnboardingPageDotsProps) {
  const { tokens } = useThemeMode();

  return (
    <View
      accessibilityRole="adjustable"
      style={{
        alignItems: 'center',
        flexDirection: 'row',
        gap: tokens.spacing.space2,
        justifyContent: 'center',
      }}>
      {Array.from({ length: count }, (_, i) => {
        const active = i === index;
        const dot = (
          <View
            style={{
              backgroundColor: active
                ? tokens.colors.accent.primary
                : tokens.colors.border.strong,
              borderRadius: tokens.radius.pill,
              height: tokens.spacing.space2,
              opacity: active ? 1 : 0.5,
              width: tokens.spacing.space2,
            }}
          />
        );

        if (!onSelect) {
          return <View key={`dot-${i}`}>{dot}</View>;
        }

        return (
          <Pressable
            key={`dot-${i}`}
            accessibilityRole="button"
            hitSlop={tokens.spacing.space2}
            onPress={() => onSelect(i)}>
            {dot}
          </Pressable>
        );
      })}
    </View>
  );
}
