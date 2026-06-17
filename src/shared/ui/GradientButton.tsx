import React, { useMemo } from 'react';
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../theme';

export interface GradientButtonProps {
  label: string;
  onPress: () => void;
  gradientColors: readonly [string, string, ...string[]];
  disabled?: boolean;
}

export const GradientButton = ({
  label,
  onPress,
  gradientColors,
  disabled = false,
}: GradientButtonProps) => {
  const scale = useMemo(() => new Animated.Value(1), []);

  const handlePressIn = () => {
    if (disabled) {
      return;
    }
    Animated.spring(scale, {
      toValue: 0.97,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  };

  const handlePress = () => {
    if (disabled) {
      return;
    }
    onPress();
  };

  return (
    <Pressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
    >
      <Animated.View
        style={[
          styles.wrapper,
          { transform: [{ scale }] },
          disabled ? styles.disabled : null,
        ]}
      >
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          <Text style={styles.label}>{label}</Text>
        </LinearGradient>
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  gradient: {
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.semibold,
  },
  disabled: {
    opacity: 0.5,
  },
});
