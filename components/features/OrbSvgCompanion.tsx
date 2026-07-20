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
  RadialGradient,
  Stop,
} from 'react-native-svg';

import type { OrbCompanionState } from '@/hooks/useOrbCompanionState';
import {
  defaultGazeForState,
  eyeOpennessForState,
  IDLE_CURIOSITY_BEATS,
} from '@/lib/orbChoreography';
import { useThemeMode } from '@/theme';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedEllipse = Animated.createAnimatedComponent(Ellipse);

type OrbSvgCompanionProps = {
  state: OrbCompanionState;
  size?: number;
  /**
   * Interaction beat layered on top of mood:
   * enter = first-seen presence, watch = user is reading, react = short punch.
   */
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
 * SVG fallback Orb — used in Expo Go and until a Rive .riv asset is wired.
 * Personality = gaze choreography + cyan iris + ring energy (no cartoon mouth).
 */
export function OrbSvgCompanion({
  state,
  size = 24,
  interaction = 'none',
}: OrbSvgCompanionProps) {
  const { tokens } = useThemeMode();
  const isFocused = useIsFocused();
  const gradientId = useId().replace(/:/g, '');
  const ringId = useId().replace(/:/g, '');
  const [reduceMotion, setReduceMotion] = useState(false);
  const isPlayful =
    !reduceMotion && tokens.presentation.orbStyle === 'illustrated';
  const showFace = !reduceMotion;

  const bodyScale = useSharedValue(1);
  const bodySquash = useSharedValue(1);
  const bodyTilt = useSharedValue(0);
  const bodyOpacity = useSharedValue(getBodyOpacity(state));
  const ringPulse = useSharedValue(0.35);
  const ringSpin = useSharedValue(0);
  const highlightDrift = useSharedValue(0);
  const gazeX = useSharedValue(0);
  const gazeY = useSharedValue(0);
  const eyeOpen = useSharedValue(1);
  const irisGlow = useSharedValue(0.85);

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion);
  }, []);

  // Mood → body / ring / iris (frame-rich loops where it pays off).
  useEffect(() => {
    if (!isFocused || reduceMotion) {
      stopShared(bodyScale, 1);
      stopShared(bodySquash, 1);
      stopShared(bodyTilt, 0);
      stopShared(ringPulse, 0.25);
      stopShared(ringSpin, 0);
      stopShared(highlightDrift, 0);
      stopShared(irisGlow, 0.7);
      bodyOpacity.value = withTiming(getBodyOpacity(state), {
        duration: tokens.motion.duration.fast,
      });
      return;
    }

    const fast = tokens.motion.duration.fast;
    const amp = isPlayful ? 1 : 0.55;

    bodyOpacity.value = withTiming(getBodyOpacity(state), { duration: fast });
    stopShared(bodyScale, bodyScale.value);
    stopShared(bodySquash, 1);
    stopShared(bodyTilt, 0);
    stopShared(ringPulse, ringPulse.value);
    stopShared(ringSpin, ringSpin.value);
    stopShared(highlightDrift, 0);
    stopShared(irisGlow, irisGlow.value);

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

    switch (state) {
      case 'idle':
        breathe(1 + 0.028 * amp, isPlayful ? 1400 : 1700);
        ringPulse.value = withRepeat(
          withSequence(
            withTiming(0.55, { duration: 1600, easing: Easing.inOut(Easing.quad) }),
            withTiming(0.28, { duration: 1600, easing: Easing.inOut(Easing.quad) }),
          ),
          -1,
          false,
        );
        ringSpin.value = withRepeat(
          withTiming(1, { duration: 12000, easing: Easing.linear }),
          -1,
          false,
        );
        highlightDrift.value = withRepeat(
          withSequence(
            withTiming(1, { duration: 2200, easing: Easing.inOut(Easing.sin) }),
            withTiming(0, { duration: 2200, easing: Easing.inOut(Easing.sin) }),
          ),
          -1,
          false,
        );
        irisGlow.value = withTiming(0.88, { duration: fast });
        break;

      case 'attentive':
        bodyScale.value = withSpring(1 + 0.045 * amp, tokens.motion.spring.default);
        bodyTilt.value = withTiming(-2 * amp, { duration: fast });
        ringPulse.value = withRepeat(
          withSequence(
            withTiming(0.75, { duration: 700 }),
            withTiming(0.4, { duration: 700 }),
          ),
          -1,
          false,
        );
        irisGlow.value = withTiming(1, { duration: fast });
        break;

      case 'think':
        breathe(1 + 0.02 * amp, 1900);
        bodyTilt.value = withRepeat(
          withSequence(
            withTiming(3 * amp, { duration: 1600, easing: Easing.inOut(Easing.sin) }),
            withTiming(-1 * amp, { duration: 1600, easing: Easing.inOut(Easing.sin) }),
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
        ringSpin.value = withRepeat(
          withTiming(1, { duration: 8000, easing: Easing.linear }),
          -1,
          false,
        );
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
          withTiming(0.45, { duration: 420 }),
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
        ringSpin.value = withRepeat(
          withTiming(1, { duration: 2400, easing: Easing.linear }),
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
        breathe(1 + 0.015 * amp, 2400);
        ringPulse.value = withTiming(0.15, { duration: fast });
        irisGlow.value = withTiming(0.4, { duration: fast });
        break;

      case 'low_energy':
        breathe(1 + 0.012 * amp, 2100);
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
    bodyOpacity,
    bodyScale,
    bodySquash,
    bodyTilt,
    highlightDrift,
    interaction,
    irisGlow,
    isFocused,
    isPlayful,
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
      eyeOpen.value = 1;
      return;
    }

    const ease = Easing.out(Easing.cubic);
    const moveGaze = (x: number, y: number, duration = 280) => {
      gazeX.value = withTiming(x, { duration, easing: ease });
      gazeY.value = withTiming(y, { duration, easing: ease });
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
        eyeOpen.value = withTiming(beat.lid ?? beat.eyeScale ?? 1, {
          duration: beat.lid != null ? 70 : 220,
        });

        if (beat.lid != null) {
          eyeOpen.value = withSequence(
            withTiming(0.12, { duration: 70 }),
            withTiming(beat.eyeScale ?? 1, { duration: 110 }),
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
        eyeOpen.value = withTiming(1.12, { duration: 120 });
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
    eyeOpen.value = withTiming(eyeOpennessForState(state), { duration: 260 });

    if (state === 'think') {
      eyeOpen.value = withRepeat(
        withSequence(
          withTiming(0.85, { duration: 700 }),
          withTiming(1.02, { duration: 700 }),
        ),
        -1,
        false,
      );
    }

    if (state === 'attentive') {
      eyeOpen.value = withSequence(
        withTiming(1.22, { duration: 160 }),
        withTiming(1.12, { duration: 280 }),
      );
    }

    if (state === 'worry') {
      eyeOpen.value = withSequence(
        withTiming(0.55, { duration: 120 }),
        withTiming(0.75, { duration: 220 }),
        withDelay(900, withTiming(0.2, { duration: 80 })),
        withTiming(0.72, { duration: 120 }),
      );
    }
  }, [
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
      { scaleX: bodyScale.value * interpolate(bodySquash.value, [0.85, 1.15], [1.06, 0.94]) },
      { scaleY: bodyScale.value * bodySquash.value },
    ],
  }));

  const faceStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: gazeX.value },
      { translateY: gazeY.value },
    ],
  }));

  const ringProps = useAnimatedProps(() => ({
    opacity: ringPulse.value,
    strokeDashoffset: interpolate(ringSpin.value, [0, 1], [0, 40]),
  }));

  // Specular highlight: opacity-only (never animate SVG cx — Expo Go crash).
  const highlightSafeProps = useAnimatedProps(() => ({
    opacity: interpolate(
      highlightDrift.value,
      [0, 1],
      [isPlayful ? 0.2 : 0.14, isPlayful ? 0.36 : 0.26],
    ),
  }));

  const leftLidProps = useAnimatedProps(() => ({
    ry: 1.35 * eyeOpen.value,
  }));
  const rightLidProps = useAnimatedProps(() => ({
    ry: 1.35 * eyeOpen.value,
  }));
  const irisProps = useAnimatedProps(() => ({
    opacity: irisGlow.value,
  }));

  const faceColor = tokens.colors.text.onAccent;
  const irisColor = tokens.colors.accent.structure;
  const pupilColor = tokens.colors.background.base;

  const eyeGeometry = useMemo(
    () => ({
      left: { cx: 9.1, cy: 10.6 },
      right: { cx: 14.9, cy: 10.6 },
    }),
    [],
  );

  return (
    <Animated.View style={[{ height: size, width: size }, bodyStyle]}>
      <View style={{ height: size, width: size }}>
        <Svg height={size} viewBox="0 0 24 24" width={size}>
          <Defs>
            <RadialGradient cx="34%" cy="28%" id={gradientId} rx="72%" ry="72%">
              <Stop offset="0%" stopColor={tokens.colors.accent.structure} />
              <Stop offset="55%" stopColor={tokens.colors.accent.primary} />
              <Stop offset="100%" stopColor={tokens.colors.accent.primaryDim} />
            </RadialGradient>
            <RadialGradient cx="50%" cy="50%" id={ringId} rx="50%" ry="50%">
              <Stop offset="0%" stopColor={tokens.colors.accent.structure} stopOpacity="0" />
              <Stop offset="100%" stopColor={tokens.colors.accent.structure} stopOpacity="0.9" />
            </RadialGradient>
          </Defs>

          {/* Energy ring — structure signature, not a face accessory */}
          <AnimatedCircle
            animatedProps={ringProps}
            cx="12"
            cy="12"
            fill="none"
            r="11.1"
            stroke={tokens.colors.accent.structure}
            strokeDasharray="6 10"
            strokeLinecap="round"
            strokeWidth={isPlayful ? 1.15 : 0.9}
          />

          <Circle cx="12" cy="12" fill={`url(#${gradientId})`} r="10" />

          <AnimatedCircle
            animatedProps={highlightSafeProps}
            cx="9"
            cy="8.6"
            fill={faceColor}
            r="2.8"
          />
        </Svg>

        {showFace ? (
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
              {/* Left eye — sclera / structure iris / pupil (no mouth) */}
              <AnimatedEllipse
                animatedProps={leftLidProps}
                cx={eyeGeometry.left.cx}
                cy={eyeGeometry.left.cy}
                fill={faceColor}
                opacity={0.95}
                rx={1.55}
              />
              <AnimatedEllipse
                animatedProps={irisProps}
                cx={eyeGeometry.left.cx + 0.15}
                cy={eyeGeometry.left.cy + 0.1}
                fill={irisColor}
                rx={0.95}
                ry={0.95}
              />
              <Circle
                cx={eyeGeometry.left.cx + 0.25}
                cy={eyeGeometry.left.cy + 0.15}
                fill={pupilColor}
                r={0.45}
              />
              <Circle
                cx={eyeGeometry.left.cx - 0.15}
                cy={eyeGeometry.left.cy - 0.25}
                fill={faceColor}
                opacity={0.55}
                r={0.22}
              />

              {/* Right eye */}
              <AnimatedEllipse
                animatedProps={rightLidProps}
                cx={eyeGeometry.right.cx}
                cy={eyeGeometry.right.cy}
                fill={faceColor}
                opacity={0.95}
                rx={1.55}
              />
              <AnimatedEllipse
                animatedProps={irisProps}
                cx={eyeGeometry.right.cx + 0.15}
                cy={eyeGeometry.right.cy + 0.1}
                fill={irisColor}
                rx={0.95}
                ry={0.95}
              />
              <Circle
                cx={eyeGeometry.right.cx + 0.25}
                cy={eyeGeometry.right.cy + 0.15}
                fill={pupilColor}
                r={0.45}
              />
              <Circle
                cx={eyeGeometry.right.cx - 0.15}
                cy={eyeGeometry.right.cy - 0.25}
                fill={faceColor}
                opacity={0.55}
                r={0.22}
              />
            </Svg>
          </Animated.View>
        ) : null}
      </View>
    </Animated.View>
  );
}
