import { useRouter } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';

import { PathCard } from '@/components/features';
import { MOCK_PATHS } from '@/data/mockPaths';
import { useThemeMode } from '@/theme';

export default function LernpfadeScreen() {
  const { tokens, t } = useThemeMode();
  const router = useRouter();

  const activePaths = MOCK_PATHS.filter((path) => path.progress !== undefined);
  const availablePaths = MOCK_PATHS.filter((path) => path.progress === undefined);

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
          activePaths.map((path) => (
            <PathCard
              currentChapter={path.currentChapter}
              key={path.id}
              onPress={() => router.push(`/lernpfad/${path.id}`)}
              progress={path.progress}
              title={path.title}
              totalChapters={path.totalChapters}
            />
          ))
        )}
      </View>

      <View style={{ gap: tokens.spacing.space3 }}>
        <Text
          style={{
            color: tokens.colors.text.primary,
            fontFamily: tokens.typography.fontFamily.heading,
            fontSize: tokens.typography.fontSize.headingMd,
          }}>
          {t('paths.sectionAvailable')}
        </Text>

        {availablePaths.map((path) => (
          <PathCard
            badgeLabel={path.isNew ? t('paths.badgeNew') : undefined}
            badgeTone="primary"
            key={path.id}
            onPress={() => router.push(`/lernpfad/${path.id}`)}
            title={path.title}
            totalChapters={path.totalChapters}
          />
        ))}
      </View>
    </ScrollView>
  );
}
