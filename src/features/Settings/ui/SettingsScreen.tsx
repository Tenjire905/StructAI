import React, { useCallback, useMemo } from 'react';
import {
  Animated,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PressableCard } from 'src/shared/ui/PressableCard';
import { theme } from 'src/shared/theme';

export interface SettingsScreenProps {
  isPremium: boolean;
  appVersion: string;
  apiKeyProviders: string[];
  onClose: () => void;
}

type SettingsSection = { id: 'premium' } | { id: 'apiKeys' } | { id: 'appInfo' };

const SECTIONS: SettingsSection[] = [
  { id: 'premium' },
  { id: 'apiKeys' },
  { id: 'appInfo' },
];

const CloseButton = ({ onClose }: { onClose: () => void }) => {
  const scale = useMemo(() => new Animated.Value(1), []);

  const handlePressIn = (): void => {
    Animated.spring(scale, {
      toValue: 0.97,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  };

  const handlePressOut = (): void => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  };

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Schließen"
      onPress={onClose}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View style={[styles.closeButton, { transform: [{ scale }] }]}>
        <Text style={styles.closeLabel}>✕</Text>
      </Animated.View>
    </Pressable>
  );
};

const SettingsScreenComponent = ({
  isPremium,
  appVersion,
  apiKeyProviders,
  onClose,
}: SettingsScreenProps) => {
  const premiumLabel = isPremium
    ? 'Premium Aktiv ✨'
    : 'Free Plan — 5 Orbs Limit';

  const apiKeySummary =
    apiKeyProviders.length > 0
      ? apiKeyProviders.join(', ')
      : 'Keine Keys hinterlegt';

  const renderItem = useCallback(
    ({ item }: { item: SettingsSection }) => {
      if (item.id === 'premium') {
        return (
          <View style={styles.sectionBlock}>
            <Text style={styles.sectionTitle}>Premium</Text>
            <PressableCard>
              <Text style={styles.cardTitle}>{premiumLabel}</Text>
            </PressableCard>
          </View>
        );
      }

      if (item.id === 'apiKeys') {
        return (
          <View style={styles.sectionBlock}>
            <Text style={styles.sectionTitle}>API-Keys (BYOK)</Text>
            <PressableCard>
              <Text style={styles.cardBody}>{apiKeySummary}</Text>
            </PressableCard>
          </View>
        );
      }

      return (
        <View style={styles.sectionBlock}>
          <Text style={styles.sectionTitle}>App-Info</Text>
          <PressableCard>
            <Text style={styles.cardTitle}>StructAI</Text>
            <Text style={styles.cardBody}>
              Master Prompting. Build Real Intelligence.
            </Text>
            <Text style={styles.cardCaption}>Version {appVersion}</Text>
          </PressableCard>
        </View>
      );
    },
    [apiKeySummary, appVersion, premiumLabel],
  );

  const keyExtractor = useCallback((item: SettingsSection): string => item.id, []);

  const listHeader = useCallback(
    () => (
      <View style={styles.headerRow}>
        <Text style={styles.title}>Einstellungen</Text>
        <CloseButton onClose={onClose} />
      </View>
    ),
    [onClose],
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={SECTIONS}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        ListHeaderComponent={listHeader}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

export const SettingsScreen = React.memo(SettingsScreenComponent);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  headerRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    marginTop: 8,
  },
  title: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.fontSize.display,
    fontWeight: theme.typography.fontWeight.bold,
  },
  closeButton: {
    alignItems: 'center',
    backgroundColor: theme.colors.background.secondary,
    borderColor: theme.colors.border.subtle,
    borderRadius: 10,
    borderWidth: 0.5,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  closeLabel: {
    color: theme.colors.text.secondary,
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
  },
  sectionBlock: {
    marginBottom: 16,
  },
  sectionTitle: {
    color: theme.colors.text.secondary,
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semibold,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  cardTitle: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
  },
  cardBody: {
    color: theme.colors.text.secondary,
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.regular,
    marginTop: 4,
  },
  cardCaption: {
    color: theme.colors.text.muted,
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.regular,
    marginTop: 8,
  },
});
