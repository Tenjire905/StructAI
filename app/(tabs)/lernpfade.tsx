import { useRouter } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';

import { PathCard } from '@/components/features';
import { computePathProgressBarModel, getMergedPaths, pathTitleKey } from '@/lib/pathProgress';
import { isPathUnlocked } from '@/lib/pathUnlock';
import { useProgressStore } from '@/store/progressStore';
import { useThemeMode } from '@/theme';

export default function LernpfadeScreen() {
  const { tokens, t } = useThemeMode();
  const router = useRouter();
  const pathProgress = useProgressStore((state) => state.pathProgress);
  const mergedPaths = getMergedPaths(pathProgress);

  const activePaths = mergedPaths.filter((path) => path.progress !== undefined);
  const notStartedPaths = mergedPaths.filter((path) => path.progress === undefined);
  const unlockedAvailablePaths = notStartedPaths.filter((path) =>
    isPathUnlocked(path.id, pathProgress),
  );
  const lockedPaths = notStartedPaths.filter((path) => !isPathUnlocked(path.id, pathProgress));

  return (
    <ScrollView
      contentContainerStyle={{
        gap: tokens.spacing.space5,
        paddingBottom: tokens.spacing.space7,
        paddingHorizontal: tokens.spacing.screenPadding,
        paddingTop: tokens.spacing.space5,
      }}
      style={{ backgroundColor: tokens.colors.background.base, flex: 1 }}>
      <View style={{ gap: tokens.spacing.space3 }}>
        <Text
          style={{
            color: tokens.colors.text.primary,
            fontFamily: tokens.typography.fontFamily.heading,
            fontSize: tokens.typography.fontSize.headingMd,
          }}>
          {t('paths.sectionActive')}
        </Text>

        {activePaths.length === 0 ? (
          <Text
            style={{
              color: tokens.colors.text.secondary,
              fontFamily: tokens.typography.fontFamily.body,
              fontSize: tokens.typography.fontSize.bodyMd,
            }}>
            {t('paths.emptyActive')}
          </Text>
        ) : (
          activePaths.map((path) => {
            const progressBar = computePathProgressBarModel(
              path.id,
              pathProgress[path.id],
            );

            return (
            <PathCard
              currentChapter={path.currentChapter}
              failedSegments={progressBar.failedSegments}
              key={path.id}
              onPress={() => router.push(`/lernpfad/${path.id}`)}
              progress={progressBar.completedRatio}
              title={t(pathTitleKey(path.id))}
              totalChapters={path.totalChapters}
            />
            );
          })
        )}
      </View>

      {unlockedAvailablePaths.length > 0 ? (
        <View style={{ gap: tokens.spacing.space3 }}>
          <Text
            style={{
              color: tokens.colors.text.primary,
              fontFamily: tokens.typography.fontFamily.heading,
              fontSize: tokens.typography.fontSize.headingMd,
            }}>
            {t('paths.sectionAvailable')}
          </Text>

          {unlockedAvailablePaths.map((path) => (
            <PathCard
              badgeLabel={path.isNew ? t('paths.badgeNew') : undefined}
              badgeTone="primary"
              key={path.id}
              onPress={() => router.push(`/lernpfad/${path.id}`)}
              title={t(pathTitleKey(path.id))}
              totalChapters={path.totalChapters}
            />
          ))}
        </View>
      ) : null}

      {lockedPaths.length > 0 ? (
        <View style={{ gap: tokens.spacing.space3 }}>
          <Text
            style={{
              color: tokens.colors.text.primary,
              fontFamily: tokens.typography.fontFamily.heading,
              fontSize: tokens.typography.fontSize.headingMd,
            }}>
            {t('paths.sectionLocked')}
          </Text>

          {lockedPaths.map((path) => (
            <PathCard
              key={path.id}
              locked
              title={t(pathTitleKey(path.id))}
              totalChapters={path.totalChapters}
            />
          ))}
        </View>
      ) : null}
    </ScrollView>
  );
}
