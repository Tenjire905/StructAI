import { useEffect, useRef } from 'react';
import { ScrollView, Text, View } from 'react-native';

import { LockedPathPreview } from '@/components/features/LockedPathPreview';
import { OrbCompanion } from '@/components/features/OrbCompanion';
import { StatBlock } from '@/components/features/StatBlock';
import { Button, ProgressBar } from '@/components/ui';
import { useOrbCompanionState } from '@/hooks/useOrbCompanionState';
import { getPathCompletionStats } from '@/lib/pathCapstone';
import { computePathProgressBarModel, pathTitleKey } from '@/lib/pathProgress';
import { getNextPathId } from '@/lib/pathUnlock';
import { useProgressStore } from '@/store/progressStore';
import { getShadow, useCelebration, useThemeMode } from '@/theme';

type CapstoneIncompleteViewProps = {
  pathId: string;
  orbsReward: number;
  onOpenMissing: () => void;
  onBackToPath: () => void;
};

export function CapstoneIncompleteView({
  pathId,
  orbsReward,
  onOpenMissing,
  onBackToPath,
}: CapstoneIncompleteViewProps) {
  const { tokens, t } = useThemeMode();
  const { celebrate } = useCelebration();
  const pathProgress = useProgressStore((state) => state.pathProgress[pathId]);
  const stats = getPathCompletionStats(pathId, pathProgress);
  const progressBar = computePathProgressBarModel(pathId, pathProgress);
  const nextPathId = getNextPathId(pathId);
  const companionState = useOrbCompanionState('happy');
  const isPlayful = tokens.presentation.orbStyle === 'illustrated';
  const finishedRef = useRef(false);

  useEffect(() => {
    if (finishedRef.current) {
      return;
    }

    finishedRef.current = true;
    celebrate('capstone_complete', { pathTitleKey: pathTitleKey(pathId) });
  }, [celebrate, pathId]);

  return (
    <ScrollView
      contentContainerStyle={{
        alignItems: 'center',
        gap: tokens.spacing.space5,
        justifyContent: 'center',
        minHeight: '100%',
        paddingHorizontal: tokens.spacing.screenPadding,
        paddingVertical: tokens.spacing.space6,
      }}
      style={{ backgroundColor: tokens.colors.background.base, flex: 1 }}>
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
        {t('capstoneIncomplete.title')}
      </Text>

      <Text
        style={{
          color: tokens.colors.text.secondary,
          fontFamily: tokens.typography.fontFamily.body,
          fontSize: tokens.typography.fontSize.bodyLg,
          lineHeight: tokens.typography.fontSize.bodyLg * 1.5,
          textAlign: 'center',
        }}>
        {t('capstoneIncomplete.subtitle', {
          missing: stats.missing,
          total: stats.total,
        })}
      </Text>

      <View style={{ alignSelf: 'stretch', gap: tokens.spacing.space2 }}>
        <ProgressBar
          color="structure"
          completedSegments={progressBar.completedSegments}
          failedSegments={progressBar.failedSegments}
          progress={progressBar.completedRatio}
        />
        <View
          style={{
            flexDirection: 'row',
            gap: tokens.spacing.space3,
          }}>
          <StatBlock copyKey="capstoneIncomplete.statCompleted" value={`${stats.completed}/${stats.total}`} />
          <StatBlock copyKey="capstoneIncomplete.statSkipped" value={stats.skipped} />
        </View>
      </View>

      <Text
        style={{
          color: tokens.colors.accent.warning,
          fontFamily: tokens.typography.fontFamily.bodyMedium,
          fontSize: tokens.typography.fontSize.bodyMd,
          lineHeight: tokens.typography.fontSize.bodyMd * 1.5,
          textAlign: 'center',
        }}>
        {t('capstoneIncomplete.lockHint')}
      </Text>

      {orbsReward > 0 ? (
        <Text
          style={{
            color: tokens.colors.accent.structure,
            fontFamily: tokens.typography.fontFamily.mono,
            fontSize: tokens.typography.fontSize.headingMd,
          }}>
          {t('lesson.orbsEarned', { count: orbsReward })}
        </Text>
      ) : null}

      <View style={{ alignSelf: 'stretch', gap: tokens.spacing.space3, width: '100%' }}>
        <Button
          label={t('capstoneIncomplete.openMissingCta')}
          onPress={onOpenMissing}
          variant="primary"
        />
        <Button label={t('capstoneIncomplete.backToPath')} onPress={onBackToPath} variant="ghost" />
      </View>

      {nextPathId ? <LockedPathPreview pathId={nextPathId} /> : null}
    </ScrollView>
  );
}
