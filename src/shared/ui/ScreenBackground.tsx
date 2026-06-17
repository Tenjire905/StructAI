import { LinearGradient } from 'expo-linear-gradient';
import { ReactNode } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';

import { theme } from '../theme';

interface ScreenBackgroundProps {
  children: ReactNode;
  style?: ViewStyle;
}

export function ScreenBackground({
  children,
  style,
}: ScreenBackgroundProps): React.JSX.Element {
  return (
    <View style={[styles.root, style]}>
      <LinearGradient
        colors={theme.colors.gradient.hero}
        locations={[0, 0.5, 1]}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.glowTop} />
      <View style={styles.glowBottom} />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
  glowTop: {
    position: 'absolute',
    top: -60,
    right: -30,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: theme.colors.glow.ambient,
  },
  glowBottom: {
    position: 'absolute',
    bottom: 80,
    left: -40,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: theme.colors.glow.accent,
  },
});
