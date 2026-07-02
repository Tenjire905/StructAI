import { Text, View } from 'react-native';

import { getShadow, useThemeMode, type CopyKey } from '@/theme';

type StatBlockProps = {
  copyKey: CopyKey;
  value: number | string;
};

export function StatBlock({ copyKey, value }: StatBlockProps) {
  const { tokens, t } = useThemeMode();

  return (
    <View
      style={[
        getShadow(1),
        {
          backgroundColor: tokens.colors.surface.card,
          borderRadius: tokens.presentation.preferredCardRadius,
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
