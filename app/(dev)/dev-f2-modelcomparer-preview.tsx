import { useEffect, useState } from 'react';
import { ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

import { ModelComparer } from '@/components/features/ModelComparer';
import { seedByokKeysForDev } from '@/lib/secureKeyStore';
import { ThemeModeScope, useThemeMode, type ThemeMode } from '@/theme';

function parseMode(value: string | string[] | undefined): ThemeMode {
  const raw = Array.isArray(value) ? value[0] : value;
  return raw === 'playful' ? 'playful' : 'focus';
}

const PREVIEW_KEYS = [
  { provider: 'openai' as const, key: 'sk-preview-openai-key-for-f2-screenshot' },
  { provider: 'anthropic' as const, key: 'sk-ant-preview-anthropic-key-for-f2' },
];

export default function DevF2ModelComparerPreviewScreen() {
  const { mode } = useLocalSearchParams<{ mode?: string }>();
  const previewMode = parseMode(mode);

  return (
    <ThemeModeScope mode={previewMode}>
      <DevF2ModelComparerPreviewContent />
    </ThemeModeScope>
  );
}

function DevF2ModelComparerPreviewContent() {
  const { tokens } = useThemeMode();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      await seedByokKeysForDev(PREVIEW_KEYS);

      if (!cancelled) {
        setReady(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  if (!ready) {
    return null;
  }

  return (
    <ScrollView
      contentContainerStyle={{
        gap: tokens.spacing.space5,
        paddingBottom: tokens.spacing.space7,
        paddingHorizontal: tokens.spacing.screenPadding,
        paddingTop: tokens.spacing.space5,
      }}
      style={{ backgroundColor: tokens.colors.background.base, flex: 1 }}>
      <ModelComparer
        autoRunMockCompare
        availableKeys={PREVIEW_KEYS}
        initialPrompt="Erkläre in drei Bulletpoints, wie man einen guten Prompt strukturiert."
        useMockCompare
      />
    </ScrollView>
  );
}
