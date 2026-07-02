import { BlurView } from 'expo-blur';
import { ReactNode, useMemo } from 'react';
import {
  Animated,
  Pressable,
  StyleProp,
  StyleSheet,
  ViewStyle,
} from 'react-native';

import { theme } from '../theme';

export interface GlassCardProps {
  children: ReactNode;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  accentColor?: string;
}

export function GlassCard({
  children,
  onPress,
  style,
  accentColor,
}: GlassCardProps): React.JSX.Element {
  const scale = useMemo(() => new Animated.Value(1), []);
  const borderColor = accentColor ?? theme.colors.border.subtle;

  const handlePressIn = (): void => {
    Animated.spring(scale, {
      toValue: 0.97,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  };

  const handlePressOut = (): void => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  };

  const card = (
    <Animated.View
      style={[
        styles.card,
        {
          borderColor,
          transform: [{ scale }],
          shadowColor: accentColor ?? theme.colors.accent.everyday,
        },
        accentColor ? styles.glow : null,
        style,
      ]}
    >
      <BlurView intensity={50} tint="dark" style={styles.blur}>
        {children}
      </BlurView>
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
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 24,
    borderWidth: 1,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 6,
  },
  glow: {
    shadowOpacity: 0.4,
  },
  blur: {
    backgroundColor: theme.colors.background.card,
    padding: 16,
  },
});
