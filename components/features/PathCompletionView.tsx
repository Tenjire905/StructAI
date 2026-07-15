import { useEffect, useRef } from 'react';
import { ScrollView, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { CertificateShareAction } from '@/components/features/CertificateShareAction';
import { CertificateView } from '@/components/features/CertificateView';
import { OrbCompanion } from '@/components/features/OrbCompanion';
import { StatBlock } from '@/components/features/StatBlock';
import { Button, ProgressBar } from '@/components/ui';
import { useOrbCompanionState } from '@/hooks/useOrbCompanionState';
import {
  CERTIFICATE_LAYOUT_HEIGHT,
  CERTIFICATE_LAYOUT_WIDTH,
} from '@/lib/certificateExport';
import { getPathCompletionStats } from '@/lib/pathCapstone';
import { computePathProgressBarModel, pathTitleKey } from '@/lib/pathProgress';
import { getNextPathId } from '@/lib/pathUnlock';
import { resolveProfileDisplayName } from '@/lib/profileDisplayName';
import { getPathTemplate } from '@/lib/pathLessonUtils';
import { useAuth } from '@/providers/AuthProvider';
import { useProgressStore } from '@/store/progressStore';
import { getShadow, useCelebration, useThemeMode } from '@/theme';

type PathCompletionViewProps = {
  pathId: string;
  orbsReward: number;
  onStartNextPath?: () => void;
  onFinish: () => void;
};

export function PathCompletionView({
  pathId,
  orbsReward,
  onStartNextPath,
  onFinish,
}: PathCompletionViewProps) {
  const { tokens, t, locale, mode } = useThemeMode();
  const { celebrate } = useCelebration();
  const { user } = useAuth();
  const companionState = useOrbCompanionState('celebrating');
  const isPlayful = tokens.presentation.orbStyle === 'illustrated';
  const finishedRef = useRef(false);
  const path = getPathTemplate(pathId);
  const totalChapters = path?.totalChapters ?? 0;
  const pathProgress = useProgressStore((state) => state.pathProgress[pathId]);
  const stats = getPathCompletionStats(pathId, pathProgress);
  const progressBar = computePathProgressBarModel(pathId, pathProgress);
  const nextPathId = getNextPathId(pathId);
  const completedAt =
    useProgressStore((state) => state.pathCompletedAt[pathId]) ?? new Date().toISOString();
  const recipientName = resolveProfileDisplayName(user);
  const previewScale = 0.72;
  const spring = tokens.motion.spring[tokens.presentation.springPreset];

  const overlayOpacity = useSharedValue(0);
  const orbScale = useSharedValue(0.6);
  const titleScale = useSharedValue(0.8);
  const statsOpacity = useSharedValue(0);
  const certificateScale = useSharedValue(0.5);
  const certificateRotate = useSharedValue(-6);
  const ctaTranslateY = useSharedValue<number>(tokens.spacing.space4);
  const ctaOpacity = useSharedValue(0);
  const ringScale = useSharedValue(isPlayful ? 0.8 : 1);
  const ringOpacity = useSharedValue(0);

  useEffect(() => {
    if (finishedRef.current) {
      return;
    }

    finishedRef.current = true;
    celebrate('path_complete', {
      orbCount: orbsReward > 0 ? orbsReward : undefined,
      pathTitleKey: pathTitleKey(pathId),
    });

    const d = tokens.motion.duration;
    overlayOpacity.value = withTiming(1, { duration: d.fast });

    orbScale.value = withDelay(
      d.instant,
      withSequence(
        withSpring(1.2, spring),
        withSpring(1, tokens.motion.spring.default),
      ),
    );

    if (isPlayful) {
      ringOpacity.value = withDelay(
        d.instant,
        withSequence(
          withTiming(0.55, { duration: d.fast }),
          withTiming(0, { duration: d.medium }),
        ),
      );
      ringScale.value = withDelay(
        d.instant,
        withSpring(1.6, spring),
      );
    }

    titleScale.value = withDelay(
      d.medium,
      withSequence(
        withSpring(1.15, spring),
        withSpring(1, tokens.motion.spring.default),
      ),
    );

    statsOpacity.value = withDelay(d.medium, withTiming(1, { duration: d.fast }));

    certificateScale.value = withDelay(
      Math.round(d.celebration * 0.35),
      withSpring(1, spring),
    );
    certificateRotate.value = withDelay(
      Math.round(d.celebration * 0.35),
      withSpring(0, tokens.motion.spring.default),
    );

    ctaOpacity.value = withDelay(d.celebration, withTiming(1, { duration: d.fast }));
    ctaTranslateY.value = withDelay(
      d.celebration,
      withSpring(0, spring),
    );
  }, [
    celebrate,
    certificateRotate,
    certificateScale,
    ctaOpacity,
    ctaTranslateY,
    isPlayful,
    orbScale,
    orbsReward,
    overlayOpacity,
    pathId,
    ringOpacity,
    ringScale,
    spring,
    statsOpacity,
    titleScale,
    tokens.motion.duration,
    tokens.motion.spring.default,
  ]);

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: overlayOpacity.value,
  }));

  const orbStyle = useAnimatedStyle(() => ({
    transform: [{ scale: orbScale.value }],
  }));

  const ringStyle = useAnimatedStyle(() => ({
    opacity: ringOpacity.value,
    transform: [{ scale: ringScale.value }],
  }));

  const titleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: titleScale.value }],
  }));

  const statsStyle = useAnimatedStyle(() => ({
    opacity: statsOpacity.value,
  }));

  const certificateStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: certificateScale.value },
      { rotate: `${certificateRotate.value}deg` },
    ],
  }));

  const ctaStyle = useAnimatedStyle(() => ({
    opacity: ctaOpacity.value,
    transform: [{ translateY: ctaTranslateY.value }],
  }));

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
      <Animated.View
        pointerEvents="none"
        style={[
          overlayStyle,
          {
            backgroundColor: tokens.colors.background.base,
            bottom: 0,
            left: 0,
            opacity: 0,
            position: 'absolute',
            right: 0,
            top: 0,
          },
        ]}
      />

      <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        {isPlayful ? (
          <Animated.View
            pointerEvents="none"
            style={[
              ringStyle,
              {
                borderColor: tokens.colors.accent.structure,
                borderRadius: tokens.radius.pill,
                borderWidth: 2,
                height: tokens.spacing.space8 * 1.45,
                position: 'absolute',
                width: tokens.spacing.space8 * 1.45,
              },
            ]}
          />
        ) : null}
        <Animated.View
          style={[
            orbStyle,
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
        </Animated.View>
      </View>

      <Animated.Text
        style={[
          titleStyle,
          {
            color: tokens.colors.text.primary,
            fontFamily: tokens.typography.fontFamily.display,
            fontSize: tokens.typography.fontSize.displayLg,
            textAlign: 'center',
          },
        ]}>
        {t('pathCompletion.titleFull')}
      </Animated.Text>

      <Text
        style={{
          color: tokens.colors.text.secondary,
          fontFamily: tokens.typography.fontFamily.bodyMedium,
          fontSize: tokens.typography.fontSize.bodyLg,
          lineHeight: tokens.typography.fontSize.bodyLg * 1.5,
          textAlign: 'center',
        }}>
        {t('pathCompletion.subtitleFull', {
          path: t(pathTitleKey(pathId)),
          total: totalChapters,
        })}
      </Text>

      <View style={{ alignSelf: 'stretch', gap: tokens.spacing.space2, width: '100%' }}>
        <ProgressBar
          animateOnMount
          color="structure"
          completedSegments={progressBar.completedSegments}
          failedSegments={progressBar.failedSegments}
          progress={1}
        />
      </View>

      <Animated.View
        style={[
          statsStyle,
          {
            flexDirection: 'row',
            gap: tokens.spacing.space3,
            width: '100%',
          },
        ]}>
        <StatBlock
          copyKey="pathCompletion.statCompleted"
          value={`${stats.completed}/${stats.total}`}
        />
        <StatBlock copyKey="pathCompletion.statCertificate" value="✓" />
      </Animated.View>

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

      <Animated.View
        style={[
          certificateStyle,
          {
            alignItems: 'center',
            height: CERTIFICATE_LAYOUT_HEIGHT * previewScale,
            justifyContent: 'center',
            width: CERTIFICATE_LAYOUT_WIDTH * previewScale,
          },
        ]}>
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
      </Animated.View>

      <Animated.View
        style={[
          ctaStyle,
          isPlayful && nextPathId ? getShadow('glow') : undefined,
          { alignSelf: 'stretch', gap: tokens.spacing.space3, width: '100%' },
        ]}>
        {nextPathId && onStartNextPath ? (
          <Button
            label={t('pathCompletion.startNextPathCta', {
              path: t(pathTitleKey(nextPathId)),
            })}
            onPress={onStartNextPath}
            variant="primary"
          />
        ) : null}

        <CertificateShareAction completedAt={completedAt} fullWidth pathId={pathId} />

        <Button label={t('pathCompletion.backToPaths')} onPress={onFinish} variant="ghost" />
      </Animated.View>
    </ScrollView>
  );
}
