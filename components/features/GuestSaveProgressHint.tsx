import { useRouter } from 'expo-router';
import { Text, View } from 'react-native';

import { Button, Card } from '@/components/ui';
import { useAuth } from '@/providers/AuthProvider';
import { useThemeMode } from '@/theme';

type GuestSaveProgressHintProps = {
  variant?: 'card' | 'inline';
};

export function GuestSaveProgressHint({ variant = 'card' }: GuestSaveProgressHintProps) {
  const { session } = useAuth();
  const router = useRouter();
  const { tokens, t } = useThemeMode();

  if (session) {
    return null;
  }

  const content = (
    <View style={{ gap: tokens.spacing.space3 }}>
      <Text
        style={{
          color: tokens.colors.text.secondary,
          fontFamily: tokens.typography.fontFamily.body,
          fontSize: tokens.typography.fontSize.bodyMd,
          lineHeight: tokens.typography.fontSize.bodyMd * 1.5,
        }}>
        {t('guest.saveProgressHint')}
      </Text>
      <Button
        label={t('guest.saveProgressCta')}
        onPress={() => router.push('/auth')}
        variant={variant === 'inline' ? 'ghost' : 'primary'}
      />
    </View>
  );

  if (variant === 'inline') {
    return (
      <View
        style={{
          alignSelf: 'stretch',
          backgroundColor: tokens.colors.surface.card,
          borderColor: tokens.colors.border.subtle,
          borderRadius: tokens.radius.md,
          borderWidth: 1,
          gap: tokens.spacing.space2,
          padding: tokens.spacing.space4,
        }}>
        {content}
      </View>
    );
  }

  return (
    <Card variant="solid">
      {content}
    </Card>
  );
}
