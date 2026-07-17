import { useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { RefreshControl, ScrollView, Text, View } from 'react-native';

import {
  HomeActivityInsightsTile,
  OrbCounter,
  PathCard,
  PathCardRetryPeek,
} from '@/components/features';
import { Avatar, Button, Card } from '@/components/ui';
import { hydrateAppStorage, isDailyGoalSetupCompleted } from '@/lib/appStorage';
import {
  computePathProgressBarModel,
  getFirstFailedLessonIdInOrder,
  pathTitleKey,
} from '@/lib/pathProgress';
import { DEFAULT_START_PATH_ID } from '@/lib/pathLessonUtils';
import { hydrateProgressOnLogin } from '@/lib/progressSync';
import { resolveGuestDisplayName, resolveProfileDisplayName } from '@/lib/profileDisplayName';
import { useAuth } from '@/providers/AuthProvider';
import { useProgressStore } from '@/store/progressStore';
import { useThemeMode } from '@/theme';

export default function HomeScreen() {
  const { tokens, t } = useThemeMode();
  const router = useRouter();
  const [retryPeek, setRetryPeek] = useState<{ pathId: string; nonce: number } | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const { user, session } = useAuth();
  const displayName = session
    ? resolveProfileDisplayName(user)
    : resolveGuestDisplayName(t('profile.guestDisplayName'));
  const orbCount = useProgressStore((state) => state.orbCount);
  const orbsEarnedToday = useProgressStore((state) => state.orbsEarnedToday);
  const dailyOrbGoal = useProgressStore((state) => state.dailyOrbGoal);
  const dailyGoalConfigured = isDailyGoalSetupCompleted() && dailyOrbGoal > 0;
  const completedLessons = useProgressStore((state) => state.completedLessons);
  const currentStreak = useProgressStore((state) => state.currentStreak);
  const streakDays = useProgressStore((state) => state.streakDays);
  const dailyOrbHistory = useProgressStore((state) => state.dailyOrbHistory);
  const pathProgress = useProgressStore((state) => state.pathProgress);
  const activePaths = useMemo(
    () => useProgressStore.getState().getActivePaths(),
    [pathProgress],
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setRetryPeek(null);

    try {
      await hydrateAppStorage();
      useProgressStore.getState().hydrate();

      if (session?.user.id) {
        await hydrateProgressOnLogin(session.user.id);
      }
    } finally {
      setRefreshing(false);
    }
  }, [session?.user.id]);

  return (
    <ScrollView
      contentContainerStyle={{
        gap: tokens.spacing.space5,
        paddingBottom: tokens.spacing.space7,
        paddingHorizontal: tokens.spacing.screenPadding,
        paddingTop: tokens.spacing.space5,
      }}
      onScrollBeginDrag={() => setRetryPeek(null)}
      refreshControl={
        <RefreshControl
          colors={[tokens.colors.accent.primary]}
          onRefresh={() => {
            void onRefresh();
          }}
          progressBackgroundColor={tokens.colors.background.elevated}
          refreshing={refreshing}
          tintColor={tokens.colors.accent.primary}
        />
      }
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
        <OrbCounter
          count={orbCount}
          dailyOrbGoal={dailyGoalConfigured ? dailyOrbGoal : 0}
          onPress={() => router.push('/tagesziel')}
          orbsEarnedToday={orbsEarnedToday}
        />
      </View>

      <HomeActivityInsightsTile
        completedLessons={completedLessons}
        currentStreak={currentStreak}
        dailyOrbGoal={dailyGoalConfigured ? dailyOrbGoal : 0}
        dailyOrbHistory={dailyOrbHistory}
        orbsEarnedToday={orbsEarnedToday}
        streakDays={streakDays}
      />

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
          <Card variant="solid">
            <View style={{ gap: tokens.spacing.space3 }}>
              <Text
                style={{
                  color: tokens.colors.text.primary,
                  fontFamily: tokens.typography.fontFamily.heading,
                  fontSize: tokens.typography.fontSize.headingMd,
                }}>
                {t(pathTitleKey(DEFAULT_START_PATH_ID))}
              </Text>
              <Text
                style={{
                  color: tokens.colors.text.secondary,
                  fontFamily: tokens.typography.fontFamily.body,
                  fontSize: tokens.typography.fontSize.bodyMd,
                  lineHeight: tokens.typography.fontSize.bodyMd * 1.5,
                }}>
                {t('home.startHint')}
              </Text>
              <Button
                label={t('home.startCta')}
                onPress={() => router.push(`/lernpfad/${DEFAULT_START_PATH_ID}`)}
                variant="primary"
              />
            </View>
          </Card>
        ) : (
          activePaths.map((path) => {
            const pathRecord = pathProgress[path.id];
            const progressBar = computePathProgressBarModel(path.id, pathRecord);
            const firstFailedLessonId = getFirstFailedLessonIdInOrder(path.id, pathRecord);
            const isRetryPeekVisible = retryPeek?.pathId === path.id;

            return (
            <PathCard
              currentChapter={path.currentChapter}
              key={path.id}
              onLongPress={() =>
                setRetryPeek((current) =>
                  current?.pathId === path.id
                    ? { pathId: path.id, nonce: current.nonce + 1 }
                    : { pathId: path.id, nonce: 0 },
                )
              }
              onPress={() => {
                if (isRetryPeekVisible) {
                  setRetryPeek(null);
                  return;
                }

                setRetryPeek(null);
                router.push(`/lernpfad/${path.id}`);
              }}
              completedSegments={progressBar.completedSegments}
              failedSegments={progressBar.failedSegments}
              footer={
                <PathCardRetryPeek
                  emptyLabel={t('home.retryFailedNone')}
                  hasFailedLesson={Boolean(firstFailedLessonId)}
                  onDismiss={() =>
                    setRetryPeek((current) => (current?.pathId === path.id ? null : current))
                  }
                  onRetry={() => {
                    if (!firstFailedLessonId) {
                      return;
                    }

                    setRetryPeek(null);
                    router.push(`/lektion/${firstFailedLessonId}`);
                  }}
                  revealNonce={retryPeek?.pathId === path.id ? retryPeek.nonce : 0}
                  retryLabel={t('home.retryFailedCta')}
                  visible={isRetryPeekVisible}
                />
              }
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
