import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { OrbPresence } from '@/components/features/OrbPresence';
import { Button } from '@/components/ui';
import { useOrbCompanionState } from '@/hooks/useOrbCompanionState';
import { useThemeMode } from '@/theme';

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
      {/* First contact is the Orb coach — not a wall of text. */}
      <View style={{ alignItems: 'center', paddingTop: tokens.spacing.space5 }}>
        <OrbPresence
          showSpeech
          size={tokens.spacing.space8 * 1.35}
          speechKey="orb.speech.onboarding.welcome"
          state={companionState}
        />
      </View>

      <View style={{ gap: isFocus ? tokens.spacing.space3 : tokens.spacing.space4 }}>
        {/* Brand is the hero signal; headline stays secondary to StructAI. */}
        <Text
          style={{
            color: tokens.colors.accent.primary,
            fontFamily: tokens.typography.fontFamily.display,
            fontSize: tokens.typography.fontSize.displayXl,
            letterSpacing: 1,
            lineHeight: tokens.typography.fontSize.displayXl * 1.1,
          }}>
          StructAI
        </Text>

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
          }}>
          {t('onboarding.welcomeHeadline')}
        </Text>

        <Text
          style={{
            color: tokens.colors.text.secondary,
            fontFamily: tokens.typography.fontFamily.body,
            fontSize: tokens.typography.fontSize.bodyLg,
            lineHeight: tokens.typography.fontSize.bodyLg * (isFocus ? 1.4 : 1.5),
            marginBottom: tokens.spacing.space3,
          }}>
          {t('onboarding.welcomeSub')}
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
