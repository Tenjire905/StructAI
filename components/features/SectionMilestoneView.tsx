import { useEffect, useRef } from 'react';
import { Text, View } from 'react-native';

import { OrbCompanion } from '@/components/features/OrbCompanion';
import { Button } from '@/components/ui';
import { useOrbCompanionState } from '@/hooks/useOrbCompanionState';
import { getShadow, useCelebration, useThemeMode } from '@/theme';

type SectionMilestoneViewProps = {
  orbsReward: number;
  onContinueNext: (nextLessonId: string) => void;
  onBackToPath: () => void;
  nextLessonId?: string;
};

export function SectionMilestoneView({
  orbsReward,
  onContinueNext,
  onBackToPath,
  nextLessonId,
}: SectionMilestoneViewProps) {
  const { tokens, t } = useThemeMode();
  const { celebrate } = useCelebration();
  const companionState = useOrbCompanionState('happy');
  const isPlayful = tokens.presentation.orbStyle === 'illustrated';
  const finishedRef = useRef(false);

  useEffect(() => {
    if (finishedRef.current) {
      return;
    }

    finishedRef.current = true;
    celebrate('section_milestone');
  }, [celebrate]);

  return (
    <View
      style={{
        alignItems: 'center',
        backgroundColor: tokens.colors.background.base,
        flex: 1,
        gap: tokens.spacing.space5,
        justifyContent: 'center',
        paddingHorizontal: tokens.spacing.screenPadding,
      }}>
      <View
        style={[
          isPlayful ? getShadow('glow') : undefined,
          {
            alignItems: 'center',
            backgroundColor: tokens.colors.surface.card,
            borderRadius: tokens.radius.pill,
            height: tokens.spacing.space8,
            justifyContent: 'center',
            width: tokens.spacing.space8,
          },
        ]}>
        <OrbCompanion size={tokens.spacing.space8 * 0.75} state={companionState} />
      </View>

      <Text
        style={{
          color: tokens.colors.text.primary,
          fontFamily: tokens.typography.fontFamily.display,
          fontSize: tokens.typography.fontSize.displayLg,
          textAlign: 'center',
        }}>
        {t('sectionMilestone.title')}
      </Text>

      <Text
        style={{
          color: tokens.colors.text.secondary,
          fontFamily: tokens.typography.fontFamily.body,
          fontSize: tokens.typography.fontSize.bodyLg,
          lineHeight: tokens.typography.fontSize.bodyLg * 1.5,
          textAlign: 'center',
        }}>
        {t('sectionMilestone.subtitle')}
      </Text>

      {orbsReward > 0 ? (
        <Text
          style={{
            color: tokens.colors.accent.structure,
            fontFamily: tokens.typography.fontFamily.mono,
            fontSize: tokens.typography.fontSize.headingLg,
          }}>
          {t('lesson.orbsEarned', { count: orbsReward })}
        </Text>
      ) : null}

      <View style={{ alignSelf: 'stretch', gap: tokens.spacing.space3, width: '100%' }}>
        {nextLessonId ? (
          <>
            <Button
              label={t('sectionMilestone.continueCta')}
              onPress={() => onContinueNext(nextLessonId)}
              variant="primary"
            />
            <Button label={t('sectionMilestone.backToPath')} onPress={onBackToPath} variant="ghost" />
          </>
        ) : (
          <Button label={t('sectionMilestone.backToPath')} onPress={onBackToPath} variant="primary" />
        )}
      </View>
    </View>
  );
}
