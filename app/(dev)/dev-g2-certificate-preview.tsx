import { ScrollView, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

import { CertificateView } from '@/components/features/CertificateView';
import { ThemeModeScope, useThemeMode, type ThemeMode } from '@/theme';

function parseMode(value: string | string[] | undefined): ThemeMode {
  const raw = Array.isArray(value) ? value[0] : value;
  return raw === 'playful' ? 'playful' : 'focus';
}

export default function DevG2CertificatePreviewScreen() {
  const { mode } = useLocalSearchParams<{ mode?: string }>();
  const previewMode = parseMode(mode);

  return (
    <ThemeModeScope mode={previewMode}>
      <DevG2CertificatePreviewContent />
    </ThemeModeScope>
  );
}

function DevG2CertificatePreviewContent() {
  const { tokens, t, locale, mode } = useThemeMode();

  return (
    <ScrollView
      contentContainerStyle={{
        alignItems: 'center',
        gap: tokens.spacing.space5,
        paddingBottom: tokens.spacing.space7,
        paddingHorizontal: tokens.spacing.screenPadding,
        paddingTop: tokens.spacing.space5,
      }}
      style={{ backgroundColor: tokens.colors.background.base, flex: 1 }}>
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <CertificateView
          awardedToLabel={t('certificate.awardedTo')}
          badgeLabel={t('certificate.badge')}
          brandTagline={t('certificate.brandTagline')}
          completedAt="2026-07-02T12:00:00.000Z"
          completedOnLabel={t('certificate.completedOn')}
          locale={locale}
          mode={mode}
          pathTitle={t('paths.title.prompt_basics')}
          recipientName="Alex Muster"
        />
      </View>
    </ScrollView>
  );
}
