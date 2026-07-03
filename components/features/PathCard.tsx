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
  onPress,
}: PathCardProps) {
  const { tokens, t } = useThemeMode();
  const scale = useSharedValue(1);
  const isStarted = currentChapter !== undefined && progress !== undefined;

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    if (onPress) {
      scale.value = withSpring(0.97, tokens.motion.spring.default);
    }
  };

  const handlePressOut = () => {
    if (onPress) {
      scale.value = withSpring(1, tokens.motion.spring.default);
    }
  };

  return (
    <AnimatedPressable
      accessibilityRole={onPress ? 'button' : undefined}
      disabled={!onPress}
      onPress={onPress}
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

      {isStarted ? (
        <ProgressBar
          color="structure"
          failedSegments={failedSegments}
          progress={progress}
        />
      ) : null}
    </AnimatedPressable>
  );
}
