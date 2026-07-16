import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';

import {
  OrbCounter,
  PathCard,
  StatBlock,
  StreakTracker,
} from '@/components/features';
import { Avatar, Button, Card } from '@/components/ui';
import {
  computePathProgressBarModel,
  getFirstFailedLessonIdInOrder,
  pathTitleKey,
} from '@/lib/pathProgress';
import { DEFAULT_START_PATH_ID } from '@/lib/pathLessonUtils';
import { resolveGuestDisplayName, resolveProfileDisplayName } from '@/lib/profileDisplayName';
import { useAuth } from '@/providers/AuthProvider';
import { useProgressStore } from '@/store/progressStore';
import { useThemeMode } from '@/theme';

export default function HomeScreen() {
  const { tokens, t } = useThemeMode();
  const router = useRouter();
  const [retryMenuPathId, setRetryMenuPathId] = useState<string | null>(null);
  const { user, session } = useAuth();
  const displayName = session
    ? resolveProfileDisplayName(user)
    : resolveGuestDisplayName(t('profile.guestDisplayName'));
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
            const showRetryMenu = retryMenuPathId === path.id;

            return (
            <PathCard
              currentChapter={path.currentChapter}
              key={path.id}
              onLongPress={() =>
                setRetryMenuPathId((current) => (current === path.id ? null : path.id))
              }
              onPress={() => {
                setRetryMenuPathId(null);
                router.push(`/lernpfad/${path.id}`);
              }}
              completedSegments={progressBar.completedSegments}
              failedSegments={progressBar.failedSegments}
              footer={
                showRetryMenu ? (
                  <Button
                    disabled={!firstFailedLessonId}
                    label={
                      firstFailedLessonId
                        ? t('home.retryFailedCta')
                        : t('home.retryFailedNone')
                    }
                    onPress={() => {
                      if (!firstFailedLessonId) {
                        return;
                      }

                      setRetryMenuPathId(null);
                      router.push(`/lektion/${firstFailedLessonId}`);
                    }}
                    variant={firstFailedLessonId ? 'primary' : 'ghost'}
                  />
                ) : null
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
