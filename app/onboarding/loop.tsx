import { useRouter } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';

import { Button } from '@/components/ui';
import { trackEvent } from '@/lib/analytics';
import { setOnboardingCompleted } from '@/lib/appStorage';
import {
  DEFAULT_START_PATH_ID,
  getFirstLessonIdForPath,
} from '@/lib/pathLessonUtils';
import { useThemeMode } from '@/theme';

const LOOP_STEP_KEYS = [
  'onboarding.loopStep1',
  'onboarding.loopStep2',
  'onboarding.loopStep3',
] as const;

export default function OnboardingLoopScreen() {
  const { tokens, t } = useThemeMode();
  const router = useRouter();
  const firstLessonId = getFirstLessonIdForPath(DEFAULT_START_PATH_ID);

  const finishOnboarding = async () => {
    await setOnboardingCompleted();
    trackEvent('onboarding_completed');
  };

  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        gap: tokens.spacing.space5,
        justifyContent: 'center',
        paddingBottom: tokens.spacing.space7,
        paddingHorizontal: tokens.spacing.screenPaddingHero,
        paddingTop: tokens.spacing.space7,
      }}
      style={{ backgroundColor: tokens.colors.background.base, flex: 1 }}>
      <Text
        style={{
          color: tokens.colors.text.primary,
          fontFamily: tokens.typography.fontFamily.display,
          fontSize: tokens.typography.fontSize.displayLg,
          lineHeight: tokens.typography.fontSize.displayLg * 1.2,
        }}>
        {t('onboarding.loopTitle')}
      </Text>

      <View style={{ gap: tokens.spacing.space4 }}>
        {LOOP_STEP_KEYS.map((stepKey, index) => (
          <View
            key={stepKey}
            style={{
              backgroundColor: tokens.colors.surface.card,
              borderRadius: tokens.radius.lg,
              gap: tokens.spacing.space2,
              padding: tokens.spacing.space4,
            }}>
            <Text
              style={{
                color: tokens.colors.accent.primary,
                fontFamily: tokens.typography.fontFamily.mono,
                fontSize: tokens.typography.fontSize.bodySm,
              }}>
              {String(index + 1).padStart(2, '0')}
            </Text>
            <Text
              style={{
                color: tokens.colors.text.secondary,
                fontFamily: tokens.typography.fontFamily.body,
                fontSize: tokens.typography.fontSize.bodyLg,
                lineHeight: tokens.typography.fontSize.bodyLg * 1.5,
              }}>
              {t(stepKey)}
            </Text>
          </View>
        ))}
      </View>

      <View style={{ gap: tokens.spacing.space3 }}>
        <Button
          label={t('onboarding.loopCta')}
          onPress={() => {
            void finishOnboarding().then(() => {
              if (firstLessonId) {
                router.replace(`/lektion/${firstLessonId}`);
              }
            });
          }}
          variant="primary"
        />
        <Button
          label={t('onboarding.loopHomeCta')}
          onPress={() => {
            void finishOnboarding().then(() => {
              router.replace('/');
            });
          }}
          variant="ghost"
        />
      </View>
    </ScrollView>
  );
}
