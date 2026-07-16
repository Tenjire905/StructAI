import { useEffect, useRef, useState } from 'react';
import { Text, View } from 'react-native';
import Animated, {
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { PressableScale } from '@/components/ui/PressableScale';
import { getShadow, useCelebration, useThemeMode } from '@/theme';
import { useOrbCompanionState } from '@/hooks/useOrbCompanionState';

import { OrbCompanion } from './OrbCompanion';

type OrbCounterProps = {
  count: number;
  orbsEarnedToday?: number;
  dailyOrbGoal?: number;
  onPress?: () => void;
};

export function OrbCounter({
  count,
  orbsEarnedToday = 0,
  dailyOrbGoal = 0,
  onPress,
}: OrbCounterProps) {
  const { tokens, t } = useThemeMode();
  const { celebrate } = useCelebration();
  const companionState = useOrbCompanionState();
  const animatedCount = useSharedValue(count);
  const orbScale = useSharedValue(1);
  const previousCountRef = useRef(count);
  const [displayCount, setDisplayCount] = useState(count);
  const isPlayful = tokens.presentation.orbStyle === 'illustrated';
  const hasDailyGoal = dailyOrbGoal > 0;

  useEffect(() => {
    animatedCount.value = withTiming(count, {
      duration: tokens.motion.duration.medium,
    });

    const previousCount = previousCountRef.current;
    if (count > previousCount) {
      const gained = count - previousCount;
      celebrate('orb_gain', { orbCount: gained });

      if (tokens.presentation.allowCelebrationSpring) {
        orbScale.value = withSequence(
          withSpring(1.12, tokens.motion.spring.bouncy),
          withSpring(1, tokens.motion.spring.default),
        );
      }
    }

    previousCountRef.current = count;
  }, [
    animatedCount,
    celebrate,
    count,
    orbScale,
    tokens.motion.duration.medium,
    tokens.motion.spring,
    tokens.presentation.allowCelebrationSpring,
  ]);

  useAnimatedReaction(
    () => Math.round(animatedCount.value),
    (value, previous) => {
      if (value !== previous) {
        runOnJS(setDisplayCount)(value);
      }
    },
    [count],
  );

  const orbAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: orbScale.value }],
  }));

  const content = (
    <View style={{ gap: tokens.spacing.space2 }}>
      <Text
        style={{
          color: tokens.colors.text.secondary,
          fontFamily: tokens.typography.fontFamily.bodyMedium,
          fontSize: tokens.typography.fontSize.bodySm,
        }}>
        {t('orbCounter.label')}
      </Text>

      <View style={{ alignItems: 'center', flexDirection: 'row', gap: tokens.spacing.space3 }}>
        <Animated.View
          style={[
            orbAnimatedStyle,
            isPlayful ? getShadow('glow') : undefined,
            {
              alignItems: 'center',
              backgroundColor: tokens.colors.surface.card,
              borderRadius: tokens.radius.pill,
              height: tokens.spacing.space7,
              justifyContent: 'center',
              width: tokens.spacing.space7,
            },
          ]}>
          <OrbCompanion size={tokens.icons.sizes.lg} state={companionState} />
        </Animated.View>

        <View style={{ gap: tokens.spacing.space1 }}>
          <Text
            style={{
              color: tokens.colors.text.primary,
              fontFamily: tokens.typography.fontFamily.display,
              fontSize: tokens.typography.fontSize.displayLg,
            }}>
            {displayCount}
          </Text>
          {hasDailyGoal ? (
            <Text
              style={{
                color: tokens.colors.text.tertiary,
                fontFamily: tokens.typography.fontFamily.mono,
                fontSize: tokens.typography.fontSize.bodySm,
              }}>
              {t('orbCounter.dailyProgress', {
                current: orbsEarnedToday,
                goal: dailyOrbGoal,
              })}
            </Text>
          ) : null}
        </View>
      </View>
    </View>
  );

  if (!onPress) {
    return content;
  }

  return (
    <PressableScale
      accessibilityHint={t('orbCounter.openDailyGoalHint')}
      accessibilityLabel={t('orbCounter.label')}
      accessibilityRole="button"
      onPress={onPress}>
      {content}
    </PressableScale>
  );
}
