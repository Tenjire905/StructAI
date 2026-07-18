import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Text, View } from 'react-native';

import { Button } from '@/components/ui';
import { useThemeMode } from '@/theme';

export default function OnboardingWelcomeScreen() {
  const { tokens, t, mode } = useThemeMode();
  const router = useRouter();
  const isFocus = mode === 'focus';

  return (
    <LinearGradient
      colors={tokens.gradients.heroBackground.colors}
      end={tokens.gradients.heroBackground.end}
      start={tokens.gradients.heroBackground.start}
      style={{
        flex: 1,
        justifyContent: 'flex-end',
        paddingBottom: tokens.spacing.space7,
        paddingHorizontal: tokens.spacing.screenPaddingHero,
      }}>
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
