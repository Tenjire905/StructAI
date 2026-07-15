import { useEffect } from 'react';
import { type StyleProp, type ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { staggerDelay } from '@/lib/motionUtils';
import { useThemeMode } from '@/theme';

type LessonStepTransitionProps = {
  stepKey: string | number;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

export function LessonStepTransition({ stepKey, children, style }: LessonStepTransitionProps) {
  const { tokens } = useThemeMode();
  const translateX = useSharedValue<number>(tokens.spacing.space4);
  const opacity = useSharedValue(0.2);
  const spring = tokens.motion.spring[tokens.presentation.springPreset];

  useEffect(() => {
    translateX.value = tokens.spacing.space4;
    opacity.value = 0.2;
    translateX.value = withSpring(0, spring);
    opacity.value = withTiming(1, { duration: tokens.motion.duration.medium });
  }, [opacity, spring, stepKey, tokens.motion.duration.medium, tokens.spacing.space4, translateX]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateX: translateX.value }],
  }));

  return <Animated.View style={[animatedStyle, style]}>{children}</Animated.View>;
}

type StepFlashOverlayProps = {
  tone: 'success' | 'warning' | null;
};

export function StepFlashOverlay({ tone }: StepFlashOverlayProps) {
  const { tokens } = useThemeMode();
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (!tone) {
      opacity.value = 0;
      return;
    }

    opacity.value = withSequence(
      withTiming(tone === 'success' ? 0.22 : 0.18, {
        duration: tokens.motion.duration.instant,
      }),
      withTiming(0, { duration: tokens.motion.duration.fast }),
    );
  }, [opacity, tone, tokens.motion.duration]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  if (!tone) {
    return null;
  }

  const backgroundColor =
    tone === 'success' ? tokens.colors.accent.success : tokens.colors.accent.warning;

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        animatedStyle,
        {
          backgroundColor,
          bottom: 0,
          left: 0,
          position: 'absolute',
          right: 0,
          top: 0,
        },
      ]}
    />
  );
}

type LessonStepCheckmarksProps = {
  totalSteps: number;
  completedStepCount: number;
  currentStepIndex: number;
};

export function LessonStepCheckmarks({
  totalSteps,
  completedStepCount,
  currentStepIndex,
}: LessonStepCheckmarksProps) {
  const { tokens } = useThemeMode();

  return (
    <ViewRow gap={tokens.spacing.space1}>
      {Array.from({ length: totalSteps }, (_, index) => {
        const isCompleted = index < completedStepCount;
        const isCurrent = index === currentStepIndex;

        return (
          <StepCheckmarkDot
            index={index}
            isCompleted={isCompleted}
            isCurrent={isCurrent}
            key={index}
          />
        );
      })}
    </ViewRow>
  );
}

function ViewRow({ children, gap }: { children: React.ReactNode; gap: number }) {
  return (
    <Animated.View style={{ flexDirection: 'row', gap }}>
      {children}
    </Animated.View>
  );
}

type StepCheckmarkDotProps = {
  index: number;
  isCompleted: boolean;
  isCurrent: boolean;
};

function StepCheckmarkDot({ index, isCompleted, isCurrent }: StepCheckmarkDotProps) {
  const { tokens } = useThemeMode();
  const scale = useSharedValue(isCompleted ? 1 : 0.6);
  const opacity = useSharedValue(isCompleted || isCurrent ? 1 : 0.35);
  const spring = tokens.motion.spring[tokens.presentation.springPreset];

  useEffect(() => {
    if (isCompleted) {
      scale.value = withDelay(
        staggerDelay(index, tokens.motion),
        withSequence(
          withSpring(1.2, spring),
          withSpring(1, tokens.motion.spring.default),
        ),
      );
      opacity.value = withDelay(
        staggerDelay(index, tokens.motion),
        withTiming(1, { duration: tokens.motion.duration.fast }),
      );
      return;
    }

    scale.value = withSpring(isCurrent ? 0.85 : 0.6, tokens.motion.spring.default);
    opacity.value = withTiming(isCurrent ? 1 : 0.35, {
      duration: tokens.motion.duration.fast,
    });
  }, [
    isCompleted,
    isCurrent,
    opacity,
    scale,
    spring,
    tokens.motion.duration.fast,
    tokens.motion.spring.default,
  ]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  const backgroundColor = isCompleted
    ? tokens.colors.accent.success
    : isCurrent
      ? tokens.colors.accent.structure
      : tokens.colors.border.subtle;

  return (
    <Animated.View
      style={[
        animatedStyle,
        {
          backgroundColor,
          borderRadius: tokens.radius.pill,
          height: tokens.spacing.space2,
          width: tokens.spacing.space2,
        },
      ]}
    />
  );
}
