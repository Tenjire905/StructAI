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
import Svg, { Circle, Defs, Ellipse, RadialGradient, Stop } from 'react-native-svg';

import type { OrbCompanionState } from '@/hooks/useOrbCompanionState';
import { bodyOpacityForState, IDLE_ENERGY_BEATS } from '@/lib/orbChoreography';
import {
  energyForInteraction,
  energyForState,
  mergeEnergy,
} from '@/lib/orbExpressions';
import { getShadow, useThemeMode } from '@/theme';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedEllipse = Animated.createAnimatedComponent(Ellipse);

type OrbSvgCompanionProps = {
  state: OrbCompanionState;
  size?: number;
  /**
   * Interaction beat layered on top of mood:
   * enter = Entry, watch = soft focus, react = short punch.
   */
  interaction?: 'none' | 'enter' | 'watch' | 'react';
};

function stopShared(value: SharedValue<number>, reset = 0) {
  cancelAnimation(value);
  value.value = reset;
}

/**
 * Abstract StructAI Orb — eclipse core + violet corona (Rive-style, no face).
 * Personality = light, bloom, spin rate (Idle vs Calcul), not mimik.
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

  const bodyScale = useSharedValue(1);
  const bodyOpacity = useSharedValue(bodyOpacityForState(state));
  const auraPulse = useSharedValue(energy.auraOpacity);
  const rimPulse = useSharedValue(energy.rimOpacity);
  const spin = useSharedValue(0);
  const flare = useSharedValue(0.4);
  const bloom = useSharedValue(energy.bloomBoost);
  const enterScale = useSharedValue(1);

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion);
  }, []);

  useEffect(() => {
    if (!isFocused || reduceMotion) {
      stopShared(bodyScale, 1);
      stopShared(spin, 0);
      stopShared(flare, 0.4);
      stopShared(bloom, 0);
      stopShared(enterScale, 1);
      auraPulse.value = withTiming(energy.auraOpacity * 0.7, {
        duration: tokens.motion.duration.fast,
      });
      rimPulse.value = withTiming(energy.rimOpacity * 0.7, {
        duration: tokens.motion.duration.fast,
      });
      bodyOpacity.value = withTiming(bodyOpacityForState(state), {
        duration: tokens.motion.duration.fast,
      });
      return;
    }

    const fast = tokens.motion.duration.fast;
    bodyOpacity.value = withTiming(bodyOpacityForState(state), { duration: fast });

    stopShared(bodyScale, bodyScale.value);
    stopShared(spin, spin.value);
    stopShared(flare, flare.value);
    stopShared(bloom, bloom.value);

    // Breath
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

    // Aura / rim pulse
    const auraHi = Math.min(1, energy.auraOpacity + 0.18 * amp);
    const auraLo = Math.max(0.12, energy.auraOpacity - 0.12);
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
        withTiming(Math.max(0.25, energy.rimOpacity - 0.2), {
          duration: energy.pulseMs / 2,
        }),
      ),
      -1,
      false,
    );

    // Corona spin — Idle slow, Calcul fast
    const spinMs = Math.max(1200, energy.spinMs / (isPlayful ? 1 : 1.35));
    spin.value = withRepeat(
      withTiming(1, { duration: spinMs, easing: Easing.linear }),
      -1,
      false,
    );

    bloom.value = withTiming(energy.bloomBoost * amp, { duration: fast });

    // Idle flare beats (asymmetric energy, not blinks)
    if (state === 'idle') {
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
        stopShared(bodyScale, 1);
      };
    }

    if (state === 'think') {
      flare.value = withRepeat(
        withSequence(
          withTiming(0.95, { duration: 280 }),
          withTiming(0.35, { duration: 280 }),
        ),
        -1,
        false,
      );
    } else if (state === 'celebrating') {
      flare.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 160 }),
          withTiming(0.4, { duration: 160 }),
        ),
        -1,
        false,
      );
    } else {
      flare.value = withTiming(0.55, { duration: fast });
    }

    if (interaction === 'enter') {
      enterScale.value = withSequence(
        withTiming(0.35, { duration: 1 }),
        withSpring(1.08, tokens.motion.spring.bouncy),
        withSpring(1, tokens.motion.spring.default),
      );
      bloom.value = withSequence(
        withTiming(0.7 * amp, { duration: 220 }),
        withTiming(energy.bloomBoost * amp, { duration: 500 }),
      );
    } else if (interaction === 'react') {
      enterScale.value = withSequence(
        withSpring(1.1, tokens.motion.spring.bouncy),
        withSpring(1, tokens.motion.spring.default),
      );
    } else {
      enterScale.value = withTiming(1, { duration: fast });
    }

    return () => {
      stopShared(bodyScale, 1);
    };
  }, [
    amp,
    auraPulse,
    bloom,
    bodyOpacity,
    bodyScale,
    energy,
    enterScale,
    flare,
    interaction,
    isFocused,
    isPlayful,
    reduceMotion,
    rimPulse,
    spin,
    state,
    tokens.motion.duration.fast,
    tokens.motion.spring,
  ]);

  const bodyStyle = useAnimatedStyle(() => ({
    opacity: bodyOpacity.value,
    transform: [{ scale: bodyScale.value * enterScale.value }],
  }));

  const spinStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${interpolate(spin.value, [0, 1], [0, 360])}deg` }],
  }));

  const auraProps = useAnimatedProps(() => ({
    opacity: auraPulse.value,
  }));

  const rimProps = useAnimatedProps(() => ({
    opacity: rimPulse.value,
  }));

  const flareProps = useAnimatedProps(() => ({
    opacity: interpolate(flare.value, [0, 1], [0.2, 0.95]) * (isPlayful ? 1 : 0.7),
  }));

  const bloomProps = useAnimatedProps(() => ({
    opacity: interpolate(bloom.value, [0, 1], [0.12, 0.55]),
  }));

  const primary = tokens.colors.accent.primary;
  const primaryDim = tokens.colors.accent.primaryDim;
  const structure = tokens.colors.accent.structure;
  const warning = tokens.colors.accent.warning;
  const core = tokens.colors.background.base;
  const onAccent = tokens.colors.text.onAccent;

  const glowColor = energy.warmth > 0.4 ? warning : primary;
  const coronaInner = energy.warmth > 0.4 ? warning : structure;
  const glowStyle = isPlayful ? getShadow('glow') : getShadow(1);

  return (
    <Animated.View style={[{ height: size, width: size }, glowStyle, bodyStyle]}>
      <View style={{ height: size, width: size }}>
        {/* Soft outer bloom (static layers + animated opacity) */}
        <Svg
          height={size}
          style={{ position: 'absolute' }}
          viewBox="0 0 24 24"
          width={size}>
          <Defs>
            <RadialGradient cx="50%" cy="50%" id={auraId} rx="50%" ry="50%">
              <Stop offset="0%" stopColor={glowColor} stopOpacity="0" />
              <Stop offset="55%" stopColor={glowColor} stopOpacity="0.35" />
              <Stop offset="100%" stopColor={primaryDim} stopOpacity="0" />
            </RadialGradient>
            <RadialGradient cx="50%" cy="50%" id={coronaId} rx="50%" ry="50%">
              <Stop offset="0%" stopColor={core} stopOpacity="1" />
              <Stop offset="62%" stopColor={core} stopOpacity="1" />
              <Stop offset="78%" stopColor={glowColor} stopOpacity="0.85" />
              <Stop offset="100%" stopColor={primaryDim} stopOpacity="0" />
            </RadialGradient>
          </Defs>

          <AnimatedCircle
            animatedProps={bloomProps}
            cx="12"
            cy="12"
            fill={glowColor}
            r="11.6"
          />
          <AnimatedCircle
            animatedProps={auraProps}
            cx="12"
            cy="12"
            fill={`url(#${auraId})`}
            r="11.4"
          />
          <Circle cx="12" cy="12" fill={`url(#${coronaId})`} r="10.2" />
        </Svg>

        {/* Rotating hotspot / plasma asymmetry */}
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
            spinStyle,
          ]}>
          <Svg height={size} viewBox="0 0 24 24" width={size}>
            <Defs>
              <RadialGradient cx="50%" cy="50%" id={flareId} rx="50%" ry="50%">
                <Stop offset="0%" stopColor={onAccent} stopOpacity="0.95" />
                <Stop offset="40%" stopColor={coronaInner} stopOpacity="0.7" />
                <Stop offset="100%" stopColor={glowColor} stopOpacity="0" />
              </RadialGradient>
            </Defs>
            <AnimatedEllipse
              animatedProps={flareProps}
              cx="12"
              cy="3.2"
              fill={`url(#${flareId})`}
              rx={isPlayful ? 3.2 : 2.6}
              ry={isPlayful ? 2.4 : 2.0}
            />
            <AnimatedEllipse
              animatedProps={flareProps}
              cx="19.2"
              cy="14.5"
              fill={glowColor}
              opacity={0.45}
              rx={2.1}
              ry={1.5}
            />
            <AnimatedEllipse
              animatedProps={flareProps}
              cx="4.8"
              cy="15"
              fill={primaryDim}
              opacity={0.4}
              rx={1.8}
              ry={1.3}
            />
          </Svg>
        </Animated.View>

        {/* Dark core + sharp rim (eclipse) */}
        <Svg
          height={size}
          style={{ position: 'absolute' }}
          viewBox="0 0 24 24"
          width={size}>
          <Circle cx="12" cy="12" fill={core} opacity={energy.coreOpacity} r="7.1" />
          <AnimatedCircle
            animatedProps={rimProps}
            cx="12"
            cy="12"
            fill="none"
            r="7.15"
            stroke={onAccent}
            strokeWidth={isPlayful ? 0.55 : 0.4}
          />
          <AnimatedCircle
            animatedProps={rimProps}
            cx="12"
            cy="12"
            fill="none"
            r="7.55"
            stroke={coronaInner}
            strokeOpacity={0.7}
            strokeWidth={isPlayful ? 1.1 : 0.85}
          />
        </Svg>
      </View>
    </Animated.View>
  );
}
