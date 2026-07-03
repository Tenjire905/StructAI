import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, TextInput, View } from 'react-native';

import { StatBlock } from '@/components/features';
import { Avatar, Badge, Button, Card } from '@/components/ui';
import {
  ScoringError,
  getProviderLabel,
  validateApiKey,
} from '@/lib/aiScoring';
import { deleteApiKey, getApiKey, saveApiKey } from '@/lib/secureKeyStore';
import { useAuth } from '@/providers/AuthProvider';
import { useProgressStore } from '@/store/progressStore';
import {
  LOCALE_LABEL_KEYS,
  LOCALES,
  useThemeMode,
  type ThemeMode,
} from '@/theme';

const MOCK_PROFILE = {
  name: 'Alex Muster',
};

type KeyStatus =
  | { state: 'none' }
  | { state: 'checking' }
  | { state: 'valid'; providerLabel: string }
  | { state: 'unverified' }
  | { state: 'invalid' };

export default function ProfilScreen() {
  const { tokens, t, mode, setMode, locale, setLocale } = useThemeMode();
  const { user, signOut } = useAuth();
  const completedLessons = useProgressStore((state) => state.completedLessons);
  const currentStreak = useProgressStore((state) => state.currentStreak);
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [keyStatus, setKeyStatus] = useState<KeyStatus>({ state: 'none' });

  // Beim Öffnen: vorhandenen Key kostenlos gegen die Models-API prüfen
  // (validiert nur Auth, verbraucht keine Tokens).
  useEffect(() => {
    let cancelled = false;

    getApiKey()
      .then(async (storedKey) => {
        if (!storedKey || storedKey.length === 0) {
          if (!cancelled) {
            setKeyStatus({ state: 'none' });
          }
          return;
        }

        if (!cancelled) {
          setKeyStatus({ state: 'checking' });
        }

        try {
          const provider = await validateApiKey(storedKey);
          if (!cancelled) {
            setKeyStatus({ state: 'valid', providerLabel: getProviderLabel(provider) });
          }
        } catch (error) {
          if (cancelled) {
            return;
          }
          if (error instanceof ScoringError && error.reason === 'invalidKey') {
            setKeyStatus({ state: 'invalid' });
          } else {
            setKeyStatus({ state: 'unverified' });
          }
        }
      })
      .catch(() => {
        if (!cancelled) {
          setKeyStatus({ state: 'none' });
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const handleSaveKey = async () => {
    const trimmedKey = apiKeyInput.trim();

    if (trimmedKey.length === 0) {
      return;
    }

    setKeyStatus({ state: 'checking' });

    try {
      const provider = await validateApiKey(trimmedKey);
      await saveApiKey(trimmedKey);
      setApiKeyInput('');
      setKeyStatus({ state: 'valid', providerLabel: getProviderLabel(provider) });
    } catch (error) {
      if (error instanceof ScoringError && error.reason === 'invalidKey') {
        // Ungültige Keys nicht speichern – Eingabe bleibt zur Korrektur stehen.
        setKeyStatus({ state: 'invalid' });
        return;
      }

      // Netzwerk-/Serverprobleme: Key trotzdem speichern, Prüfung folgt bei Nutzung.
      await saveApiKey(trimmedKey);
      setApiKeyInput('');
      setKeyStatus({ state: 'unverified' });
    }
  };

  const handleDeleteKey = async () => {
    await deleteApiKey();
    setKeyStatus({ state: 'none' });
  };

  const hasStoredKey =
    keyStatus.state === 'valid' ||
    keyStatus.state === 'unverified' ||
    keyStatus.state === 'checking';

  const displayName =
    user?.user_metadata?.full_name ??
    user?.user_metadata?.name ??
    user?.email?.split('@')[0] ??
    MOCK_PROFILE.name;

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <ScrollView
      contentContainerStyle={{
        gap: tokens.spacing.space5,
        paddingBottom: tokens.spacing.space7,
        paddingHorizontal: tokens.spacing.screenPadding,
        paddingTop: tokens.spacing.space5,
      }}
      style={{ backgroundColor: tokens.colors.background.base, flex: 1 }}>
      <View
        style={{
          alignItems: 'center',
          flexDirection: 'row',
          gap: tokens.spacing.space4,
        }}>
        <Avatar name={displayName} size="lg" />
        <View style={{ flex: 1, gap: tokens.spacing.space2 }}>
          <Text
            style={{
              color: tokens.colors.text.primary,
              fontFamily: tokens.typography.fontFamily.display,
              fontSize: tokens.typography.fontSize.headingLg,
            }}>
            {displayName}
          </Text>
          {user?.email ? (
            <Text
              style={{
                color: tokens.colors.text.secondary,
                fontFamily: tokens.typography.fontFamily.body,
                fontSize: tokens.typography.fontSize.bodySm,
              }}>
              {user.email}
            </Text>
          ) : null}
        </View>
      </View>

      <View style={{ gap: tokens.spacing.space3 }}>
        <Text
          style={{
            color: tokens.colors.text.primary,
            fontFamily: tokens.typography.fontFamily.heading,
            fontSize: tokens.typography.fontSize.headingMd,
          }}>
          {t('profile.statsSection')}
        </Text>
        <View style={{ flexDirection: 'row', gap: tokens.spacing.space3 }}>
          <StatBlock copyKey="statBlock.completedLessons" value={completedLessons} />
          <StatBlock copyKey="statBlock.currentStreak" value={currentStreak} />
        </View>
      </View>

      <View style={{ gap: tokens.spacing.space3 }}>
        <Text
          style={{
            color: tokens.colors.text.primary,
            fontFamily: tokens.typography.fontFamily.heading,
            fontSize: tokens.typography.fontSize.headingMd,
          }}>
          {t('profile.modeSection')}
        </Text>

        <Card variant="solid">
          <View style={{ gap: tokens.spacing.space3 }}>
            <View style={{ flexDirection: 'row', gap: tokens.spacing.space2 }}>
              <ModeOption
                isActive={mode === 'playful'}
                label={t('profile.modePlayful')}
                onSelect={() => setMode('playful')}
                targetMode="playful"
              />
              <ModeOption
                isActive={mode === 'focus'}
                label={t('profile.modeFocus')}
                onSelect={() => setMode('focus')}
                targetMode="focus"
              />
            </View>
            <Text
              style={{
                color: tokens.colors.text.secondary,
                fontFamily: tokens.typography.fontFamily.body,
                fontSize: tokens.typography.fontSize.bodySm,
                lineHeight: tokens.typography.fontSize.bodySm * 1.5,
              }}>
              {t('profile.modeDescription')}
            </Text>
          </View>
        </Card>
      </View>

      <View style={{ gap: tokens.spacing.space3 }}>
        <Text
          style={{
            color: tokens.colors.text.primary,
            fontFamily: tokens.typography.fontFamily.heading,
            fontSize: tokens.typography.fontSize.headingMd,
          }}>
          {t('profile.languageSection')}
        </Text>

        <Card variant="solid">
          <View style={{ gap: tokens.spacing.space3 }}>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: tokens.spacing.space2 }}>
              {LOCALES.map((targetLocale) => (
                <LocaleOption
                  isActive={locale === targetLocale}
                  key={targetLocale}
                  label={t(LOCALE_LABEL_KEYS[targetLocale])}
                  onSelect={() => setLocale(targetLocale)}
                />
              ))}
            </View>
            <Text
              style={{
                color: tokens.colors.text.secondary,
                fontFamily: tokens.typography.fontFamily.body,
                fontSize: tokens.typography.fontSize.bodySm,
                lineHeight: tokens.typography.fontSize.bodySm * 1.5,
              }}>
              {t('profile.languageDescription')}
            </Text>
          </View>
        </Card>
      </View>

      <View style={{ gap: tokens.spacing.space3 }}>
        <Text
          style={{
            color: tokens.colors.text.primary,
            fontFamily: tokens.typography.fontFamily.heading,
            fontSize: tokens.typography.fontSize.headingMd,
          }}>
          {t('profile.accountSection')}
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
              {t('profile.accountDescription')}
            </Text>
            <Button label={t('profile.signOut')} onPress={handleSignOut} variant="ghost" />
          </View>
        </Card>
      </View>

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
          <View style={{ gap: tokens.spacing.space3 }}>
            <Text
              style={{
                color: tokens.colors.text.secondary,
                fontFamily: tokens.typography.fontFamily.body,
                fontSize: tokens.typography.fontSize.bodyMd,
                lineHeight: tokens.typography.fontSize.bodyMd * 1.5,
              }}>
              {t('profile.byokDescription')}
            </Text>

            {keyStatus.state === 'checking' ? (
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
              <View
                style={{
                  alignItems: 'center',
                  flexDirection: 'row',
                  gap: tokens.spacing.space3,
                  justifyContent: 'space-between',
                }}>
                {keyStatus.state === 'valid' ? (
                  <Badge
                    label={t('profile.byokValidBadge', {
                      provider: keyStatus.providerLabel,
                    })}
                    tone="success"
                  />
                ) : (
                  <Badge label={t('profile.byokUnverifiedBadge')} tone="warning" />
                )}
                <Button
                  label={t('profile.byokDelete')}
                  onPress={handleDeleteKey}
                  variant="ghost"
                />
              </View>
            ) : (
              <View style={{ gap: tokens.spacing.space3 }}>
                {keyStatus.state === 'invalid' ? (
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
                  onChangeText={setApiKeyInput}
                  placeholder={t('profile.byokPlaceholder')}
                  placeholderTextColor={tokens.colors.text.tertiary}
                  secureTextEntry
                  style={{
                    borderColor:
                      keyStatus.state === 'invalid'
                        ? tokens.colors.accent.danger
                        : tokens.colors.border.strong,
                    borderRadius: tokens.radius.md,
                    borderWidth: 1,
                    color: tokens.colors.text.primary,
                    fontFamily: tokens.typography.fontFamily.mono,
                    fontSize: tokens.typography.fontSize.bodyMd,
                    padding: tokens.spacing.space3,
                  }}
                  value={apiKeyInput}
                />
                <Button
                  disabled={apiKeyInput.trim().length === 0}
                  label={t('profile.byokSave')}
                  onPress={handleSaveKey}
                  variant="primary"
                />
              </View>
            )}
          </View>
        </Card>
      </View>
    </ScrollView>
  );
}

type ModeOptionProps = {
  label: string;
  targetMode: ThemeMode;
  isActive: boolean;
  onSelect: () => void;
};

function ModeOption({ label, isActive, onSelect }: ModeOptionProps) {
  return (
    <View style={{ flex: 1 }}>
      <Button
        label={label}
        onPress={onSelect}
        variant={isActive ? 'primary' : 'ghost'}
      />
    </View>
  );
}

type LocaleOptionProps = {
  label: string;
  isActive: boolean;
  onSelect: () => void;
};

function LocaleOption({ label, isActive, onSelect }: LocaleOptionProps) {
  return (
    <View style={{ minWidth: '47%' }}>
      <Button
        label={label}
        onPress={onSelect}
        variant={isActive ? 'primary' : 'ghost'}
      />
    </View>
  );
}
