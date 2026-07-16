import type { ReactNode } from 'react';
import Animated from 'react-native-reanimated';

import { useAutoDismissPeek } from '@/hooks/useAutoDismissPeek';

type AutoDismissPeekProps = {
  visible: boolean;
  revealNonce?: number;
  onDismiss: () => void;
  maxHeight?: number;
  children: ReactNode;
};

export function AutoDismissPeek({
  visible,
  revealNonce = 0,
  onDismiss,
  maxHeight,
  children,
}: AutoDismissPeekProps) {
  const { mounted, peekStyle } = useAutoDismissPeek({
    visible,
    revealNonce,
    onDismiss,
    maxHeight,
  });

  if (!mounted) {
    return null;
  }

  return <Animated.View style={peekStyle}>{children}</Animated.View>;
}
