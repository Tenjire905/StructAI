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
  progress: number;
  color?: ProgressColor;
  style?: StyleProp<ViewStyle>;
};

export function ProgressBar({
  progress,
  color = 'primary',
  style,
}: ProgressBarProps) {
  const { tokens } = useThemeMode();
  const clampedProgress = Math.min(1, Math.max(0, progress));
  const animatedProgress = useSharedValue(clampedProgress);
  const trackWidth = useSharedValue(0);

  useEffect(() => {
    animatedProgress.value = withTiming(clampedProgress, {
      duration: tokens.motion.duration.medium,
    });
  }, [animatedProgress, clampedProgress, tokens.motion.duration.medium]);

  const fillStyle = useAnimatedStyle(() => ({
    width: trackWidth.value * animatedProgress.value,
  }));

  const handleTrackLayout = (event: LayoutChangeEvent) => {
    trackWidth.value = event.nativeEvent.layout.width;
  };

  const fillColor =
    color === 'structure'
      ? tokens.colors.accent.structure
      : tokens.colors.accent.primary;

  return (
    <View
      style={[
        styles.track,
        {
          backgroundColor: tokens.colors.border.subtle,
          borderRadius: tokens.radius.pill,
          height: tokens.spacing.space2,
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
            height: tokens.spacing.space2,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    overflow: 'hidden',
    width: '100%',
  },
});
