import { ScrollView, Text, View } from 'react-native';
import { Stack } from 'expo-router';

import {
  OrbCounter,
  PathCard,
  StatBlock,
  StreakTracker,
} from '@/components/features';
import { Avatar } from '@/components/ui';
import { useThemeMode } from '@/theme';

const MOCK_USER = {
  name: 'Alex',
  initialsName: 'Alex Muster',
  orbCount: 142,
  orbMax: 200,
  streakDays: [true, true, true, true, false, false, false] as boolean[],
  completedLessons: 24,
  currentStreak: 4,
  continuePaths: [
    {
      id: 'prompt-basics',
      title: 'Prompt-Grundlagen',
      currentChapter: 3,
      totalChapters: 8,
      progress: 0.42,
    },
    {
      id: 'structure-lab',
      title: 'Struktur & Constraints',
      currentChapter: 1,
      totalChapters: 6,
      progress: 0.12,
    },
  ],
};

export default function HomeScreen() {
  const { tokens, t } = useThemeMode();

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
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
              {t('home.greeting', { name: MOCK_USER.name })}
            </Text>
            <Avatar name={MOCK_USER.initialsName} size="md" />
          </View>
          <OrbCounter count={MOCK_USER.orbCount} max={MOCK_USER.orbMax} />
        </View>

        <StreakTracker completedDays={MOCK_USER.streakDays} />

        <View style={{ flexDirection: 'row', gap: tokens.spacing.space3 }}>
          <StatBlock
            copyKey="statBlock.completedLessons"
            value={MOCK_USER.completedLessons}
          />
          <StatBlock copyKey="statBlock.currentStreak" value={MOCK_USER.currentStreak} />
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

          {MOCK_USER.continuePaths.map((path) => (
            <PathCard
              currentChapter={path.currentChapter}
              key={path.id}
              progress={path.progress}
              title={path.title}
              totalChapters={path.totalChapters}
            />
          ))}
        </View>
      </ScrollView>
    </>
  );
}
