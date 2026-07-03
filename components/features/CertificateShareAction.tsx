import { useRef, useState } from 'react';
import { Alert, Platform, View } from 'react-native';

import { CertificateView } from '@/components/features/CertificateView';
import { Button } from '@/components/ui';
import { exportCertificateImage } from '@/lib/certificateExport';
import { pathTitleKey } from '@/lib/pathProgress';
import { resolveProfileDisplayName } from '@/lib/profileDisplayName';
import { useAuth } from '@/providers/AuthProvider';
import { useThemeMode } from '@/theme';

type CertificateShareActionProps = {
  pathId: string;
  completedAt: string;
  variant?: 'primary' | 'ghost';
  fullWidth?: boolean;
};

export function CertificateShareAction({
  pathId,
  completedAt,
  variant = 'primary',
  fullWidth = false,
}: CertificateShareActionProps) {
  const certificateRef = useRef<View>(null);
  const { t, locale, mode } = useThemeMode();
  const { user } = useAuth();
  const [isSharing, setIsSharing] = useState(false);
  const recipientName = resolveProfileDisplayName(user);
  const isWeb = Platform.OS === 'web';

  const handleShare = async () => {
    setIsSharing(true);

    try {
      const result = await exportCertificateImage(
        certificateRef,
        t('certificate.shareDialogTitle'),
        `structai-certificate-${pathId}.png`,
      );

      if (result === 'unavailable') {
        Alert.alert(
          isWeb ? t('certificate.shareWebUnavailable') : t('certificate.shareUnavailable'),
        );
      }
    } catch {
      Alert.alert(
        isWeb ? t('certificate.shareWebUnavailable') : t('certificate.shareUnavailable'),
      );
    } finally {
      setIsSharing(false);
    }
  };

  const actionLabel = isSharing
    ? t('certificate.sharing')
    : isWeb
      ? t('certificate.download')
      : t('certificate.share');

  return (
    <>
      <View
        collapsable={false}
        pointerEvents="none"
        style={{
          left: -9999,
          opacity: 0,
          position: 'absolute',
          top: 0,
        }}>
        <CertificateView
          awardedToLabel={t('certificate.awardedTo')}
          badgeLabel={t('certificate.badge')}
          brandTagline={t('certificate.brandTagline')}
          completedAt={completedAt}
          completedOnLabel={t('certificate.completedOn')}
          locale={locale}
          mode={mode}
          pathTitle={t(pathTitleKey(pathId))}
          recipientName={recipientName}
          ref={certificateRef}
        />
      </View>

      <Button
        disabled={isSharing}
        label={actionLabel}
        onPress={() => {
          void handleShare();
        }}
        style={fullWidth ? { alignSelf: 'stretch' } : undefined}
        variant={variant}
      />
    </>
  );
}
