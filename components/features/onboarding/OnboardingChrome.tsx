import { LinearGradient } from 'expo-linear-gradient';
import type { ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/ui';
import { useThemeMode } from '@/theme';

import { OnboardingLocaleButton } from './OnboardingLocaleButton';
import { OnboardingSegmentProgress } from './OnboardingSegmentProgress';

type OnboardingChromeProps = {
  children: ReactNode;
  /** When set, shows Liftoff segmented progress at top. */
  progressStep?: number;
  progressTotal?: number;
  /** Brand mark above content (marketing slides). */
  showBrand?: boolean;
  /**
   * Top-right language control (Liftoff pattern). Defaults on when brand
   * is shown so the welcome screen always exposes locale switching.
   */
  showLocalePicker?: boolean;
  ctaLabel: string;
  onCta: () => void;
  ctaDisabled?: boolean;
  skipLabel?: string;
  onSkip?: () => void;
  secondaryLabel?: string;
  onSecondary?: () => void;
  footerExtra?: ReactNode;
};

/**
 * Shared Liftoff onboarding chrome: dark hero gradient, optional segments,
 * bottom skip + full-width primary CTA + optional secondary text link.
 *
 * Design: brand/progress stay above the fold; CTA stack is sticky at the bottom
 * so swipe content never fights the primary action (Liftoff pattern).
 * Language sits top-right so the centered brand stays the hero signal.
 */
export function OnboardingChrome({
  children,
  progressStep,
  progressTotal = 4,
  showBrand = false,
  showLocalePicker,
  ctaLabel,
  onCta,
  ctaDisabled = false,
  skipLabel,
  onSkip,
  secondaryLabel,
  onSecondary,
  footerExtra,
}: OnboardingChromeProps) {
  const { tokens, mode } = useThemeMode();
  const insets = useSafeAreaInsets();
  const isFocus = mode === 'focus';
  const footerGap = isFocus ? tokens.spacing.space3 : tokens.spacing.space4;
  const localePickerVisible = showLocalePicker ?? showBrand;

  return (
    <LinearGradient
      colors={tokens.gradients.heroBackground.colors}
      end={tokens.gradients.heroBackground.end}
      start={tokens.gradients.heroBackground.start}
      style={{
        flex: 1,
        paddingBottom: tokens.spacing.space5 + insets.bottom,
        paddingHorizontal: tokens.spacing.screenPaddingHero,
        paddingTop: insets.top + tokens.spacing.space4,
      }}>
      <View
        style={{
          gap: tokens.spacing.space4,
          marginBottom: tokens.spacing.space4,
          position: 'relative',
        }}>
        {progressStep != null ? (
          <OnboardingSegmentProgress step={progressStep} total={progressTotal} />
        ) : null}
        {showBrand ? (
          <Text
            style={{
              color: tokens.colors.accent.primary,
              fontFamily: tokens.typography.fontFamily.display,
              fontSize: tokens.typography.fontSize.displayLg,
              letterSpacing: 1.2,
              lineHeight: tokens.typography.fontSize.displayLg * 1.1,
              paddingHorizontal: localePickerVisible
                ? tokens.spacing.space7
                : 0,
              textAlign: 'center',
            }}>
            StructAI
          </Text>
        ) : null}
        {localePickerVisible ? (
          <View
            style={{
              position: 'absolute',
              right: 0,
              top: 0,
              zIndex: 2,
            }}>
            <OnboardingLocaleButton />
          </View>
        ) : null}
      </View>

      <View style={{ flex: 1, justifyContent: 'center' }}>{children}</View>

      <View style={{ gap: footerGap }}>
        {footerExtra}
        {skipLabel && onSkip ? (
          <Pressable
            accessibilityRole="button"
            hitSlop={tokens.spacing.space3}
            onPress={onSkip}
            style={{ alignItems: 'center', paddingVertical: tokens.spacing.space1 }}>
            <Text
              style={{
                color: tokens.colors.text.tertiary,
                fontFamily: tokens.typography.fontFamily.bodyMedium,
                fontSize: tokens.typography.fontSize.bodyMd,
              }}>
              {skipLabel}
            </Text>
          </Pressable>
        ) : null}
        <Button
          disabled={ctaDisabled}
          label={ctaLabel}
          onPress={onCta}
          style={{ width: '100%' }}
          variant="primary"
        />
        {secondaryLabel && onSecondary ? (
          <Pressable
            accessibilityRole="button"
            hitSlop={tokens.spacing.space3}
            onPress={onSecondary}
            style={{ alignItems: 'center', paddingVertical: tokens.spacing.space1 }}>
            <Text
              style={{
                color: tokens.colors.accent.primary,
                fontFamily: tokens.typography.fontFamily.bodyMedium,
                fontSize: tokens.typography.fontSize.bodyMd,
              }}>
              {secondaryLabel}
            </Text>
          </Pressable>
        ) : null}
      </View>
    </LinearGradient>
  );
}
