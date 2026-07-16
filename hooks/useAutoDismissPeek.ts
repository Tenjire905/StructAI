import { useEffect, useState } from 'react';
import {
  cancelAnimation,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { useThemeMode } from '@/theme';

/** Dwell time before the peek auto-dismisses (SwiftUI-style acceptance window). */
export const AUTO_DISMISS_PEEK_MS = 3_400;

type UseAutoDismissPeekOptions = {
  visible: boolean;
  revealNonce?: number;
  onDismiss: () => void;
  maxHeight?: number;
};

export function useAutoDismissPeek({
  visible,
  revealNonce = 0,
  onDismiss,
  maxHeight = 120,
}: UseAutoDismissPeekOptions) {
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
      dismissTimer = setTimeout(dismissWithAnimation, AUTO_DISMISS_PEEK_MS);
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
    maxHeight: visibility.value * maxHeight,
    opacity: visibility.value,
    overflow: 'hidden' as const,
    transform: [
      { translateY: (1 - visibility.value) * 10 },
      { scale: 0.94 + visibility.value * 0.06 },
    ],
  }));

  return { mounted, peekStyle };
}
