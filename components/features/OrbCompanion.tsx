import { useIsFocused } from 'expo-router';
import { useEffect, useId, useMemo, useState } from 'react';
import { AccessibilityInfo } from 'react-native';
import Animated, {
  cancelAnimation,
  Easing,
  type SharedValue,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import Svg, {
  Circle,
  Defs,
  Ellipse,
  Line,
  Path,
  RadialGradient,
  Stop,
} from 'react-native-svg';

import type { OrbCompanionState } from '@/hooks/useOrbCompanionState';
import { useThemeMode } from '@/theme';

const AnimatedEllipse = Animated.createAnimatedComponent(Ellipse);

type OrbCompanionProps = {
  state: OrbCompanionState;
  size?: number;
};

function stopScaleAnimation(scale: SharedValue<number>) {
  cancelAnimation(scale);
  scale.value = 1;
}

function stopEyeAnimations(
  eyeRadius: SharedValue<number>,
  eyeHeight: SharedValue<number>,
) {
  cancelAnimation(eyeRadius);
  cancelAnimation(eyeHeight);
  eyeRadius.value = 1.1;
  eyeHeight.value = 1.1;
}

function getOrbBodyOpacity(state: OrbCompanionState): number {
  switch (state) {
    case 'low_energy':
      return 0.8;
    case 'sleepy':
      return 0.85;
    case 'happy':
    case 'celebrating':
    case 'attentive':
      return 1;
    default:
      return 1;
  }
}

function getHighlightOpacity(state: OrbCompanionState, isPlayfulPresentation: boolean): number {
  if (!isPlayfulPresentation) {
    switch (state) {
      case 'low_energy':
        return 0.15;
      case 'sleepy':
        return 0.12;
      case 'celebrating':
      case 'happy':
      case 'attentive':
        return 0.3;
      default:
        return 0.25;
    }
  }

  switch (state) {
    case 'low_energy':
      return 0.18;
    case 'sleepy':
      return 0.14;
    default:
      return 0.25;
  }
}

type PlayfulEyesProps = {
  state: OrbCompanionState;
  reduceMotion: boolean;
  isFocused: boolean;
};

function PlayfulEyes({ state, reduceMotion, isFocused }: PlayfulEyesProps) {
  const { tokens } = useThemeMode();
  const eyeRadius = useSharedValue(1.1);
  const eyeHeight = useSharedValue(1.1);

  useEffect(() => {
    if (!isFocused || reduceMotion) {
      stopEyeAnimations(eyeRadius, eyeHeight);
      return () => {
        stopEyeAnimations(eyeRadius, eyeHeight);
      };
    }

    stopEyeAnimations(eyeRadius, eyeHeight);

    switch (state) {
      case 'attentive':
        eyeRadius.value = withTiming(1.35, { duration: tokens.motion.duration.fast });
        eyeHeight.value = withTiming(1.35, { duration: tokens.motion.duration.fast });
        break;
      case 'low_energy':
        eyeRadius.value = withTiming(1.1, { duration: tokens.motion.duration.fast });
        eyeHeight.value = withTiming(0.35, { duration: tokens.motion.duration.fast });
        break;
      case 'idle':
      case 'celebrating':
      case 'happy':
      default:
        eyeRadius.value = withTiming(1.1, { duration: tokens.motion.duration.fast });
        eyeHeight.value = withTiming(1.1, { duration: tokens.motion.duration.fast });
        break;
    }

    return () => {
      stopEyeAnimations(eyeRadius, eyeHeight);
    };
  }, [eyeHeight, eyeRadius, isFocused, reduceMotion, state, tokens.motion.duration.fast]);

  const leftEyeProps = useAnimatedProps(() => ({
    rx: eyeRadius.value,
    ry: eyeHeight.value,
  }));

  const rightEyeProps = useAnimatedProps(() => ({
    rx: eyeRadius.value,
    ry: eyeHeight.value,
  }));

  const eyeColor = tokens.colors.text.onAccent;

  if (state === 'sleepy') {
    return (
      <>
        <Line
          stroke={eyeColor}
          strokeLinecap="round"
          strokeWidth={1.2}
          x1={7}
          x2={10}
          y1={10.5}
          y2={10.5}
        />
        <Line
          stroke={eyeColor}
          strokeLinecap="round"
          strokeWidth={1.2}
          x1={14}
          x2={17}
          y1={10.5}
          y2={10.5}
        />
      </>
    );
  }

  if (state === 'happy') {
    return (
      <>
        <Path
          d="M 7.2 10.8 Q 8.5 9.1 9.8 10.8"
          fill="none"
          stroke={eyeColor}
          strokeLinecap="round"
          strokeWidth={1.2}
        />
        <Path
          d="M 14.2 10.8 Q 15.5 9.1 16.8 10.8"
          fill="none"
          stroke={eyeColor}
          strokeLinecap="round"
          strokeWidth={1.2}
        />
      </>
    );
  }

  return (
    <>
      <AnimatedEllipse
        animatedProps={leftEyeProps}
        cx={8.5}
        cy={10.5}
        fill={eyeColor}
        opacity={0.9}
      />
      <AnimatedEllipse
        animatedProps={rightEyeProps}
        cx={15.5}
        cy={10.5}
        fill={eyeColor}
        opacity={0.9}
      />
    </>
  );
}

export function OrbCompanion({ state, size = 24 }: OrbCompanionProps) {
  const { tokens } = useThemeMode();
  const isFocused = useIsFocused();
  const gradientId = useId().replace(/:/g, '');
  const orbScale = useSharedValue(1);
  const [reduceMotion, setReduceMotion] = useState(false);

  const isPlayfulPresentation =
    !reduceMotion && tokens.presentation.orbStyle === 'illustrated';

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion);
  }, []);

  useEffect(() => {
    if (!isFocused || reduceMotion) {
      stopScaleAnimation(orbScale);
      return () => {
        stopScaleAnimation(orbScale);
      };
    }

    stopScaleAnimation(orbScale);

    if (state === 'idle') {
      const duration = isPlayfulPresentation ? 1200 : 1500;
      const peak = isPlayfulPresentation ? 1.03 : 1.01;
      orbScale.value = withRepeat(
        withSequence(
          withTiming(peak, { duration, easing: Easing.inOut(Easing.sin) }),
          withTiming(1, { duration, easing: Easing.inOut(Easing.sin) }),
        ),
        -1,
        false,
      );

      return () => {
        stopScaleAnimation(orbScale);
      };
    }

    if (state === 'sleepy' && isPlayfulPresentation) {
      orbScale.value = withRepeat(
        withSequence(
          withTiming(1.015, { duration: 2000, easing: Easing.inOut(Easing.sin) }),
          withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.sin) }),
        ),
        -1,
        false,
      );

      return () => {
        stopScaleAnimation(orbScale);
      };
    }

    if (isPlayfulPresentation && state === 'happy') {
      orbScale.value = withSequence(
        withSpring(1.08, tokens.motion.spring.bouncy),
        withSpring(1, tokens.motion.spring.default),
      );

      return () => {
        stopScaleAnimation(orbScale);
      };
    }

    if (isPlayfulPresentation && state === 'celebrating') {
      orbScale.value = withSequence(
        withSpring(1.12, tokens.motion.spring.bouncy),
        withSpring(1, tokens.motion.spring.default),
      );

      return () => {
        stopScaleAnimation(orbScale);
      };
    }

    orbScale.value = withTiming(1, { duration: tokens.motion.duration.fast });

    return () => {
      stopScaleAnimation(orbScale);
    };
  }, [
    isFocused,
    isPlayfulPresentation,
    orbScale,
    reduceMotion,
    state,
    tokens.motion.duration.fast,
    tokens.motion.spring,
  ]);

  const containerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: orbScale.value }],
  }));

  const bodyOpacity = useMemo(() => getOrbBodyOpacity(state), [state]);
  const highlightOpacity = useMemo(
    () => getHighlightOpacity(state, isPlayfulPresentation),
    [isPlayfulPresentation, state],
  );

  return (
    <Animated.View style={containerStyle}>
      <Svg height={size} viewBox="0 0 24 24" width={size}>
        <Defs>
          <RadialGradient cx="35%" cy="30%" id={gradientId} rx="70%" ry="70%">
            <Stop offset="0%" stopColor={tokens.colors.accent.structure} />
            <Stop offset="100%" stopColor={tokens.colors.accent.primary} />
          </RadialGradient>
        </Defs>
        <Circle cx="12" cy="12" fill={`url(#${gradientId})`} opacity={bodyOpacity} r="10" />
        <Circle
          cx="9"
          cy="9"
          fill={tokens.colors.text.onAccent}
          opacity={highlightOpacity}
          r="3"
        />
        {isPlayfulPresentation ? (
          <PlayfulEyes isFocused={isFocused} reduceMotion={reduceMotion} state={state} />
        ) : null}
      </Svg>
    </Animated.View>
  );
}
