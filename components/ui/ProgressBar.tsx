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
  /** Completed portion (0–1) for simple aggregate bars. */
  progress: number;
  /** Positional completed chapters — overrides aggregate fill when provided. */
  completedSegments?: PathProgressSegment[];
  /** Skipped/failed chapters at their path positions (not yet passed). */
  failedSegments?: PathProgressSegment[];
  color?: ProgressColor;
  /** Balkenhöhe, Default space-2 (8) – z. B. für Miniatur-Previews reduzierbar. */
  height?: number;
  style?: StyleProp<ViewStyle>;
};

type SegmentLayout = {
  key: string;
  left: number;
  width: number;
};

const MIN_SEGMENT_PX = 4;

function layoutPathSegments(
  segments: PathProgressSegment[],
  trackWidthPx: number,
  keyPrefix: string,
): SegmentLayout[] {
  if (trackWidthPx <= 0 || segments.length === 0) {
    return [];
  }

  return segments.map((segment, index) => {
    const left = trackWidthPx * segment.start;
    const width = Math.max(trackWidthPx * segment.width, MIN_SEGMENT_PX);

    return {
      key: `${keyPrefix}-${segment.start}-${index}`,
      left: Math.min(left, Math.max(0, trackWidthPx - width)),
      width: Math.min(width, trackWidthPx - left),
    };
  });
}

export function ProgressBar({
  progress,
  completedSegments,
  failedSegments = [],
  color = 'primary',
  height,
  style,
}: ProgressBarProps) {
  const { tokens } = useThemeMode();
  const barHeight = height ?? tokens.spacing.space2;
  const clampedProgress = Math.min(1, Math.max(0, progress));
  const usePositionalCompleted = completedSegments !== undefined;
  const animatedProgress = useSharedValue(clampedProgress);
  const trackWidth = useSharedValue(0);
  const [trackWidthPx, setTrackWidthPx] = useState(0);
  const isPlayful = tokens.presentation.orbStyle === 'illustrated';

  useEffect(() => {
    if (!usePositionalCompleted) {
      animatedProgress.value = withTiming(clampedProgress, {
        duration: tokens.motion.duration.medium,
      });
    }
  }, [
    animatedProgress,
    clampedProgress,
    tokens.motion.duration.medium,
    usePositionalCompleted,
  ]);

  const aggregateFillStyle = useAnimatedStyle(() => ({
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

  const warningOpacity = isPlayful ? 0.85 : 0.72;
  const completedLayouts = layoutPathSegments(
    completedSegments ?? [],
    trackWidthPx,
    'completed',
  );
  const failedLayouts = layoutPathSegments(failedSegments, trackWidthPx, 'failed');

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
        {!usePositionalCompleted ? (
          <Animated.View
            style={[
              aggregateFillStyle,
              {
                backgroundColor: fillColor,
                borderRadius: tokens.radius.pill,
                height: barHeight,
              },
            ]}
          />
        ) : null}
      </View>
      {usePositionalCompleted
        ? completedLayouts.map((segment) => (
            <View
              key={segment.key}
              style={{
                backgroundColor: fillColor,
                borderRadius: tokens.radius.pill,
                height: barHeight,
                left: segment.left,
                position: 'absolute',
                top: 0,
                width: segment.width,
              }}
            />
          ))
        : null}
      {failedLayouts.map((segment) => (
        <View
          key={segment.key}
          style={{
            backgroundColor: tokens.colors.accent.warning,
            borderRadius: tokens.radius.pill,
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
