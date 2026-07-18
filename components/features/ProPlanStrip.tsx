import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Text, View } from 'react-native';

import { Button, Card } from '@/components/ui';
import {
  getPlanId,
  isProUnlocked,
  lockProPreview,
  unlockProPreview,
} from '@/lib/entitlements';
import { useThemeMode } from '@/theme';

/**
 * Free vs Pro framing strip — no IAP yet.
 * Preview unlock is local-only so soft gates can be demoed before Block H.
 */
export function ProPlanStrip() {
  const { tokens, t } = useThemeMode();
  const [planId, setPlanId] = useState(getPlanId);
  const pro = planId === 'pro';

  const refresh = useCallback(() => {
    setPlanId(getPlanId());
  }, []);

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh]),
  );

  return (
    <Card variant="solid">
      <View style={{ gap: tokens.spacing.space3 }}>
        <View
          style={{
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'space-between',
            gap: tokens.spacing.space3,
          }}>
          <Text
            style={{
              color: tokens.colors.text.tertiary,
              fontFamily: tokens.typography.fontFamily.body,
              fontSize: tokens.typography.fontSize.bodySm,
              textTransform: 'uppercase',
            }}>
            {t('pro.planEyebrow')}
          </Text>
          <Text
            style={{
              color: pro ? tokens.colors.accent.structure : tokens.colors.text.primary,
              fontFamily: tokens.typography.fontFamily.heading,
              fontSize: tokens.typography.fontSize.bodyLg,
            }}>
            {pro ? t('pro.planPro') : t('pro.planFree')}
          </Text>
        </View>

        <Text
          style={{
            color: tokens.colors.text.secondary,
            fontFamily: tokens.typography.fontFamily.body,
            fontSize: tokens.typography.fontSize.bodySm,
            lineHeight: tokens.typography.fontSize.bodySm * 1.45,
          }}>
          {pro ? t('pro.planBodyPro') : t('pro.planBodyFree')}
        </Text>

        <Button
          label={pro ? t('pro.previewLockCta') : t('pro.previewUnlockCta')}
          onPress={() => {
            void (async () => {
              if (isProUnlocked()) {
                await lockProPreview();
              } else {
                await unlockProPreview();
              }
              refresh();
            })();
          }}
          variant="ghost"
        />
      </View>
    </Card>
  );
}
