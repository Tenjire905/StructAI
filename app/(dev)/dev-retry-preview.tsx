import { useLocalSearchParams } from 'expo-router';

import { RetryPromptView } from '@/components/features/lesson-steps';
import { ThemeModeScope } from '@/theme';

export default function DevRetryPreviewScreen() {
  const { mode } = useLocalSearchParams<{ mode?: string }>();
  const previewMode = mode === 'focus' ? 'focus' : 'playful';

  return (
    <ThemeModeScope mode={previewMode}>
      <RetryPromptView
        correctCount={0}
        gradedCount={2}
        onContinueLater={() => undefined}
        onRetry={() => undefined}
      />
    </ThemeModeScope>
  );
}
