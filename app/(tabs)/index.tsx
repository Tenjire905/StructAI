import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import { ScrollView, Text, View } from 'react-native';

import {
  OrbCounter,
  PathCard,
  StatBlock,
  StreakTracker,
} from '@/components/features';
import { Avatar } from '@/components/ui';
import { computePathProgressBarModel, pathTitleKey } from '@/lib/pathProgress';
import { resolveProfileDisplayName } from '@/lib/profileDisplayName';
import { useAuth } from '@/providers/AuthProvider';
import { useProgressStore } from '@/store/progressStore';
import { useThemeMode } from '@/theme';

export default function HomeScreen() {
  const { tokens, t } = useThemeMode();
  const router = useRouter();
  const { user, session } = useAuth();
  const displayName = session ? resolveProfileDisplayName(user) : t('profile.guestDisplayName');
  const orbCount = useProgressStore((state) => state.orbCount);
  const orbMax = useProgressStore((state) => state.orbMax);
  const completedLessons = useProgressStore((state) => state.completedLessons);
  const currentStreak = useProgressStore((state) => state.currentStreak);
  const streakDays = useProgressStore((state) => state.streakDays);
  const pathProgress = useProgressStore((state) => state.pathProgress);
  const activePaths = useMemo(
    () => useProgressStore.getState().getActivePaths(),
    [pathProgress],
  );

  return (
    <ScrollView
      contentContainerStyle={{
        gap: tokens.spacing.space5,
        paddingBottom: tokens.spacing.space7,
        paddingHorizontal: tokens.spacing.screenPadding,
        paddingTop: tokens.spacing.space5,
      }}
      style={{ backgroundColor: tokens.colors.background.base, flex: 1 }}>
      <View
        style={{
          alignItems: 'center',
          flexDirection: 'row',
          gap: tokens.spacing.space3,
          justifyContent: 'space-between',
        }}>
        <View style={{ flex: 1, gap: tokens.spacing.space2 }}>
          <Text
            style={{
              color: tokens.colors.text.primary,
              fontFamily: tokens.typography.fontFamily.display,
              fontSize: tokens.typography.fontSize.headingLg,
            }}>
            {t('home.greeting', { name: displayName })}
          </Text>
          <Avatar name={displayName} size="md" />
        </View>
        <OrbCounter count={orbCount} max={orbMax} />
      </View>

      <StreakTracker completedDays={streakDays} />

      <View style={{ flexDirection: 'row', gap: tokens.spacing.space3 }}>
        <StatBlock copyKey="statBlock.completedLessons" value={completedLessons} />
        <StatBlock copyKey="statBlock.currentStreak" value={currentStreak} />
      </View>

      <View style={{ gap: tokens.spacing.space3 }}>
        <Text
          style={{
            color: tokens.colors.text.primary,
            fontFamily: tokens.typography.fontFamily.heading,
            fontSize: tokens.typography.fontSize.headingMd,
          }}>
          {t('home.continueLearning')}
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
              onPress={() => router.push(`/lektion/${path.resumeLessonId}`)}
              progress={progressBar.completedRatio}
              title={t(path.titleKey)}
              totalChapters={path.totalChapters}
            />
            );
          })
        )}
      </View>
    </ScrollView>
  );
}
