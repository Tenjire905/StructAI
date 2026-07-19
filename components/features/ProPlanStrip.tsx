import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { Text, View } from 'react-native';

import { Button, Card } from '@/components/ui';
import { getPlanId, isProUnlocked, lockProPreview } from '@/lib/entitlements';
import { PRO_PRICE_OFFERS } from '@/lib/proPricing';
import { useThemeMode } from '@/theme';

/**
 * Profile plan strip — opens the value/pricing paywall for Free users.
 */
export function ProPlanStrip() {
  const { tokens, t } = useThemeMode();
  const router = useRouter();
  const [planId, setPlanId] = useState(getPlanId);
  const pro = planId === 'pro';
  const yearly = PRO_PRICE_OFFERS.yearly;

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
          {pro
            ? t('pro.planBodyPro')
            : t('pro.planBodyFree', {
                monthly: PRO_PRICE_OFFERS.monthly.priceLabel,
                yearly: yearly.priceLabel,
              })}
        </Text>

        {pro ? (
          <Button
            label={t('pro.previewLockCta')}
            onPress={() => {
              void (async () => {
                await lockProPreview();
                refresh();
              })();
            }}
            variant="ghost"
          />
        ) : (
          <Button
            label={t('pro.openPaywallCta')}
            onPress={() => {
              if (!isProUnlocked()) {
                router.push('/paywall');
              }
            }}
            variant="primary"
          />
        )}
      </View>
    </Card>
  );
}
