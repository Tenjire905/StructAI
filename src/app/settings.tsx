import { useCallback, useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { listApiKeyProviders } from 'src/features/APIKeyManager/model/secureKeyStore';
import { useGamificationStore } from 'src/features/Gamification/model/store';
import { SettingsScreen } from 'src/features/Settings/ui/SettingsScreen';
import { theme } from 'src/shared/theme';

const APP_VERSION = '1.0.0';

export default function Settings() {
  const isPremium = useGamificationStore((state) => state.isPremium);
  const router = useRouter();
  const [apiKeyProviders, setApiKeyProviders] = useState<string[]>([]);

  useEffect(() => {
    let active = true;

    const loadProviders = async (): Promise<void> => {
      try {
        const providers = await listApiKeyProviders();
        if (active) {
          setApiKeyProviders(providers);
        }
      } catch (error: unknown) {
        const message =
          error instanceof Error ? error.message : 'Unbekannter Fehler';
        console.error('[Settings] API-Key-Provider laden fehlgeschlagen:', message);
        if (active) {
          setApiKeyProviders([]);
        }
      }
    };

    void loadProviders();

    return () => {
      active = false;
    };
  }, []);

  const onClose = useCallback(() => {
    try {
      router.back();
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Unbekannter Fehler';
      console.error('[Settings] Navigation zurück fehlgeschlagen:', message);
    }
  }, [router]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <SettingsScreen
        apiKeyProviders={apiKeyProviders}
        appVersion={APP_VERSION}
        isPremium={isPremium}
        onClose={onClose}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
});
