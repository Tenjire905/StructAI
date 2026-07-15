import { Pressable, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { useThemeMode } from '@/theme';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

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
      scale.value = withSpring(0.97, tokens.motion.spring.default);
    }
    onPressIn?.(event);
  };

  const handlePressOut: PressableProps['onPressOut'] = (event) => {
    if (!disabled && !pressFeedbackDisabled && onPress) {
      scale.value = withSpring(1, tokens.motion.spring.default);
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
