import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import Animated, {
  FadeIn,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { OnboardingChrome } from '@/components/features/onboarding/OnboardingChrome';
import { OnboardingFeatureVisual } from '@/components/features/onboarding/OnboardingFeatureVisual';
import { OnboardingPageDots } from '@/components/features/onboarding/OnboardingPageDots';
import { playSfx } from '@/lib/sfx';
import { useThemeMode } from '@/theme';

const SLIDES = [
  {
    kind: 'score' as const,
    valueKey: 'onboarding.introSlide1Value',
  },
  {
    kind: 'path' as const,
    valueKey: 'onboarding.introSlide2Value',
  },
  {
    kind: 'coach' as const,
    valueKey: 'onboarding.introSlide3Value',
  },
] as const;

/**
 * Liftoff-style marketing carousel: brand, feature visual, one value line,
 * page dots, full-width CTA + Anmelden. Game start SFX once on mount.
 */
export default function OnboardingWelcomeScreen() {
  const { tokens, t, mode } = useThemeMode();
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const slide = SLIDES[index];
  const pulse = useSharedValue(1);
  const soundEnabled = tokens.presentation.soundEnabled;

  useEffect(() => {
    playSfx('start', soundEnabled);
  }, [soundEnabled]);

  useEffect(() => {
    pulse.value = withSpring(mode === 'playful' ? 1.02 : 1, tokens.motion.spring.default);
  }, [index, mode, pulse, tokens.motion.spring.default]);

  const visualStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
  }));

  const advance = () => {
    playSfx('tap', soundEnabled);
    if (index < SLIDES.length - 1) {
      setIndex((current) => current + 1);
      return;
    }
    router.push('/onboarding/meet');
  };

  return (
    <OnboardingChrome
      ctaLabel={
        index < SLIDES.length - 1
          ? t('onboarding.introNext')
          : t('onboarding.welcomeCta')
      }
      footerExtra={
        <OnboardingPageDots count={SLIDES.length} index={index} />
      }
      onCta={advance}
      onSecondary={() => {
        playSfx('tap', soundEnabled);
        router.push('/auth');
      }}
      onSkip={() => {
        playSfx('tap', soundEnabled);
        router.push('/onboarding/meet');
      }}
      secondaryLabel={t('onboarding.introSignIn')}
      showBrand
      skipLabel={t('onboarding.skip')}>
      <View
        style={{
          alignItems: 'center',
          flex: 1,
          gap: tokens.spacing.space5,
          justifyContent: 'center',
        }}>
        <Animated.View entering={FadeIn.duration(tokens.motion.duration.fast)} style={visualStyle}>
          <OnboardingFeatureVisual kind={slide.kind} />
        </Animated.View>

        <Animated.View
          entering={FadeIn.duration(tokens.motion.duration.medium)}
          exiting={FadeOut.duration(tokens.motion.duration.fast)}
          key={slide.valueKey}
          style={{ paddingHorizontal: tokens.spacing.space2 }}>
          <Text
            style={{
              color: tokens.colors.text.primary,
              fontFamily: tokens.typography.fontFamily.display,
              fontSize:
                mode === 'focus'
                  ? tokens.typography.fontSize.headingMd
                  : tokens.typography.fontSize.headingLg,
              lineHeight:
                (mode === 'focus'
                  ? tokens.typography.fontSize.headingMd
                  : tokens.typography.fontSize.headingLg) * 1.3,
              textAlign: 'center',
            }}>
            {t(slide.valueKey)}
          </Text>
        </Animated.View>
      </View>
    </OnboardingChrome>
  );
}
