import { Stack, useLocalSearchParams } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';

import { ChapterRow } from '@/components/features';
import { Card } from '@/components/ui';
import { getLessonText } from '@/data/lessonContent';
import type { MockChapter } from '@/data/mockPaths';
import { pathTitleKey } from '@/lib/pathProgress';
import { ThemeModeScope, colors, useThemeMode } from '@/theme';

const DEMO_CHAPTERS: MockChapter[] = [
  { id: 'pb-1', title: 'Was ist ein Prompt?', status: 'completed' },
  { id: 'pb-2', title: 'Klare Anweisungen', status: 'failed' },
  { id: 'pb-3', title: 'Zieldefinition', status: 'current' },
  { id: 'pb-4', title: 'Formatvorgaben', status: 'locked' },
];

function PathDetailChapterListPreview() {
  const { t, locale } = useThemeMode();

  return (
    <View style={{ gap: 12 }}>
      <Text
        style={{
          color: colors.text.secondary,
          fontFamily: 'GeneralSans-Medium',
          fontSize: 14,
        }}>
        Lernpfad-Detail · {t(pathTitleKey('prompt-basics'))}
      </Text>

      <Text
        style={{
          color: colors.text.primary,
          fontFamily: 'ClashDisplay-Medium',
          fontSize: 18,
        }}>
        {t('pathDetail.chapterListTitle')}
      </Text>

      <Card variant="solid">
        <View>
          {DEMO_CHAPTERS.map((chapter, index) => (
            <ChapterRow
              chapter={chapter}
              isLast={index === DEMO_CHAPTERS.length - 1}
              key={chapter.id}
              number={index + 1}
              onPress={() => undefined}
              title={getLessonText(`${chapter.id}.title`, locale)}
            />
          ))}
        </View>
      </Card>
    </View>
  );
}

export default function DevD2ChapterStatesPreviewScreen() {
  const { mode } = useLocalSearchParams<{ mode?: string }>();
  const previewMode = mode === 'focus' ? 'focus' : 'playful';

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ThemeModeScope mode={previewMode}>
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: 'center',
            padding: 16,
          }}
          style={{ backgroundColor: colors.background.base, flex: 1 }}>
          <PathDetailChapterListPreview />
        </ScrollView>
      </ThemeModeScope>
    </>
  );
}
