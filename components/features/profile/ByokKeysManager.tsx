import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Text, TextInput, View } from 'react-native';

import { Badge, Button, Card } from '@/components/ui';
import {
  ScoringError,
  getProviderLabel,
  validateApiKey,
  type AiProvider,
} from '@/lib/aiScoring';
import { trackEvent } from '@/lib/analytics';
import {
  BYOK_PROVIDERS,
  listApiKeys,
  removeApiKey,
  upsertApiKey,
  type ByokKeyEntry,
  type ByokProvider,
} from '@/lib/secureKeyStore';
import { useThemeMode } from '@/theme';

type ProviderKeyStatus =
  | { state: 'empty' }
  | { state: 'checking' }
  | { state: 'valid' }
  | { state: 'unverified' }
  | { state: 'invalid' };

const EMPTY_STATUS: Record<ByokProvider, ProviderKeyStatus> = {
  openai: { state: 'empty' },
  anthropic: { state: 'empty' },
  google: { state: 'empty' },
};

async function validateStoredKey(key: string): Promise<ProviderKeyStatus> {
  try {
    await validateApiKey(key);
    return { state: 'valid' };
  } catch (error) {
    if (error instanceof ScoringError && error.reason === 'invalidKey') {
      return { state: 'invalid' };
    }

    return { state: 'unverified' };
  }
}

export function ByokKeysManager() {
  const { tokens, t } = useThemeMode();
  const [entries, setEntries] = useState<ByokKeyEntry[]>([]);
  const [statusByProvider, setStatusByProvider] =
    useState<Record<ByokProvider, ProviderKeyStatus>>(EMPTY_STATUS);
  const [inputByProvider, setInputByProvider] = useState<Record<ByokProvider, string>>({
    openai: '',
    anthropic: '',
    google: '',
  });
  const [busyProvider, setBusyProvider] = useState<ByokProvider | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshEntries = useCallback(async () => {
    const stored = await listApiKeys();
    setEntries(stored);

    const nextStatus: Record<ByokProvider, ProviderKeyStatus> = { ...EMPTY_STATUS };

    for (const provider of BYOK_PROVIDERS) {
      const entry = stored.find((item) => item.provider === provider);

      if (!entry) {
        continue;
      }

      nextStatus[provider] = { state: 'checking' };
    }

    setStatusByProvider(nextStatus);

    await Promise.all(
      BYOK_PROVIDERS.map(async (provider) => {
        const entry = stored.find((item) => item.provider === provider);

        if (!entry) {
          return;
        }

        const status = await validateStoredKey(entry.key);

        setStatusByProvider((current) => ({
          ...current,
          [provider]: status,
        }));
      }),
    );
  }, []);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      await refreshEntries();

      if (!cancelled) {
        setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [refreshEntries]);

  const handleSave = async (provider: ByokProvider) => {
    const trimmedKey = inputByProvider[provider].trim();

    if (trimmedKey.length === 0 || busyProvider !== null) {
      return;
    }

    setBusyProvider(provider);
    setStatusByProvider((current) => ({
      ...current,
      [provider]: { state: 'checking' },
    }));

    try {
      const detectedProvider = await validateApiKey(trimmedKey);

      if (detectedProvider !== provider) {
        setStatusByProvider((current) => ({
          ...current,
          [provider]: { state: 'invalid' },
        }));
        return;
      }

      await upsertApiKey({ provider, key: trimmedKey });
      trackEvent('byok_key_added_success');
      setInputByProvider((current) => ({ ...current, [provider]: '' }));
      await refreshEntries();
    } catch (error) {
      if (error instanceof ScoringError && error.reason === 'invalidKey') {
        setStatusByProvider((current) => ({
          ...current,
          [provider]: { state: 'invalid' },
        }));
        return;
      }

      await upsertApiKey({ provider, key: trimmedKey });
      setInputByProvider((current) => ({ ...current, [provider]: '' }));
      await refreshEntries();
    } finally {
      setBusyProvider(null);
    }
  };

  const handleTest = async (provider: ByokProvider) => {
    const entry = entries.find((item) => item.provider === provider);

    if (!entry || busyProvider !== null) {
      return;
    }

    setBusyProvider(provider);
    setStatusByProvider((current) => ({
      ...current,
      [provider]: { state: 'checking' },
    }));

    const status = await validateStoredKey(entry.key);
    setStatusByProvider((current) => ({
      ...current,
      [provider]: status,
    }));
    setBusyProvider(null);
  };

  const handleRemove = async (provider: ByokProvider) => {
    if (busyProvider !== null) {
      return;
    }

    setBusyProvider(provider);
    await removeApiKey(provider);
    setInputByProvider((current) => ({ ...current, [provider]: '' }));
    setStatusByProvider((current) => ({
      ...current,
      [provider]: { state: 'empty' },
    }));
    setEntries((current) => current.filter((entry) => entry.provider !== provider));
    setBusyProvider(null);
  };

  const configuredCount = entries.length;

  return (
    <View style={{ gap: tokens.spacing.space3 }}>
      <Text
        style={{
          color: tokens.colors.text.primary,
          fontFamily: tokens.typography.fontFamily.heading,
          fontSize: tokens.typography.fontSize.headingMd,
        }}>
        {t('profile.byokSection')}
      </Text>

      <Card variant="solid">
        <View style={{ gap: tokens.spacing.space4 }}>
          <Text
            style={{
              color: tokens.colors.text.secondary,
              fontFamily: tokens.typography.fontFamily.body,
              fontSize: tokens.typography.fontSize.bodyMd,
              lineHeight: tokens.typography.fontSize.bodyMd * 1.5,
            }}>
            {t('profile.byokDescription')}
          </Text>

          {configuredCount > 0 ? (
            <Badge
              label={t('profile.byokConfiguredCount', { count: configuredCount })}
              tone="success"
            />
          ) : null}

          {isLoading ? (
            <View
              style={{
                alignItems: 'center',
                flexDirection: 'row',
                gap: tokens.spacing.space2,
              }}>
              <ActivityIndicator color={tokens.colors.accent.primary} size="small" />
              <Text
                style={{
                  color: tokens.colors.text.secondary,
                  fontFamily: tokens.typography.fontFamily.body,
                  fontSize: tokens.typography.fontSize.bodySm,
                }}>
                {t('profile.byokChecking')}
              </Text>
            </View>
          ) : (
            <View style={{ gap: tokens.spacing.space3 }}>
              {BYOK_PROVIDERS.map((provider) => (
                <ProviderKeyRow
                  busyProvider={busyProvider}
                  hasStoredKey={entries.some((entry) => entry.provider === provider)}
                  inputValue={inputByProvider[provider]}
                  key={provider}
                  onInputChange={(value) =>
                    setInputByProvider((current) => ({ ...current, [provider]: value }))
                  }
                  onRemove={() => void handleRemove(provider)}
                  onSave={() => void handleSave(provider)}
                  onTest={() => void handleTest(provider)}
                  provider={provider}
                  status={statusByProvider[provider]}
                />
              ))}
            </View>
          )}
        </View>
      </Card>
    </View>
  );
}

type ProviderKeyRowProps = {
  provider: ByokProvider;
  status: ProviderKeyStatus;
  hasStoredKey: boolean;
  inputValue: string;
  busyProvider: ByokProvider | null;
  onInputChange: (value: string) => void;
  onSave: () => void;
  onTest: () => void;
  onRemove: () => void;
};

function ProviderKeyRow({
  provider,
  status,
  hasStoredKey,
  inputValue,
  busyProvider,
  onInputChange,
  onSave,
  onTest,
  onRemove,
}: ProviderKeyRowProps) {
  const { tokens, t } = useThemeMode();
  const providerLabel = getProviderLabel(provider as AiProvider);
  const isBusy = busyProvider === provider;

  return (
    <View
      style={{
        borderColor: tokens.colors.border.subtle,
        borderRadius: tokens.radius.md,
        borderWidth: 1,
        gap: tokens.spacing.space3,
        padding: tokens.spacing.space3,
      }}>
      <Text
        style={{
          color: tokens.colors.text.primary,
          fontFamily: tokens.typography.fontFamily.bodyMedium,
          fontSize: tokens.typography.fontSize.bodyMd,
        }}>
        {providerLabel}
      </Text>

      {status.state === 'checking' ? (
        <View
          style={{
            alignItems: 'center',
            flexDirection: 'row',
            gap: tokens.spacing.space2,
          }}>
          <ActivityIndicator color={tokens.colors.accent.primary} size="small" />
          <Text
            style={{
              color: tokens.colors.text.secondary,
              fontFamily: tokens.typography.fontFamily.body,
              fontSize: tokens.typography.fontSize.bodySm,
            }}>
            {t('profile.byokChecking')}
          </Text>
        </View>
      ) : hasStoredKey ? (
        <View style={{ gap: tokens.spacing.space3 }}>
          <View
            style={{
              alignItems: 'center',
              flexDirection: 'row',
              flexWrap: 'wrap',
              gap: tokens.spacing.space2,
            }}>
            {status.state === 'valid' ? (
              <Badge
                label={t('profile.byokValidBadge', { provider: providerLabel })}
                tone="success"
              />
            ) : status.state === 'invalid' ? (
              <Badge label={t('profile.byokInvalidError')} tone="warning" />
            ) : (
              <Badge label={t('profile.byokUnverifiedBadge')} tone="warning" />
            )}
          </View>

          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: tokens.spacing.space2 }}>
            <Button
              disabled={busyProvider !== null}
              label={t('profile.byokTest')}
              onPress={onTest}
              variant="ghost"
            />
            <Button
              disabled={busyProvider !== null}
              label={t('profile.byokDelete')}
              onPress={onRemove}
              variant="ghost"
            />
          </View>
        </View>
      ) : (
        <View style={{ gap: tokens.spacing.space3 }}>
          {status.state === 'invalid' ? (
            <Text
              style={{
                color: tokens.colors.accent.danger,
                fontFamily: tokens.typography.fontFamily.bodyMedium,
                fontSize: tokens.typography.fontSize.bodySm,
              }}>
              {t('profile.byokInvalidError')}
            </Text>
          ) : null}
          <TextInput
            autoCapitalize="none"
            autoCorrect={false}
            editable={!isBusy && busyProvider === null}
            onChangeText={onInputChange}
            placeholder={t('profile.byokPlaceholder')}
            placeholderTextColor={tokens.colors.text.tertiary}
            secureTextEntry
            style={{
              borderColor:
                status.state === 'invalid'
                  ? tokens.colors.accent.danger
                  : tokens.colors.border.strong,
              borderRadius: tokens.radius.md,
              borderWidth: 1,
              color: tokens.colors.text.primary,
              fontFamily: tokens.typography.fontFamily.mono,
              fontSize: tokens.typography.fontSize.bodyMd,
              padding: tokens.spacing.space3,
            }}
            value={inputValue}
          />
          <Button
            disabled={inputValue.trim().length === 0 || busyProvider !== null}
            label={t('profile.byokSave')}
            onPress={onSave}
            variant="primary"
          />
        </View>
      )}
    </View>
  );
}
