import { useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ScrollView,
  Text,
  View,
  useWindowDimensions,
  type View as RNView,
} from 'react-native';

import {
  OrbCounter,
  PathCard,
  PathCardRetryPeek,
  PATH_CARD_RETRY_PEEK_MAX_HEIGHT,
  StatBlock,
  StreakTracker,
} from '@/components/features';
import { Avatar, Button, Card } from '@/components/ui';
import {
  computePathProgressBarModel,
  getFirstFailedLessonIdInOrder,
  pathTitleKey,
} from '@/lib/pathProgress';
import { isPathFullyCompleted } from '@/lib/pathCompletion';
import { DEFAULT_START_PATH_ID } from '@/lib/pathLessonUtils';
import { isDailyGoalSetupCompleted } from '@/lib/appStorage';
import { resolveGuestDisplayName, resolveProfileDisplayName } from '@/lib/profileDisplayName';
import { useAuth } from '@/providers/AuthProvider';
import { useProgressStore } from '@/store/progressStore';
import { useThemeMode } from '@/theme';

/** Space reserved for tab bar + safe inset when scrolling peek into view. */
const SCROLL_BOTTOM_INSET = 120;

export default function HomeScreen() {
  const { tokens, t } = useThemeMode();
  const router = useRouter();
  const { height: windowHeight } = useWindowDimensions();
  const scrollViewRef = useRef<ScrollView>(null);
  const scrollOffsetRef = useRef(0);
  const pathCardRefs = useRef<Record<string, RNView | null>>({});
  const [retryPeek, setRetryPeek] = useState<{ pathId: string; nonce: number } | null>(null);
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
  const pathProgress = useProgressStore((state) => state.pathProgress);
  const activePaths = useMemo(
    () => useProgressStore.getState().getActivePaths(),
    [pathProgress],
  );

  const scrollPeekIntoView = useCallback(
    (pathId: string) => {
      const cardRef = pathCardRefs.current[pathId];

      if (!cardRef) {
        return;
      }

      cardRef.measureInWindow((_x, cardY, _width, cardHeight) => {
        const peekBottom = cardY + cardHeight + PATH_CARD_RETRY_PEEK_MAX_HEIGHT;
        const visibleBottom = windowHeight - SCROLL_BOTTOM_INSET;

        if (peekBottom <= visibleBottom) {
          return;
        }

        scrollViewRef.current?.scrollTo({
          y: scrollOffsetRef.current + (peekBottom - visibleBottom),
          animated: true,
        });
      });
    },
    [windowHeight],
  );

  useEffect(() => {
    if (!retryPeek) {
      return;
    }

    const scrollTimer = setTimeout(() => {
      scrollPeekIntoView(retryPeek.pathId);
    }, 320);

    return () => {
      clearTimeout(scrollTimer);
    };
  }, [retryPeek, scrollPeekIntoView]);

  return (
    <ScrollView
      ref={scrollViewRef}
      contentContainerStyle={{
        gap: tokens.spacing.space5,
        paddingBottom: tokens.spacing.space7,
        paddingHorizontal: tokens.spacing.screenPadding,
        paddingTop: tokens.spacing.space5,
      }}
      onScroll={(event) => {
        scrollOffsetRef.current = event.nativeEvent.contentOffset.y;
      }}
      scrollEventThrottle={16}
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
            const pathIsComplete = isPathFullyCompleted(path.id, pathRecord);
            const isRetryPeekVisible = retryPeek?.pathId === path.id;
            const retryEmptyLabel = pathIsComplete
              ? t('home.retryFailedNone')
              : t('home.retryFailedNoOpen');

            return (
              <View
                key={path.id}
                ref={(node) => {
                  pathCardRefs.current[path.id] = node;
                }}>
                <PathCard
                  currentChapter={path.currentChapter}
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
                      emptyLabel={retryEmptyLabel}
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
              </View>
            );
          })
        )}
      </View>
    </ScrollView>
  );
}
