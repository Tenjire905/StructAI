import { useEffect, useRef } from 'react';
import { Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
} from 'react-native-reanimated';
import { Check } from 'lucide-react-native';

import { streakWeekdayCopyKeys, useCelebration, useThemeMode } from '@/theme';

import { OrbIcon } from './OrbIcon';

const STREAK_MILESTONE_DAYS = 7;

type StreakTrackerProps = {
  completedDays: boolean[];
};

export function StreakTracker({ completedDays }: StreakTrackerProps) {
  const { tokens, t } = useThemeMode();
  const { celebrate } = useCelebration();
  const days = [...completedDays.slice(0, 7)];

  while (days.length < 7) {
    days.push(false);
  }

  const completedCount = days.filter(Boolean).length;
  const previousCountRef = useRef(completedCount);

  useEffect(() => {
    if (
      completedCount === STREAK_MILESTONE_DAYS &&
      previousCountRef.current < STREAK_MILESTONE_DAYS
    ) {
      celebrate('streak_milestone');
    }

    previousCountRef.current = completedCount;
  }, [celebrate, completedCount]);

  return (
    <View style={{ gap: tokens.spacing.space3 }}>
      <Text
        style={{
          color: tokens.colors.text.primary,
          fontFamily: tokens.typography.fontFamily.heading,
          fontSize: tokens.typography.fontSize.headingMd,
        }}>
        {t('streakTracker.title')}
      </Text>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        {days.map((completed, index) => (
          <StreakDay
            completed={completed}
            isMilestoneDay={
              completedCount === STREAK_MILESTONE_DAYS && completed
            }
            key={streakWeekdayCopyKeys[index]}
            label={t(streakWeekdayCopyKeys[index])}
          />
        ))}
      </View>
    </View>
  );
}

type StreakDayProps = {
  completed: boolean;
  isMilestoneDay: boolean;
  label: string;
};

function StreakDay({ completed, isMilestoneDay, label }: StreakDayProps) {
  const { tokens } = useThemeMode();
  const scale = useSharedValue(completed ? 1 : 0.92);
  const isPlayful = tokens.presentation.orbStyle === 'illustrated';

  useEffect(() => {
    if (completed && isMilestoneDay && tokens.presentation.allowCelebrationSpring) {
      scale.value = withSequence(
        withSpring(1.12, tokens.motion.spring.bouncy),
        withSpring(1, tokens.motion.spring.default),
      );
      return;
    }

    scale.value = withSpring(completed ? 1 : 0.92, tokens.motion.spring.default);
  }, [
    completed,
    isMilestoneDay,
    scale,
    tokens.motion.spring,
    tokens.presentation.allowCelebrationSpring,
  ]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <View style={{ alignItems: 'center', gap: tokens.spacing.space1 }}>
      <Animated.View
        style={[
          animatedStyle,
          {
            alignItems: 'center',
            backgroundColor: completed
              ? tokens.colors.surface.cardHover
              : tokens.colors.surface.card,
            borderColor: completed
              ? tokens.colors.accent.primary
              : tokens.colors.border.subtle,
            borderRadius: tokens.radius.sm,
            borderWidth: 1,
            height: tokens.spacing.space6,
            justifyContent: 'center',
            width: tokens.spacing.space6,
          },
        ]}>
        {completed ? (
          isPlayful ? (
            <OrbIcon size={tokens.icons.sizes.sm} />
          ) : (
            <Check
              color={tokens.colors.accent.success}
              size={tokens.icons.sizes.sm}
              strokeWidth={tokens.icons.strokeWidth}
            />
          )
        ) : null}
      </Animated.View>
      <Text
        style={{
          color: tokens.colors.text.tertiary,
          fontFamily: tokens.typography.fontFamily.body,
          fontSize: tokens.typography.fontSize.bodySm,
        }}>
        {label}
      </Text>
    </View>
  );
}
