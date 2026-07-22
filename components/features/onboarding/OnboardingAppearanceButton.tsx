import { Moon, Sun } from 'lucide-react-native';

import { PressableScale } from '@/components/ui';
import { playSfx } from '@/lib/sfx';
import { useThemeMode } from '@/theme';

/**
 * Quiet edge appearance control for onboarding — left rim chip mirroring the
 * language control on the right so the centered brand stays the hero signal.
 */
export function OnboardingAppearanceButton() {
  const { tokens, mode, appearance, toggleAppearance, t } = useThemeMode();
  const soundEnabled = tokens.presentation.soundEnabled;
  const isFocus = mode === 'focus';
  const iconSize = tokens.icons.sizes.sm;
  const buttonSize = isFocus
    ? tokens.spacing.space5 + tokens.spacing.space1
    : tokens.spacing.space6;
  const isLight = appearance === 'light';
  const Icon = isLight ? Sun : Moon;

  return (
    <PressableScale
      accessibilityLabel={t('onboarding.appearanceToggleA11y')}
      accessibilityRole="button"
      accessibilityState={{ selected: isLight }}
      hitSlop={tokens.spacing.space3}
      onPress={() => {
        playSfx('tap', soundEnabled);
        toggleAppearance();
      }}
      style={{
        alignItems: 'center',
        backgroundColor: tokens.colors.surface.card,
        borderColor: tokens.colors.border.subtle,
        borderRadius: tokens.radius.sm,
        borderWidth: 1,
        height: buttonSize,
        justifyContent: 'center',
        width: buttonSize,
      }}>
      <Icon
        color={tokens.colors.accent.primary}
        size={iconSize}
        strokeWidth={tokens.icons.strokeWidth}
      />
    </PressableScale>
  );
}
