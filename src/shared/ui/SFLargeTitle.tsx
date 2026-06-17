import { StyleSheet, Text, TextStyle } from 'react-native';

import { theme } from '../theme';

interface SFLargeTitleProps {
  children: string;
  subtitle?: string;
  titleStyle?: TextStyle;
}

export function SFLargeTitle({
  children,
  subtitle,
  titleStyle,
}: SFLargeTitleProps): React.JSX.Element {
  return (
    <>
      <Text style={[styles.title, titleStyle]}>{children}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: theme.typography.fontSize.display,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
  },
  subtitle: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.regular,
    color: theme.colors.text.muted,
    marginTop: 4,
  },
});
