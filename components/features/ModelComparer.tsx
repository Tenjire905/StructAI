import * as Clipboard from 'expo-clipboard';
import { Check, Copy } from 'lucide-react-native';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';

import { PromptLabTextInput } from '@/components/features/PromptLabTextInput';
import { Badge, Button, Card, PressableScale } from '@/components/ui';
import {
  getSpendingWarning,
  readSpendingSettings,
  readSpendingTotals,
  recordEstimatedSpend,
  type SpendingWarning,
} from '@/lib/byokSpending';
import { hapticPromptLabResult } from '@/lib/haptics';
import {
  comparePromptAcrossModels,
  getCompareModelLabel,
  mockComparePromptAcrossModels,
  type CompareModelResult,
} from '@/lib/modelCompare';
import {
  buildCompareInsightsByProvider,
  type CompareInsight,
} from '@/lib/modelCompareInsights';
import type { ByokKeyEntry, ByokProvider } from '@/lib/secureKeyStore';
import { useThemeMode } from '@/theme';

type ModelComparerProps = {
  availableKeys: ByokKeyEntry[];
  useMockCompare?: boolean;
  initialPrompt?: string;
  autoRunMockCompare?: boolean;
};

const ERROR_COPY_KEY = {
  invalidKey: 'modelComparer.errorInvalidKey',
  quota: 'modelComparer.errorQuota',
  network: 'modelComparer.errorNetwork',
  generic: 'modelComparer.errorGeneric',
} as const;

const SPENDING_WARNING_COPY_KEY: Record<Exclude<SpendingWarning, 'none'>, string> = {
  daily: 'modelComparer.spendingWarningDaily',
  monthly: 'modelComparer.spendingWarningMonthly',
  both: 'modelComparer.spendingWarningBoth',
};

function formatLatencySeconds(latencyMs: number): string {
  return (latencyMs / 1000).toFixed(1);
}

function formatEstimatedCost(usd: number): string {
  if (usd < 0.0001) {
    return '< $0.0001';
  }

  if (usd < 0.01) {
    return `$${usd.toFixed(4)}`;
  }

  return `$${usd.toFixed(3)}`;
}

export function ModelComparer({
  availableKeys,
  useMockCompare = false,
  initialPrompt = '',
  autoRunMockCompare = false,
}: ModelComparerProps) {
  const { tokens, t } = useThemeMode();
  const { width: windowWidth } = useWindowDimensions();
  const [promptInput, setPromptInput] = useState(initialPrompt);
  const [selectedProviders, setSelectedProviders] = useState<ByokProvider[]>([]);
  const [results, setResults] = useState<CompareModelResult[] | null>(null);
  const [isComparing, setIsComparing] = useState(false);
  const [spendingWarning, setSpendingWarning] = useState<SpendingWarning>('none');

  const availableProviders = useMemo(
    () => availableKeys.map((entry) => entry.provider),
    [availableKeys],
  );

  useEffect(() => {
    setSpendingWarning(
      getSpendingWarning(readSpendingSettings(), readSpendingTotals()),
    );
  }, []);

  const applyCompareResults = useCallback((nextResults: CompareModelResult[]) => {
    const estimatedRunCost = nextResults.reduce((sum, result) => {
      if (result.status !== 'success') {
        return sum;
      }

      return sum + result.estimatedCostUsd;
    }, 0);

    if (estimatedRunCost > 0) {
      recordEstimatedSpend(estimatedRunCost);
    }

    setResults(nextResults);
    setSpendingWarning(
      getSpendingWarning(readSpendingSettings(), readSpendingTotals()),
    );

    const hasSuccess = nextResults.some((result) => result.status === 'success');

    if (hasSuccess) {
      hapticPromptLabResult('success');
    } else {
      // Nur bei klarer Nutzerursache (ungültiger/limitierter Key) als echten
      // Fehler werten; Netzwerkrauschen bekommt laut Haptics Map v1 höchstens
      // ein sehr leichtes Warning statt eines Error-Impulses.
      const isUserCaused = nextResults.some(
        (result) =>
          result.status === 'error' &&
          (result.reason === 'invalidKey' || result.reason === 'quota'),
      );

      hapticPromptLabResult('failure', isUserCaused ? 'user' : 'network');
    }
  }, []);

  useEffect(() => {
    setSelectedProviders((current) => {
      const stillValid = current.filter((provider) => availableProviders.includes(provider));

      if (stillValid.length >= 2) {
        return stillValid.slice(0, 3);
      }

      return availableProviders.slice(0, Math.min(3, Math.max(2, availableProviders.length)));
    });
  }, [availableProviders]);

  useEffect(() => {
    if (!autoRunMockCompare || !useMockCompare || availableProviders.length < 2) {
      return;
    }

    let cancelled = false;

    void (async () => {
      const prompt = initialPrompt.trim();

      if (prompt.length === 0) {
        return;
      }

      setIsComparing(true);
      setResults(null);

      const providers = availableProviders.slice(0, Math.min(3, availableProviders.length));
      const targets = providers
        .map((provider) => {
          const entry = availableKeys.find((item) => item.provider === provider);
          return entry ? { provider, apiKey: entry.key } : null;
        })
        .filter((target): target is { provider: ByokProvider; apiKey: string } => target !== null);

      const nextResults = await mockComparePromptAcrossModels(prompt, targets);

      if (!cancelled) {
        setSelectedProviders(providers);
        applyCompareResults(nextResults);
        setIsComparing(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [
    autoRunMockCompare,
    availableKeys,
    availableProviders,
    initialPrompt,
    useMockCompare,
    applyCompareResults,
  ]);

  const toggleProvider = useCallback(
    (provider: ByokProvider) => {
      setSelectedProviders((current) => {
        if (current.includes(provider)) {
          if (current.length <= 2) {
            return current;
          }

          return current.filter((item) => item !== provider);
        }

        if (current.length >= 3) {
          return [...current.slice(1), provider];
        }

        return [...current, provider];
      });
    },
    [],
  );

  const canCompare =
    promptInput.trim().length > 0 &&
    selectedProviders.length >= 2 &&
    !isComparing &&
    availableProviders.length >= 2;

  const resultInsights = useMemo(
    () => (results ? buildCompareInsightsByProvider(results) : new Map<string, CompareInsight>()),
    [results],
  );

  const handleCompare = async () => {
    if (!canCompare) {
      return;
    }

    setIsComparing(true);
    setResults(null);

    const targets = selectedProviders
      .map((provider) => {
        const entry = availableKeys.find((item) => item.provider === provider);
        return entry ? { provider, apiKey: entry.key } : null;
      })
      .filter((target): target is { provider: ByokProvider; apiKey: string } => target !== null);

    const compareFn = useMockCompare ? mockComparePromptAcrossModels : comparePromptAcrossModels;
    const nextResults = await compareFn(promptInput.trim(), targets);

    applyCompareResults(nextResults);
    setIsComparing(false);
  };

  // Zwei Modelle nebeneinander wären auf ~390 px zu schmal für Antworttext.
  // Horizontal scrollbare Karten (~85 % Viewport) für 2 und 3 Modelle.
  const cardWidth = Math.max(280, windowWidth * 0.85 - tokens.spacing.screenPadding);

  if (availableProviders.length < 2) {
    return (
      <Card variant="solid">
        <Text
          style={{
            color: tokens.colors.text.secondary,
            fontFamily: tokens.typography.fontFamily.body,
            fontSize: tokens.typography.fontSize.bodyMd,
            lineHeight: tokens.typography.fontSize.bodyMd * 1.5,
          }}>
          {t('modelComparer.needTwoKeys')}
        </Text>
      </Card>
    );
  }

  return (
    <View style={{ gap: tokens.spacing.space4 }}>
      <Text
        style={{
          color: tokens.colors.text.secondary,
          fontFamily: tokens.typography.fontFamily.body,
          fontSize: tokens.typography.fontSize.bodyMd,
          lineHeight: tokens.typography.fontSize.bodyMd * 1.5,
        }}>
        {t('modelComparer.description')}
      </Text>

      <View style={{ gap: tokens.spacing.space2 }}>
        <Text
          style={{
            color: tokens.colors.text.primary,
            fontFamily: tokens.typography.fontFamily.bodyMedium,
            fontSize: tokens.typography.fontSize.bodySm,
          }}>
          {t('modelComparer.modelPickerLabel')}
        </Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: tokens.spacing.space2 }}>
          {availableProviders.map((provider) => {
            const isSelected = selectedProviders.includes(provider);

            return (
              <View key={provider} style={{ minWidth: '30%' }}>
                <Button
                  label={getCompareModelLabel(provider)}
                  onPress={() => toggleProvider(provider)}
                  variant={isSelected ? 'primary' : 'ghost'}
                />
              </View>
            );
          })}
        </View>
        <Text
          style={{
            color: tokens.colors.text.tertiary,
            fontFamily: tokens.typography.fontFamily.body,
            fontSize: tokens.typography.fontSize.bodySm,
          }}>
          {t('modelComparer.modelPickerHint')}
        </Text>
      </View>

      <View style={{ gap: tokens.spacing.space3 }}>
        <Text
          style={{
            color: tokens.colors.text.primary,
            fontFamily: tokens.typography.fontFamily.heading,
            fontSize: tokens.typography.fontSize.headingMd,
          }}>
          {t('modelComparer.promptLabel')}
        </Text>
        <PromptLabTextInput
          onChangeText={setPromptInput}
          placeholder={t('modelComparer.promptPlaceholder')}
          value={promptInput}
        />
        <Button
          disabled={!canCompare}
          label={isComparing ? t('modelComparer.comparing') : t('modelComparer.compareButton')}
          onPress={() => void handleCompare()}
          variant="primary"
        />
      </View>

      {isComparing ? (
        <View
          style={{
            alignItems: 'center',
            flexDirection: 'row',
            gap: tokens.spacing.space2,
            justifyContent: 'center',
          }}>
          <ActivityIndicator color={tokens.colors.accent.primary} size="small" />
          <Text
            style={{
              color: tokens.colors.text.secondary,
              fontFamily: tokens.typography.fontFamily.body,
              fontSize: tokens.typography.fontSize.bodySm,
            }}>
            {t('modelComparer.comparing')}
          </Text>
        </View>
      ) : null}

      {spendingWarning !== 'none' ? (
        <View
          style={{
            backgroundColor: tokens.colors.surface.card,
            borderColor: tokens.colors.accent.warning,
            borderRadius: tokens.radius.md,
            borderWidth: 1,
            padding: tokens.spacing.space3,
          }}>
          <Text
            style={{
              color: tokens.colors.text.primary,
              fontFamily: tokens.typography.fontFamily.body,
              fontSize: tokens.typography.fontSize.bodySm,
              lineHeight: tokens.typography.fontSize.bodySm * 1.4,
            }}>
            {t(SPENDING_WARNING_COPY_KEY[spendingWarning])}
          </Text>
        </View>
      ) : null}

      {results !== null ? (
        <View style={{ gap: tokens.spacing.space3 }}>
          <Text
            style={{
              color: tokens.colors.text.primary,
              fontFamily: tokens.typography.fontFamily.heading,
              fontSize: tokens.typography.fontSize.headingMd,
            }}>
            {t('modelComparer.resultsTitle')}
          </Text>

          <ScrollView
            horizontal
            contentContainerStyle={{ gap: tokens.spacing.space3, paddingRight: tokens.spacing.space2 }}
            showsHorizontalScrollIndicator={false}>
            {results.map((result) => (
              <CompareResultCard
                cardWidth={cardWidth}
                insight={resultInsights.get(result.provider) ?? null}
                key={result.provider}
                result={result}
              />
            ))}
          </ScrollView>
        </View>
      ) : null}
    </View>
  );
}

type CompareResultCardProps = {
  result: CompareModelResult;
  cardWidth: number;
  insight: CompareInsight | null;
};

function CompareResultCard({ result, cardWidth, insight }: CompareResultCardProps) {
  const { tokens, t } = useThemeMode();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) {
      return;
    }

    const timer = setTimeout(() => setCopied(false), 1600);
    return () => clearTimeout(timer);
  }, [copied]);

  const handleCopy = async () => {
    if (result.status !== 'success' || !result.responseText.trim()) {
      return;
    }

    await Clipboard.setStringAsync(result.responseText);
    setCopied(true);
  };

  return (
    <View style={{ width: cardWidth }}>
      <Card variant="solid">
        <View style={{ gap: tokens.spacing.space3 }}>
          <View
            style={{
              alignItems: 'center',
              flexDirection: 'row',
              gap: tokens.spacing.space2,
              justifyContent: 'space-between',
            }}>
            <Text
              style={{
                color: tokens.colors.text.primary,
                flex: 1,
                fontFamily: tokens.typography.fontFamily.heading,
                fontSize: tokens.typography.fontSize.bodyLg,
              }}>
              {result.modelLabel}
            </Text>

            {result.status === 'success' ? (
              <PressableScale
                accessibilityLabel={
                  copied ? t('modelComparer.copiedA11y') : t('modelComparer.copyA11y')
                }
                accessibilityRole="button"
                hitSlop={tokens.spacing.space2}
                onPress={() => {
                  void handleCopy();
                }}
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: tokens.icons.sizes.lg,
                  minWidth: tokens.icons.sizes.lg,
                  padding: tokens.spacing.space1,
                }}>
                {copied ? (
                  <Check
                    color={tokens.colors.accent.success}
                    size={tokens.icons.sizes.md}
                    strokeWidth={tokens.icons.strokeWidth}
                  />
                ) : (
                  <Copy
                    color={tokens.colors.text.secondary}
                    size={tokens.icons.sizes.md}
                    strokeWidth={tokens.icons.strokeWidth}
                  />
                )}
              </PressableScale>
            ) : null}
          </View>

          {result.status === 'success' ? (
            <>
              <Text
                style={{
                  color: tokens.colors.text.primary,
                  fontFamily: tokens.typography.fontFamily.body,
                  fontSize: tokens.typography.fontSize.bodyMd,
                  lineHeight: tokens.typography.fontSize.bodyMd * 1.5,
                }}>
                {result.responseText}
              </Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: tokens.spacing.space2 }}>
                <Badge
                  label={t('modelComparer.latencyBadge', {
                    seconds: formatLatencySeconds(result.latencyMs),
                  })}
                  tone="structure"
                />
                <Badge
                  label={t('modelComparer.costBadge', {
                    cost: formatEstimatedCost(result.estimatedCostUsd),
                  })}
                  tone="primary"
                />
              </View>
              {insight !== null ? (
                <Text
                  style={{
                    color: tokens.colors.text.secondary,
                    fontFamily: tokens.typography.fontFamily.bodyMedium,
                    fontSize: tokens.typography.fontSize.bodySm,
                    lineHeight: tokens.typography.fontSize.bodySm * 1.5,
                  }}>
                  {t(insight.copyKey, insight.vars)}
                </Text>
              ) : null}
            </>
          ) : (
            <View style={{ gap: tokens.spacing.space2 }}>
              <Badge label={t('modelComparer.errorBadge')} tone="warning" />
              <Text
                style={{
                  color: tokens.colors.text.secondary,
                  fontFamily: tokens.typography.fontFamily.body,
                  fontSize: tokens.typography.fontSize.bodySm,
                  lineHeight: tokens.typography.fontSize.bodySm * 1.4,
                }}>
                {t(ERROR_COPY_KEY[result.reason])}
              </Text>
              <Badge
                label={t('modelComparer.latencyBadge', {
                  seconds: formatLatencySeconds(result.latencyMs),
                })}
                tone="structure"
              />
            </View>
          )}
        </View>
      </Card>
    </View>
  );
}
