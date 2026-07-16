import type { ReactNode } from 'react';
import Animated from 'react-native-reanimated';

import { PressableScale } from '@/components/ui/PressableScale';
import { useAutoDismissPeek } from '@/hooks/useAutoDismissPeek';

type AutoDismissPeekProps = {
  visible: boolean;
  revealNonce?: number;
  onDismiss: () => void;
  maxHeight?: number;
  /** When true, tapping the peek content dismisses it early. Default: true. */
  dismissOnPress?: boolean;
  children: ReactNode;
};

export function AutoDismissPeek({
  visible,
  revealNonce = 0,
  onDismiss,
  maxHeight,
  dismissOnPress = true,
  children,
}: AutoDismissPeekProps) {
  const { mounted, peekStyle, dismissWithAnimation } = useAutoDismissPeek({
    visible,
    revealNonce,
    onDismiss,
    maxHeight,
  });

  if (!mounted) {
    return null;
  }

  const content = dismissOnPress ? (
    <PressableScale onPress={dismissWithAnimation}>{children}</PressableScale>
  ) : (
    children
  );

  return <Animated.View style={peekStyle}>{content}</Animated.View>;
}
