import { useRef, useState } from 'react';
import { Alert, Platform, View } from 'react-native';

import { CertificateView } from '@/components/features/CertificateView';
import { Button } from '@/components/ui';
import { buildCertificateViewModel } from '@/lib/buildCertificateViewModel';
import { exportCertificateImage } from '@/lib/certificateExport';
import { canUseProFeature } from '@/lib/entitlements';
import { getPathCompletionStats } from '@/lib/pathCapstone';
import { resolveProfileDisplayName } from '@/lib/profileDisplayName';
import { useAuth } from '@/providers/AuthProvider';
import { useProgressStore } from '@/store/progressStore';
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
  const pathProgress = useProgressStore((state) => state.pathProgress[pathId]);
  const [isSharing, setIsSharing] = useState(false);
  const recipientName = resolveProfileDisplayName(user);
  const isWeb = Platform.OS === 'web';
  const stats = getPathCompletionStats(pathId, pathProgress);
  const viewModel = buildCertificateViewModel({
    chaptersCompleted: stats.completed,
    chaptersTotal: stats.total,
    completedAt,
    pathId,
    recipientName,
    t,
  });

  const handleShare = async () => {
    if (!canUseProFeature('certificateExport')) {
      Alert.alert(t('pro.gateTitle'), t('pro.gateCertificateBody'));
      return;
    }

    setIsSharing(true);

    try {
      const result = await exportCertificateImage(
        certificateRef,
        viewModel.shareDialogTitle,
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

  const proLocked = !canUseProFeature('certificateExport');
  const actionLabel = isSharing
    ? t('certificate.sharing')
    : proLocked
      ? t('pro.certificateCta')
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
          awardedToLabel={viewModel.awardedToLabel}
          badgeLabel={viewModel.badgeLabel}
          brandTagline={viewModel.brandTagline}
          completedAt={completedAt}
          completedOnLabel={viewModel.completedOnLabel}
          credentialId={viewModel.credentialId}
          credentialLabel={viewModel.credentialLabel}
          evidenceLabel={viewModel.evidenceLabel}
          locale={locale}
          mode={mode}
          pathTitle={viewModel.pathTitle}
          recipientName={recipientName}
          ref={certificateRef}
          skillLabel={viewModel.skillLabel}
          skillStatement={viewModel.skillStatement}
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
