import { useEffect, useState } from 'react';
import { View } from 'react-native';
import Animated, {
  cancelAnimation,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { Button } from '@/components/ui';
import { useThemeMode } from '@/theme';

/** Dwell time before the peek auto-dismisses (SwiftUI-style acceptance window). */
export const RETRY_PEEK_DWELL_MS = 3_400;

type PathCardRetryPeekProps = {
  visible: boolean;
  /** Bumps when the same card is long-pressed again — resets the auto-dismiss timer. */
  revealNonce?: number;
  hasFailedLesson: boolean;
  onDismiss: () => void;
  onRetry: () => void;
  retryLabel: string;
  emptyLabel: string;
};

export function PathCardRetryPeek({
  visible,
  revealNonce = 0,
  hasFailedLesson,
  onDismiss,
  onRetry,
  retryLabel,
  emptyLabel,
}: PathCardRetryPeekProps) {
  const { tokens } = useThemeMode();
  const visibility = useSharedValue(0);
  const [mounted, setMounted] = useState(visible);

  useEffect(() => {
    if (visible) {
      setMounted(true);
    }
  }, [visible]);

  useEffect(() => {
    let dismissTimer: ReturnType<typeof setTimeout> | undefined;

    const finishDismiss = () => {
      setMounted(false);
      onDismiss();
    };

    const dismissWithAnimation = () => {
      cancelAnimation(visibility);
      visibility.value = withTiming(0, { duration: tokens.motion.duration.fast }, (finished) => {
        if (finished) {
          runOnJS(finishDismiss)();
        }
      });
    };

    if (visible && mounted) {
      cancelAnimation(visibility);
      visibility.value = withSpring(1, tokens.motion.spring.default);
      dismissTimer = setTimeout(dismissWithAnimation, RETRY_PEEK_DWELL_MS);
    } else if (!visible && mounted) {
      dismissWithAnimation();
    }

    return () => {
      if (dismissTimer) {
        clearTimeout(dismissTimer);
      }
    };
  }, [
    mounted,
    onDismiss,
    revealNonce,
    tokens.motion.duration.fast,
    tokens.motion.spring.default,
    visible,
    visibility,
  ]);

  const peekStyle = useAnimatedStyle(() => ({
    marginTop: tokens.spacing.space2 * visibility.value,
    maxHeight: visibility.value * 72,
    opacity: visibility.value,
    overflow: 'hidden' as const,
    transform: [
      { translateY: (1 - visibility.value) * 10 },
      { scale: 0.94 + visibility.value * 0.06 },
    ],
  }));

  if (!mounted) {
    return null;
  }

  return (
    <Animated.View style={peekStyle}>
      <View style={{ paddingTop: tokens.spacing.space1 }}>
        <Button
          disabled={!hasFailedLesson}
          label={hasFailedLesson ? retryLabel : emptyLabel}
          onPress={() => {
            if (!hasFailedLesson) {
              return;
            }

            onRetry();
          }}
          variant={hasFailedLesson ? 'primary' : 'ghost'}
        />
      </View>
    </Animated.View>
  );
}
