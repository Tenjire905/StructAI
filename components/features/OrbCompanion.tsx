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
  withDelay,
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
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

type OrbCompanionProps = {
  state: OrbCompanionState;
  size?: number;
};

type GazeDirection = 'center' | 'right' | 'down' | 'left';
type MouthMood = 'none' | 'smile' | 'grin' | 'frown';

function stopScaleAnimation(scale: SharedValue<number>) {
  cancelAnimation(scale);
  scale.value = 1;
}

function stopEyeAnimations(
  eyeRadius: SharedValue<number>,
  eyeHeight: SharedValue<number>,
  blink: SharedValue<number>,
) {
  cancelAnimation(eyeRadius);
  cancelAnimation(eyeHeight);
  cancelAnimation(blink);
  eyeRadius.value = 1.1;
  eyeHeight.value = 1.1;
  blink.value = 1;
}

function stopGradientIntensity(intensity: SharedValue<number>, value = 1) {
  cancelAnimation(intensity);
  intensity.value = value;
}

function getOrbBodyOpacity(state: OrbCompanionState): number {
  switch (state) {
    case 'low_energy':
      return 0.8;
    case 'sleepy':
      return 0.85;
    case 'worry':
      return 0.92;
    case 'think':
      return 0.96;
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
      case 'think':
        return 0.3;
      case 'worry':
        return 0.22;
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

/** Static eye centers — never animate SVG cx/cy (Expo Go crash). */
function getEyeCenters(
  gaze: GazeDirection,
  thinkGlance: boolean,
): { leftCx: number; rightCx: number; cy: number } {
  if (thinkGlance) {
    return { leftCx: 9.6, rightCx: 16.6, cy: 10.5 };
  }

  switch (gaze) {
    case 'right':
      return { leftCx: 9.8, rightCx: 16.8, cy: 10.5 };
    case 'left':
      return { leftCx: 7.2, rightCx: 14.2, cy: 10.5 };
    case 'down':
      return { leftCx: 8.5, rightCx: 15.5, cy: 12.0 };
    default:
      return { leftCx: 8.5, rightCx: 15.5, cy: 10.5 };
  }
}

function resolveMouthMood(state: OrbCompanionState, gaze: GazeDirection): MouthMood {
  switch (state) {
    case 'happy':
    case 'celebrating':
      return 'grin';
    case 'worry':
      return 'frown';
    case 'sleepy':
    case 'low_energy':
    case 'think':
      return 'none';
    case 'attentive':
      return 'smile';
    case 'idle':
    default:
      // Soft smile while looking around; stronger when facing forward again.
      return gaze === 'center' ? 'smile' : 'smile';
  }
}

function OrbMouth({ mood, color }: { mood: MouthMood; color: string }) {
  if (mood === 'none') {
    return null;
  }

  if (mood === 'frown') {
    return (
      <Path
        d="M 9.2 15.6 Q 12 14.4 14.8 15.6"
        fill="none"
        stroke={color}
        strokeLinecap="round"
        strokeWidth={1.15}
      />
    );
  }

  if (mood === 'grin') {
    return (
      <Path
        d="M 8.4 14.6 Q 12 17.4 15.6 14.6"
        fill="none"
        stroke={color}
        strokeLinecap="round"
        strokeWidth={1.3}
      />
    );
  }

  return (
    <Path
      d="M 9 15 Q 12 16.7 15 15"
      fill="none"
      stroke={color}
      strokeLinecap="round"
      strokeWidth={1.2}
    />
  );
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
  const blink = useSharedValue(1);
  const [gaze, setGaze] = useState<GazeDirection>('center');

  const thinkGlance = state === 'think';
  const { leftCx, rightCx, cy } = getEyeCenters(gaze, thinkGlance);
  const mouthMood = resolveMouthMood(state, gaze);
  const usesHappyArcs = state === 'happy' || state === 'celebrating';

  // Idle: look right → center → down → center (with a smile), not endless blank blinking.
  useEffect(() => {
    if (!isFocused || reduceMotion || state !== 'idle') {
      setGaze('center');
      return;
    }

    let step = 0;
    const sequence: Array<{ gaze: GazeDirection; ms: number }> = [
      { gaze: 'center', ms: 2200 },
      { gaze: 'right', ms: 1100 },
      { gaze: 'center', ms: 1400 },
      { gaze: 'down', ms: 1000 },
      { gaze: 'center', ms: 1800 },
      { gaze: 'left', ms: 900 },
      { gaze: 'center', ms: 2000 },
    ];

    let timer: ReturnType<typeof setTimeout> | undefined;

    const tick = () => {
      const current = sequence[step % sequence.length];
      setGaze(current.gaze);
      step += 1;
      timer = setTimeout(tick, current.ms);
    };

    tick();

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [isFocused, reduceMotion, state]);

  useEffect(() => {
    if (!isFocused || reduceMotion) {
      stopEyeAnimations(eyeRadius, eyeHeight, blink);
      return () => {
        stopEyeAnimations(eyeRadius, eyeHeight, blink);
      };
    }

    stopEyeAnimations(eyeRadius, eyeHeight, blink);

    // Occasional single blinks on idle/attentive — not a constant open/close loop.
    const softBlinkStates =
      state === 'idle' || state === 'attentive' || state === 'think' || state === 'worry';

    if (softBlinkStates) {
      const gap = state === 'idle' ? 3800 : 2600;
      blink.value = withRepeat(
        withSequence(
          withDelay(gap, withTiming(0.12, { duration: 80 })),
          withTiming(1, { duration: 110 }),
        ),
        -1,
        false,
      );
    }

    switch (state) {
      case 'attentive':
        eyeRadius.value = withTiming(1.35, { duration: tokens.motion.duration.fast });
        eyeHeight.value = withTiming(1.35, { duration: tokens.motion.duration.fast });
        break;
      case 'think':
        eyeRadius.value = withTiming(1.15, { duration: tokens.motion.duration.fast });
        eyeHeight.value = withTiming(1.05, { duration: tokens.motion.duration.fast });
        break;
      case 'worry':
        eyeRadius.value = withTiming(1.05, { duration: tokens.motion.duration.fast });
        eyeHeight.value = withTiming(0.85, { duration: tokens.motion.duration.fast });
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
      stopEyeAnimations(eyeRadius, eyeHeight, blink);
    };
  }, [
    blink,
    eyeHeight,
    eyeRadius,
    isFocused,
    reduceMotion,
    state,
    tokens.motion.duration.fast,
  ]);

  const leftEyeProps = useAnimatedProps(() => ({
    rx: eyeRadius.value,
    ry: eyeHeight.value * blink.value,
  }));

  const rightEyeProps = useAnimatedProps(() => ({
    rx: eyeRadius.value,
    ry: eyeHeight.value * blink.value,
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

  if (usesHappyArcs) {
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
        <OrbMouth color={eyeColor} mood={mouthMood} />
      </>
    );
  }

  if (state === 'worry') {
    return (
      <>
        <Path
          d="M 6.8 9.2 Q 8.5 10.4 10.2 9.2"
          fill="none"
          stroke={eyeColor}
          strokeLinecap="round"
          strokeWidth={1.1}
        />
        <Path
          d="M 13.8 9.2 Q 15.5 10.4 17.2 9.2"
          fill="none"
          stroke={eyeColor}
          strokeLinecap="round"
          strokeWidth={1.1}
        />
        <AnimatedEllipse
          animatedProps={leftEyeProps}
          cx={leftCx}
          cy={11.2}
          fill={eyeColor}
          opacity={0.9}
        />
        <AnimatedEllipse
          animatedProps={rightEyeProps}
          cx={rightCx}
          cy={11.2}
          fill={eyeColor}
          opacity={0.9}
        />
        <OrbMouth color={eyeColor} mood={mouthMood} />
      </>
    );
  }

  return (
    <>
      <AnimatedEllipse
        animatedProps={leftEyeProps}
        cx={leftCx}
        cy={cy}
        fill={eyeColor}
        opacity={0.9}
      />
      <AnimatedEllipse
        animatedProps={rightEyeProps}
        cx={rightCx}
        cy={cy}
        fill={eyeColor}
        opacity={0.9}
      />
      {state === 'think' ? (
        <Circle cx={18.5} cy={7.5} fill={eyeColor} opacity={0.55} r={0.7} />
      ) : null}
      <OrbMouth color={eyeColor} mood={mouthMood} />
    </>
  );
}

export function OrbCompanion({ state, size = 24 }: OrbCompanionProps) {
  const { tokens } = useThemeMode();
  const isFocused = useIsFocused();
  const gradientId = useId().replace(/:/g, '');
  const orbScale = useSharedValue(1);
  const gradientIntensity = useSharedValue(getOrbBodyOpacity(state));
  const [reduceMotion, setReduceMotion] = useState(false);

  const isPlayfulPresentation =
    !reduceMotion && tokens.presentation.orbStyle === 'illustrated';
  // Faces run in both modes; Playful only increases motion amplitude.
  const showFace = !reduceMotion;

  const highlightRatio = useMemo(() => {
    const bodyOpacity = getOrbBodyOpacity(state);
    return getHighlightOpacity(state, isPlayfulPresentation) / bodyOpacity;
  }, [isPlayfulPresentation, state]);

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion);
  }, []);

  useEffect(() => {
    const targetIntensity = getOrbBodyOpacity(state);
    stopGradientIntensity(gradientIntensity, gradientIntensity.value);
    gradientIntensity.value = withTiming(targetIntensity, {
      duration: tokens.motion.duration.fast,
    });

    return () => {
      stopGradientIntensity(gradientIntensity, targetIntensity);
    };
  }, [gradientIntensity, state, tokens.motion.duration.fast]);

  useEffect(() => {
    if (!isFocused || reduceMotion) {
      stopScaleAnimation(orbScale);
      return () => {
        stopScaleAnimation(orbScale);
      };
    }

    stopScaleAnimation(orbScale);

    if (state === 'idle' || state === 'think') {
      const duration = isPlayfulPresentation ? 1200 : 1500;
      const peak = isPlayfulPresentation
        ? state === 'think'
          ? 1.025
          : 1.03
        : 1.01;
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

    if (state === 'low_energy' && isPlayfulPresentation) {
      const duration = 1600;
      const peak = 1.015;

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

    if (state === 'happy') {
      const peak = isPlayfulPresentation ? 1.08 : 1.04;
      orbScale.value = withSequence(
        withSpring(peak, tokens.motion.spring.default),
        withSpring(1, tokens.motion.spring.default),
      );

      return () => {
        stopScaleAnimation(orbScale);
      };
    }

    if (state === 'worry') {
      orbScale.value = withSequence(
        withTiming(isPlayfulPresentation ? 0.97 : 0.985, {
          duration: tokens.motion.duration.fast,
        }),
        withSpring(1, tokens.motion.spring.default),
      );

      return () => {
        stopScaleAnimation(orbScale);
      };
    }

    if (state === 'celebrating') {
      const peak = isPlayfulPresentation ? 1.12 : 1.06;
      orbScale.value = withSequence(
        withSpring(
          peak,
          isPlayfulPresentation
            ? tokens.motion.spring.bouncy
            : tokens.motion.spring.default,
        ),
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

  const bodyAnimatedProps = useAnimatedProps(() => ({
    opacity: gradientIntensity.value,
  }));

  const highlightAnimatedProps = useAnimatedProps(() => ({
    opacity: gradientIntensity.value * highlightRatio,
  }));

  return (
    <Animated.View style={containerStyle}>
      <Svg height={size} viewBox="0 0 24 24" width={size}>
        <Defs>
          <RadialGradient cx="35%" cy="30%" id={gradientId} rx="70%" ry="70%">
            <Stop offset="0%" stopColor={tokens.colors.accent.structure} />
            <Stop offset="100%" stopColor={tokens.colors.accent.primary} />
          </RadialGradient>
        </Defs>
        <AnimatedCircle
          animatedProps={bodyAnimatedProps}
          cx="12"
          cy="12"
          fill={`url(#${gradientId})`}
          r="10"
        />
        <AnimatedCircle
          animatedProps={highlightAnimatedProps}
          cx="9"
          cy="9"
          fill={tokens.colors.text.onAccent}
          r="3"
        />
        {showFace ? (
          <PlayfulEyes isFocused={isFocused} reduceMotion={reduceMotion} state={state} />
        ) : null}
      </Svg>
    </Animated.View>
  );
}
