import { useEffect } from 'react';
import { AlertCircle, Check, Lock, Play } from 'lucide-react-native';
import { Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { PressableScale, StaggeredReveal } from '@/components/ui';
import type { MockChapter } from '@/data/mockPaths';
import { staggerDelay } from '@/lib/motionUtils';
import { useThemeMode } from '@/theme';

export type ChapterRowProps = {
  chapter: MockChapter;
  number: number;
  isLast: boolean;
  title: string;
  onPress?: (lessonId: string) => void;
  entryIndex?: number;
};

function isChapterPressable(status: MockChapter['status']): boolean {
  return status === 'completed' || status === 'failed' || status === 'current';
}

export function ChapterRow({
  chapter,
  number,
  isLast,
  title,
  onPress,
  entryIndex = 0,
}: ChapterRowProps) {
  const { tokens } = useThemeMode();
  const pressable = isChapterPressable(chapter.status) && onPress !== undefined;

  const statusIcon = (
    <ChapterStatusIcon status={chapter.status} entryIndex={entryIndex} />
  );

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
    return (
      <StaggeredReveal enabled index={entryIndex}>
        <View style={rowStyle}>{content}</View>
      </StaggeredReveal>
    );
  }

  return (
    <StaggeredReveal enabled index={entryIndex}>
      <PressableScale
        accessibilityRole="button"
        onPress={() => onPress?.(chapter.id)}
        style={rowStyle}>
        {content}
      </PressableScale>
    </StaggeredReveal>
  );
}

type ChapterStatusIconProps = {
  status: MockChapter['status'];
  entryIndex: number;
};

function ChapterStatusIcon({ status, entryIndex }: ChapterStatusIconProps) {
  const { tokens } = useThemeMode();
  const scale = useSharedValue(status === 'completed' ? 1 : 0.85);
  const spring = tokens.motion.spring[tokens.presentation.springPreset];

  useEffect(() => {
    if (status === 'completed') {
      scale.value = withDelay(
        staggerDelay(entryIndex, tokens.motion),
        withSequence(
          withSpring(1.2, spring),
          withSpring(1, tokens.motion.spring.default),
        ),
      );
      return;
    }

    scale.value = withSpring(0.85, tokens.motion.spring.default);
  }, [entryIndex, scale, spring, status, tokens.motion]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const iconProps = {
    size: tokens.icons.sizes.md,
    strokeWidth: tokens.icons.strokeWidth,
  };

  const icon = {
    completed: (
      <Check color={tokens.colors.accent.success} {...iconProps} />
    ),
    current: <Play color={tokens.colors.accent.primary} {...iconProps} />,
    failed: <AlertCircle color={tokens.colors.accent.warning} {...iconProps} />,
    locked: <Lock color={tokens.colors.text.tertiary} {...iconProps} />,
  }[status];

  return <Animated.View style={animatedStyle}>{icon}</Animated.View>;
}
