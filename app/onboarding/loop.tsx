import { useRouter } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';

import { OnboardingChrome } from '@/components/features/onboarding/OnboardingChrome';
import { OrbPresence } from '@/components/features/OrbPresence';
import { useOrbCompanionState } from '@/hooks/useOrbCompanionState';
import { trackEvent } from '@/lib/analytics';
import { setOnboardingCompleted } from '@/lib/appStorage';
import { resolveHomeRoute } from '@/lib/homeNavigation';
import { openLesson } from '@/lib/lessonNavigation';
import {
  DEFAULT_START_PATH_ID,
  getFirstLessonIdForPath,
} from '@/lib/pathLessonUtils';
import { playSfx } from '@/lib/sfx';
import { useProgressStore } from '@/store/progressStore';
import { useThemeMode } from '@/theme';

const LOOP_STEP_KEYS = [
  'onboarding.loopStep1',
  'onboarding.loopStep2',
  'onboarding.loopStep3',
] as const;

/**
 * Learning loop — Orb explains the rhythm (Liftoff Q&A chrome).
 */
export default function OnboardingLoopScreen() {
  const { tokens, t } = useThemeMode();
  const router = useRouter();
  const completedLessons = useProgressStore((state) => state.completedLessons);
  const firstLessonId = getFirstLessonIdForPath(DEFAULT_START_PATH_ID);
  const companionState = useOrbCompanionState('happy');
  const soundEnabled = tokens.presentation.soundEnabled;

  const finishOnboarding = async () => {
    await setOnboardingCompleted();
    trackEvent('onboarding_completed');
  };

  return (
    <OnboardingChrome
      ctaLabel={t('onboarding.loopCta')}
      onCta={() => {
        playSfx('success', soundEnabled);
        void finishOnboarding().then(() => {
          if (firstLessonId) {
            openLesson(router, firstLessonId);
          }
        });
      }}
      onSecondary={() => {
        playSfx('tap', soundEnabled);
        void finishOnboarding().then(() => {
          router.replace(resolveHomeRoute(completedLessons));
        });
      }}
      onSkip={() => {
        playSfx('tap', soundEnabled);
        void finishOnboarding().then(() => {
          if (firstLessonId) {
            openLesson(router, firstLessonId);
          }
        });
      }}
      progressStep={3}
      secondaryLabel={t('onboarding.loopHomeCta')}
      skipLabel={t('onboarding.skip')}>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          gap: tokens.spacing.space5,
          justifyContent: 'center',
          paddingBottom: tokens.spacing.space4,
        }}
        showsVerticalScrollIndicator={false}
        style={{ flex: 1 }}>
        <OrbPresence
          interaction="watch"
          layout="hero"
          showSpeech
          size={tokens.spacing.space8 * 1.1}
          speechKey="orb.speech.onboarding.loop"
          state={companionState}
        />

        <Text
          style={{
            color: tokens.colors.text.primary,
            fontFamily: tokens.typography.fontFamily.display,
            fontSize: tokens.typography.fontSize.headingLg,
            lineHeight: tokens.typography.fontSize.headingLg * 1.25,
            textAlign: 'center',
          }}>
          {t('onboarding.loopTitle')}
        </Text>

        <View style={{ gap: tokens.spacing.space3 }}>
          {LOOP_STEP_KEYS.map((stepKey, index) => (
            <View
              key={stepKey}
              style={{
                backgroundColor: tokens.colors.surface.card,
                borderRadius: tokens.radius.lg,
                flexDirection: 'row',
                gap: tokens.spacing.space3,
                padding: tokens.spacing.space4,
              }}>
              <Text
                style={{
                  color: tokens.colors.accent.primary,
                  fontFamily: tokens.typography.fontFamily.mono,
                  fontSize: tokens.typography.fontSize.bodyMd,
                }}>
                {String(index + 1).padStart(2, '0')}
              </Text>
              <Text
                style={{
                  color: tokens.colors.text.secondary,
                  flex: 1,
                  fontFamily: tokens.typography.fontFamily.body,
                  fontSize: tokens.typography.fontSize.bodyLg,
                  lineHeight: tokens.typography.fontSize.bodyLg * 1.45,
                }}>
                {t(stepKey)}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </OnboardingChrome>
  );
}
