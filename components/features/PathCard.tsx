import { Text, View } from 'react-native';

import { Badge, ProgressBar } from '@/components/ui';
import { getShadow, useThemeMode } from '@/theme';

type PathCardProps = {
  title: string;
  totalChapters: number;
  /** Ohne currentChapter/progress rendert die Karte den "nicht gestartet"-Zustand. */
  currentChapter?: number;
  progress?: number;
  badgeLabel?: string;
  badgeTone?: 'primary' | 'structure' | 'warning' | 'success';
};

export function PathCard({
  title,
  totalChapters,
  currentChapter,
  progress,
  badgeLabel,
  badgeTone = 'primary',
}: PathCardProps) {
  const { tokens, t } = useThemeMode();
  const isStarted = currentChapter !== undefined && progress !== undefined;

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
      <View
        style={{
          alignItems: 'center',
          flexDirection: 'row',
          gap: tokens.spacing.space2,
          justifyContent: 'space-between',
        }}>
        <Text
          style={{
            color: tokens.colors.text.primary,
            flexShrink: 1,
            fontFamily: tokens.typography.fontFamily.heading,
            fontSize: tokens.typography.fontSize.headingLg,
          }}>
          {title}
        </Text>
        {badgeLabel ? <Badge label={badgeLabel} tone={badgeTone} /> : null}
      </View>

      <Text
        style={{
          color: tokens.colors.text.secondary,
          fontFamily: tokens.typography.fontFamily.body,
          fontSize: tokens.typography.fontSize.bodyMd,
        }}>
        {isStarted
          ? t('pathCard.chapters', { current: currentChapter, total: totalChapters })
          : t('pathCard.chaptersTotal', { total: totalChapters })}
      </Text>

      {isStarted ? <ProgressBar color="structure" progress={progress} /> : null}
    </View>
  );
}
