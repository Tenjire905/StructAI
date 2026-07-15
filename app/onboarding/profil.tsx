import { useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';

import { AuthCredentialsForm } from '@/components/features/auth/AuthCredentialsForm';
import { ModePreviewCard } from '@/components/features/onboarding/ModePreviewCard';
import { Button, Card } from '@/components/ui';
import {
  getGuestDisplayName,
  getProfileAge,
  setGuestDisplayName,
  setProfileAge,
  setProfileOnboardingCompleted,
} from '@/lib/appStorage';
import { resolveProfileDisplayName } from '@/lib/profileDisplayName';
import {
  isPlayfulModeRecommended,
  isValidProfileAge,
  parseProfileAgeInput,
  updateAuthenticatedUserDisplayName,
} from '@/lib/userProfile';
import { useAuth } from '@/providers/AuthProvider';
import { useThemeMode, type ThemeMode } from '@/theme';

export default function OnboardingProfileScreen() {
  const { tokens, t, setMode } = useThemeMode();
  const router = useRouter();
  const { session, user } = useAuth();
  const [displayName, setDisplayName] = useState('');
  const [ageInput, setAgeInput] = useState('');
  const [selectedMode, setSelectedMode] = useState<ThemeMode | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const storedName = getGuestDisplayName();
    const initialName = session ? resolveProfileDisplayName(user) : storedName ?? '';
    setDisplayName(initialName);

    const storedAge = getProfileAge();
    if (storedAge !== undefined) {
      setAgeInput(String(storedAge));
    }
  }, [session, user]);

  const parsedAge = useMemo(() => parseProfileAgeInput(ageInput), [ageInput]);
  const recommendPlayful = isPlayfulModeRecommended(parsedAge);

  useEffect(() => {
    if (recommendPlayful && selectedMode === null) {
      setSelectedMode('playful');
    }
  }, [recommendPlayful, selectedMode]);

  useEffect(() => {
    if (session && user) {
      const authName = resolveProfileDisplayName(user);
      if (authName && authName !== displayName) {
        setDisplayName(authName);
      }
    }
  }, [session, user]);

  const canSubmit =
    displayName.trim().length > 0 &&
    parsedAge !== null &&
    isValidProfileAge(parsedAge) &&
    selectedMode !== null &&
    !isSaving;

  const handleConfirm = async () => {
    if (!canSubmit || !selectedMode) {
      return;
    }

    setValidationError(null);
    setIsSaving(true);

    try {
      const trimmedName = displayName.trim();

      if (session) {
        await updateAuthenticatedUserDisplayName(trimmedName);
      } else {
        await setGuestDisplayName(trimmedName);
      }

      await setProfileAge(parsedAge);
      setMode(selectedMode);
      await setProfileOnboardingCompleted();
      router.replace('/(tabs)');
    } catch {
      setValidationError(t('onboarding.profileSaveError'));
    } finally {
      setIsSaving(false);
    }
  };

  const inputStyle = {
    backgroundColor: tokens.colors.surface.card,
    borderColor: tokens.colors.border.strong,
    borderRadius: tokens.radius.md,
    borderWidth: 1,
    color: tokens.colors.text.primary,
    fontFamily: tokens.typography.fontFamily.body,
    fontSize: tokens.typography.fontSize.bodyMd,
    paddingHorizontal: tokens.spacing.space4,
    paddingVertical: tokens.spacing.space3,
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ backgroundColor: tokens.colors.background.base, flex: 1 }}>
      <ScrollView
        contentContainerStyle={{
          gap: tokens.spacing.space5,
          paddingBottom: tokens.spacing.space7,
          paddingHorizontal: tokens.spacing.screenPaddingHero,
          paddingTop: tokens.spacing.space7,
        }}
        keyboardShouldPersistTaps="handled">
        <View style={{ gap: tokens.spacing.space3 }}>
          <Text
            style={{
              color: tokens.colors.text.primary,
              fontFamily: tokens.typography.fontFamily.display,
              fontSize: tokens.typography.fontSize.displayLg,
              lineHeight: tokens.typography.fontSize.displayLg * 1.2,
            }}>
            {t('onboarding.profileTitle')}
          </Text>
          <Text
            style={{
              color: tokens.colors.text.secondary,
              fontFamily: tokens.typography.fontFamily.body,
              fontSize: tokens.typography.fontSize.bodyLg,
              lineHeight: tokens.typography.fontSize.bodyLg * 1.5,
            }}>
            {t('onboarding.profileSubtitle')}
          </Text>
        </View>

        <View style={{ gap: tokens.spacing.space3 }}>
          <Text
            style={{
              color: tokens.colors.text.primary,
              fontFamily: tokens.typography.fontFamily.bodyMedium,
              fontSize: tokens.typography.fontSize.bodyMd,
            }}>
            {t('onboarding.profileNameLabel')}
          </Text>
          <TextInput
            autoCapitalize="words"
            autoCorrect={false}
            onChangeText={setDisplayName}
            placeholder={t('onboarding.profileNamePlaceholder')}
            placeholderTextColor={tokens.colors.text.tertiary}
            style={inputStyle}
            value={displayName}
          />
        </View>

        <View style={{ gap: tokens.spacing.space3 }}>
          <Text
            style={{
              color: tokens.colors.text.primary,
              fontFamily: tokens.typography.fontFamily.bodyMedium,
              fontSize: tokens.typography.fontSize.bodyMd,
            }}>
            {t('onboarding.profileAgeLabel')}
          </Text>
          <TextInput
            keyboardType="number-pad"
            maxLength={3}
            onChangeText={(value) => {
              setAgeInput(value.replace(/[^\d]/g, ''));
              setValidationError(null);
            }}
            placeholder={t('onboarding.profileAgePlaceholder')}
            placeholderTextColor={tokens.colors.text.tertiary}
            style={inputStyle}
            value={ageInput}
          />
          <Text
            style={{
              color: tokens.colors.text.tertiary,
              fontFamily: tokens.typography.fontFamily.body,
              fontSize: tokens.typography.fontSize.bodySm,
              lineHeight: tokens.typography.fontSize.bodySm * 1.5,
            }}>
            {t('onboarding.profileAgeDisclaimer')}
          </Text>
        </View>

        <Card variant="solid">
          <View style={{ gap: tokens.spacing.space3 }}>
            <Text
              style={{
                color: tokens.colors.text.primary,
                fontFamily: tokens.typography.fontFamily.heading,
                fontSize: tokens.typography.fontSize.headingMd,
              }}>
              {t('onboarding.profileAuthSection')}
            </Text>
            <Text
              style={{
                color: tokens.colors.text.secondary,
                fontFamily: tokens.typography.fontFamily.body,
                fontSize: tokens.typography.fontSize.bodySm,
                lineHeight: tokens.typography.fontSize.bodySm * 1.5,
              }}>
              {t('onboarding.profileAuthHint')}
            </Text>
            <AuthCredentialsForm />
          </View>
        </Card>

        <View style={{ gap: tokens.spacing.space3 }}>
          <Text
            style={{
              color: tokens.colors.text.primary,
              fontFamily: tokens.typography.fontFamily.heading,
              fontSize: tokens.typography.fontSize.headingMd,
            }}>
            {t('onboarding.profileModeSection')}
          </Text>
          <Text
            style={{
              color: tokens.colors.text.secondary,
              fontFamily: tokens.typography.fontFamily.body,
              fontSize: tokens.typography.fontSize.bodyMd,
              lineHeight: tokens.typography.fontSize.bodyMd * 1.5,
            }}>
            {recommendPlayful
              ? t('onboarding.profileModeHintRecommended')
              : t('onboarding.profileModeHintNeutral')}
          </Text>

          <View style={{ flexDirection: 'row', gap: tokens.spacing.space3 }}>
            <ModePreviewCard
              isSelected={selectedMode === 'playful'}
              label={t('profile.modePlayful')}
              mode="playful"
              onSelect={() => setSelectedMode('playful')}
              recommendCopy={t('onboarding.profilePlayfulRecommendCopy')}
              recommended={recommendPlayful}
            />
            <ModePreviewCard
              isSelected={selectedMode === 'focus'}
              label={t('profile.modeFocus')}
              mode="focus"
              onSelect={() => setSelectedMode('focus')}
            />
          </View>
        </View>

        {validationError ? (
          <Text
            style={{
              color: tokens.colors.accent.danger,
              fontFamily: tokens.typography.fontFamily.bodyMedium,
              fontSize: tokens.typography.fontSize.bodySm,
            }}>
            {validationError}
          </Text>
        ) : null}

        {parsedAge !== null && !isValidProfileAge(parsedAge) ? (
          <Text
            style={{
              color: tokens.colors.accent.danger,
              fontFamily: tokens.typography.fontFamily.bodyMedium,
              fontSize: tokens.typography.fontSize.bodySm,
            }}>
            {t('onboarding.profileAgeInvalid')}
          </Text>
        ) : null}

        <Button
          disabled={!canSubmit}
          label={isSaving ? t('onboarding.profileSaving') : t('onboarding.profileCta')}
          onPress={handleConfirm}
          variant="primary"
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
