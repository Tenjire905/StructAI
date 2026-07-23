import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { useThemeMode } from '@/theme';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type ButtonVariant = 'primary' | 'ghost';

type ButtonProps = {
  label: string;
  variant?: ButtonVariant;
  onPress?: () => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function Button({
  label,
  variant = 'primary',
  onPress,
  disabled = false,
  style,
}: ButtonProps) {
  const { tokens } = useThemeMode();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.97, tokens.motion.spring.default);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, tokens.motion.spring.default);
  };

  const content = (
    <Text
      style={{
        color:
          variant === 'primary'
            ? tokens.colors.text.onAccent
            : tokens.colors.text.primary,
        fontFamily: tokens.typography.fontFamily.bodyMedium,
        fontSize: tokens.typography.fontSize.bodyMd,
      }}>
      {label}
    </Text>
  );

  return (
    <AnimatedPressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[
        animatedStyle,
        {
          opacity: disabled ? 0.5 : 1,
          borderRadius: tokens.radius.pill,
        },
        style,
      ]}>
      {variant === 'primary' ? (
        <LinearGradient
          colors={[
            tokens.colors.accent.primary,
            tokens.colors.accent.primaryDim,
          ]}
          end={tokens.gradients.primaryButton.end}
          start={tokens.gradients.primaryButton.start}
          style={[
            styles.primary,
            {
              borderRadius: tokens.radius.pill,
              paddingHorizontal: tokens.spacing.space5,
              paddingVertical: tokens.spacing.space3,
            },
          ]}>
          {content}
        </LinearGradient>
      ) : (
        <View
          style={[
            styles.ghost,
            {
              backgroundColor:
                tokens.appearance === 'light'
                  ? tokens.colors.surface.inset
                  : 'transparent',
              borderColor:
                tokens.appearance === 'light'
                  ? tokens.colors.border.strong
                  : tokens.colors.border.subtle,
              borderRadius: tokens.radius.pill,
              paddingHorizontal: tokens.spacing.space5,
              paddingVertical: tokens.spacing.space3,
            },
          ]}>
          {content}
        </View>
      )}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  primary: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  ghost: {
    alignItems: 'center',
    borderWidth: 1,
    justifyContent: 'center',
  },
});
