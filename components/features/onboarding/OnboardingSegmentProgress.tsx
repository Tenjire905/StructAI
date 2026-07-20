import { View } from 'react-native';

import { useThemeMode } from '@/theme';

type OnboardingSegmentProgressProps = {
  /** 1-based active step */
  step: number;
  total?: number;
};

/**
 * Liftoff-style segmented top progress (thin bars, one active).
 * Active fill uses brand primary — not accent-structure (scoring-only).
 */
export function OnboardingSegmentProgress({
  step,
  total = 4,
}: OnboardingSegmentProgressProps) {
  const { tokens } = useThemeMode();
  const clamped = Math.min(total, Math.max(1, step));

  return (
    <View
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 1, max: total, now: clamped }}
      style={{
        flexDirection: 'row',
        gap: tokens.spacing.space2,
        width: '100%',
      }}>
      {Array.from({ length: total }, (_, index) => {
        const active = index + 1 === clamped;
        return (
          <View
            key={`seg-${index}`}
            style={{
              backgroundColor: active
                ? tokens.colors.accent.primary
                : tokens.colors.border.subtle,
              borderRadius: tokens.radius.pill,
              flex: 1,
              height: tokens.spacing.space1,
            }}
          />
        );
      })}
    </View>
  );
}
