import { useCallback, useEffect, useRef, useState } from 'react';
import {
  cancelAnimation,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { useThemeMode } from '@/theme';

/** Dwell time before the peek auto-dismisses (~7–8 s reading window). */
export const AUTO_DISMISS_PEEK_MS = 7_500;

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
  const dismissTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const clearDismissTimer = useCallback(() => {
    if (dismissTimerRef.current) {
      clearTimeout(dismissTimerRef.current);
      dismissTimerRef.current = undefined;
    }
  }, []);

  const finishDismiss = useCallback(() => {
    setMounted(false);
    onDismiss();
  }, [onDismiss]);

  const dismissWithAnimation = useCallback(() => {
    clearDismissTimer();
    cancelAnimation(visibility);
    visibility.value = withTiming(0, { duration: tokens.motion.duration.fast }, (finished) => {
      if (finished) {
        runOnJS(finishDismiss)();
      }
    });
  }, [clearDismissTimer, finishDismiss, tokens.motion.duration.fast, visibility]);

  useEffect(() => {
    if (visible) {
      setMounted(true);
    }
  }, [visible]);

  useEffect(() => {
    if (visible && mounted) {
      cancelAnimation(visibility);
      visibility.value = withSpring(1, tokens.motion.spring.default);
      clearDismissTimer();
      dismissTimerRef.current = setTimeout(dismissWithAnimation, AUTO_DISMISS_PEEK_MS);
    } else if (!visible && mounted) {
      dismissWithAnimation();
    }

    return clearDismissTimer;
  }, [
    clearDismissTimer,
    dismissWithAnimation,
    mounted,
    revealNonce,
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

  return { mounted, peekStyle, dismissWithAnimation };
}
