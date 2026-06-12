import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  Alert,
} from 'react-native';
import type { ListRenderItemInfo } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from 'src/shared/theme/index';
import { GradientButton } from 'src/shared/ui/GradientButton';
import { PressableCard } from 'src/shared/ui/PressableCard';
import { useGamificationStore } from 'src/features/Gamification/model/store';
import {
  optimizePrompt,
  type OptimizeResponse,
} from 'src/features/PromptLab/api/optimizer';

interface OptimizationHistoryEntry {
  id: string;
  prompt: string;
  score: number;
  timestamp: number;
}

const GRADIENT_COLORS: readonly [string, string] = [
  theme.colors.accent.everyday,
  theme.colors.accent.code,
];

export default function LabScreen() {
  const [prompt, setPrompt] = useState<string>('');
  const [score, setScore] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [history, setHistory] = useState<OptimizationHistoryEntry[]>([]);

  const currentOrbs = useGamificationStore((s) => s.energy.currentOrbs);
  const maxOrbs = useGamificationStore((s) => s.energy.maxOrbs);
  const isPremium = useGamificationStore((s) => s.isPremium);
  const spendOrb = useGamificationStore((s) => s.useOrb);
  const addXP = useGamificationStore((s) => s.addXP);

  const handleOptimize = useCallback(async () => {
    if (prompt.trim() === '') {
      setErrorMessage('Bitte gib zuerst einen Prompt ein.');
      return;
    }

    if (!isPremium && !spendOrb()) {
      Alert.alert(
        'Keine Energie',
        'Warte auf Regeneration oder upgrade auf Premium ✨',
      );
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const result: OptimizeResponse = await optimizePrompt({
        rawPrompt: prompt,
        provider: 'openai',
      });

      setScore(result.score);
      addXP(10);

      setHistory((prev) => [
        {
          id: Date.now().toString(),
          prompt,
          score: result.score,
          timestamp: Date.now(),
        },
        ...prev,
      ]);
    } catch (err: unknown) {
      let message = 'Optimierung fehlgeschlagen';
      if (
        err !== null &&
        typeof err === 'object' &&
        'message' in err &&
        typeof (err as Record<string, unknown>).message === 'string'
      ) {
        message = (err as Record<string, string>).message;
      } else if (err instanceof Error) {
        message = err.message;
      }
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  }, [prompt, isPremium, spendOrb, addXP]);

  const renderHistoryItem = useCallback(
    ({ item }: ListRenderItemInfo<OptimizationHistoryEntry>) => {
      const displayPrompt =
        item.prompt.length > 80
          ? item.prompt.slice(0, 80) + '…'
          : item.prompt;

      return (
        <PressableCard style={styles.historyCard}>
          <Text style={styles.historyPrompt}>{displayPrompt}</Text>
          <Text style={styles.historyScore}>Score {item.score}</Text>
        </PressableCard>
      );
    },
    [],
  );

  const keyExtractor = useCallback(
    (item: OptimizationHistoryEntry) => item.id,
    [],
  );

  const ListEmptyComponent = (
    <Text style={styles.emptyText}>Noch keine Optimierungen</Text>
  );

  const ListHeaderComponent = (
    <View style={styles.header}>
      <Text style={styles.title}>Prompt-Lab</Text>

      <View style={styles.orbRow}>
        {[0, 1, 2, 3, 4].map((index) => {
          const filled = isPremium || index < currentOrbs;
          return (
            <View
              key={index}
              style={[
                styles.orb,
                filled ? styles.orbFilled : styles.orbEmpty,
              ]}
            />
          );
        })}
      </View>
      <Text style={styles.orbLabel}>
        {isPremium ? maxOrbs : currentOrbs}/{maxOrbs} Energie
      </Text>

      <TextInput
        style={styles.textInput}
        value={prompt}
        onChangeText={setPrompt}
        multiline
        numberOfLines={6}
        placeholder="Beschreibe, was du erreichen willst…"
        placeholderTextColor={theme.colors.text.muted}
        textAlignVertical="top"
      />

      <GradientButton
        label="Optimieren ✨"
        onPress={handleOptimize}
        gradientColors={GRADIENT_COLORS}
        disabled={isLoading}
      />

      {score !== null && (
        <PressableCard
          style={styles.scoreCard}
          accentColor={theme.colors.feedback.success}
        >
          <Text style={styles.scoreLabel}>Score</Text>
          <Text style={styles.scoreValue}>{score}</Text>
        </PressableCard>
      )}

      {errorMessage !== null && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>{errorMessage}</Text>
        </View>
      )}

      <Text style={styles.sectionTitle}>Verlauf</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={history}
        renderItem={renderHistoryItem}
        keyExtractor={keyExtractor}
        ListEmptyComponent={ListEmptyComponent}
        ListHeaderComponent={ListHeaderComponent}
        contentContainerStyle={styles.content}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
  content: {
    paddingBottom: 32,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 24,
    gap: 16,
  },
  title: {
    fontSize: theme.typography.fontSize.xxl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
  },
  orbRow: {
    flexDirection: 'row',
    gap: 8,
  },
  orb: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },
  orbFilled: {
    backgroundColor: theme.colors.accent.everyday,
  },
  orbEmpty: {
    backgroundColor: theme.colors.background.card,
    borderWidth: 1,
    borderColor: theme.colors.border.subtle,
  },
  orbLabel: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.muted,
    fontWeight: theme.typography.fontWeight.medium,
  },
  textInput: {
    backgroundColor: theme.colors.background.card,
    borderColor: theme.colors.border.subtle,
    borderWidth: 1,
    borderRadius: 16,
    color: theme.colors.text.primary,
    minHeight: 120,
    textAlignVertical: 'top',
    padding: 16,
    fontSize: theme.typography.fontSize.md,
  },
  scoreCard: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  scoreLabel: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.secondary,
    fontWeight: theme.typography.fontWeight.medium,
  },
  scoreValue: {
    fontSize: theme.typography.fontSize.display,
    color: theme.colors.feedback.success,
    fontWeight: theme.typography.fontWeight.bold,
  },
  errorBanner: {
    borderColor: theme.colors.feedback.danger,
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
  },
  errorText: {
    color: theme.colors.feedback.danger,
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
    marginTop: 8,
  },
  historyCard: {
    marginHorizontal: 16,
    marginTop: 12,
  },
  historyPrompt: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    marginBottom: 8,
  },
  historyScore: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.accent.everyday,
    fontWeight: theme.typography.fontWeight.semibold,
  },
  emptyText: {
    color: theme.colors.text.muted,
    fontSize: theme.typography.fontSize.sm,
    textAlign: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
  },
});