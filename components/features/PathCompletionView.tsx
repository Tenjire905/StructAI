import { useEffect, useRef } from 'react';
import { Text, View } from 'react-native';

import { OrbCompanion } from '@/components/features/OrbCompanion';
import { Button } from '@/components/ui';
import { useOrbCompanionState } from '@/hooks/useOrbCompanionState';
import { pathTitleKey } from '@/lib/pathProgress';
import { getPathTemplate } from '@/lib/pathLessonUtils';
import { getShadow, useCelebration, useThemeMode } from '@/theme';

type PathCompletionViewProps = {
  pathId: string;
  orbsReward: number;
  onFinish: () => void;
};

export function PathCompletionView({ pathId, orbsReward, onFinish }: PathCompletionViewProps) {
  const { tokens, t } = useThemeMode();
  const { celebrate } = useCelebration();
  const companionState = useOrbCompanionState('celebrating');
  const isPlayful = tokens.presentation.orbStyle === 'illustrated';
  const finishedRef = useRef(false);
  const path = getPathTemplate(pathId);
  const totalChapters = path?.totalChapters ?? 0;

  useEffect(() => {
    if (finishedRef.current) {
      return;
    }

    finishedRef.current = true;
    celebrate('path_complete', {
      orbCount: orbsReward > 0 ? orbsReward : undefined,
      pathTitleKey: pathTitleKey(pathId),
    });
  }, [celebrate, orbsReward, pathId]);

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
            height: tokens.spacing.space8 * 1.15,
            justifyContent: 'center',
            width: tokens.spacing.space8 * 1.15,
          },
        ]}>
        <OrbCompanion size={tokens.spacing.space8 * 0.85} state={companionState} />
      </View>

      <Text
        style={{
          color: tokens.colors.text.primary,
          fontFamily: tokens.typography.fontFamily.display,
          fontSize: tokens.typography.fontSize.displayLg,
          textAlign: 'center',
        }}>
        {t('pathCompletion.title')}
      </Text>

      <Text
        style={{
          color: tokens.colors.text.secondary,
          fontFamily: tokens.typography.fontFamily.bodyMedium,
          fontSize: tokens.typography.fontSize.bodyLg,
          lineHeight: tokens.typography.fontSize.bodyLg * 1.5,
          textAlign: 'center',
        }}>
        {t('pathCompletion.subtitle', {
          path: t(pathTitleKey(pathId)),
          total: totalChapters,
        })}
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

      <Text
        style={{
          color: tokens.colors.text.tertiary,
          fontFamily: tokens.typography.fontFamily.body,
          fontSize: tokens.typography.fontSize.bodySm,
          lineHeight: tokens.typography.fontSize.bodySm * 1.5,
          textAlign: 'center',
        }}>
        {t('pathCompletion.certificateHint')}
      </Text>

      <Button
        label={t('pathCompletion.backToPaths')}
        onPress={onFinish}
        style={{ alignSelf: 'stretch' }}
        variant="primary"
      />
    </View>
  );
}
