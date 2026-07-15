import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { ScrollView, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { ChapterRow, LockedPathView } from '@/components/features';
import { Button, Card, ProgressBar } from '@/components/ui';
import { getLessonText } from '@/data/lessonContent';
import {
  getContinueLessonId,
  getMergedPath,
  getPathProgressBarModel,
  pathTitleKey,
} from '@/lib/pathProgress';
import { getPathUnlockBlockReason } from '@/lib/pathUnlock';
import { useProgressStore } from '@/store/progressStore';
import { getShadow, useThemeMode } from '@/theme';

export default function LernpfadDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const pathId = id ?? '';
  const { tokens, t, locale } = useThemeMode();
  const router = useRouter();
  const pathProgress = useProgressStore((state) => state.pathProgress);
  const path = getMergedPath(pathId, pathProgress);

  const headerOptions = {
    headerShown: true,
    title: path ? t(pathTitleKey(path.id)) : '',
    headerStyle: { backgroundColor: tokens.colors.background.elevated },
    headerTintColor: tokens.colors.text.primary,
    headerTitleStyle: { fontFamily: tokens.typography.fontFamily.heading },
  };

  if (!path) {
    return (
      <>
        <Stack.Screen options={headerOptions} />
        <View
          style={{
            alignItems: 'center',
            backgroundColor: tokens.colors.background.base,
            flex: 1,
            justifyContent: 'center',
            paddingHorizontal: tokens.spacing.screenPadding,
          }}>
          <Text
            style={{
              color: tokens.colors.text.secondary,
              fontFamily: tokens.typography.fontFamily.body,
              fontSize: tokens.typography.fontSize.bodyLg,
            }}>
            {t('pathDetail.notFound')}
          </Text>
        </View>
      </>
    );
  }

  const isStarted = path.currentChapter !== undefined && path.progress !== undefined;
  const blockReason = getPathUnlockBlockReason(pathId, pathProgress);

  if (!isStarted && blockReason) {
    const prerequisiteTitle = t(pathTitleKey(blockReason.prerequisitePathId));

    return (
      <>
        <Stack.Screen options={headerOptions} />
        <LockedPathView
          onBack={() => router.replace('/(tabs)/lernpfade')}
          prerequisitePathTitle={prerequisiteTitle}
        />
      </>
    );
  }

  const progressBar = getPathProgressBarModel(pathId, pathProgress);
  const progressPercent = Math.round(progressBar.completedRatio * 100);
  const shouldPulseCta = progressPercent > 80;

  return (
    <>
      <Stack.Screen options={headerOptions} />
      <ScrollView
        contentContainerStyle={{
          gap: tokens.spacing.space5,
          paddingBottom: tokens.spacing.space7,
          paddingHorizontal: tokens.spacing.screenPadding,
          paddingTop: tokens.spacing.space5,
        }}
        style={{ backgroundColor: tokens.colors.background.base, flex: 1 }}>
        <Card variant="solid">
          <View style={{ gap: tokens.spacing.space3 }}>
            <View
              style={{
                alignItems: 'center',
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <Text
                style={{
                  color: tokens.colors.text.primary,
                  fontFamily: tokens.typography.fontFamily.heading,
                  fontSize: tokens.typography.fontSize.headingMd,
                }}>
                {t('pathDetail.progressTitle')}
              </Text>
              <Text
                style={{
                  color: tokens.colors.accent.structure,
                  fontFamily: tokens.typography.fontFamily.mono,
                  fontSize: tokens.typography.fontSize.headingMd,
                }}>
                {progressPercent} %
              </Text>
            </View>

            <ProgressBar
              animateOnMount
              color="structure"
              completedSegments={progressBar.completedSegments}
              failedSegments={progressBar.failedSegments}
              progress={progressBar.completedRatio}
            />

            <Text
              style={{
                color: tokens.colors.text.secondary,
                fontFamily: tokens.typography.fontFamily.body,
                fontSize: tokens.typography.fontSize.bodyMd,
              }}>
              {path.currentChapter !== undefined
                ? t('pathCard.chapters', {
                    current: path.currentChapter,
                    total: path.totalChapters,
                  })
                : t('pathCard.chaptersTotal', { total: path.totalChapters })}
            </Text>
          </View>
        </Card>

        <PulsingCta enabled={shouldPulseCta}>
          <Button
            label={isStarted ? t('pathDetail.continueCta') : t('pathDetail.startCta')}
            onPress={() => {
              router.push(`/lektion/${getContinueLessonId(path)}`);
            }}
            variant="primary"
          />
        </PulsingCta>

        <View style={{ gap: tokens.spacing.space3 }}>
          <Text
            style={{
              color: tokens.colors.text.primary,
              fontFamily: tokens.typography.fontFamily.heading,
              fontSize: tokens.typography.fontSize.headingMd,
            }}>
            {t('pathDetail.chapterListTitle')}
          </Text>

          <Card variant="solid">
            <View>
              {path.chapters.map((chapter, index) => (
                <ChapterRow
                  chapter={chapter}
                  entryIndex={index}
                  isLast={index === path.chapters.length - 1}
                  key={chapter.id}
                  number={index + 1}
                  onPress={(lessonId) => router.push(`/lektion/${lessonId}`)}
                  title={getLessonText(`${chapter.id}.title`, locale)}
                />
              ))}
            </View>
          </Card>
        </View>
      </ScrollView>
    </>
  );
}

function PulsingCta({
  children,
  enabled,
}: {
  children: React.ReactNode;
  enabled: boolean;
}) {
  const { tokens } = useThemeMode();
  const scale = useSharedValue(1);
  const isPlayful = tokens.presentation.orbStyle === 'illustrated';

  useEffect(() => {
    if (!enabled) {
      scale.value = withSpring(1, tokens.motion.spring.default);
      return;
    }

    scale.value = withRepeat(
      withSequence(
        withTiming(1.03, { duration: tokens.motion.duration.medium }),
        withTiming(1, { duration: tokens.motion.duration.medium }),
      ),
      -1,
      false,
    );
  }, [enabled, scale, tokens.motion.duration, tokens.motion.spring.default]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={[animatedStyle, enabled && isPlayful ? getShadow('glow') : undefined]}>
      {children}
    </Animated.View>
  );
}
