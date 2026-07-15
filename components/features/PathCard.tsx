import { Lock } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { Badge, ProgressBar, StaggeredReveal } from '@/components/ui';
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
  /** Staggered screen-entry index. */
  entryIndex?: number;
  /** Slide-up reveal for newly unlocked paths. */
  isNewUnlock?: boolean;
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
  entryIndex = 0,
  isNewUnlock = false,
}: PathCardProps) {
  const { tokens, t } = useThemeMode();
  const scale = useSharedValue(1);
  const shakeX = useSharedValue(0);
  const flashOpacity = useSharedValue(0);
  const isStarted = currentChapter !== undefined && progress !== undefined;
  const isPressable = Boolean(onPress) && !locked;
  const resolvedBadgeLabel = locked ? t('paths.lockedBadge') : badgeLabel;
  const resolvedBadgeTone = locked ? 'warning' : badgeTone;
  const liftSpring = tokens.motion.spring[tokens.presentation.springPreset];

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { translateX: shakeX.value }],
  }));

  const flashStyle = useAnimatedStyle(() => ({
    opacity: flashOpacity.value,
  }));

  const handlePressIn = () => {
    if (isPressable) {
      scale.value = withSpring(0.95, tokens.motion.spring.default);
    }
  };

  const handlePressOut = () => {
    if (isPressable) {
      scale.value = withSequence(
        withSpring(1.02, liftSpring),
        withSpring(1, tokens.motion.spring.default),
      );
    }
  };

  const handleLockedPress = () => {
    flashOpacity.value = withSequence(
      withTiming(0.35, { duration: tokens.motion.duration.instant }),
      withTiming(0, { duration: tokens.motion.duration.fast }),
    );
    shakeX.value = withSequence(
      withTiming(-4, { duration: tokens.motion.duration.instant }),
      withTiming(4, { duration: tokens.motion.duration.instant }),
      withTiming(-3, { duration: tokens.motion.duration.instant }),
      withTiming(0, { duration: tokens.motion.duration.instant }),
    );
  };

  const cardBody = (
    <>
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
    </>
  );

  const cardShell = (
    <AnimatedPressable
      accessibilityRole={isPressable || locked ? 'button' : undefined}
      disabled={!isPressable && !locked}
      onPress={locked ? handleLockedPress : isPressable ? onPress : undefined}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[
        animatedStyle,
        getShadow(isNewUnlock ? 'glow' : 1),
        {
          backgroundColor: tokens.colors.surface.card,
          borderRadius: tokens.presentation.preferredCardRadius,
          gap: tokens.spacing.space3,
          overflow: 'hidden',
          padding: tokens.spacing.space4,
          position: 'relative',
        },
      ]}>
      {locked ? (
        <Animated.View
          pointerEvents="none"
          style={[
            flashStyle,
            {
              backgroundColor: tokens.colors.accent.danger,
              bottom: 0,
              left: 0,
              position: 'absolute',
              right: 0,
              top: 0,
            },
          ]}
        />
      ) : null}
      {cardBody}
    </AnimatedPressable>
  );

  return (
    <StaggeredReveal enabled index={entryIndex}>
      {cardShell}
    </StaggeredReveal>
  );
}
