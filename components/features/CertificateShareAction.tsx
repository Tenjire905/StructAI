import { useRef, useState } from 'react';
import { Alert, View } from 'react-native';

import { CertificateView } from '@/components/features/CertificateView';
import { Button } from '@/components/ui';
import { isCertificateSharingAvailable, shareCertificateImage } from '@/lib/certificateExport';
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

  const handleShare = async () => {
    setIsSharing(true);

    try {
      const available = await isCertificateSharingAvailable();

      if (!available) {
        Alert.alert(t('certificate.shareUnavailable'));
        return;
      }

      const result = await shareCertificateImage(
        certificateRef,
        t('certificate.shareDialogTitle'),
      );

      if (result === 'unavailable') {
        Alert.alert(t('certificate.shareUnavailable'));
      }
    } catch {
      Alert.alert(t('certificate.shareUnavailable'));
    } finally {
      setIsSharing(false);
    }
  };

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
        label={isSharing ? t('certificate.sharing') : t('certificate.share')}
        onPress={() => {
          void handleShare();
        }}
        style={fullWidth ? { alignSelf: 'stretch' } : undefined}
        variant={variant}
      />
    </>
  );
}
