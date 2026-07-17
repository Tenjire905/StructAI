import { Text, View } from 'react-native';

import { getShadow, useThemeMode, type CopyKey } from '@/theme';

type StatBlockProps = {
  copyKey: CopyKey;
  value: number | string;
  embedded?: boolean;
};

export function StatBlock({ copyKey, value, embedded = false }: StatBlockProps) {
  const { tokens, t } = useThemeMode();

  return (
    <View
      style={[
        embedded ? undefined : getShadow(1),
        {
          backgroundColor: embedded
            ? tokens.colors.background.elevated
            : tokens.colors.surface.card,
          borderRadius: embedded ? tokens.radius.lg : tokens.presentation.preferredCardRadius,
          flex: 1,
          gap: tokens.spacing.space1,
          minWidth: tokens.spacing.space8 * 2,
          padding: tokens.spacing.space4,
        },
      ]}>
      <Text
        style={{
          color: tokens.colors.text.primary,
          fontFamily: tokens.typography.fontFamily.display,
          fontSize: tokens.typography.fontSize.displayLg,
        }}>
        {value}
      </Text>
      <Text
        style={{
          color: tokens.colors.text.secondary,
          fontFamily: tokens.typography.fontFamily.body,
          fontSize: tokens.typography.fontSize.bodySm,
        }}>
        {t(copyKey)}
      </Text>
    </View>
  );
}
