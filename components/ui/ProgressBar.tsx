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

type FailedSegmentLayout = {
  key: string;
  left: number;
  width: number;
  borderRadius: number;
};

function layoutFailedSegments(
  segments: PathProgressSegment[],
  trackWidthPx: number,
  barHeight: number,
): FailedSegmentLayout[] {
  if (trackWidthPx <= 0) {
    return [];
  }

  return segments.map((segment, index) => {
    const slotWidthPx = trackWidthPx * segment.width;
    const slotLeftPx = trackWidthPx * segment.start;
    const width = Math.max(slotWidthPx, barHeight * 0.45);
    const center = slotLeftPx + slotWidthPx / 2;
    const left = Math.max(0, Math.min(trackWidthPx - width, center - width / 2));

    return {
      key: `failed-${segment.start}-${index}`,
      left,
      width,
      borderRadius: Math.min(barHeight / 2, width / 2),
    };
  });
}

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
  const failedLayouts = layoutFailedSegments(failedSegments, trackWidthPx, barHeight);

  return (
    <View
      style={[
        styles.root,
        {
          borderRadius: tokens.radius.pill,
          height: barHeight,
        },
        style,
      ]}
      onLayout={handleTrackLayout}>
      <View
        style={[
          styles.track,
          {
            backgroundColor: tokens.colors.border.subtle,
            borderRadius: tokens.radius.pill,
            height: barHeight,
          },
        ]}>
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
      </View>
      {failedLayouts.map((segment) => (
        <View
          key={segment.key}
          style={{
            backgroundColor: tokens.colors.accent.warning,
            borderRadius: segment.borderRadius,
            height: barHeight,
            left: segment.left,
            opacity: warningOpacity,
            position: 'absolute',
            top: 0,
            width: segment.width,
          }}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    position: 'relative',
    width: '100%',
  },
  track: {
    overflow: 'hidden',
    width: '100%',
  },
});
