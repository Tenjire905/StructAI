import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { Badge, Button, Card } from '@/components/ui';
import {
  DEFAULT_PRO_BILLING_PERIOD,
  PRO_PRICE_OFFERS,
  type ProBillingPeriod,
} from '@/lib/proPricing';
import { unlockProPreview } from '@/lib/entitlements';
import { useThemeMode } from '@/theme';

type ProPaywallViewProps = {
  onClose: () => void;
  onUnlocked?: () => void;
};

/**
 * Value-first Pro paywall: Free vs Pro, clear prices, one CTA.
 * Block H IAP not wired — CTA unlocks local Pro preview with honest footnote.
 */
export function ProPaywallView({ onClose, onUnlocked }: ProPaywallViewProps) {
  const { tokens, t } = useThemeMode();
  const [period, setPeriod] = useState<ProBillingPeriod>(DEFAULT_PRO_BILLING_PERIOD);
  const [busy, setBusy] = useState(false);
  const isFocus = tokens.presentation.orbStyle === 'minimal';
  const offer = PRO_PRICE_OFFERS[period];

  const benefitKeys = [
    'pro.paywall.benefitLessons',
    'pro.paywall.benefitLabLocal',
    'pro.paywall.benefitLabLive',
    'pro.paywall.benefitCertificates',
  ] as const;

  const freeIncluded = [true, true, false, false];

  return (
    <ScrollView
      contentContainerStyle={{
        gap: tokens.presentation.preferredSectionGap,
        paddingBottom: tokens.spacing.space7,
        paddingHorizontal: tokens.spacing.screenPadding,
        paddingTop: tokens.spacing.space5,
      }}
      style={{ backgroundColor: tokens.colors.background.base, flex: 1 }}>
      <View style={{ gap: tokens.spacing.space2 }}>
        <Text
          style={{
            color: tokens.colors.accent.primary,
            fontFamily: tokens.typography.fontFamily.display,
            fontSize: tokens.typography.fontSize.headingLg,
          }}>
          {t('pro.paywall.brand')}
        </Text>
        <Text
          style={{
            color: tokens.colors.text.primary,
            fontFamily: tokens.typography.fontFamily.heading,
            fontSize: isFocus
              ? tokens.typography.fontSize.headingMd
              : tokens.typography.fontSize.headingLg,
            lineHeight:
              (isFocus
                ? tokens.typography.fontSize.headingMd
                : tokens.typography.fontSize.headingLg) * 1.25,
          }}>
          {t('pro.paywall.headline')}
        </Text>
        <Text
          style={{
            color: tokens.colors.text.secondary,
            fontFamily: tokens.typography.fontFamily.body,
            fontSize: tokens.typography.fontSize.bodyMd,
            lineHeight: tokens.typography.fontSize.bodyMd * (isFocus ? 1.4 : 1.5),
          }}>
          {t('pro.paywall.sub')}
        </Text>
      </View>

      <Card variant="solid">
        <View style={{ gap: tokens.spacing.space3 }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingBottom: tokens.spacing.space2,
            }}>
            <Text
              style={{
                color: tokens.colors.text.tertiary,
                flex: 1,
                fontFamily: tokens.typography.fontFamily.body,
                fontSize: tokens.typography.fontSize.bodySm,
              }}>
              {t('pro.paywall.compareFeature')}
            </Text>
            <Text
              style={{
                color: tokens.colors.text.tertiary,
                fontFamily: tokens.typography.fontFamily.bodyMedium,
                fontSize: tokens.typography.fontSize.bodySm,
                width: tokens.spacing.space7,
                textAlign: 'center',
              }}>
              {t('pro.planFree')}
            </Text>
            <Text
              style={{
                color: tokens.colors.accent.structure,
                fontFamily: tokens.typography.fontFamily.bodyMedium,
                fontSize: tokens.typography.fontSize.bodySm,
                width: tokens.spacing.space7,
                textAlign: 'center',
              }}>
              {t('pro.planPro')}
            </Text>
          </View>

          {benefitKeys.map((key, index) => (
            <View
              key={key}
              style={{
                borderTopColor: tokens.colors.border.subtle,
                borderTopWidth: index === 0 ? 0 : 1,
                flexDirection: 'row',
                alignItems: 'center',
                gap: tokens.spacing.space2,
                paddingTop: index === 0 ? 0 : tokens.spacing.space3,
              }}>
              <Text
                style={{
                  color: tokens.colors.text.primary,
                  flex: 1,
                  fontFamily: tokens.typography.fontFamily.body,
                  fontSize: tokens.typography.fontSize.bodySm,
                  lineHeight: tokens.typography.fontSize.bodySm * 1.4,
                }}>
                {t(key)}
              </Text>
              <Text
                style={{
                  color: freeIncluded[index]
                    ? tokens.colors.accent.success
                    : tokens.colors.text.tertiary,
                  fontFamily: tokens.typography.fontFamily.bodyMedium,
                  fontSize: tokens.typography.fontSize.bodySm,
                  width: tokens.spacing.space7,
                  textAlign: 'center',
                }}>
                {freeIncluded[index] ? t('pro.paywall.included') : t('pro.paywall.excluded')}
              </Text>
              <Text
                style={{
                  color: tokens.colors.accent.success,
                  fontFamily: tokens.typography.fontFamily.bodyMedium,
                  fontSize: tokens.typography.fontSize.bodySm,
                  width: tokens.spacing.space7,
                  textAlign: 'center',
                }}>
                {t('pro.paywall.included')}
              </Text>
            </View>
          ))}
        </View>
      </Card>

      <View style={{ flexDirection: 'row', gap: tokens.spacing.space3 }}>
        {(['monthly', 'yearly'] as const).map((option) => {
          const selected = period === option;
          const price = PRO_PRICE_OFFERS[option];
          return (
            <Pressable
              key={option}
              accessibilityRole="button"
              onPress={() => setPeriod(option)}
              style={{
                backgroundColor: tokens.colors.surface.card,
                borderColor: selected
                  ? tokens.colors.accent.primary
                  : tokens.colors.border.subtle,
                borderRadius: tokens.presentation.preferredCardRadius,
                borderWidth: selected ? 2 : 1,
                flex: 1,
                gap: tokens.spacing.space1,
                padding: tokens.presentation.preferredCardPadding,
              }}>
              {option === 'yearly' ? (
                <Badge label={t('pro.paywall.bestValue')} tone="structure" />
              ) : (
                <View style={{ height: tokens.spacing.space4 }} />
              )}
              <Text
                style={{
                  color: tokens.colors.text.primary,
                  fontFamily: tokens.typography.fontFamily.heading,
                  fontSize: tokens.typography.fontSize.bodyLg,
                }}>
                {t(option === 'monthly' ? 'pro.paywall.periodMonthly' : 'pro.paywall.periodYearly')}
              </Text>
              <Text
                style={{
                  color: tokens.colors.text.primary,
                  fontFamily: tokens.typography.fontFamily.display,
                  fontSize: tokens.typography.fontSize.headingMd,
                }}>
                {price.priceLabel}
              </Text>
              <Text
                style={{
                  color: tokens.colors.text.secondary,
                  fontFamily: tokens.typography.fontFamily.body,
                  fontSize: tokens.typography.fontSize.bodySm,
                }}>
                {option === 'yearly' && price.monthlyEquivalentLabel
                  ? t('pro.paywall.yearlyHint', { monthly: price.monthlyEquivalentLabel })
                  : t('pro.paywall.monthlyHint')}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <View style={{ gap: tokens.spacing.space3 }}>
        <Button
          disabled={busy}
          label={
            busy
              ? t('pro.paywall.ctaBusy')
              : t('pro.paywall.cta', { price: offer.priceLabel })
          }
          onPress={() => {
            void (async () => {
              setBusy(true);
              try {
                await unlockProPreview();
                onUnlocked?.();
                onClose();
              } finally {
                setBusy(false);
              }
            })();
          }}
          variant="primary"
        />
        <Text
          style={{
            color: tokens.colors.text.tertiary,
            fontFamily: tokens.typography.fontFamily.body,
            fontSize: tokens.typography.fontSize.bodySm,
            lineHeight: tokens.typography.fontSize.bodySm * 1.4,
            textAlign: 'center',
          }}>
          {t('pro.paywall.billingFootnote')}
        </Text>
        <Button label={t('pro.paywall.dismiss')} onPress={onClose} variant="ghost" />
      </View>
    </ScrollView>
  );
}
