import { useEffect } from 'react';
import { type StyleProp, type ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { staggerDelay } from '@/lib/motionUtils';
import { useThemeMode } from '@/theme';

type StaggeredRevealProps = {
  children: React.ReactNode;
  index?: number;
  /** When false, content renders immediately without entry motion. */
  enabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function StaggeredReveal({
  children,
  index = 0,
  enabled = true,
  style,
}: StaggeredRevealProps) {
  const { tokens } = useThemeMode();
  const translateY = useSharedValue(enabled ? tokens.spacing.space3 : 0);
  const opacity = useSharedValue(enabled ? 0 : 1);
  const isPlayful = tokens.presentation.springPreset === 'bouncy';
  const spring = tokens.motion.spring[isPlayful ? 'bouncy' : 'default'];

  useEffect(() => {
    if (!enabled) {
      translateY.value = 0;
      opacity.value = 1;
      return;
    }

    translateY.value = tokens.spacing.space3;
    opacity.value = 0;

    const delay = staggerDelay(index, tokens.motion);

    translateY.value = withDelay(delay, withSpring(0, spring));
    opacity.value = withDelay(
      delay,
      withTiming(1, { duration: tokens.motion.duration.medium }),
    );
  }, [
    enabled,
    index,
    opacity,
    spring,
    tokens.motion,
    tokens.spacing.space3,
    translateY,
  ]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return <Animated.View style={[animatedStyle, style]}>{children}</Animated.View>;
}
