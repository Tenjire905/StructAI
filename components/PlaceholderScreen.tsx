import { StyleSheet, Text, View } from 'react-native';

import { useThemeMode } from '@/theme';

type PlaceholderScreenProps = {
  title: string;
};

export function PlaceholderScreen({ title }: PlaceholderScreenProps) {
  const { tokens } = useThemeMode();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: tokens.colors.background.base,
          paddingHorizontal: tokens.spacing.screenPadding,
        },
      ]}>
      <Text
        style={{
          color: tokens.colors.text.primary,
          fontFamily: tokens.typography.fontFamily.heading,
          fontSize: tokens.typography.fontSize.displayLg,
        }}>
        {title}
      </Text>
      <Text
        style={{
          marginTop: tokens.spacing.space2,
          color: tokens.colors.text.secondary,
          fontFamily: tokens.typography.fontFamily.body,
          fontSize: tokens.typography.fontSize.bodyMd,
        }}>
        Platzhalter-Screen
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
});
