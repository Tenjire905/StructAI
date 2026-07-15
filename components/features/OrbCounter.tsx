import { useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
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
import Svg, { Circle, G } from 'react-native-svg';

import { getShadow, useCelebration, useThemeMode } from '@/theme';
import { useOrbCompanionState } from '@/hooks/useOrbCompanionState';

import { OrbCompanion } from './OrbCompanion';

type OrbCounterProps = {
  count: number;
  max?: number;
};

export function OrbCounter({ count, max = 999 }: OrbCounterProps) {
  const { tokens, t } = useThemeMode();
  const { celebrate } = useCelebration();
  const companionState = useOrbCompanionState();
  const animatedCount = useSharedValue(count);
  const orbScale = useSharedValue(1);
  const glowOpacity = useSharedValue(0);
  const ringScale = useSharedValue(0.85);
  const ringOpacity = useSharedValue(0);
  const previousCountRef = useRef(count);
  const [displayCount, setDisplayCount] = useState(count);
  const isPlayful = tokens.presentation.orbStyle === 'illustrated';
  const energyRatio = Math.min(1, Math.max(0, count / max));
  const spring = tokens.motion.spring[tokens.presentation.springPreset];

  const runMountPulse = useCallback(() => {
    if (tokens.presentation.allowCelebrationSpring) {
      orbScale.value = withSequence(
        withSpring(1.15, tokens.motion.spring.bouncy),
        withSpring(1, tokens.motion.spring.default),
      );
    } else {
      orbScale.value = withSequence(
        withSpring(1.08, tokens.motion.spring.default),
        withSpring(1, tokens.motion.spring.default),
      );
    }

    glowOpacity.value = withSequence(
      withTiming(isPlayful ? 0.45 : 0.28, { duration: tokens.motion.duration.fast }),
      withTiming(0, { duration: tokens.motion.duration.medium }),
    );
  }, [
    glowOpacity,
    isPlayful,
    orbScale,
    tokens.motion.duration,
    tokens.motion.spring,
    tokens.presentation.allowCelebrationSpring,
  ]);

  useFocusEffect(
    useCallback(() => {
      runMountPulse();
    }, [runMountPulse]),
  );

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
          withSpring(1.15, tokens.motion.spring.bouncy),
          withSpring(1, tokens.motion.spring.default),
        );
      } else {
        orbScale.value = withSequence(
          withSpring(1.06, tokens.motion.spring.default),
          withSpring(1, tokens.motion.spring.default),
        );
      }

      if (isPlayful) {
        ringScale.value = 0.85;
        ringOpacity.value = withSequence(
          withTiming(0.5, { duration: tokens.motion.duration.instant }),
          withTiming(0, { duration: tokens.motion.duration.medium }),
        );
        ringScale.value = withSpring(1.45, spring);
      } else {
        glowOpacity.value = withSequence(
          withTiming(0.35, { duration: tokens.motion.duration.instant }),
          withTiming(0, { duration: tokens.motion.duration.medium }),
        );
      }
    }

    previousCountRef.current = count;
  }, [
    animatedCount,
    celebrate,
    count,
    glowOpacity,
    isPlayful,
    orbScale,
    ringOpacity,
    ringScale,
    spring,
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

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  const ringStyle = useAnimatedStyle(() => ({
    opacity: ringOpacity.value,
    transform: [{ scale: ringScale.value }],
  }));

  const ringSize = tokens.spacing.space7;
  const strokeWidth = tokens.spacing.space1;
  const ringRadius = (ringSize - strokeWidth) / 2;
  const center = ringSize / 2;
  const circumference = 2 * Math.PI * ringRadius;
  const strokeDashoffset = circumference * (1 - energyRatio);

  return (
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
        {isPlayful ? (
          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <Animated.View
              pointerEvents="none"
              style={[
                ringStyle,
                {
                  borderColor: tokens.colors.accent.structure,
                  borderRadius: tokens.radius.pill,
                  borderWidth: 2,
                  height: tokens.spacing.space7 * 1.2,
                  position: 'absolute',
                  width: tokens.spacing.space7 * 1.2,
                },
              ]}
            />
            <Animated.View
              pointerEvents="none"
              style={[
                glowStyle,
                {
                  backgroundColor: tokens.colors.accent.structure,
                  borderRadius: tokens.radius.pill,
                  height: tokens.spacing.space7,
                  position: 'absolute',
                  width: tokens.spacing.space7,
                },
              ]}
            />
            <Animated.View
              style={[
                orbAnimatedStyle,
                getShadow('glow'),
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
          </View>
        ) : (
          <View style={{ alignItems: 'center', flexDirection: 'row', gap: tokens.spacing.space2 }}>
            <View
              style={{
                alignItems: 'center',
                height: ringSize,
                justifyContent: 'center',
                width: ringSize,
              }}>
              <Animated.View
                pointerEvents="none"
                style={[
                  glowStyle,
                  {
                    backgroundColor: tokens.colors.accent.primary,
                    borderRadius: tokens.radius.pill,
                    height: ringSize,
                    position: 'absolute',
                    width: ringSize,
                  },
                ]}
              />
              <Svg height={ringSize} width={ringSize}>
                <Circle
                  cx={center}
                  cy={center}
                  fill="none"
                  r={ringRadius}
                  stroke={tokens.colors.border.subtle}
                  strokeWidth={strokeWidth}
                />
                <G transform={`rotate(-90 ${center} ${center})`}>
                  <Circle
                    cx={center}
                    cy={center}
                    fill="none"
                    r={ringRadius}
                    stroke={tokens.colors.accent.primary}
                    strokeDasharray={`${circumference} ${circumference}`}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    strokeWidth={strokeWidth}
                  />
                </G>
              </Svg>
              <Text
                style={{
                  color: tokens.colors.text.primary,
                  fontFamily: tokens.typography.fontFamily.mono,
                  fontSize: tokens.typography.fontSize.bodySm,
                  position: 'absolute',
                }}>
                {Math.round(energyRatio * 100)}
              </Text>
            </View>
            <Animated.View style={orbAnimatedStyle}>
              <OrbCompanion size={tokens.icons.sizes.lg} state={companionState} />
            </Animated.View>
          </View>
        )}

        <Text
          style={{
            color: tokens.colors.text.primary,
            fontFamily: tokens.typography.fontFamily.display,
            fontSize: tokens.typography.fontSize.displayLg,
          }}>
          {displayCount}
        </Text>
      </View>
    </View>
  );
}
