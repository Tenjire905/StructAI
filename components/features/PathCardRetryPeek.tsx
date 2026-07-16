import { View } from 'react-native';

import { AutoDismissPeek } from '@/components/ui/AutoDismissPeek';
import { Button } from '@/components/ui';

type PathCardRetryPeekProps = {
  visible: boolean;
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
  return (
    <AutoDismissPeek
      dismissOnPress={false}
      maxHeight={72}
      onDismiss={onDismiss}
      revealNonce={revealNonce}
      visible={visible}>
      <View>
        <Button
          disabled={!hasFailedLesson}
          label={hasFailedLesson ? retryLabel : emptyLabel}
          onPress={() => {
            if (!hasFailedLesson) {
              onDismiss();
              return;
            }

            onRetry();
          }}
          variant={hasFailedLesson ? 'primary' : 'ghost'}
        />
      </View>
    </AutoDismissPeek>
  );
}

export { AUTO_DISMISS_PEEK_MS } from '@/hooks/useAutoDismissPeek';
