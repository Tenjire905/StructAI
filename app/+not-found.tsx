import { Link, Stack } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { useThemeMode } from '@/theme';

export default function NotFoundScreen() {
  const { tokens } = useThemeMode();

  return (
    <>
      <Stack.Screen options={{ title: 'Nicht gefunden' }} />
      <View
        style={[
          styles.container,
          { backgroundColor: tokens.colors.background.base },
        ]}>
        <Text
          style={{
            color: tokens.colors.text.primary,
            fontFamily: tokens.typography.fontFamily.heading,
            fontSize: tokens.typography.fontSize.headingLg,
          }}>
          Dieser Screen existiert nicht.
        </Text>

        <Link href="/" style={styles.link}>
          <Text
            style={{
              color: tokens.colors.accent.primary,
              fontFamily: tokens.typography.fontFamily.bodyMedium,
              fontSize: tokens.typography.fontSize.bodyMd,
            }}>
            Zur Startseite
          </Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});
