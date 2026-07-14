import { Lock } from 'lucide-react-native';
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
  failedSegments?: PathProgressSegment[];
  badgeLabel?: string;
  badgeTone?: 'primary' | 'structure' | 'warning' | 'success';
  locked?: boolean;
  onPress?: () => void;
};

export function PathCard({
  title,
  totalChapters,
  currentChapter,
  progress,
  failedSegments,
  badgeLabel,
  badgeTone = 'primary',
  locked = false,
  onPress,
}: PathCardProps) {
  const { tokens, t } = useThemeMode();
  const scale = useSharedValue(1);
  const isStarted = currentChapter !== undefined && progress !== undefined;
  const isPressable = Boolean(onPress) && !locked;
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
    <AnimatedPressable
      accessibilityRole={isPressable ? 'button' : undefined}
      disabled={!isPressable}
      onPress={isPressable ? onPress : undefined}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[
        animatedStyle,
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
        <ProgressBar color="structure" failedSegments={failedSegments} progress={progress} />
      ) : null}
    </AnimatedPressable>
  );
}
