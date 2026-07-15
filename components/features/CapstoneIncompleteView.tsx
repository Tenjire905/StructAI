import { useEffect, useRef } from 'react';
import { ScrollView, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

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
  const spring = tokens.motion.spring[tokens.presentation.springPreset];

  const orbScale = useSharedValue(0.85);
  const titleScale = useSharedValue(0.8);
  const statsOpacity = useSharedValue(0);

  useEffect(() => {
    if (finishedRef.current) {
      return;
    }

    finishedRef.current = true;
    celebrate('capstone_complete', { pathTitleKey: pathTitleKey(pathId) });

    const d = tokens.motion.duration;

    orbScale.value = withDelay(
      d.instant,
      withSequence(
        withSpring(1.15, spring),
        withSpring(1, tokens.motion.spring.default),
      ),
    );

    titleScale.value = withDelay(
      d.medium,
      withSequence(
        withSpring(1.15, spring),
        withSpring(1, tokens.motion.spring.default),
      ),
    );

    statsOpacity.value = withDelay(d.medium, withTiming(1, { duration: d.fast }));
  }, [
    celebrate,
    orbScale,
    pathId,
    spring,
    statsOpacity,
    titleScale,
    tokens.motion.duration,
    tokens.motion.spring.default,
  ]);

  const orbStyle = useAnimatedStyle(() => ({
    transform: [{ scale: orbScale.value }],
  }));

  const titleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: titleScale.value }],
  }));

  const statsStyle = useAnimatedStyle(() => ({
    opacity: statsOpacity.value,
  }));

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
      <Animated.View
        style={[
          orbStyle,
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
      </Animated.View>

      <Animated.Text
        style={[
          titleStyle,
          {
            color: tokens.colors.text.primary,
            fontFamily: tokens.typography.fontFamily.display,
            fontSize: tokens.typography.fontSize.displayLg,
            textAlign: 'center',
          },
        ]}>
        {t('capstoneIncomplete.title')}
      </Animated.Text>

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
          animateOnMount
          color="structure"
          completedSegments={progressBar.completedSegments}
          failedSegments={progressBar.failedSegments}
          progress={progressBar.completedRatio}
        />
        <Animated.View
          style={[
            statsStyle,
            {
              flexDirection: 'row',
              gap: tokens.spacing.space3,
            },
          ]}>
          <StatBlock copyKey="capstoneIncomplete.statCompleted" value={`${stats.completed}/${stats.total}`} />
          <StatBlock copyKey="capstoneIncomplete.statSkipped" value={stats.skipped} />
        </Animated.View>
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
