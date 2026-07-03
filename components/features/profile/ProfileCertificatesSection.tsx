import { Text, View } from 'react-native';

import { CertificateShareAction } from '@/components/features/CertificateShareAction';
import { Card } from '@/components/ui';
import { pathTitleKey } from '@/lib/pathProgress';
import { useProgressStore } from '@/store/progressStore';
import { useThemeMode } from '@/theme';

export function ProfileCertificatesSection() {
  const { tokens, t } = useThemeMode();
  const completedPathIds = useProgressStore((state) => state.completedPathIds);
  const pathCompletedAt = useProgressStore((state) => state.pathCompletedAt);

  if (completedPathIds.length === 0) {
    return null;
  }

  return (
    <View style={{ gap: tokens.spacing.space3 }}>
      <Text
        style={{
          color: tokens.colors.text.primary,
          fontFamily: tokens.typography.fontFamily.heading,
          fontSize: tokens.typography.fontSize.headingMd,
        }}>
        {t('profile.certificatesSection')}
      </Text>

      <Card variant="solid">
        <View style={{ gap: tokens.spacing.space4 }}>
          <Text
            style={{
              color: tokens.colors.text.secondary,
              fontFamily: tokens.typography.fontFamily.body,
              fontSize: tokens.typography.fontSize.bodySm,
              lineHeight: tokens.typography.fontSize.bodySm * 1.5,
            }}>
            {t('profile.certificatesDescription')}
          </Text>

          {completedPathIds.map((pathId, index) => (
            <View
              key={pathId}
              style={{
                borderTopColor: tokens.colors.border.subtle,
                borderTopWidth: index === 0 ? 0 : 1,
                gap: tokens.spacing.space3,
                paddingTop: index === 0 ? 0 : tokens.spacing.space3,
              }}>
              <Text
                style={{
                  color: tokens.colors.text.primary,
                  fontFamily: tokens.typography.fontFamily.heading,
                  fontSize: tokens.typography.fontSize.bodyLg,
                }}>
                {t(pathTitleKey(pathId))}
              </Text>
              <CertificateShareAction
                completedAt={pathCompletedAt[pathId] ?? new Date().toISOString()}
                pathId={pathId}
                variant="ghost"
              />
            </View>
          ))}
        </View>
      </Card>
    </View>
  );
}
