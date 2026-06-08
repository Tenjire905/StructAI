import React, { useRef } from 'react';
import {
  Animated,
  Pressable,
  StyleProp,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { theme } from '../theme';

export interface PressableCardProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  accentColor?: string;
}

const PressableCardComponent = ({
  children,
  onPress,
  style,
  accentColor,
}: PressableCardProps) => {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
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

  const borderColor = accentColor ?? theme.colors.border.subtle;

  const card = (
    <Animated.View
      style={[
        styles.card,
        { borderColor, transform: [{ scale }] },
        accentColor ? styles.accentGlow : null,
        accentColor ? { shadowColor: accentColor } : null,
        style,
      ]}
    >
      {children}
    </Animated.View>
  );

  if (!onPress) {
    return card;
  }

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      accessibilityRole="button"
    >
      {card}
    </Pressable>
  );
};

export const PressableCard = React.memo(PressableCardComponent);

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    backgroundColor: theme.colors.background.card,
    borderWidth: 1,
    padding: 16,
  },
  accentGlow: {
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 4,
  },
});
