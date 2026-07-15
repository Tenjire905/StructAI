import { AlertCircle, Check, Lock, Play } from 'lucide-react-native';
import { Text, View } from 'react-native';

import { PressableScale } from '@/components/ui';
import type { MockChapter } from '@/data/mockPaths';
import { useThemeMode } from '@/theme';

export type ChapterRowProps = {
  chapter: MockChapter;
  number: number;
  isLast: boolean;
  title: string;
  onPress?: (lessonId: string) => void;
};

function isChapterPressable(status: MockChapter['status']): boolean {
  return status === 'completed' || status === 'failed' || status === 'current';
}

export function ChapterRow({ chapter, number, isLast, title, onPress }: ChapterRowProps) {
  const { tokens } = useThemeMode();
  const pressable = isChapterPressable(chapter.status) && onPress !== undefined;

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
    failed: (
      <AlertCircle
        color={tokens.colors.accent.warning}
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
    failed: tokens.colors.text.primary,
    locked: tokens.colors.text.tertiary,
  }[chapter.status];

  const content = (
    <>
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
            chapter.status === 'current' || chapter.status === 'failed'
              ? tokens.typography.fontFamily.bodyMedium
              : tokens.typography.fontFamily.body,
          fontSize: tokens.typography.fontSize.bodyLg,
        }}>
        {title}
      </Text>
      {statusIcon}
    </>
  );

  const rowStyle = {
    alignItems: 'center' as const,
    borderBottomColor: tokens.colors.border.subtle,
    borderBottomWidth: isLast ? 0 : 1,
    flexDirection: 'row' as const,
    gap: tokens.spacing.space3,
    paddingVertical: tokens.spacing.space3,
  };

  if (!pressable) {
    return <View style={rowStyle}>{content}</View>;
  }

  return (
    <PressableScale
      accessibilityRole="button"
      onPress={() => onPress?.(chapter.id)}
      style={rowStyle}>
      {content}
    </PressableScale>
  );
}
