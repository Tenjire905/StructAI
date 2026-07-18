import { Lock } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { Badge, ProgressBar } from '@/components/ui';
import type { PathProgressSegment } from '@/lib/pathProgress';
import { getShadow, useThemeMode } from '@/theme';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type PathCardProps = {
  title: string;
  totalChapters: number;
  /** Ohne currentChapter/progress rendert die Karte den "nicht gestartet"-Zustand. */
  currentChapter?: number;
  progress?: number;
  completedSegments?: PathProgressSegment[];
  failedSegments?: PathProgressSegment[];
  badgeLabel?: string;
  badgeTone?: 'primary' | 'structure' | 'warning' | 'success';
  locked?: boolean;
  onPress?: () => void;
  onLongPress?: () => void;
  footer?: ReactNode;
};

export function PathCard({
  title,
  totalChapters,
  currentChapter,
  progress,
  completedSegments,
  failedSegments,
  badgeLabel,
  badgeTone = 'primary',
  locked = false,
  onPress,
  onLongPress,
  footer,
}: PathCardProps) {
  const { tokens, t } = useThemeMode();
  const scale = useSharedValue(1);
  const isStarted = currentChapter !== undefined && progress !== undefined;
  const isPressable = Boolean(onPress) && !locked;
  const isLongPressable = Boolean(onLongPress) && !locked;
  const resolvedBadgeLabel = locked ? t('paths.lockedBadge') : badgeLabel;
  const resolvedBadgeTone = locked ? 'warning' : badgeTone;

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    if (isPressable) {
      scale.value = withSpring(0.97, tokens.motion.spring.default);
    }
  };

  const handlePressOut = () => {
    if (isPressable) {
      scale.value = withSpring(1, tokens.motion.spring.default);
    }
  };

  return (
    <View
      style={[
        getShadow(1),
        {
          backgroundColor: tokens.colors.surface.card,
          borderRadius: tokens.presentation.preferredCardRadius,
        },
      ]}>
      <AnimatedPressable
        accessibilityRole={isPressable || isLongPressable ? 'button' : undefined}
        disabled={!isPressable && !isLongPressable}
        onPress={isPressable ? onPress : undefined}
        onLongPress={isLongPressable ? onLongPress : undefined}
        delayLongPress={450}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[
          animatedStyle,
          {
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
              color: locked ? tokens.colors.text.tertiary : tokens.colors.text.primary,
              flex: 1,
              flexShrink: 1,
              fontFamily: tokens.typography.fontFamily.heading,
              fontSize: tokens.typography.fontSize.headingLg,
            }}>
            {title}
          </Text>
          {locked ? (
            <Lock
              color={tokens.colors.text.tertiary}
              size={tokens.icons.sizes.md}
              strokeWidth={tokens.icons.strokeWidth}
            />
          ) : null}
          {resolvedBadgeLabel ? (
            <Badge label={resolvedBadgeLabel} tone={resolvedBadgeTone} />
          ) : null}
        </View>

        <Text
          style={{
            color: locked ? tokens.colors.text.tertiary : tokens.colors.text.secondary,
            fontFamily: tokens.typography.fontFamily.body,
            fontSize: tokens.typography.fontSize.bodyMd,
          }}>
          {isStarted
            ? t('pathCard.chapters', { current: currentChapter, total: totalChapters })
            : t('pathCard.chaptersTotal', { total: totalChapters })}
        </Text>

        {isStarted ? (
          <ProgressBar
            color="structure"
            completedSegments={completedSegments}
            failedSegments={failedSegments}
            progress={progress}
          />
        ) : null}
      </AnimatedPressable>

      {footer ? (
        <View
          style={{
            paddingBottom: tokens.spacing.space4,
            paddingHorizontal: tokens.spacing.space4,
          }}>
          {footer}
        </View>
      ) : null}
    </View>
  );
}
