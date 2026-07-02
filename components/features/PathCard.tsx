import { Text, View } from 'react-native';

import { ProgressBar } from '@/components/ui';
import { getShadow, useThemeMode } from '@/theme';

type PathCardProps = {
  title: string;
  currentChapter: number;
  totalChapters: number;
  progress: number;
};

export function PathCard({
  title,
  currentChapter,
  totalChapters,
  progress,
}: PathCardProps) {
  const { tokens, t } = useThemeMode();

  return (
    <View
      style={[
        getShadow(1),
        {
          backgroundColor: tokens.colors.surface.card,
          borderRadius: tokens.presentation.preferredCardRadius,
          gap: tokens.spacing.space3,
          padding: tokens.spacing.space4,
        },
      ]}>
      <Text
        style={{
          color: tokens.colors.text.primary,
          fontFamily: tokens.typography.fontFamily.heading,
          fontSize: tokens.typography.fontSize.headingLg,
        }}>
        {title}
      </Text>

      <Text
        style={{
          color: tokens.colors.text.secondary,
          fontFamily: tokens.typography.fontFamily.body,
          fontSize: tokens.typography.fontSize.bodyMd,
        }}>
        {t('pathCard.chapters', { current: currentChapter, total: totalChapters })}
      </Text>

      <ProgressBar color="structure" progress={progress} />
    </View>
  );
}
