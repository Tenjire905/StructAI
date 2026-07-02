import { ScrollView, Text, View } from 'react-native';

import { PathCard } from '@/components/features';
import { useThemeMode } from '@/theme';

const MOCK_PATHS = {
  active: [
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
  available: [
    {
      id: 'context-mastery',
      title: 'Kontext & Rollen',
      totalChapters: 7,
      isNew: true,
    },
    {
      id: 'iteration-loops',
      title: 'Iteratives Verfeinern',
      totalChapters: 5,
      isNew: false,
    },
    {
      id: 'eval-scoring',
      title: 'Prompts bewerten',
      totalChapters: 6,
      isNew: false,
    },
  ],
};

export default function LernpfadeScreen() {
  const { tokens, t } = useThemeMode();

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

        {MOCK_PATHS.active.length === 0 ? (
          <Text
            style={{
              color: tokens.colors.text.secondary,
              fontFamily: tokens.typography.fontFamily.body,
              fontSize: tokens.typography.fontSize.bodyMd,
            }}>
            {t('paths.emptyActive')}
          </Text>
        ) : (
          MOCK_PATHS.active.map((path) => (
            <PathCard
              currentChapter={path.currentChapter}
              key={path.id}
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

        {MOCK_PATHS.available.map((path) => (
          <PathCard
            badgeLabel={path.isNew ? t('paths.badgeNew') : undefined}
            badgeTone="primary"
            key={path.id}
            title={path.title}
            totalChapters={path.totalChapters}
          />
        ))}
      </View>
    </ScrollView>
  );
}
