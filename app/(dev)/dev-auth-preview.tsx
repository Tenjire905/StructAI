import { useLocalSearchParams } from 'expo-router';

import { AuthScreenView } from '@/components/features/auth/AuthScreenView';
import { ThemeModeScope, type ThemeMode } from '@/theme';

function parseMode(value: string | string[] | undefined): ThemeMode {
  const raw = Array.isArray(value) ? value[0] : value;
  return raw === 'playful' ? 'playful' : 'focus';
}

export default function DevAuthPreviewScreen() {
  const { mode } = useLocalSearchParams<{ mode?: string }>();
  const previewMode = parseMode(mode);

  return (
    <ThemeModeScope mode={previewMode}>
      <AuthScreenView />
    </ThemeModeScope>
  );
}
