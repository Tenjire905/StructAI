import { Stack, useLocalSearchParams } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';

import { PathCard } from '@/components/features';
import { Card, ProgressBar } from '@/components/ui';
import { computePathProgressBarModel, pathTitleKey } from '@/lib/pathProgress';
import type { PathProgressRecord } from '@/store/progressStore';
import { ThemeModeScope, colors, useThemeMode } from '@/theme';

const DEMO_PATH_ID = 'prompt-basics';
const DEMO_RECORD: PathProgressRecord = {
  completedLessonIds: ['pb-1', 'pb-2'],
  failedLessonIds: ['pb-3'],
  currentLessonId: 'pb-3',
  lastTouchedLessonId: 'pb-3',
  progress: 0.25,
};

function HomePreview() {
  const { t } = useThemeMode();
  const progressBar = computePathProgressBarModel(DEMO_PATH_ID, DEMO_RECORD);

  return (
    <View style={{ gap: 12 }}>
      <Text
        style={{
          color: colors.text.secondary,
          fontFamily: 'GeneralSans-Medium',
          fontSize: 14,
        }}>
        Home · PathCard
      </Text>
      <PathCard
        currentChapter={3}
        failedRatio={progressBar.failedRatio}
        progress={progressBar.completedRatio}
        title={t(pathTitleKey(DEMO_PATH_ID))}
        totalChapters={8}
      />
    </View>
  );
}

function DetailPreview() {
  const { t } = useThemeMode();
  const progressBar = computePathProgressBarModel(DEMO_PATH_ID, DEMO_RECORD);
  const progressPercent = Math.round(progressBar.completedRatio * 100);

  return (
    <View style={{ gap: 12 }}>
      <Text
        style={{
          color: colors.text.secondary,
          fontFamily: 'GeneralSans-Medium',
          fontSize: 14,
        }}>
        Lernpfad-Detail · Gesamtfortschritt
      </Text>
      <Card variant="solid">
        <View style={{ gap: 12 }}>
          <View
            style={{
              alignItems: 'center',
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <Text
              style={{
                color: colors.text.primary,
                fontFamily: 'ClashDisplay-Medium',
                fontSize: 18,
              }}>
              {t('pathDetail.progressTitle')}
            </Text>
            <Text
              style={{
                color: colors.accent.structure,
                fontFamily: 'SpaceMono-Regular',
                fontSize: 18,
              }}>
              {progressPercent} %
            </Text>
          </View>

          <ProgressBar
            color="structure"
            failedRatio={progressBar.failedRatio}
            progress={progressBar.completedRatio}
          />

          <Text
            style={{
              color: colors.text.secondary,
              fontFamily: 'GeneralSans-Regular',
              fontSize: 14,
            }}>
            {t('pathCard.chapters', { current: 3, total: 8 })}
          </Text>
        </View>
      </Card>
    </View>
  );
}

export default function DevD1bProgressPreviewScreen() {
  const { mode, screen } = useLocalSearchParams<{ mode?: string; screen?: string }>();
  const previewMode = mode === 'focus' ? 'focus' : 'playful';
  const previewScreen = screen === 'detail' ? 'detail' : 'home';

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <ThemeModeScope mode={previewMode}>
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: 'center',
            padding: 16,
          }}
          style={{ backgroundColor: colors.background.base, flex: 1 }}>
          {previewScreen === 'detail' ? <DetailPreview /> : <HomePreview />}
        </ScrollView>
      </ThemeModeScope>
    </>
  );
}
