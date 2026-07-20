import { useIsFocused } from 'expo-router';
import { useEffect, useId, useMemo, useState } from 'react';
import { AccessibilityInfo, View } from 'react-native';
import Animated, {
  cancelAnimation,
  Easing,
  interpolate,
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
  Path,
  RadialGradient,
  Stop,
} from 'react-native-svg';

import type { OrbCompanionState } from '@/hooks/useOrbCompanionState';
import {
  defaultGazeForState,
  eyeOpennessForState,
  IDLE_CURIOSITY_BEATS,
} from '@/lib/orbChoreography';
import {
  expressionForState,
  interactionExpressionBoost,
  mergeExpression,
} from '@/lib/orbExpressions';
import { getShadow, useThemeMode } from '@/theme';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedEllipse = Animated.createAnimatedComponent(Ellipse);
const AnimatedPath = Animated.createAnimatedComponent(Path);

type OrbSvgCompanionProps = {
  state: OrbCompanionState;
  size?: number;
  interaction?: 'none' | 'enter' | 'watch' | 'react';
};

function stopShared(value: SharedValue<number>, reset = 1) {
  cancelAnimation(value);
  value.value = reset;
}

function getBodyOpacity(state: OrbCompanionState): number {
  switch (state) {
    case 'low_energy':
      return 0.78;
    case 'sleepy':
      return 0.84;
    case 'worry':
      return 0.9;
    case 'think':
      return 0.96;
    default:
      return 1;
  }
}

/**
 * Premium SVG Orb coach — expression-rich (brows, lids, cheeks, cue, dual rings).
 * No cartoon mouth. Works in Expo Go. Tokens only.
 */
export function OrbSvgCompanion({
  state,
  size = 24,
  interaction = 'none',
}: OrbSvgCompanionProps) {
  const { tokens } = useThemeMode();
  const isFocused = useIsFocused();
  const gradientId = useId().replace(/:/g, '');
  const glowId = useId().replace(/:/g, '');
  const [reduceMotion, setReduceMotion] = useState(false);
  const isPlayful =
    !reduceMotion && tokens.presentation.orbStyle === 'illustrated';
  const showFace = !reduceMotion;
  const amp = isPlayful ? 1 : 0.55;

  const expression = useMemo(
    () =>
      mergeExpression(
        expressionForState(state),
        interactionExpressionBoost(interaction),
      ),
    [interaction, state],
  );

  const bodyScale = useSharedValue(1);
  const bodySquash = useSharedValue(1);
  const bodyTilt = useSharedValue(0);
  const bodyOpacity = useSharedValue(getBodyOpacity(state));
  const ringPulse = useSharedValue(expression.ringEnergy);
  const ringSpin = useSharedValue(0);
  const innerRingSpin = useSharedValue(0);
  const highlightDrift = useSharedValue(0);
  const gazeX = useSharedValue(0);
  const gazeY = useSharedValue(0);
  const eyeOpen = useSharedValue(expression.eyeOpen);
  const irisGlow = useSharedValue(0.85);
  const browLeft = useSharedValue(expression.browLeftDeg);
  const browRight = useSharedValue(expression.browRightDeg);
  const browLift = useSharedValue(expression.browY);
  const cheek = useSharedValue(expression.cheekOpacity);
  const cue = useSharedValue(expression.cueOpacity);
  const orbit = useSharedValue(0);

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion);
  }, []);

  // Mood → body / rings / brows / cheeks
  useEffect(() => {
    if (!isFocused || reduceMotion) {
      stopShared(bodyScale, 1);
      stopShared(bodySquash, 1);
      stopShared(bodyTilt, 0);
      stopShared(ringPulse, 0.25);
      stopShared(ringSpin, 0);
      stopShared(innerRingSpin, 0);
      stopShared(highlightDrift, 0);
      stopShared(irisGlow, 0.7);
      stopShared(orbit, 0);
      browLeft.value = withTiming(expression.browLeftDeg, {
        duration: tokens.motion.duration.fast,
      });
      browRight.value = withTiming(expression.browRightDeg, {
        duration: tokens.motion.duration.fast,
      });
      browLift.value = withTiming(expression.browY, {
        duration: tokens.motion.duration.fast,
      });
      cheek.value = withTiming(expression.cheekOpacity, {
        duration: tokens.motion.duration.fast,
      });
      cue.value = withTiming(expression.cueOpacity, {
        duration: tokens.motion.duration.fast,
      });
      bodyOpacity.value = withTiming(getBodyOpacity(state), {
        duration: tokens.motion.duration.fast,
      });
      return;
    }

    const fast = tokens.motion.duration.fast;

    bodyOpacity.value = withTiming(getBodyOpacity(state), { duration: fast });
    browLeft.value = withSpring(expression.browLeftDeg, tokens.motion.spring.default);
    browRight.value = withSpring(expression.browRightDeg, tokens.motion.spring.default);
    browLift.value = withSpring(expression.browY, tokens.motion.spring.default);
    cheek.value = withTiming(expression.cheekOpacity * amp, { duration: fast });
    cue.value = withTiming(expression.cueOpacity, { duration: fast });

    stopShared(bodyScale, bodyScale.value);
    stopShared(bodySquash, 1);
    stopShared(bodyTilt, 0);
    stopShared(ringPulse, ringPulse.value);
    stopShared(ringSpin, ringSpin.value);
    stopShared(innerRingSpin, innerRingSpin.value);
    stopShared(highlightDrift, 0);
    stopShared(irisGlow, irisGlow.value);
    stopShared(orbit, orbit.value);

    const breathe = (peak: number, duration: number) => {
      bodyScale.value = withRepeat(
        withSequence(
          withTiming(peak, { duration, easing: Easing.inOut(Easing.sin) }),
          withTiming(1, { duration, easing: Easing.inOut(Easing.sin) }),
        ),
        -1,
        false,
      );
    };

    const spinOuter = (duration: number) => {
      ringSpin.value = withRepeat(
        withTiming(1, { duration, easing: Easing.linear }),
        -1,
        false,
      );
    };

    const spinInner = (duration: number) => {
      innerRingSpin.value = withRepeat(
        withTiming(1, { duration, easing: Easing.linear }),
        -1,
        false,
      );
    };

    switch (state) {
      case 'idle':
        breathe(expression.bodyBreathPeak, isPlayful ? 1400 : 1700);
        ringPulse.value = withRepeat(
          withSequence(
            withTiming(expression.ringEnergy + 0.15, {
              duration: 1600,
              easing: Easing.inOut(Easing.quad),
            }),
            withTiming(expression.ringEnergy - 0.1, {
              duration: 1600,
              easing: Easing.inOut(Easing.quad),
            }),
          ),
          -1,
          false,
        );
        spinOuter(14000);
        spinInner(9000);
        highlightDrift.value = withRepeat(
          withSequence(
            withTiming(1, { duration: 2200, easing: Easing.inOut(Easing.sin) }),
            withTiming(0, { duration: 2200, easing: Easing.inOut(Easing.sin) }),
          ),
          -1,
          false,
        );
        orbit.value = withRepeat(
          withTiming(1, { duration: 10000, easing: Easing.linear }),
          -1,
          false,
        );
        irisGlow.value = withTiming(0.88, { duration: fast });
        break;

      case 'attentive':
        bodyScale.value = withSpring(expression.bodyBreathPeak, tokens.motion.spring.default);
        bodyTilt.value = withTiming(-2 * amp, { duration: fast });
        ringPulse.value = withRepeat(
          withSequence(
            withTiming(0.85, { duration: 700 }),
            withTiming(0.5, { duration: 700 }),
          ),
          -1,
          false,
        );
        spinOuter(8000);
        irisGlow.value = withTiming(1, { duration: fast });
        break;

      case 'think':
        breathe(expression.bodyBreathPeak, 1900);
        bodyTilt.value = withRepeat(
          withSequence(
            withTiming(3 * amp, { duration: 1600, easing: Easing.inOut(Easing.sin) }),
            withTiming(-1 * amp, { duration: 1600, easing: Easing.inOut(Easing.sin) }),
          ),
          -1,
          false,
        );
        browLeft.value = withRepeat(
          withSequence(
            withTiming(expression.browLeftDeg - 3, { duration: 900 }),
            withTiming(expression.browLeftDeg, { duration: 900 }),
          ),
          -1,
          false,
        );
        ringPulse.value = withRepeat(
          withSequence(
            withTiming(0.65, { duration: 1100 }),
            withTiming(0.3, { duration: 1100 }),
          ),
          -1,
          false,
        );
        spinOuter(8000);
        spinInner(6000);
        irisGlow.value = withRepeat(
          withSequence(
            withTiming(0.7, { duration: 900 }),
            withTiming(1, { duration: 900 }),
          ),
          -1,
          false,
        );
        break;

      case 'happy':
        bodyScale.value = withSequence(
          withSpring(1 + 0.09 * amp, tokens.motion.spring.bouncy),
          withSpring(1.02, tokens.motion.spring.default),
        );
        bodySquash.value = withSequence(
          withTiming(0.92, { duration: 90 }),
          withSpring(1.06, tokens.motion.spring.bouncy),
          withSpring(1, tokens.motion.spring.default),
        );
        ringPulse.value = withSequence(
          withTiming(0.95, { duration: 160 }),
          withTiming(0.5, { duration: 420 }),
        );
        irisGlow.value = withSequence(
          withTiming(1, { duration: 120 }),
          withTiming(0.92, { duration: 400 }),
        );
        break;

      case 'celebrating':
        bodyScale.value = withSequence(
          withSpring(1 + 0.14 * amp, tokens.motion.spring.bouncy),
          withSpring(0.96, tokens.motion.spring.default),
          withSpring(1 + 0.1 * amp, tokens.motion.spring.bouncy),
          withSpring(1, tokens.motion.spring.default),
        );
        bodySquash.value = withSequence(
          withTiming(0.88, { duration: 80 }),
          withSpring(1.1, tokens.motion.spring.bouncy),
          withTiming(0.94, { duration: 90 }),
          withSpring(1, tokens.motion.spring.default),
        );
        ringPulse.value = withRepeat(
          withSequence(
            withTiming(1, { duration: 220 }),
            withTiming(0.35, { duration: 220 }),
          ),
          5,
          false,
        );
        spinOuter(2400);
        orbit.value = withRepeat(
          withTiming(1, { duration: 2200, easing: Easing.linear }),
          -1,
          false,
        );
        irisGlow.value = withRepeat(
          withSequence(withTiming(1, { duration: 180 }), withTiming(0.75, { duration: 180 })),
          6,
          false,
        );
        break;

      case 'worry':
        bodyScale.value = withSequence(
          withTiming(0.94, { duration: fast }),
          withSpring(0.97, tokens.motion.spring.default),
        );
        bodyTilt.value = withTiming(4 * amp, { duration: fast });
        ringPulse.value = withTiming(0.2, { duration: fast });
        irisGlow.value = withTiming(0.55, { duration: fast });
        break;

      case 'sleepy':
        breathe(expression.bodyBreathPeak, 2400);
        ringPulse.value = withTiming(0.15, { duration: fast });
        irisGlow.value = withTiming(0.4, { duration: fast });
        break;

      case 'low_energy':
        breathe(expression.bodyBreathPeak, 2100);
        ringPulse.value = withTiming(0.18, { duration: fast });
        irisGlow.value = withTiming(0.5, { duration: fast });
        break;

      default:
        breathe(1.02, 1600);
        break;
    }

    if (interaction === 'enter') {
      bodyScale.value = withSequence(
        withTiming(0.82, { duration: 1 }),
        withSpring(1 + 0.06 * amp, tokens.motion.spring.bouncy),
        withSpring(1, tokens.motion.spring.default),
      );
      ringPulse.value = withSequence(
        withTiming(1, { duration: 280 }),
        withTiming(0.4, { duration: 500 }),
      );
    }

    if (interaction === 'react') {
      bodyScale.value = withSequence(
        withSpring(1 + 0.08 * amp, tokens.motion.spring.bouncy),
        withSpring(1, tokens.motion.spring.default),
      );
    }

    return () => {
      stopShared(bodyScale, 1);
      stopShared(bodySquash, 1);
      stopShared(bodyTilt, 0);
    };
  }, [
    amp,
    bodyOpacity,
    bodyScale,
    bodySquash,
    bodyTilt,
    browLeft,
    browLift,
    browRight,
    cheek,
    cue,
    expression,
    highlightDrift,
    innerRingSpin,
    interaction,
    irisGlow,
    isFocused,
    isPlayful,
    orbit,
    reduceMotion,
    ringPulse,
    ringSpin,
    state,
    tokens.motion.duration.fast,
    tokens.motion.spring,
  ]);

  // Gaze + lid choreography (View transforms — never SVG cx).
  useEffect(() => {
    if (!isFocused || reduceMotion || !showFace) {
      gazeX.value = 0;
      gazeY.value = 0;
      eyeOpen.value = expression.eyeOpen;
      return;
    }

    const ease = Easing.out(Easing.cubic);
    const moveGaze = (x: number, y: number, duration = 280) => {
      gazeX.value = withTiming(x * amp, { duration, easing: ease });
      gazeY.value = withTiming(y * amp, { duration, easing: ease });
    };

    cancelAnimation(eyeOpen);

    if (state === 'idle') {
      let step = 0;
      let timer: ReturnType<typeof setTimeout> | undefined;
      let cancelled = false;

      const runBeat = () => {
        if (cancelled) {
          return;
        }

        const beat = IDLE_CURIOSITY_BEATS[step % IDLE_CURIOSITY_BEATS.length];
        moveGaze(beat.gaze.x, beat.gaze.y, 320);
        eyeOpen.value = withTiming(
          (beat.lid ?? beat.eyeScale ?? 1) * expression.eyeOpen,
          { duration: beat.lid != null ? 70 : 220 },
        );

        if (beat.lid != null) {
          eyeOpen.value = withSequence(
            withTiming(0.12, { duration: 70 }),
            withTiming((beat.eyeScale ?? 1) * expression.eyeOpen, { duration: 110 }),
          );
        }

        step += 1;
        timer = setTimeout(runBeat, beat.holdMs);
      };

      runBeat();

      return () => {
        cancelled = true;
        if (timer) {
          clearTimeout(timer);
        }
      };
    }

    if (state === 'celebrating') {
      const path = [
        { x: 0, y: -0.9 },
        { x: 1.2, y: -0.4 },
        { x: -1.1, y: -0.3 },
        { x: 0.4, y: 0.5 },
        { x: 0, y: -0.5 },
      ];
      let i = 0;
      let timer: ReturnType<typeof setTimeout> | undefined;
      let cancelled = false;

      const tick = () => {
        if (cancelled) {
          return;
        }
        const g = path[i % path.length];
        moveGaze(g.x, g.y, 180);
        eyeOpen.value = withTiming(1.12 * expression.eyeOpen, { duration: 120 });
        i += 1;
        timer = setTimeout(tick, 280);
      };
      tick();
      return () => {
        cancelled = true;
        if (timer) {
          clearTimeout(timer);
        }
      };
    }

    const gaze = defaultGazeForState(state);
    moveGaze(gaze.x, gaze.y, 340);
    eyeOpen.value = withTiming(
      eyeOpennessForState(state) * expression.eyeOpen,
      { duration: 260 },
    );

    if (state === 'think') {
      eyeOpen.value = withRepeat(
        withSequence(
          withTiming(0.85 * expression.eyeOpen, { duration: 700 }),
          withTiming(1.02 * expression.eyeOpen, { duration: 700 }),
        ),
        -1,
        false,
      );
    }

    if (state === 'attentive') {
      eyeOpen.value = withSequence(
        withTiming(1.22 * expression.eyeOpen, { duration: 160 }),
        withTiming(1.12 * expression.eyeOpen, { duration: 280 }),
      );
    }

    if (state === 'worry') {
      eyeOpen.value = withSequence(
        withTiming(0.55, { duration: 120 }),
        withTiming(0.75 * expression.eyeOpen, { duration: 220 }),
        withDelay(900, withTiming(0.2, { duration: 80 })),
        withTiming(0.72 * expression.eyeOpen, { duration: 120 }),
      );
    }
  }, [
    amp,
    expression.eyeOpen,
    eyeOpen,
    gazeX,
    gazeY,
    isFocused,
    reduceMotion,
    showFace,
    state,
  ]);

  const bodyStyle = useAnimatedStyle(() => ({
    opacity: bodyOpacity.value,
    transform: [
      { rotate: `${bodyTilt.value}deg` },
      {
        scaleX:
          bodyScale.value * interpolate(bodySquash.value, [0.85, 1.15], [1.06, 0.94]),
      },
      { scaleY: bodyScale.value * bodySquash.value },
    ],
  }));

  const faceStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: gazeX.value }, { translateY: gazeY.value }],
  }));

  const browRowStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: browLift.value * (size / 24) }],
  }));

  const leftBrowStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${browLeft.value}deg` }],
  }));

  const rightBrowStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${browRight.value}deg` }],
  }));

  const ringProps = useAnimatedProps(() => ({
    opacity: ringPulse.value,
    strokeDashoffset: interpolate(ringSpin.value, [0, 1], [0, 48]),
  }));

  const innerRingProps = useAnimatedProps(() => ({
    opacity: interpolate(ringPulse.value, [0, 1], [0.15, 0.55]),
    strokeDashoffset: interpolate(innerRingSpin.value, [0, 1], [0, -28]),
  }));

  const highlightSafeProps = useAnimatedProps(() => ({
    opacity: interpolate(
      highlightDrift.value,
      [0, 1],
      [isPlayful ? 0.18 : 0.12, expression.highlightPeak * (isPlayful ? 1 : 0.75)],
    ),
  }));

  const leftLidProps = useAnimatedProps(() => ({
    ry: 1.45 * eyeOpen.value,
    rx: 1.65 * expression.eyeWidth,
  }));
  const rightLidProps = useAnimatedProps(() => ({
    ry: 1.45 * eyeOpen.value,
    rx: 1.65 * expression.eyeWidth,
  }));
  const irisProps = useAnimatedProps(() => ({
    opacity: irisGlow.value,
    rx: 0.95 * expression.irisScale,
    ry: 0.95 * expression.irisScale,
  }));
  const cheekProps = useAnimatedProps(() => ({
    opacity: cheek.value,
  }));
  const cueProps = useAnimatedProps(() => ({
    opacity: cue.value,
    strokeWidth: 0.7 * expression.cueWidth,
  }));

  const orbitDotProps = useAnimatedProps(() => ({
    opacity: isPlayful
      ? interpolate(orbit.value, [0, 0.5, 1], [0.15, 0.55, 0.15])
      : 0,
  }));

  const faceColor = tokens.colors.text.onAccent;
  const irisColor = tokens.colors.accent.structure;
  const pupilColor = tokens.colors.background.base;
  const browColor = tokens.colors.background.elevated;
  const warmAccent = tokens.colors.accent.warning;
  const structureDim = tokens.colors.accent.structureDim;

  const eyeGeometry = useMemo(
    () => ({
      left: { cx: 9.0, cy: 10.7 },
      right: { cx: 15.0, cy: 10.7 },
    }),
    [],
  );

  const unit = size / 24;
  const glowStyle = isPlayful ? getShadow('glow') : getShadow(1);

  // Warmth blends body toward warning for worry/low_energy via stop mix — tokens only.
  const bodyCore =
    expression.warmth > 0.4
      ? warmAccent
      : tokens.colors.accent.structure;
  const bodyMid =
    expression.warmth > 0.4
      ? tokens.colors.accent.primary
      : tokens.colors.accent.primary;
  const bodyEdge = tokens.colors.accent.primaryDim;

  return (
    <Animated.View style={[{ height: size, width: size }, glowStyle, bodyStyle]}>
      <View style={{ height: size, width: size }}>
        <Svg height={size} viewBox="0 0 24 24" width={size}>
          <Defs>
            <RadialGradient cx="34%" cy="28%" id={gradientId} rx="72%" ry="72%">
              <Stop offset="0%" stopColor={bodyCore} />
              <Stop offset="52%" stopColor={bodyMid} />
              <Stop offset="100%" stopColor={bodyEdge} />
            </RadialGradient>
            <RadialGradient cx="50%" cy="50%" id={glowId} rx="50%" ry="50%">
              <Stop offset="0%" stopColor={irisColor} stopOpacity="0.35" />
              <Stop offset="70%" stopColor={irisColor} stopOpacity="0.08" />
              <Stop offset="100%" stopColor={structureDim} stopOpacity="0" />
            </RadialGradient>
          </Defs>

          {/* Soft aura disk */}
          <Circle cx="12" cy="12" fill={`url(#${glowId})`} r="11.6" />

          {/* Outer energy ring */}
          <AnimatedCircle
            animatedProps={ringProps}
            cx="12"
            cy="12"
            fill="none"
            r="11.15"
            stroke={irisColor}
            strokeDasharray="5 9"
            strokeLinecap="round"
            strokeWidth={isPlayful ? 1.2 : 0.95}
          />

          {/* Inner counter-rotating ring */}
          <AnimatedCircle
            animatedProps={innerRingProps}
            cx="12"
            cy="12"
            fill="none"
            r="10.35"
            stroke={faceColor}
            strokeDasharray="2 8"
            strokeLinecap="round"
            strokeOpacity={0.35}
            strokeWidth={0.55}
          />

          <Circle cx="12" cy="12" fill={`url(#${gradientId})`} r="9.85" />

          {/* Glass rim */}
          <Circle
            cx="12"
            cy="12"
            fill="none"
            r="9.85"
            stroke={faceColor}
            strokeOpacity={0.18}
            strokeWidth={0.4}
          />

          <AnimatedCircle
            animatedProps={highlightSafeProps}
            cx="8.8"
            cy="8.2"
            fill={faceColor}
            r="2.6"
          />

          {/* Playful orbit markers — structure signal, not confetti */}
          {isPlayful ? (
            <>
              <AnimatedCircle
                animatedProps={orbitDotProps}
                cx="12"
                cy="1.6"
                fill={irisColor}
                r="0.55"
              />
              <AnimatedCircle
                animatedProps={orbitDotProps}
                cx="21.2"
                cy="14.5"
                fill={irisColor}
                r="0.45"
              />
              <AnimatedCircle
                animatedProps={orbitDotProps}
                cx="2.8"
                cy="14.5"
                fill={irisColor}
                r="0.45"
              />
            </>
          ) : null}
        </Svg>

        {showFace ? (
          <>
            {/* Brows — View transforms (safe on Expo Go) */}
            <Animated.View
              pointerEvents="none"
              style={[
                {
                  height: size,
                  left: 0,
                  position: 'absolute',
                  top: 0,
                  width: size,
                },
                browRowStyle,
              ]}>
              <Animated.View
                style={[
                  {
                    height: 2.2 * unit,
                    left: 6.6 * unit,
                    position: 'absolute',
                    top: 7.4 * unit,
                    width: 4.2 * unit,
                  },
                  leftBrowStyle,
                ]}>
                <View
                  style={{
                    backgroundColor: browColor,
                    borderRadius: tokens.radius.pill,
                    flex: 1,
                    opacity: 0.75,
                  }}
                />
              </Animated.View>
              <Animated.View
                style={[
                  {
                    height: 2.2 * unit,
                    left: 13.2 * unit,
                    position: 'absolute',
                    top: 7.4 * unit,
                    width: 4.2 * unit,
                  },
                  rightBrowStyle,
                ]}>
                <View
                  style={{
                    backgroundColor: browColor,
                    borderRadius: tokens.radius.pill,
                    flex: 1,
                    opacity: 0.75,
                  }}
                />
              </Animated.View>
            </Animated.View>

            <Animated.View
              pointerEvents="none"
              style={[
                {
                  height: size,
                  left: 0,
                  position: 'absolute',
                  top: 0,
                  width: size,
                },
                faceStyle,
              ]}>
              <Svg height={size} viewBox="0 0 24 24" width={size}>
                {/* Left eye */}
                <AnimatedEllipse
                  animatedProps={leftLidProps}
                  cx={eyeGeometry.left.cx}
                  cy={eyeGeometry.left.cy}
                  fill={faceColor}
                  opacity={0.96}
                />
                <AnimatedEllipse
                  animatedProps={irisProps}
                  cx={eyeGeometry.left.cx + 0.18}
                  cy={eyeGeometry.left.cy + 0.12}
                  fill={irisColor}
                />
                <Circle
                  cx={eyeGeometry.left.cx + 0.28}
                  cy={eyeGeometry.left.cy + 0.18}
                  fill={pupilColor}
                  r={0.48}
                />
                <Circle
                  cx={eyeGeometry.left.cx - 0.12}
                  cy={eyeGeometry.left.cy - 0.28}
                  fill={faceColor}
                  opacity={0.6}
                  r={0.24}
                />

                {/* Right eye */}
                <AnimatedEllipse
                  animatedProps={rightLidProps}
                  cx={eyeGeometry.right.cx}
                  cy={eyeGeometry.right.cy}
                  fill={faceColor}
                  opacity={0.96}
                />
                <AnimatedEllipse
                  animatedProps={irisProps}
                  cx={eyeGeometry.right.cx + 0.18}
                  cy={eyeGeometry.right.cy + 0.12}
                  fill={irisColor}
                />
                <Circle
                  cx={eyeGeometry.right.cx + 0.28}
                  cy={eyeGeometry.right.cy + 0.18}
                  fill={pupilColor}
                  r={0.48}
                />
                <Circle
                  cx={eyeGeometry.right.cx - 0.12}
                  cy={eyeGeometry.right.cy - 0.28}
                  fill={faceColor}
                  opacity={0.6}
                  r={0.24}
                />

                {/* Cheeks — soft presence, not blush spam */}
                <AnimatedEllipse
                  animatedProps={cheekProps}
                  cx="7.4"
                  cy="13.6"
                  fill={warmAccent}
                  rx={1.3}
                  ry={0.7}
                />
                <AnimatedEllipse
                  animatedProps={cheekProps}
                  cx="16.6"
                  cy="13.6"
                  fill={warmAccent}
                  rx={1.3}
                  ry={0.7}
                />

                {/* Structure cue — flat focus mark (never a curved smile) */}
                <AnimatedPath
                  animatedProps={cueProps}
                  d="M9.4 14.85 L14.6 14.85"
                  fill="none"
                  stroke={irisColor}
                  strokeLinecap="round"
                />
              </Svg>
            </Animated.View>
          </>
        ) : null}
      </View>
    </Animated.View>
  );
}
