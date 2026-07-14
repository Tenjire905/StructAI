import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';

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
import { useThemeMode } from '@/theme';

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
              color="structure"
              failedRatio={progressBar.failedRatio}
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

        <Button
          label={isStarted ? t('pathDetail.continueCta') : t('pathDetail.startCta')}
          onPress={() => {
            router.push(`/lektion/${getContinueLessonId(path)}`);
          }}
          variant="primary"
        />

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
