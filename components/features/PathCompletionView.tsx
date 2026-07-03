import { useEffect, useRef } from 'react';
import { ScrollView, Text, View } from 'react-native';

import { CertificateShareAction } from '@/components/features/CertificateShareAction';
import { CertificateView } from '@/components/features/CertificateView';
import { OrbCompanion } from '@/components/features/OrbCompanion';
import { Button } from '@/components/ui';
import { useOrbCompanionState } from '@/hooks/useOrbCompanionState';
import {
  CERTIFICATE_LAYOUT_HEIGHT,
  CERTIFICATE_LAYOUT_WIDTH,
} from '@/lib/certificateExport';
import { pathTitleKey } from '@/lib/pathProgress';
import { resolveProfileDisplayName } from '@/lib/profileDisplayName';
import { getPathTemplate } from '@/lib/pathLessonUtils';
import { useAuth } from '@/providers/AuthProvider';
import { useProgressStore } from '@/store/progressStore';
import { getShadow, useCelebration, useThemeMode } from '@/theme';

type PathCompletionViewProps = {
  pathId: string;
  orbsReward: number;
  onFinish: () => void;
};

export function PathCompletionView({ pathId, orbsReward, onFinish }: PathCompletionViewProps) {
  const { tokens, t, locale, mode } = useThemeMode();
  const { celebrate } = useCelebration();
  const { user } = useAuth();
  const companionState = useOrbCompanionState('celebrating');
  const isPlayful = tokens.presentation.orbStyle === 'illustrated';
  const finishedRef = useRef(false);
  const path = getPathTemplate(pathId);
  const totalChapters = path?.totalChapters ?? 0;
  const completedAt =
    useProgressStore((state) => state.pathCompletedAt[pathId]) ?? new Date().toISOString();
  const recipientName = resolveProfileDisplayName(user);
  const previewScale = 0.72;

  useEffect(() => {
    if (finishedRef.current) {
      return;
    }

    finishedRef.current = true;
    celebrate('path_complete', {
      orbCount: orbsReward > 0 ? orbsReward : undefined,
      pathTitleKey: pathTitleKey(pathId),
    });
  }, [celebrate, orbsReward, pathId]);

  return (
    <ScrollView
      contentContainerStyle={{
        alignItems: 'center',
        gap: tokens.spacing.space5,
        justifyContent: 'center',
        minHeight: '100%',
        paddingHorizontal: tokens.spacing.screenPadding,
        paddingVertical: tokens.spacing.space6,
      }}
      style={{ backgroundColor: tokens.colors.background.base, flex: 1 }}>
      <View
        style={[
          isPlayful ? getShadow('glow') : undefined,
          {
            alignItems: 'center',
            backgroundColor: tokens.colors.surface.card,
            borderRadius: tokens.radius.pill,
            height: tokens.spacing.space8 * 1.15,
            justifyContent: 'center',
            width: tokens.spacing.space8 * 1.15,
          },
        ]}>
        <OrbCompanion size={tokens.spacing.space8 * 0.85} state={companionState} />
      </View>

      <Text
        style={{
          color: tokens.colors.text.primary,
          fontFamily: tokens.typography.fontFamily.display,
          fontSize: tokens.typography.fontSize.displayLg,
          textAlign: 'center',
        }}>
        {t('pathCompletion.title')}
      </Text>

      <Text
        style={{
          color: tokens.colors.text.secondary,
          fontFamily: tokens.typography.fontFamily.bodyMedium,
          fontSize: tokens.typography.fontSize.bodyLg,
          lineHeight: tokens.typography.fontSize.bodyLg * 1.5,
          textAlign: 'center',
        }}>
        {t('pathCompletion.subtitle', {
          path: t(pathTitleKey(pathId)),
          total: totalChapters,
        })}
      </Text>

      {orbsReward > 0 ? (
        <Text
          style={{
            color: tokens.colors.accent.structure,
            fontFamily: tokens.typography.fontFamily.mono,
            fontSize: tokens.typography.fontSize.headingLg,
          }}>
          {t('lesson.orbsEarned', { count: orbsReward })}
        </Text>
      ) : null}

      <View
        style={{
          alignItems: 'center',
          height: CERTIFICATE_LAYOUT_HEIGHT * previewScale,
          justifyContent: 'center',
          width: CERTIFICATE_LAYOUT_WIDTH * previewScale,
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
          style={{
            transform: [{ scale: previewScale }],
          }}
        />
      </View>

      <CertificateShareAction
        completedAt={completedAt}
        fullWidth
        pathId={pathId}
      />

      <Button
        label={t('pathCompletion.backToPaths')}
        onPress={onFinish}
        style={{ alignSelf: 'stretch' }}
        variant="ghost"
      />
    </ScrollView>
  );
}
