import { Stack, useLocalSearchParams } from 'expo-router';
import { Check, Lock, Play } from 'lucide-react-native';
import { ScrollView, Text, View } from 'react-native';

import { Button, Card } from '@/components/ui';
import { ProgressBar } from '@/components/ui';
import { getMockPath, type MockChapter } from '@/data/mockPaths';
import { useThemeMode } from '@/theme';

export default function LernpfadDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { tokens, t } = useThemeMode();
  const path = getMockPath(id ?? '');

  const headerOptions = {
    headerShown: true,
    title: path?.title ?? '',
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
  const progressPercent = Math.round((path.progress ?? 0) * 100);

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

            <ProgressBar color="structure" progress={path.progress ?? 0} />

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
          onPress={() => undefined}
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
                />
              ))}
            </View>
          </Card>
        </View>
      </ScrollView>
    </>
  );
}

type ChapterRowProps = {
  chapter: MockChapter;
  number: number;
  isLast: boolean;
};

function ChapterRow({ chapter, number, isLast }: ChapterRowProps) {
  const { tokens } = useThemeMode();

  const statusIcon = {
    completed: (
      <Check
        color={tokens.colors.accent.success}
        size={tokens.icons.sizes.md}
        strokeWidth={tokens.icons.strokeWidth}
      />
    ),
    current: (
      <Play
        color={tokens.colors.accent.primary}
        size={tokens.icons.sizes.md}
        strokeWidth={tokens.icons.strokeWidth}
      />
    ),
    locked: (
      <Lock
        color={tokens.colors.text.tertiary}
        size={tokens.icons.sizes.md}
        strokeWidth={tokens.icons.strokeWidth}
      />
    ),
  }[chapter.status];

  const titleColor = {
    completed: tokens.colors.text.secondary,
    current: tokens.colors.text.primary,
    locked: tokens.colors.text.tertiary,
  }[chapter.status];

  return (
    <View
      style={{
        alignItems: 'center',
        borderBottomColor: tokens.colors.border.subtle,
        borderBottomWidth: isLast ? 0 : 1,
        flexDirection: 'row',
        gap: tokens.spacing.space3,
        paddingVertical: tokens.spacing.space3,
      }}>
      <Text
        style={{
          color: tokens.colors.text.tertiary,
          fontFamily: tokens.typography.fontFamily.mono,
          fontSize: tokens.typography.fontSize.bodySm,
          width: tokens.spacing.space5,
        }}>
        {String(number).padStart(2, '0')}
      </Text>
      <Text
        style={{
          color: titleColor,
          flex: 1,
          fontFamily:
            chapter.status === 'current'
              ? tokens.typography.fontFamily.bodyMedium
              : tokens.typography.fontFamily.body,
          fontSize: tokens.typography.fontSize.bodyLg,
        }}>
        {chapter.title}
      </Text>
      {statusIcon}
    </View>
  );
}
