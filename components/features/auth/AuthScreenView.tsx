import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';

import { Button } from '@/components/ui';
import { useAuth } from '@/providers/AuthProvider';
import { useThemeMode } from '@/theme';

type AuthMode = 'signIn' | 'signUp';

type AuthScreenViewProps = {
  /** Reserved for dev previews; production navigation uses session Redirect. */
  onAuthenticated?: () => void;
};

function resolveAuthErrorMessage(error: unknown, t: (key: string) => string): string {
  if (error instanceof Error) {
    if (error.message === 'supabase_not_configured') {
      return t('auth.errorNotConfigured');
    }

    if (error.message === 'oauth_cancelled') {
      return t('auth.errorOAuthCancelled');
    }

    if (
      error.message === 'oauth_failed' ||
      error.message === 'oauth_session_missing' ||
      error.message === 'oauth_url_missing'
    ) {
      return t('auth.errorOAuthFailed');
    }

    const normalized = error.message.toLowerCase();

    if (normalized.includes('invalid login credentials')) {
      return t('auth.errorInvalidCredentials');
    }

    if (normalized.includes('email not confirmed')) {
      return t('auth.errorEmailNotConfirmed');
    }

    if (normalized.includes('user already registered')) {
      return t('auth.errorUserExists');
    }

    if (normalized.includes('password')) {
      return t('auth.errorWeakPassword');
    }
  }

  return t('auth.errorGeneric');
}

export function AuthScreenView({ onAuthenticated }: AuthScreenViewProps) {
  const { tokens, t } = useThemeMode();
  const { isConfigured, signInWithEmail, signUpWithEmail, signInWithGoogle } = useAuth();
  const [mode, setMode] = useState<AuthMode>('signIn');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);

  const isBusy = isSubmitting || isGoogleSubmitting;
  const canSubmit = email.trim().length > 0 && password.length >= 6 && !isBusy;

  const handleEmailAuth = async () => {
    if (!canSubmit) {
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);
    setInfoMessage(null);

    try {
      if (mode === 'signIn') {
        await signInWithEmail(email.trim(), password);
        return;
      }

      const signUpResult = await signUpWithEmail(email.trim(), password);

      if (signUpResult === 'confirmation_required') {
        setInfoMessage(t('auth.signUpConfirmEmail'));
        setMode('signIn');
        return;
      }
    } catch (error) {
      setErrorMessage(resolveAuthErrorMessage(error, t));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleAuth = async () => {
    setIsGoogleSubmitting(true);
    setErrorMessage(null);

    try {
      await signInWithGoogle();
    } catch (error) {
      setErrorMessage(resolveAuthErrorMessage(error, t));
    } finally {
      setIsGoogleSubmitting(false);
    }
  };

  return (
    <LinearGradient
      colors={tokens.gradients.heroBackground.colors}
      end={tokens.gradients.heroBackground.end}
      start={tokens.gradients.heroBackground.start}
      style={{ flex: 1 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            gap: tokens.spacing.space5,
            justifyContent: 'center',
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
                lineHeight: tokens.typography.fontSize.displayLg * 1.15,
              }}>
              {t('auth.headline')}
            </Text>
            <Text
              style={{
                color: tokens.colors.text.secondary,
                fontFamily: tokens.typography.fontFamily.body,
                fontSize: tokens.typography.fontSize.bodyLg,
                lineHeight: tokens.typography.fontSize.bodyLg * 1.5,
              }}>
              {t('auth.subheadline')}
            </Text>
          </View>

          {!isConfigured ? (
            <View
              style={{
                backgroundColor: tokens.colors.surface.card,
                borderColor: tokens.colors.border.subtle,
                borderRadius: tokens.radius.lg,
                borderWidth: 1,
                gap: tokens.spacing.space2,
                padding: tokens.spacing.space4,
              }}>
              <Text
                style={{
                  color: tokens.colors.accent.warning,
                  fontFamily: tokens.typography.fontFamily.bodyMedium,
                  fontSize: tokens.typography.fontSize.bodyMd,
                }}>
                {t('auth.configMissingTitle')}
              </Text>
              <Text
                style={{
                  color: tokens.colors.text.secondary,
                  fontFamily: tokens.typography.fontFamily.body,
                  fontSize: tokens.typography.fontSize.bodySm,
                  lineHeight: tokens.typography.fontSize.bodySm * 1.5,
                }}>
                {t('auth.configMissingBody')}
              </Text>
            </View>
          ) : null}

          <View style={{ flexDirection: 'row', gap: tokens.spacing.space2 }}>
            <View style={{ flex: 1 }}>
              <Button
                label={t('auth.signInTab')}
                onPress={() => {
                  setMode('signIn');
                  setErrorMessage(null);
                  setInfoMessage(null);
                }}
                variant={mode === 'signIn' ? 'primary' : 'ghost'}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Button
                label={t('auth.signUpTab')}
                onPress={() => {
                  setMode('signUp');
                  setErrorMessage(null);
                  setInfoMessage(null);
                }}
                variant={mode === 'signUp' ? 'primary' : 'ghost'}
              />
            </View>
          </View>

          <View style={{ gap: tokens.spacing.space3 }}>
            <TextInput
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect={false}
              editable={!isBusy && isConfigured}
              keyboardType="email-address"
              onChangeText={setEmail}
              placeholder={t('auth.emailPlaceholder')}
              placeholderTextColor={tokens.colors.text.tertiary}
              style={{
                backgroundColor: tokens.colors.surface.card,
                borderColor: tokens.colors.border.strong,
                borderRadius: tokens.radius.md,
                borderWidth: 1,
                color: tokens.colors.text.primary,
                fontFamily: tokens.typography.fontFamily.body,
                fontSize: tokens.typography.fontSize.bodyMd,
                paddingHorizontal: tokens.spacing.space4,
                paddingVertical: tokens.spacing.space3,
              }}
              value={email}
            />

            <TextInput
              autoCapitalize="none"
              autoComplete={mode === 'signIn' ? 'password' : 'new-password'}
              autoCorrect={false}
              editable={!isBusy && isConfigured}
              onChangeText={setPassword}
              placeholder={t('auth.passwordPlaceholder')}
              placeholderTextColor={tokens.colors.text.tertiary}
              secureTextEntry
              style={{
                backgroundColor: tokens.colors.surface.card,
                borderColor: tokens.colors.border.strong,
                borderRadius: tokens.radius.md,
                borderWidth: 1,
                color: tokens.colors.text.primary,
                fontFamily: tokens.typography.fontFamily.body,
                fontSize: tokens.typography.fontSize.bodyMd,
                paddingHorizontal: tokens.spacing.space4,
                paddingVertical: tokens.spacing.space3,
              }}
              value={password}
            />

            {errorMessage ? (
              <Text
                style={{
                  color: tokens.colors.accent.danger,
                  fontFamily: tokens.typography.fontFamily.bodyMedium,
                  fontSize: tokens.typography.fontSize.bodySm,
                  lineHeight: tokens.typography.fontSize.bodySm * 1.5,
                }}>
                {errorMessage}
              </Text>
            ) : null}

            {infoMessage ? (
              <Text
                style={{
                  color: tokens.colors.accent.success,
                  fontFamily: tokens.typography.fontFamily.bodyMedium,
                  fontSize: tokens.typography.fontSize.bodySm,
                  lineHeight: tokens.typography.fontSize.bodySm * 1.5,
                }}>
                {infoMessage}
              </Text>
            ) : null}

            <Button
              disabled={!canSubmit || !isConfigured}
              label={
                mode === 'signIn'
                  ? isSubmitting
                    ? t('auth.signInLoading')
                    : t('auth.signInCta')
                  : isSubmitting
                    ? t('auth.signUpLoading')
                    : t('auth.signUpCta')
              }
              onPress={handleEmailAuth}
              variant="primary"
            />
          </View>

          <View style={{ alignItems: 'center', flexDirection: 'row', gap: tokens.spacing.space3 }}>
            <View
              style={{
                backgroundColor: tokens.colors.border.subtle,
                flex: 1,
                height: 1,
              }}
            />
            <Text
              style={{
                color: tokens.colors.text.tertiary,
                fontFamily: tokens.typography.fontFamily.body,
                fontSize: tokens.typography.fontSize.bodySm,
              }}>
              {t('auth.dividerOr')}
            </Text>
            <View
              style={{
                backgroundColor: tokens.colors.border.subtle,
                flex: 1,
                height: 1,
              }}
            />
          </View>

          <Button
            disabled={isBusy || !isConfigured}
            label={
              isGoogleSubmitting ? t('auth.googleLoading') : t('auth.googleCta')
            }
            onPress={handleGoogleAuth}
            variant="ghost"
          />

          {mode === 'signUp' ? (
            <Text
              style={{
                color: tokens.colors.text.tertiary,
                fontFamily: tokens.typography.fontFamily.body,
                fontSize: tokens.typography.fontSize.bodySm,
                lineHeight: tokens.typography.fontSize.bodySm * 1.5,
                textAlign: 'center',
              }}>
              {t('auth.signUpHint')}
            </Text>
          ) : null}

          {isBusy ? (
            <ActivityIndicator color={tokens.colors.accent.primary} size="small" />
          ) : null}
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}
