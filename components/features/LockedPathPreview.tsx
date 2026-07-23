import { Lock } from 'lucide-react-native';
import { Text, View } from 'react-native';

import { pathTitleKey } from '@/lib/pathProgress';
import { getShadow, useThemeMode } from '@/theme';

type LockedPathPreviewProps = {
  pathId: string;
};

export function LockedPathPreview({ pathId }: LockedPathPreviewProps) {
  const { tokens, t } = useThemeMode();

  return (
    <View
      style={[
        getShadow(1, tokens.appearance),
        {
          backgroundColor: tokens.colors.surface.card,
          borderColor: tokens.colors.border.subtle,
          borderRadius: tokens.presentation.preferredCardRadius,
          borderWidth: tokens.appearance === 'light' ? 1 : 0,
          gap: tokens.spacing.space2,
          opacity: 0.88,
          padding: tokens.spacing.space4,
          width: '100%',
        },
      ]}>
      <View
        style={{
          alignItems: 'center',
          flexDirection: 'row',
          gap: tokens.spacing.space2,
          justifyContent: 'space-between',
        }}>
        <Text
          style={{
            color: tokens.colors.text.tertiary,
            flex: 1,
            fontFamily: tokens.typography.fontFamily.heading,
            fontSize: tokens.typography.fontSize.bodyLg,
          }}>
          {t(pathTitleKey(pathId))}
        </Text>
        <Lock
          color={tokens.colors.text.tertiary}
          size={tokens.icons.sizes.md}
          strokeWidth={tokens.icons.strokeWidth}
        />
      </View>
      <Text
        style={{
          color: tokens.colors.text.tertiary,
          fontFamily: tokens.typography.fontFamily.body,
          fontSize: tokens.typography.fontSize.bodySm,
          lineHeight: tokens.typography.fontSize.bodySm * 1.5,
        }}>
        {t('pathPreview.lockedHint')}
      </Text>
    </View>
  );
}
