import { Text, View } from 'react-native';

import { AutoDismissPeek } from '@/components/ui/AutoDismissPeek';
import { Button } from '@/components/ui';
import { useThemeMode } from '@/theme';

type PathCardRetryPeekProps = {
  visible: boolean;
  revealNonce?: number;
  hasFailedLesson: boolean;
  onDismiss: () => void;
  onRetry: () => void;
  retryLabel: string;
  emptyLabel: string;
};

/** Approximate expanded peek height for scroll-into-view (2–3 lines of body text). */
export const PATH_CARD_RETRY_PEEK_MAX_HEIGHT = 112;

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

  return (
    <AutoDismissPeek
      dismissOnPress={false}
      maxHeight={PATH_CARD_RETRY_PEEK_MAX_HEIGHT}
      onDismiss={onDismiss}
      revealNonce={revealNonce}
      visible={visible}>
      <View>
        {hasFailedLesson ? (
          <Button label={retryLabel} onPress={onRetry} variant="primary" />
        ) : (
          <Text
            accessibilityRole="text"
            style={{
              color: tokens.colors.text.secondary,
              fontFamily: tokens.typography.fontFamily.body,
              fontSize: tokens.typography.fontSize.bodyMd,
              lineHeight: tokens.typography.fontSize.bodyMd * 1.5,
              textAlign: 'center',
            }}>
            {emptyLabel}
          </Text>
        )}
      </View>
    </AutoDismissPeek>
  );
}

export { AUTO_DISMISS_PEEK_MS } from '@/hooks/useAutoDismissPeek';
