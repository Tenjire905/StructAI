import { View } from 'react-native';

import { useThemeMode } from '@/theme';

type OnboardingPageDotsProps = {
  count: number;
  index: number;
};

/** Carousel page dots — active = accent-primary. */
export function OnboardingPageDots({ count, index }: OnboardingPageDotsProps) {
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
        return (
          <View
            key={`dot-${i}`}
            style={{
              backgroundColor: active
                ? tokens.colors.accent.primary
                : tokens.colors.border.strong,
              borderRadius: tokens.radius.pill,
              height: tokens.spacing.space2,
              opacity: active ? 1 : 0.55,
              width: active ? tokens.spacing.space4 : tokens.spacing.space2,
            }}
          />
        );
      })}
    </View>
  );
}
