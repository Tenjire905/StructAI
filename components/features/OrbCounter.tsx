import { useEffect, useState } from 'react';
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

import { getShadow, useThemeMode } from '@/theme';

import { OrbIcon } from './OrbIcon';

type OrbCounterProps = {
  count: number;
  max?: number;
};

export function OrbCounter({ count, max = 999 }: OrbCounterProps) {
  const { tokens, t } = useThemeMode();
  const animatedCount = useSharedValue(count);
  const orbScale = useSharedValue(1);
  const [displayCount, setDisplayCount] = useState(count);
  const isPlayful = tokens.presentation.orbStyle === 'illustrated';
  const energyRatio = Math.min(1, Math.max(0, count / max));

  useEffect(() => {
    animatedCount.value = withTiming(count, {
      duration: tokens.motion.duration.medium,
    });

    // withSequence statt Callback-Chaining – siehe StreakTracker (Web-Rekursion)
    if (isPlayful) {
      orbScale.value = withSequence(
        withSpring(1.08, tokens.motion.spring.bouncy),
        withSpring(1, tokens.motion.spring.default),
      );
    }
  }, [animatedCount, count, isPlayful, orbScale, tokens.motion]);

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
            <OrbIcon size={tokens.icons.sizes.lg} />
          </Animated.View>
        ) : (
          <View
            style={{
              alignItems: 'center',
              height: ringSize,
              justifyContent: 'center',
              width: ringSize,
            }}>
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
