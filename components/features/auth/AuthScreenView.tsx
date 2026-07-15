import { LinearGradient } from 'expo-linear-gradient';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from 'react-native';

import { AuthCredentialsForm } from '@/components/features/auth/AuthCredentialsForm';
import { useThemeMode } from '@/theme';

type AuthScreenViewProps = {
  /** Reserved for dev previews; production navigation uses session Redirect. */
  onAuthenticated?: () => void;
};

export function AuthScreenView({ onAuthenticated }: AuthScreenViewProps) {
  const { tokens, t } = useThemeMode();

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

          <AuthCredentialsForm />
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}
