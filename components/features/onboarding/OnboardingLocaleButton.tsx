import { Check, Languages } from 'lucide-react-native';
import { useState } from 'react';
import { Modal, Pressable, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PressableScale } from '@/components/ui';
import { playSfx } from '@/lib/sfx';
import {
  getShadow,
  LOCALES,
  LOCALE_ENDONYMS,
  type Locale,
  useThemeMode,
} from '@/theme';

/**
 * Quiet edge language control for onboarding — small, low-contrast chip so the
 * brand stays hero and the picker reads as an optional rim affordance (not a CTA).
 */
export function OnboardingLocaleButton() {
  const { tokens, mode, locale, setLocale, t } = useThemeMode();
  const insets = useSafeAreaInsets();
  const [open, setOpen] = useState(false);
  const soundEnabled = tokens.presentation.soundEnabled;
  const menuOpacity = useSharedValue(0);
  const menuScale = useSharedValue(0.96);
  const isFocus = mode === 'focus';
  const iconSize = tokens.icons.sizes.sm;
  const buttonSize = isFocus ? tokens.spacing.space5 + tokens.spacing.space1 : tokens.spacing.space6;

  const menuStyle = useAnimatedStyle(() => ({
    opacity: menuOpacity.value,
    transform: [{ scale: menuScale.value }],
  }));

  const openMenu = () => {
    playSfx('tap', soundEnabled);
    menuOpacity.value = 0;
    menuScale.value = 0.96;
    setOpen(true);
    menuOpacity.value = withTiming(1, { duration: tokens.motion.duration.fast });
    menuScale.value = withSpring(1, tokens.motion.spring.default);
  };

  const closeMenu = () => {
    setOpen(false);
  };

  const selectLocale = (next: Locale) => {
    playSfx('tap', soundEnabled);
    setLocale(next);
    closeMenu();
  };

  return (
    <>
      <PressableScale
        accessibilityLabel={t('onboarding.languagePickerA11y')}
        accessibilityRole="button"
        hitSlop={tokens.spacing.space3}
        onPress={openMenu}
        style={{
          alignItems: 'center',
          backgroundColor: tokens.colors.surface.card,
          borderColor:
            tokens.appearance === 'light'
              ? tokens.colors.border.strong
              : tokens.colors.border.subtle,
          borderRadius: tokens.radius.sm,
          borderWidth: 1,
          height: buttonSize,
          justifyContent: 'center',
          width: buttonSize,
        }}>
        <Languages
          color={tokens.colors.text.secondary}
          size={iconSize}
          strokeWidth={tokens.icons.strokeWidth}
        />
      </PressableScale>

      <Modal animationType="none" onRequestClose={closeMenu} transparent visible={open}>
        <View style={{ flex: 1 }}>
          <Pressable
            accessibilityLabel={t('onboarding.languagePickerCloseA11y')}
            accessibilityRole="button"
            onPress={closeMenu}
            style={{ bottom: 0, left: 0, position: 'absolute', right: 0, top: 0 }}
          />
          <Animated.View
            style={[
              {
                backgroundColor: tokens.colors.background.elevated,
                borderColor: tokens.colors.border.subtle,
                borderRadius: tokens.radius.lg,
                borderWidth: 1,
                gap: tokens.spacing.space1,
                minWidth: tokens.spacing.space8 * 2 + tokens.spacing.space6,
                padding: tokens.spacing.space2,
                position: 'absolute',
                right: tokens.spacing.screenPaddingHero,
                top: insets.top + tokens.spacing.space4 + buttonSize + tokens.spacing.space2,
                ...getShadow(2, tokens.appearance),
              },
              menuStyle,
            ]}>
            <Text
              style={{
                color: tokens.colors.text.tertiary,
                fontFamily: tokens.typography.fontFamily.bodyMedium,
                fontSize: tokens.typography.fontSize.bodySm,
                paddingHorizontal: tokens.spacing.space3,
                paddingVertical: tokens.spacing.space2,
              }}>
              {t('onboarding.languagePickerTitle')}
            </Text>
            {LOCALES.map((target) => {
              const isActive = locale === target;
              return (
                <PressableScale
                  accessibilityRole="button"
                  accessibilityState={{ selected: isActive }}
                  key={target}
                  onPress={() => selectLocale(target)}
                  style={{
                    alignItems: 'center',
                    backgroundColor: isActive
                      ? tokens.colors.surface.card
                      : 'transparent',
                    borderRadius: tokens.radius.md,
                    flexDirection: 'row',
                    gap: tokens.spacing.space3,
                    justifyContent: 'space-between',
                    paddingHorizontal: tokens.spacing.space3,
                    paddingVertical: tokens.spacing.space3,
                  }}>
                  <Text
                    style={{
                      color: isActive
                        ? tokens.colors.text.primary
                        : tokens.colors.text.secondary,
                      fontFamily: isActive
                        ? tokens.typography.fontFamily.bodyMedium
                        : tokens.typography.fontFamily.body,
                      fontSize: tokens.typography.fontSize.bodyLg,
                    }}>
                    {LOCALE_ENDONYMS[target]}
                  </Text>
                  {isActive ? (
                    <Check
                      color={tokens.colors.accent.primary}
                      size={tokens.icons.sizes.md}
                      strokeWidth={tokens.icons.strokeWidth}
                    />
                  ) : (
                    <View style={{ width: tokens.icons.sizes.md }} />
                  )}
                </PressableScale>
              );
            })}
          </Animated.View>
        </View>
      </Modal>
    </>
  );
}
