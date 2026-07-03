import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Text, View } from 'react-native';

import { Button } from '@/components/ui';
import { useThemeMode } from '@/theme';

export default function OnboardingWelcomeScreen() {
  const { tokens, t } = useThemeMode();
  const router = useRouter();

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
      <View style={{ gap: tokens.spacing.space4 }}>
        <Text
          style={{
            color: tokens.colors.text.primary,
            fontFamily: tokens.typography.fontFamily.display,
            fontSize: tokens.typography.fontSize.displayXl,
            lineHeight: tokens.typography.fontSize.displayXl * 1.15,
          }}>
          {t('onboarding.welcomeHeadline')}
        </Text>

        <Text
          style={{
            color: tokens.colors.text.secondary,
            fontFamily: tokens.typography.fontFamily.body,
            fontSize: tokens.typography.fontSize.bodyLg,
            lineHeight: tokens.typography.fontSize.bodyLg * 1.5,
            marginBottom: tokens.spacing.space4,
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
