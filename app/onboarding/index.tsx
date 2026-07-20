import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { OrbPresence } from '@/components/features/OrbPresence';
import { Button } from '@/components/ui';
import { useOrbCompanionState } from '@/hooks/useOrbCompanionState';
import { useThemeMode } from '@/theme';

/**
 * Liftoff-style welcome: Orb leads with a coach bubble; brand + one CTA.
 * No voiceover — the bubble is the Jimbo beat.
 */
export default function OnboardingWelcomeScreen() {
  const { tokens, t, mode } = useThemeMode();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const isFocus = mode === 'focus';
  const companionState = useOrbCompanionState('attentive');

  return (
    <LinearGradient
      colors={tokens.gradients.heroBackground.colors}
      end={tokens.gradients.heroBackground.end}
      start={tokens.gradients.heroBackground.start}
      style={{
        flex: 1,
        justifyContent: 'space-between',
        paddingBottom: tokens.spacing.space7 + insets.bottom,
        paddingHorizontal: tokens.spacing.screenPaddingHero,
        paddingTop: insets.top + tokens.spacing.space6,
      }}>
      <View style={{ alignItems: 'center', gap: tokens.spacing.space4, paddingTop: tokens.spacing.space5 }}>
        <Text
          style={{
            color: tokens.colors.accent.primary,
            fontFamily: tokens.typography.fontFamily.display,
            fontSize: tokens.typography.fontSize.displayXl,
            letterSpacing: 1,
            lineHeight: tokens.typography.fontSize.displayXl * 1.1,
            textAlign: 'center',
          }}>
          StructAI
        </Text>

        <OrbPresence
          interaction="enter"
          layout="hero"
          showSpeech
          size={tokens.spacing.space8 * 1.55}
          speechKey="orb.speech.onboarding.welcome"
          state={companionState}
        />
      </View>

      <View style={{ gap: isFocus ? tokens.spacing.space3 : tokens.spacing.space4 }}>
        <Text
          style={{
            color: tokens.colors.text.primary,
            fontFamily: tokens.typography.fontFamily.display,
            fontSize: isFocus
              ? tokens.typography.fontSize.headingMd
              : tokens.typography.fontSize.headingLg,
            lineHeight:
              (isFocus
                ? tokens.typography.fontSize.headingMd
                : tokens.typography.fontSize.headingLg) * 1.25,
            textAlign: 'center',
          }}>
          {t('onboarding.welcomeHeadline')}
        </Text>

        <Button
          label={t('onboarding.welcomeCta')}
          onPress={() => router.push('/onboarding/modus')}
          variant="primary"
        />
      </View>
    </LinearGradient>
  );
}
