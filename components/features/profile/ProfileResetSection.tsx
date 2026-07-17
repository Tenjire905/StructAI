import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Text, View } from 'react-native';

import { Button, Card } from '@/components/ui';
import {
  resetAllLearningProgress,
  wipeAccountDataForOnboarding,
} from '@/lib/accountReset';
import { useAuth } from '@/providers/AuthProvider';
import { useThemeMode } from '@/theme';

/**
 * Profile danger zone: reset progress only, or wipe everything and restart onboarding.
 */
export function ProfileResetSection() {
  const { tokens, t } = useThemeMode();
  const { session, signOut } = useAuth();
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const isSignedIn = Boolean(session);

  const runResetProgress = () => {
    Alert.alert(
      t('profile.resetProgressConfirmTitle'),
      t('profile.resetProgressConfirmBody'),
      [
        { text: t('profile.resetCancel'), style: 'cancel' },
        {
          text: t('profile.resetProgressConfirmAction'),
          style: 'destructive',
          onPress: () => {
            void (async () => {
              setBusy(true);
              try {
                await resetAllLearningProgress({ isSignedIn });
              } finally {
                setBusy(false);
              }
            })();
          },
        },
      ],
    );
  };

  const runWipeAccount = () => {
    Alert.alert(
      t('profile.deleteAccountConfirmTitle'),
      isSignedIn
        ? t('profile.deleteAccountConfirmBodySignedIn')
        : t('profile.deleteAccountConfirmBodyGuest'),
      [
        { text: t('profile.resetCancel'), style: 'cancel' },
        {
          text: t('profile.deleteAccountConfirmAction'),
          style: 'destructive',
          onPress: () => {
            void (async () => {
              setBusy(true);
              try {
                await wipeAccountDataForOnboarding({
                  isSignedIn,
                  signOut: isSignedIn ? signOut : undefined,
                });
                router.replace('/onboarding');
              } finally {
                setBusy(false);
              }
            })();
          },
        },
      ],
    );
  };

  return (
    <View style={{ gap: tokens.spacing.space3 }}>
      <Text
        style={{
          color: tokens.colors.text.primary,
          fontFamily: tokens.typography.fontFamily.heading,
          fontSize: tokens.typography.fontSize.headingMd,
        }}>
        {t('profile.resetSection')}
      </Text>

      <Card variant="solid">
        <View style={{ gap: tokens.spacing.space3 }}>
          <Text
            style={{
              color: tokens.colors.text.secondary,
              fontFamily: tokens.typography.fontFamily.body,
              fontSize: tokens.typography.fontSize.bodyMd,
              lineHeight: tokens.typography.fontSize.bodyMd * 1.5,
            }}>
            {t('profile.resetSectionDescription')}
          </Text>

          <Button
            disabled={busy}
            label={t('profile.resetProgressCta')}
            onPress={runResetProgress}
            variant="ghost"
          />

          <Button
            disabled={busy}
            label={t('profile.deleteAccountCta')}
            onPress={runWipeAccount}
            variant="ghost"
          />

          <Text
            style={{
              color: tokens.colors.accent.danger,
              fontFamily: tokens.typography.fontFamily.body,
              fontSize: tokens.typography.fontSize.bodySm,
              lineHeight: tokens.typography.fontSize.bodySm * 1.45,
            }}>
            {isSignedIn
              ? t('profile.deleteAccountFootnoteSignedIn')
              : t('profile.deleteAccountFootnoteGuest')}
          </Text>
        </View>
      </Card>
    </View>
  );
}
