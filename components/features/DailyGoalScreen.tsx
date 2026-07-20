import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, Switch, Text, View } from 'react-native';

import { OrbPresence } from '@/components/features/OrbPresence';
import { Button } from '@/components/ui';
import { PressableScale } from '@/components/ui/PressableScale';
import { useOrbCompanionState } from '@/hooks/useOrbCompanionState';
import {
  isDailyGoalSetupCompleted,
  setDailyGoalSetupCompleted,
} from '@/lib/appStorage';
import {
  areDailyGoalNotificationsSupported,
  requestDailyGoalNotificationPermission,
} from '@/lib/dailyGoalNotifications';
import { DAILY_ORB_GOAL_PRESETS, DEFAULT_DAILY_ORB_GOAL } from '@/lib/dailyOrbGoal';
import { useProgressStore } from '@/store/progressStore';
import { useThemeMode } from '@/theme';

type DailyGoalScreenProps = {
  returnTo?: '/(tabs)' | '/';
};

export function DailyGoalScreen({ returnTo = '/(tabs)' }: DailyGoalScreenProps) {
  const { tokens, t } = useThemeMode();
  const router = useRouter();
  const setDailyOrbGoal = useProgressStore((state) => state.setDailyOrbGoal);
  const storedGoal = useProgressStore((state) => state.dailyOrbGoal);
  const storedNotifications = useProgressStore((state) => state.dailyGoalNotificationsEnabled);
  const companionState = useOrbCompanionState('attentive');

  const notificationsSupported = areDailyGoalNotificationsSupported();
  const [selectedGoal, setSelectedGoal] = useState(
    storedGoal > 0 ? storedGoal : DEFAULT_DAILY_ORB_GOAL,
  );
  // First setup: default ON when supported so day-2 comeback is one tap away. Respect prior choice after setup.
  const [notificationsEnabled, setNotificationsEnabled] = useState(() => {
    if (isDailyGoalSetupCompleted()) {
      return storedNotifications;
    }

    return notificationsSupported || storedNotifications;
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleToggleNotifications = async (enabled: boolean) => {
    if (enabled) {
      const granted = await requestDailyGoalNotificationPermission();
      setNotificationsEnabled(granted);
      return;
    }

    setNotificationsEnabled(false);
  };

  const handleSave = async () => {
    setIsSaving(true);

    try {
      setDailyOrbGoal(selectedGoal, notificationsSupported ? notificationsEnabled : false);
      await setDailyGoalSetupCompleted();
      router.replace(returnTo);
    } finally {
      setIsSaving(false);
    }
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
      <OrbPresence
        interaction="enter"
        layout="hero"
        showSpeech={false}
        size={tokens.spacing.space8 * 1.1}
        state={companionState}
        voiceKey="orb.speech.onboarding.dailyGoal"
      />

      <View style={{ gap: tokens.spacing.space3 }}>
        <Text
          style={{
            color: tokens.colors.text.primary,
            fontFamily: tokens.typography.fontFamily.display,
            fontSize: tokens.typography.fontSize.displayLg,
            lineHeight: tokens.typography.fontSize.displayLg * 1.15,
          }}>
          {t('dailyGoal.title')}
        </Text>
        <Text
          style={{
            color: tokens.colors.text.secondary,
            fontFamily: tokens.typography.fontFamily.body,
            fontSize: tokens.typography.fontSize.bodyLg,
            lineHeight: tokens.typography.fontSize.bodyLg * 1.5,
          }}>
          {t('dailyGoal.subtitle')}
        </Text>
      </View>

      <View
        style={{
          backgroundColor: tokens.colors.surface.card,
          borderRadius: tokens.radius.lg,
          gap: tokens.spacing.space2,
          padding: tokens.spacing.space4,
        }}>
        <Text
          style={{
            color: tokens.colors.text.primary,
            fontFamily: tokens.typography.fontFamily.heading,
            fontSize: tokens.typography.fontSize.headingMd,
          }}>
          {t('dailyGoal.explanationTitle')}
        </Text>
        <Text
          style={{
            color: tokens.colors.text.secondary,
            fontFamily: tokens.typography.fontFamily.body,
            fontSize: tokens.typography.fontSize.bodyMd,
            lineHeight: tokens.typography.fontSize.bodyMd * 1.5,
          }}>
          {t('dailyGoal.explanationBody')}
        </Text>
      </View>

      <View style={{ gap: tokens.spacing.space3 }}>
        <Text
          style={{
            color: tokens.colors.text.primary,
            fontFamily: tokens.typography.fontFamily.heading,
            fontSize: tokens.typography.fontSize.headingMd,
          }}>
          {t('dailyGoal.targetLabel')}
        </Text>

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: tokens.spacing.space2 }}>
          {DAILY_ORB_GOAL_PRESETS.map((preset) => {
            const isSelected = selectedGoal === preset;

            return (
              <PressableScale
                key={preset}
                onPress={() => setSelectedGoal(preset)}
                style={{
                  backgroundColor: isSelected
                    ? tokens.colors.accent.primary
                    : tokens.colors.surface.card,
                  borderColor: isSelected
                    ? tokens.colors.accent.primary
                    : tokens.colors.border.subtle,
                  borderRadius: tokens.radius.pill,
                  borderWidth: 1,
                  paddingHorizontal: tokens.spacing.space4,
                  paddingVertical: tokens.spacing.space2,
                }}>
                <Text
                  style={{
                    color: isSelected
                      ? tokens.colors.text.onAccent
                      : tokens.colors.text.primary,
                    fontFamily: tokens.typography.fontFamily.bodyMedium,
                    fontSize: tokens.typography.fontSize.bodyMd,
                  }}>
                  {t('dailyGoal.presetOrbs', { count: preset })}
                </Text>
              </PressableScale>
            );
          })}
        </View>
      </View>

      {notificationsSupported ? (
        <View
          style={{
            alignItems: 'center',
            backgroundColor: tokens.colors.surface.card,
            borderRadius: tokens.radius.lg,
            flexDirection: 'row',
            gap: tokens.spacing.space3,
            justifyContent: 'space-between',
            padding: tokens.spacing.space4,
          }}>
          <View style={{ flex: 1, gap: tokens.spacing.space1 }}>
            <Text
              style={{
                color: tokens.colors.text.primary,
                fontFamily: tokens.typography.fontFamily.heading,
                fontSize: tokens.typography.fontSize.bodyMd,
              }}>
              {t('dailyGoal.notificationsTitle')}
            </Text>
            <Text
              style={{
                color: tokens.colors.text.secondary,
                fontFamily: tokens.typography.fontFamily.body,
                fontSize: tokens.typography.fontSize.bodySm,
                lineHeight: tokens.typography.fontSize.bodySm * 1.45,
              }}>
              {t('dailyGoal.notificationsBody')}
            </Text>
          </View>
          <Switch
            onValueChange={(value) => {
              void handleToggleNotifications(value);
            }}
            thumbColor={tokens.colors.text.onAccent}
            trackColor={{
              false: tokens.colors.border.subtle,
              true: tokens.colors.accent.primary,
            }}
            value={notificationsEnabled}
          />
        </View>
      ) : (
        <View
          style={{
            backgroundColor: tokens.colors.surface.card,
            borderRadius: tokens.radius.lg,
            gap: tokens.spacing.space1,
            padding: tokens.spacing.space4,
          }}>
          <Text
            style={{
              color: tokens.colors.text.primary,
              fontFamily: tokens.typography.fontFamily.heading,
              fontSize: tokens.typography.fontSize.bodyMd,
            }}>
            {t('dailyGoal.notificationsTitle')}
          </Text>
          <Text
            style={{
              color: tokens.colors.text.secondary,
              fontFamily: tokens.typography.fontFamily.body,
              fontSize: tokens.typography.fontSize.bodySm,
              lineHeight: tokens.typography.fontSize.bodySm * 1.45,
            }}>
            {t('dailyGoal.notificationsExpoGoHint')}
          </Text>
        </View>
      )}

      <Button
        label={isSaving ? t('dailyGoal.saving') : t('dailyGoal.cta')}
        onPress={() => {
          void handleSave();
        }}
        variant="primary"
      />
    </ScrollView>
  );
}
