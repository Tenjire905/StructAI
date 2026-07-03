import { useEffect, useState } from 'react';
import { Text, TextInput, View } from 'react-native';

import { Badge, Button, Card } from '@/components/ui';
import {
  formatSpendUsd,
  getSpendingWarning,
  readSpendingSettings,
  readSpendingTotals,
  saveSpendingSettings,
  type SpendingLimitSettings,
  type SpendingTotals,
  type SpendingWarning,
} from '@/lib/byokSpending';
import { useThemeMode } from '@/theme';

const WARNING_COPY_KEY: Record<Exclude<SpendingWarning, 'none'>, string> = {
  daily: 'profile.spendingLimitWarningDaily',
  monthly: 'profile.spendingLimitWarningMonthly',
  both: 'profile.spendingLimitWarningBoth',
};

function parseLimitInput(value: string): number | null {
  const trimmed = value.trim();

  if (trimmed.length === 0) {
    return null;
  }

  const parsed = Number.parseFloat(trimmed.replace(',', '.'));

  if (!Number.isFinite(parsed) || parsed <= 0) {
    return null;
  }

  return parsed;
}

export function SpendingLimitSettings() {
  const { tokens, t } = useThemeMode();
  const [dailyInput, setDailyInput] = useState('');
  const [monthlyInput, setMonthlyInput] = useState('');
  const [totals, setTotals] = useState<SpendingTotals>(() => readSpendingTotals());
  const [warning, setWarning] = useState<SpendingWarning>('none');

  useEffect(() => {
    const settings = readSpendingSettings();
    setDailyInput(settings.dailyLimitUsd !== null ? String(settings.dailyLimitUsd) : '');
    setMonthlyInput(settings.monthlyLimitUsd !== null ? String(settings.monthlyLimitUsd) : '');

    const nextTotals = readSpendingTotals();
    setTotals(nextTotals);
    setWarning(getSpendingWarning(settings, nextTotals));
  }, []);

  const handleSave = () => {
    const settings: SpendingLimitSettings = {
      dailyLimitUsd: parseLimitInput(dailyInput),
      monthlyLimitUsd: parseLimitInput(monthlyInput),
    };

    saveSpendingSettings(settings);
    const nextTotals = readSpendingTotals();
    setTotals(nextTotals);
    setWarning(getSpendingWarning(settings, nextTotals));
  };

  return (
    <View style={{ gap: tokens.spacing.space3 }}>
      <Text
        style={{
          color: tokens.colors.text.primary,
          fontFamily: tokens.typography.fontFamily.heading,
          fontSize: tokens.typography.fontSize.headingMd,
        }}>
        {t('profile.spendingLimitSection')}
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
            {t('profile.spendingLimitDescription')}
          </Text>

          <Text
            style={{
              color: tokens.colors.text.tertiary,
              fontFamily: tokens.typography.fontFamily.body,
              fontSize: tokens.typography.fontSize.bodySm,
              lineHeight: tokens.typography.fontSize.bodySm * 1.4,
            }}>
            {t('profile.spendingLimitDisclaimer')}
          </Text>

          <View style={{ gap: tokens.spacing.space2 }}>
            <Text
              style={{
                color: tokens.colors.text.secondary,
                fontFamily: tokens.typography.fontFamily.bodyMedium,
                fontSize: tokens.typography.fontSize.bodySm,
              }}>
              {t('profile.spendingLimitDailyLabel')}
            </Text>
            <TextInput
              keyboardType="decimal-pad"
              onChangeText={setDailyInput}
              placeholder={t('profile.spendingLimitPlaceholder')}
              placeholderTextColor={tokens.colors.text.tertiary}
              style={{
                borderColor: tokens.colors.border.strong,
                borderRadius: tokens.radius.md,
                borderWidth: 1,
                color: tokens.colors.text.primary,
                fontFamily: tokens.typography.fontFamily.mono,
                fontSize: tokens.typography.fontSize.bodyMd,
                padding: tokens.spacing.space3,
              }}
              value={dailyInput}
            />
          </View>

          <View style={{ gap: tokens.spacing.space2 }}>
            <Text
              style={{
                color: tokens.colors.text.secondary,
                fontFamily: tokens.typography.fontFamily.bodyMedium,
                fontSize: tokens.typography.fontSize.bodySm,
              }}>
              {t('profile.spendingLimitMonthlyLabel')}
            </Text>
            <TextInput
              keyboardType="decimal-pad"
              onChangeText={setMonthlyInput}
              placeholder={t('profile.spendingLimitPlaceholder')}
              placeholderTextColor={tokens.colors.text.tertiary}
              style={{
                borderColor: tokens.colors.border.strong,
                borderRadius: tokens.radius.md,
                borderWidth: 1,
                color: tokens.colors.text.primary,
                fontFamily: tokens.typography.fontFamily.mono,
                fontSize: tokens.typography.fontSize.bodyMd,
                padding: tokens.spacing.space3,
              }}
              value={monthlyInput}
            />
          </View>

          <Button label={t('profile.spendingLimitSave')} onPress={handleSave} variant="primary" />

          <View style={{ gap: tokens.spacing.space1 }}>
            <Text
              style={{
                color: tokens.colors.text.secondary,
                fontFamily: tokens.typography.fontFamily.body,
                fontSize: tokens.typography.fontSize.bodySm,
              }}>
              {t('profile.spendingLimitUsageToday', { amount: formatSpendUsd(totals.dailyUsd) })}
            </Text>
            <Text
              style={{
                color: tokens.colors.text.secondary,
                fontFamily: tokens.typography.fontFamily.body,
                fontSize: tokens.typography.fontSize.bodySm,
              }}>
              {t('profile.spendingLimitUsageMonth', { amount: formatSpendUsd(totals.monthlyUsd) })}
            </Text>
          </View>

          {warning !== 'none' ? (
            <Badge label={t(WARNING_COPY_KEY[warning])} tone="warning" />
          ) : null}
        </View>
      </Card>
    </View>
  );
}
