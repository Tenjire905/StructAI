import { Pressable, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { useThemeMode } from '@/theme';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

/** Quiet tile press — barely noticeable scale, no spring bounce. */
export const PRESS_SCALE_SUBTLE = 0.985;

type PressableScaleProps = Omit<PressableProps, 'style'> & {
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
  /** Deaktiviert Press-Feedback ohne onPress zu entfernen. */
  pressFeedbackDisabled?: boolean;
};

export function PressableScale({
  children,
  onPress,
  onPressIn,
  onPressOut,
  disabled,
  pressFeedbackDisabled = false,
  style,
  ...rest
}: PressableScaleProps) {
  const { tokens } = useThemeMode();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn: PressableProps['onPressIn'] = (event) => {
    if (!disabled && !pressFeedbackDisabled && onPress) {
      scale.value = withTiming(PRESS_SCALE_SUBTLE, {
        duration: tokens.motion.duration.instant,
      });
    }
    onPressIn?.(event);
  };

  const handlePressOut: PressableProps['onPressOut'] = (event) => {
    if (!disabled && !pressFeedbackDisabled && onPress) {
      scale.value = withTiming(1, {
        duration: tokens.motion.duration.instant,
      });
    }
    onPressOut?.(event);
  };

  return (
    <AnimatedPressable
      {...rest}
      disabled={disabled}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[animatedStyle, style]}>
      {children}
    </AnimatedPressable>
  );
}
