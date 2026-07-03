import { LinearGradient } from 'expo-linear-gradient';
import { forwardRef } from 'react';
import { Text, View, type ViewStyle } from 'react-native';

import { formatCertificateDate } from '@/lib/certificateFormat';
import {
  CERTIFICATE_LAYOUT_HEIGHT,
  CERTIFICATE_LAYOUT_WIDTH,
} from '@/lib/certificateExport';
import { getShadow, type ThemeMode } from '@/theme';
import { colors, gradients, radius, spacing, typography } from '@/theme/theme';

export type CertificateViewProps = {
  pathTitle: string;
  recipientName: string;
  completedAt: string;
  locale: 'de' | 'en' | 'fr' | 'ru';
  mode: ThemeMode;
  badgeLabel: string;
  awardedToLabel: string;
  completedOnLabel: string;
  brandTagline: string;
  style?: ViewStyle;
};

export const CertificateView = forwardRef<View, CertificateViewProps>(function CertificateView(
  {
    pathTitle,
    recipientName,
    completedAt,
    locale,
    mode,
    badgeLabel,
    awardedToLabel,
    completedOnLabel,
    brandTagline,
    style,
  },
  ref,
) {
  const isPlayful = mode === 'playful';
  const formattedDate = formatCertificateDate(completedAt, locale);

  return (
    <View
      collapsable={false}
      ref={ref}
      style={[
        isPlayful ? getShadow('glow') : getShadow(2),
        {
          borderColor: isPlayful ? colors.accent.primary : colors.border.strong,
          borderRadius: radius.xl,
          borderWidth: isPlayful ? 1.5 : 1,
          height: CERTIFICATE_LAYOUT_HEIGHT,
          overflow: 'hidden',
          width: CERTIFICATE_LAYOUT_WIDTH,
        },
        style,
      ]}>
      <LinearGradient
        colors={[...gradients.heroBackground.colors]}
        end={gradients.heroBackground.end}
        start={gradients.heroBackground.start}
        style={{ flex: 1, padding: spacing.space5 }}>
        <View style={{ alignItems: 'center', gap: spacing.space2 }}>
          <Text
            style={{
              color: colors.accent.primary,
              fontFamily: typography.fontFamily.display,
              fontSize: typography.fontSize.headingMd,
              letterSpacing: 1.2,
            }}>
            StructAI
          </Text>
          <Text
            style={{
              color: colors.text.tertiary,
              fontFamily: typography.fontFamily.body,
              fontSize: typography.fontSize.bodySm,
              letterSpacing: 0.6,
              textAlign: 'center',
              textTransform: 'uppercase',
            }}>
            {brandTagline}
          </Text>
        </View>

        <View
          style={{
            alignItems: 'center',
            flex: 1,
            gap: spacing.space4,
            justifyContent: 'center',
            paddingVertical: spacing.space3,
          }}>
          <View
            style={{
              backgroundColor: isPlayful
                ? 'rgba(139,92,246,0.18)'
                : colors.surface.glass,
              borderColor: isPlayful ? colors.accent.primary : colors.border.subtle,
              borderRadius: radius.pill,
              borderWidth: 1,
              paddingHorizontal: spacing.space4,
              paddingVertical: spacing.space2,
            }}>
            <Text
              style={{
                color: isPlayful ? colors.accent.structure : colors.text.secondary,
                fontFamily: typography.fontFamily.bodyMedium,
                fontSize: typography.fontSize.bodySm,
                letterSpacing: 0.8,
                textTransform: 'uppercase',
              }}>
              {badgeLabel}
            </Text>
          </View>

          <Text
            style={{
              color: colors.text.primary,
              fontFamily: typography.fontFamily.display,
              fontSize: typography.fontSize.displayLg,
              lineHeight: typography.fontSize.displayLg * 1.15,
              textAlign: 'center',
            }}>
            {pathTitle}
          </Text>

          <View style={{ alignItems: 'center', gap: spacing.space2, width: '100%' }}>
            <Text
              style={{
                color: colors.text.tertiary,
                fontFamily: typography.fontFamily.body,
                fontSize: typography.fontSize.bodySm,
                textTransform: 'uppercase',
              }}>
              {awardedToLabel}
            </Text>
            <Text
              style={{
                color: colors.text.primary,
                fontFamily: typography.fontFamily.heading,
                fontSize: typography.fontSize.headingLg,
                textAlign: 'center',
              }}>
              {recipientName}
            </Text>
          </View>

          <View style={{ alignItems: 'center', gap: spacing.space1 }}>
            <Text
              style={{
                color: colors.text.tertiary,
                fontFamily: typography.fontFamily.body,
                fontSize: typography.fontSize.bodySm,
              }}>
              {completedOnLabel}
            </Text>
            <Text
              style={{
                color: colors.accent.success,
                fontFamily: typography.fontFamily.mono,
                fontSize: typography.fontSize.bodyMd,
              }}>
              {formattedDate}
            </Text>
          </View>
        </View>

        <LinearGradient
          colors={[colors.accent.primary, colors.accent.structure]}
          end={{ x: 1, y: 0 }}
          start={{ x: 0, y: 0 }}
          style={{
            borderRadius: radius.pill,
            height: 4,
            width: '100%',
          }}
        />
      </LinearGradient>
    </View>
  );
});
