import { BlurView } from 'expo-blur';
import { Platform, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { getShadow, useThemeMode } from '@/theme';

type CardVariant = 'solid' | 'glass';

type CardProps = {
  children: React.ReactNode;
  variant?: CardVariant;
  style?: StyleProp<ViewStyle>;
};

export function Card({ children, variant = 'solid', style }: CardProps) {
  const { tokens } = useThemeMode();

  const cardStyle = {
    borderRadius: tokens.presentation.preferredCardRadius,
    overflow: 'hidden' as const,
    padding: tokens.presentation.preferredCardPadding,
    ...getShadow(1, tokens.appearance),
  };

  if (variant === 'glass') {
    return (
      <View style={[cardStyle, style]}>
        {Platform.OS === 'ios' ? (
          <BlurView
            intensity={tokens.blur.glassIntensity}
            style={[
              StyleSheet.absoluteFill,
              { backgroundColor: tokens.colors.surface.glass },
            ]}
            tint={tokens.appearance === 'light' ? 'light' : 'dark'}
          />
        ) : (
          <View
            style={[
              StyleSheet.absoluteFill,
              { backgroundColor: tokens.colors.surface.glass },
            ]}
          />
        )}
        <View style={styles.content}>{children}</View>
      </View>
    );
  }

  return (
    <View
      style={[
        cardStyle,
        {
          backgroundColor: tokens.colors.surface.card,
        },
        style,
      ]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    position: 'relative',
  },
});
