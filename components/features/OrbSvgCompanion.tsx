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
import { bodyOpacityForState, IDLE_ENERGY_BEATS } from '@/lib/orbChoreography';
import {
  energyForInteraction,
  energyForState,
  mergeEnergy,
  waveDashForSegments,
} from '@/lib/orbExpressions';
import { getShadow, useThemeMode } from '@/theme';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedEllipse = Animated.createAnimatedComponent(Ellipse);

type OrbSvgCompanionProps = {
  state: OrbCompanionState;
  size?: number;
  interaction?: 'none' | 'enter' | 'watch' | 'react';
};

function stopShared(value: SharedValue<number>, reset = 0) {
  cancelAnimation(value);
  value.value = reset;
}

/** Cancel every looping shared value — partial cleanup crashes Expo Go on unmount. */
function stopAllOrbMotion(values: {
  bodyScale: SharedValue<number>;
  bodyOpacity: SharedValue<number>;
  auraPulse: SharedValue<number>;
  rimPulse: SharedValue<number>;
  spin: SharedValue<number>;
  counterSpin: SharedValue<number>;
  flare: SharedValue<number>;
  bloom: SharedValue<number>;
  enterScale: SharedValue<number>;
  waveRx: SharedValue<number>;
  waveRy: SharedValue<number>;
  lobe: SharedValue<number>;
  dashPhase: SharedValue<number>;
}) {
  stopShared(values.bodyScale, 1);
  stopShared(values.bodyOpacity, values.bodyOpacity.value);
  stopShared(values.auraPulse, values.auraPulse.value);
  stopShared(values.rimPulse, values.rimPulse.value);
  stopShared(values.spin, 0);
  stopShared(values.counterSpin, 0);
  stopShared(values.flare, 0.4);
  stopShared(values.bloom, 0);
  stopShared(values.enterScale, 1);
  stopShared(values.waveRx, values.waveRx.value);
  stopShared(values.waveRy, values.waveRy.value);
  stopShared(values.lobe, values.lobe.value);
  stopShared(values.dashPhase, 0);
}

/**
 * Abstract StructAI Orb — multi-layer plasma waves (Rive-like), no face.
 * Situations change spin direction/speed, dash density, and ellipse form.
 */
export function OrbSvgCompanion({
  state,
  size = 24,
  interaction = 'none',
}: OrbSvgCompanionProps) {
  const { tokens } = useThemeMode();
  const isFocused = useIsFocused();
  const auraId = useId().replace(/:/g, '');
  const coronaId = useId().replace(/:/g, '');
  const flareId = useId().replace(/:/g, '');
  const [reduceMotion, setReduceMotion] = useState(false);
  const isPlayful =
    !reduceMotion && tokens.presentation.orbStyle === 'illustrated';
  const amp = isPlayful ? 1 : 0.55;

  const energy = useMemo(
    () => mergeEnergy(energyForState(state), energyForInteraction(interaction)),
    [interaction, state],
  );

  const waveDash = useMemo(
    () => waveDashForSegments(energy.waveSegments),
    [energy.waveSegments],
  );

  const bodyScale = useSharedValue(1);
  const bodyOpacity = useSharedValue(bodyOpacityForState(state));
  const auraPulse = useSharedValue(energy.auraOpacity);
  const rimPulse = useSharedValue(energy.rimOpacity);
  const spin = useSharedValue(0);
  const counterSpin = useSharedValue(0);
  const flare = useSharedValue(0.4);
  const bloom = useSharedValue(energy.bloomBoost);
  const enterScale = useSharedValue(1);
  const waveRx = useSharedValue(energy.waveRx);
  const waveRy = useSharedValue(energy.waveRy);
  const lobe = useSharedValue(energy.lobeStrength);
  const dashPhase = useSharedValue(0);

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion);
  }, []);

  useEffect(() => {
    const motionValues = {
      bodyScale,
      bodyOpacity,
      auraPulse,
      rimPulse,
      spin,
      counterSpin,
      flare,
      bloom,
      enterScale,
      waveRx,
      waveRy,
      lobe,
      dashPhase,
    };

    if (!isFocused || reduceMotion) {
      stopAllOrbMotion(motionValues);
      waveRx.value = withTiming(energy.waveRx, { duration: tokens.motion.duration.fast });
      waveRy.value = withTiming(energy.waveRy, { duration: tokens.motion.duration.fast });
      lobe.value = withTiming(energy.lobeStrength * 0.5, {
        duration: tokens.motion.duration.fast,
      });
      auraPulse.value = withTiming(energy.auraOpacity * 0.7, {
        duration: tokens.motion.duration.fast,
      });
      rimPulse.value = withTiming(energy.rimOpacity * 0.7, {
        duration: tokens.motion.duration.fast,
      });
      bodyOpacity.value = withTiming(bodyOpacityForState(state), {
        duration: tokens.motion.duration.fast,
      });
      return () => {
        stopAllOrbMotion(motionValues);
      };
    }

    const fast = tokens.motion.duration.fast;
    bodyOpacity.value = withTiming(bodyOpacityForState(state), { duration: fast });
    waveRx.value = withSpring(energy.waveRx, tokens.motion.spring.default);
    waveRy.value = withSpring(energy.waveRy, tokens.motion.spring.default);
    lobe.value = withTiming(energy.lobeStrength * amp, { duration: fast });

    stopShared(bodyScale, bodyScale.value);
    stopShared(spin, spin.value);
    stopShared(counterSpin, counterSpin.value);
    stopShared(flare, flare.value);
    stopShared(bloom, bloom.value);
    stopShared(dashPhase, dashPhase.value);

    const peak = 1 + (energy.breathPeak - 1) * amp;
    bodyScale.value = withRepeat(
      withSequence(
        withTiming(peak, {
          duration: energy.pulseMs / 2,
          easing: Easing.inOut(Easing.sin),
        }),
        withTiming(1, {
          duration: energy.pulseMs / 2,
          easing: Easing.inOut(Easing.sin),
        }),
      ),
      -1,
      false,
    );

    const auraHi = Math.min(1, energy.auraOpacity + 0.2 * amp);
    const auraLo = Math.max(0.12, energy.auraOpacity - 0.14);
    auraPulse.value = withRepeat(
      withSequence(
        withTiming(auraHi, {
          duration: energy.pulseMs / 2,
          easing: Easing.inOut(Easing.quad),
        }),
        withTiming(auraLo, {
          duration: energy.pulseMs / 2,
          easing: Easing.inOut(Easing.quad),
        }),
      ),
      -1,
      false,
    );

    rimPulse.value = withRepeat(
      withSequence(
        withTiming(Math.min(1, energy.rimOpacity), {
          duration: energy.pulseMs / 2,
        }),
        withTiming(Math.max(0.25, energy.rimOpacity - 0.22), {
          duration: energy.pulseMs / 2,
        }),
      ),
      -1,
      false,
    );

    const spinMs = Math.max(1100, energy.spinMs / (isPlayful ? 1 : 1.35));
    const counterMs = Math.max(900, energy.counterSpinMs / (isPlayful ? 1 : 1.35));
    spin.value = withRepeat(
      withTiming(1, { duration: spinMs, easing: Easing.linear }),
      -1,
      false,
    );
    counterSpin.value = withRepeat(
      withTiming(1, { duration: counterMs, easing: Easing.linear }),
      -1,
      false,
    );
    dashPhase.value = withRepeat(
      withTiming(1, { duration: spinMs * 0.85, easing: Easing.linear }),
      -1,
      false,
    );

    bloom.value = withTiming(energy.bloomBoost * amp, { duration: fast });

    // Soft morph of wave ellipse during idle
    if (state === 'idle') {
      waveRx.value = withRepeat(
        withSequence(
          withTiming(energy.waveRx + 0.35 * amp, {
            duration: 2800,
            easing: Easing.inOut(Easing.sin),
          }),
          withTiming(energy.waveRx - 0.25 * amp, {
            duration: 2800,
            easing: Easing.inOut(Easing.sin),
          }),
        ),
        -1,
        false,
      );
      waveRy.value = withRepeat(
        withSequence(
          withTiming(energy.waveRy - 0.3 * amp, {
            duration: 2800,
            easing: Easing.inOut(Easing.sin),
          }),
          withTiming(energy.waveRy + 0.35 * amp, {
            duration: 2800,
            easing: Easing.inOut(Easing.sin),
          }),
        ),
        -1,
        false,
      );

      let step = 0;
      let timer: ReturnType<typeof setTimeout> | undefined;
      let cancelled = false;
      const run = () => {
        if (cancelled) {
          return;
        }
        const beat = IDLE_ENERGY_BEATS[step % IDLE_ENERGY_BEATS.length];
        flare.value = withTiming(beat.flare, {
          duration: 480,
          easing: Easing.inOut(Easing.sin),
        });
        step += 1;
        timer = setTimeout(run, beat.holdMs);
      };
      run();
      return () => {
        cancelled = true;
        if (timer) {
          clearTimeout(timer);
        }
        stopAllOrbMotion(motionValues);
      };
    }

    if (state === 'think') {
      flare.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 220 }),
          withTiming(0.3, { duration: 220 }),
        ),
        -1,
        false,
      );
      waveRx.value = withRepeat(
        withSequence(
          withTiming(energy.waveRx + 0.5, { duration: 500, easing: Easing.inOut(Easing.sin) }),
          withTiming(energy.waveRx - 0.2, { duration: 500, easing: Easing.inOut(Easing.sin) }),
        ),
        -1,
        false,
      );
    } else if (state === 'celebrating') {
      flare.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 140 }),
          withTiming(0.35, { duration: 140 }),
        ),
        -1,
        false,
      );
    } else {
      flare.value = withTiming(0.55, { duration: fast });
    }

    if (interaction === 'enter') {
      enterScale.value = withSequence(
        withTiming(0.28, { duration: 1 }),
        withSpring(1.1, tokens.motion.spring.bouncy),
        withSpring(1, tokens.motion.spring.default),
      );
      bloom.value = withSequence(
        withTiming(0.75 * amp, { duration: 220 }),
        withTiming(energy.bloomBoost * amp, { duration: 500 }),
      );
    } else if (interaction === 'react') {
      enterScale.value = withSequence(
        withSpring(1.12, tokens.motion.spring.bouncy),
        withSpring(1, tokens.motion.spring.default),
      );
    } else {
      enterScale.value = withTiming(1, { duration: fast });
    }

    return () => {
      stopAllOrbMotion(motionValues);
    };
  }, [
    amp,
    auraPulse,
    bloom,
    bodyOpacity,
    bodyScale,
    counterSpin,
    dashPhase,
    energy,
    enterScale,
    flare,
    interaction,
    isFocused,
    isPlayful,
    lobe,
    reduceMotion,
    rimPulse,
    spin,
    state,
    tokens.motion.duration.fast,
    tokens.motion.spring,
    waveRx,
    waveRy,
  ]);

  const bodyStyle = useAnimatedStyle(() => ({
    opacity: bodyOpacity.value,
    transform: [{ scale: bodyScale.value * enterScale.value }],
  }));

  const spinStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${interpolate(spin.value, [0, 1], [0, 360])}deg` }],
  }));

  const counterSpinStyle = useAnimatedStyle(() => ({
    transform: [
      { rotate: `${interpolate(counterSpin.value, [0, 1], [0, -360])}deg` },
    ],
  }));

  const auraProps = useAnimatedProps(() => ({
    opacity: auraPulse.value,
  }));

  const rimProps = useAnimatedProps(() => ({
    opacity: rimPulse.value,
  }));

  const flareProps = useAnimatedProps(() => ({
    opacity: interpolate(flare.value, [0, 1], [0.15, 0.95]) * (isPlayful ? 1 : 0.7),
  }));

  const bloomProps = useAnimatedProps(() => ({
    opacity: interpolate(bloom.value, [0, 1], [0.1, 0.55]),
  }));

  const primaryWaveProps = useAnimatedProps(() => ({
    opacity: interpolate(lobe.value, [0, 1], [0.25, 0.9]),
    rx: waveRx.value,
    ry: waveRy.value,
    strokeDashoffset: interpolate(dashPhase.value, [0, 1], [0, 36]),
  }));

  const secondaryWaveProps = useAnimatedProps(() => ({
    opacity: interpolate(lobe.value, [0, 1], [0.15, 0.7]),
    rx: waveRy.value * 0.98,
    ry: waveRx.value * 0.96,
    strokeDashoffset: interpolate(dashPhase.value, [0, 1], [0, -28]),
  }));

  const lobeAProps = useAnimatedProps(() => ({
    opacity: interpolate(flare.value, [0, 1], [0.2, 0.85]) * lobe.value,
  }));

  const primary = tokens.colors.accent.primary;
  const primaryDim = tokens.colors.accent.primaryDim;
  const warning = tokens.colors.accent.warning;
  const core = tokens.colors.background.base;
  const onAccent = tokens.colors.text.onAccent;

  // Warmth (worry/low_energy) → warning only. Never accent-structure here —
  // cyan is scoring-only and read as a stray “green particle” on orange orbs.
  const glowColor = energy.warmth > 0.4 ? warning : primary;
  const coronaInner = energy.warmth > 0.4 ? warning : primaryDim;
  const glowStyle = isPlayful ? getShadow('glow') : getShadow(1);
  const strokeW = energy.waveStroke * (isPlayful ? 1 : 0.75);

  return (
    <Animated.View style={[{ height: size, width: size }, glowStyle, bodyStyle]}>
      <View style={{ height: size, width: size }}>
        <Svg
          height={size}
          style={{ position: 'absolute' }}
          viewBox="0 0 24 24"
          width={size}>
          <Defs>
            <RadialGradient cx="50%" cy="50%" id={auraId} rx="50%" ry="50%">
              <Stop offset="0%" stopColor={glowColor} stopOpacity="0" />
              <Stop offset="52%" stopColor={glowColor} stopOpacity="0.4" />
              <Stop offset="100%" stopColor={primaryDim} stopOpacity="0" />
            </RadialGradient>
            <RadialGradient cx="50%" cy="50%" id={coronaId} rx="50%" ry="50%">
              <Stop offset="0%" stopColor={core} stopOpacity="1" />
              <Stop offset="58%" stopColor={core} stopOpacity="1" />
              <Stop offset="76%" stopColor={glowColor} stopOpacity="0.9" />
              <Stop offset="100%" stopColor={primaryDim} stopOpacity="0" />
            </RadialGradient>
          </Defs>

          <AnimatedCircle
            animatedProps={bloomProps}
            cx="12"
            cy="12"
            fill={glowColor}
            r="11.7"
          />
          <AnimatedCircle
            animatedProps={auraProps}
            cx="12"
            cy="12"
            fill={`url(#${auraId})`}
            r="11.5"
          />
          <Circle cx="12" cy="12" fill={`url(#${coronaId})`} r="10.3" />
        </Svg>

        {/* Primary plasma wave — clockwise */}
        <Animated.View
          pointerEvents="none"
          style={[
            { height: size, left: 0, position: 'absolute', top: 0, width: size },
            spinStyle,
          ]}>
          <Svg height={size} viewBox="0 0 24 24" width={size}>
            <Defs>
              <RadialGradient cx="50%" cy="50%" id={flareId} rx="50%" ry="50%">
                <Stop offset="0%" stopColor={onAccent} stopOpacity="1" />
                <Stop offset="35%" stopColor={coronaInner} stopOpacity="0.75" />
                <Stop offset="100%" stopColor={glowColor} stopOpacity="0" />
              </RadialGradient>
            </Defs>

            <AnimatedEllipse
              animatedProps={primaryWaveProps}
              cx="12"
              cy="12"
              fill="none"
              stroke={glowColor}
              strokeDasharray={waveDash}
              strokeLinecap="round"
              strokeWidth={strokeW}
            />

            <AnimatedEllipse
              animatedProps={lobeAProps}
              cx="12"
              cy="2.6"
              fill={`url(#${flareId})`}
              rx={isPlayful ? 3.6 : 2.8}
              ry={isPlayful ? 2.6 : 2.0}
            />
            <AnimatedEllipse
              animatedProps={lobeAProps}
              cx="20.2"
              cy="13.2"
              fill={coronaInner}
              rx={2.4}
              ry={1.7}
            />
            <AnimatedEllipse
              animatedProps={lobeAProps}
              cx="4.2"
              cy="15.2"
              fill={primaryDim}
              rx={2.1}
              ry={1.5}
            />
            <AnimatedEllipse
              animatedProps={flareProps}
              cx="16.5"
              cy="5.5"
              fill={onAccent}
              rx={1.3}
              ry={0.9}
            />
          </Svg>
        </Animated.View>

        {/* Counter-rotating secondary wave — opposite form */}
        <Animated.View
          pointerEvents="none"
          style={[
            { height: size, left: 0, position: 'absolute', top: 0, width: size },
            counterSpinStyle,
          ]}>
          <Svg height={size} viewBox="0 0 24 24" width={size}>
            <AnimatedEllipse
              animatedProps={secondaryWaveProps}
              cx="12"
              cy="12"
              fill="none"
              stroke={coronaInner}
              strokeDasharray={waveDashForSegments(
                Math.max(2, energy.waveSegments - 2),
              )}
              strokeLinecap="round"
              strokeWidth={strokeW * 0.7}
            />
            <AnimatedEllipse
              animatedProps={flareProps}
              cx="12"
              cy="21.2"
              fill={glowColor}
              rx={2.0}
              ry={1.4}
            />
            <AnimatedEllipse
              animatedProps={flareProps}
              cx="3.5"
              cy="9"
              fill={glowColor}
              opacity={0.45}
              rx={1.6}
              ry={1.1}
            />
          </Svg>
        </Animated.View>

        {/* Eclipse core + rim */}
        <Svg
          height={size}
          style={{ position: 'absolute' }}
          viewBox="0 0 24 24"
          width={size}>
          <Circle cx="12" cy="12" fill={core} opacity={energy.coreOpacity} r="6.95" />
          <AnimatedCircle
            animatedProps={rimProps}
            cx="12"
            cy="12"
            fill="none"
            r="7.0"
            stroke={onAccent}
            strokeWidth={isPlayful ? 0.6 : 0.42}
          />
          <AnimatedCircle
            animatedProps={rimProps}
            cx="12"
            cy="12"
            fill="none"
            r="7.45"
            stroke={coronaInner}
            strokeOpacity={0.75}
            strokeWidth={isPlayful ? 1.15 : 0.85}
          />
        </Svg>
      </View>
    </Animated.View>
  );
}
