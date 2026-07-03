import { useEffect, useState } from 'react';
import { LayoutChangeEvent, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import type { PathProgressSegment } from '@/lib/pathProgress';
import { useThemeMode } from '@/theme';

type ProgressColor = 'primary' | 'structure';

type ProgressBarProps = {
  progress: number;
  color?: ProgressColor;
  failedSegments?: PathProgressSegment[];
  /** Balkenhöhe, Default space-2 (8) – z. B. für Miniatur-Previews reduzierbar. */
  height?: number;
  style?: StyleProp<ViewStyle>;
};

export function ProgressBar({
  progress,
  color = 'primary',
  failedSegments = [],
  height,
  style,
}: ProgressBarProps) {
  const { tokens } = useThemeMode();
  const barHeight = height ?? tokens.spacing.space2;
  const clampedProgress = Math.min(1, Math.max(0, progress));
  const animatedProgress = useSharedValue(clampedProgress);
  const trackWidth = useSharedValue(0);
  const [trackWidthPx, setTrackWidthPx] = useState(0);
  const isPlayful = tokens.presentation.orbStyle === 'illustrated';

  useEffect(() => {
    animatedProgress.value = withTiming(clampedProgress, {
      duration: tokens.motion.duration.medium,
    });
  }, [animatedProgress, clampedProgress, tokens.motion.duration.medium]);

  const fillStyle = useAnimatedStyle(() => ({
    width: trackWidth.value * animatedProgress.value,
  }));

  const handleTrackLayout = (event: LayoutChangeEvent) => {
    const width = event.nativeEvent.layout.width;
    trackWidth.value = width;
    setTrackWidthPx(width);
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
          fillStyle,
          {
            backgroundColor: fillColor,
            borderRadius: tokens.radius.pill,
            height: barHeight,
          },
        ]}
      />
      {trackWidthPx > 0
        ? failedSegments.map((segment, index) => (
            <View
              key={`failed-${segment.start}-${index}`}
              style={{
                backgroundColor: tokens.colors.accent.warning,
                borderRadius: tokens.radius.pill,
                height: barHeight,
                left: trackWidthPx * segment.start,
                opacity: warningOpacity,
                position: 'absolute',
                top: 0,
                width: trackWidthPx * segment.width,
                zIndex: 1,
              }}
            />
          ))
        : null}
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    overflow: 'hidden',
    width: '100%',
  },
});
