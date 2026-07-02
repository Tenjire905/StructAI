import { useEffect, useState } from 'react';
import { ScrollView, Text, TextInput, View } from 'react-native';

import { StatBlock } from '@/components/features';
import { Avatar, Badge, Button, Card } from '@/components/ui';
import { deleteApiKey, getApiKey, saveApiKey } from '@/lib/secureKeyStore';
import { useThemeMode, type ThemeMode } from '@/theme';

const MOCK_PROFILE = {
  name: 'Alex Muster',
  completedLessons: 24,
  currentStreak: 4,
};

export default function ProfilScreen() {
  const { tokens, t, mode, setMode } = useThemeMode();
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [hasStoredKey, setHasStoredKey] = useState(false);

  useEffect(() => {
    getApiKey().then((storedKey) => {
      setHasStoredKey(storedKey !== null && storedKey.length > 0);
    });
  }, []);

  const handleSaveKey = async () => {
    const trimmedKey = apiKeyInput.trim();

    if (trimmedKey.length === 0) {
      return;
    }

    await saveApiKey(trimmedKey);
    setApiKeyInput('');
    setHasStoredKey(true);
  };

  const handleDeleteKey = async () => {
    await deleteApiKey();
    setHasStoredKey(false);
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
        <Avatar name={MOCK_PROFILE.name} size="lg" />
        <Text
          style={{
            color: tokens.colors.text.primary,
            fontFamily: tokens.typography.fontFamily.display,
            fontSize: tokens.typography.fontSize.headingLg,
          }}>
          {MOCK_PROFILE.name}
        </Text>
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
          <StatBlock
            copyKey="statBlock.completedLessons"
            value={MOCK_PROFILE.completedLessons}
          />
          <StatBlock
            copyKey="statBlock.currentStreak"
            value={MOCK_PROFILE.currentStreak}
          />
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

            {hasStoredKey ? (
              <View
                style={{
                  alignItems: 'center',
                  flexDirection: 'row',
                  gap: tokens.spacing.space3,
                  justifyContent: 'space-between',
                }}>
                <Badge label={t('profile.byokSavedBadge')} tone="success" />
                <Button
                  label={t('profile.byokDelete')}
                  onPress={handleDeleteKey}
                  variant="ghost"
                />
              </View>
            ) : (
              <View style={{ gap: tokens.spacing.space3 }}>
                <TextInput
                  autoCapitalize="none"
                  autoCorrect={false}
                  onChangeText={setApiKeyInput}
                  placeholder={t('profile.byokPlaceholder')}
                  placeholderTextColor={tokens.colors.text.tertiary}
                  secureTextEntry
                  style={{
                    borderColor: tokens.colors.border.strong,
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
