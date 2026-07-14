import { useEffect } from 'react';
import { LayoutChangeEvent, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { useThemeMode } from '@/theme';

type ProgressColor = 'primary' | 'structure';

type ProgressBarProps = {
  /** Completed portion (0–1). */
  progress: number;
  /** Skipped/failed lessons not yet passed (0–1), rendered after progress. */
  failedRatio?: number;
  color?: ProgressColor;
  /** Balkenhöhe, Default space-2 (8) – z. B. für Miniatur-Previews reduzierbar. */
  height?: number;
  style?: StyleProp<ViewStyle>;
};

export function ProgressBar({
  progress,
  failedRatio = 0,
  color = 'primary',
  height,
  style,
}: ProgressBarProps) {
  const { tokens } = useThemeMode();
  const barHeight = height ?? tokens.spacing.space2;
  const clampedProgress = Math.min(1, Math.max(0, progress));
  const clampedFailed = Math.min(Math.max(0, failedRatio), 1 - clampedProgress);
  const animatedProgress = useSharedValue(clampedProgress);
  const animatedFailed = useSharedValue(clampedFailed);
  const trackWidth = useSharedValue(0);
  const isPlayful = tokens.presentation.orbStyle === 'illustrated';

  useEffect(() => {
    animatedProgress.value = withTiming(clampedProgress, {
      duration: tokens.motion.duration.medium,
    });
    animatedFailed.value = withTiming(clampedFailed, {
      duration: tokens.motion.duration.medium,
    });
  }, [
    animatedFailed,
    animatedProgress,
    clampedFailed,
    clampedProgress,
    tokens.motion.duration.medium,
  ]);

  const completedStyle = useAnimatedStyle(() => ({
    width: trackWidth.value * animatedProgress.value,
  }));

  const failedStyle = useAnimatedStyle(() => ({
    left: trackWidth.value * animatedProgress.value,
    width: trackWidth.value * animatedFailed.value,
  }));

  const handleTrackLayout = (event: LayoutChangeEvent) => {
    trackWidth.value = event.nativeEvent.layout.width;
  };

  const fillColor =
    color === 'structure'
      ? tokens.colors.accent.structure
      : tokens.colors.accent.primary;

  const warningOpacity = isPlayful ? 0.78 : 0.58;

  return (
    <View
      style={[
        styles.track,
        {
          backgroundColor: tokens.colors.border.subtle,
          borderRadius: tokens.radius.pill,
          height: barHeight,
        },
        style,
      ]}
      onLayout={handleTrackLayout}>
      <Animated.View
        style={[
          completedStyle,
          {
            backgroundColor: fillColor,
            borderRadius: tokens.radius.pill,
            height: barHeight,
          },
        ]}
      />
      {clampedFailed > 0 ? (
        <Animated.View
          style={[
            failedStyle,
            {
              backgroundColor: tokens.colors.accent.warning,
              height: barHeight,
              opacity: warningOpacity,
              position: 'absolute',
              top: 0,
            },
          ]}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    overflow: 'hidden',
    width: '100%',
  },
});
