import { Text, View } from 'react-native';

import { Button } from '@/components/ui';
import { useThemeMode } from '@/theme';

type LockedPathViewProps = {
  prerequisitePathTitle: string;
  onBack: () => void;
};

export function LockedPathView({ prerequisitePathTitle, onBack }: LockedPathViewProps) {
  const { tokens, t } = useThemeMode();

  return (
    <View
      style={{
        alignItems: 'center',
        backgroundColor: tokens.colors.background.base,
        flex: 1,
        gap: tokens.spacing.space5,
        justifyContent: 'center',
        paddingHorizontal: tokens.spacing.screenPadding,
      }}>
      <Text
        style={{
          color: tokens.colors.text.primary,
          fontFamily: tokens.typography.fontFamily.display,
          fontSize: tokens.typography.fontSize.displayLg,
          textAlign: 'center',
        }}>
        {t('paths.lockedTitle')}
      </Text>

      <Text
        style={{
          color: tokens.colors.text.secondary,
          fontFamily: tokens.typography.fontFamily.body,
          fontSize: tokens.typography.fontSize.bodyLg,
          lineHeight: tokens.typography.fontSize.bodyLg * 1.5,
          textAlign: 'center',
        }}>
        {t('paths.lockedBody', { path: prerequisitePathTitle })}
      </Text>

      <Button
        label={t('paths.lockedCta')}
        onPress={onBack}
        style={{ alignSelf: 'stretch' }}
        variant="primary"
      />
    </View>
  );
}
