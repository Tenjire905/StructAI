import * as Haptics from 'expo-haptics';
import { FlashList, type ListRenderItem } from '@shopify/flash-list';
import { useCallback, useState } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useGamificationStore } from 'src/features/Gamification/model/store';
import {
  optimizePrompt,
  type OptimizeResponse,
} from 'src/features/PromptLab/api/optimizer';
import { theme } from 'src/shared/theme';
import {
  GlassCard,
  GradientButton,
  ScreenBackground,
  SFErrorBanner,
  SFOrbIndicator,
  SFTextInput,
  SFLargeTitle,
} from 'src/shared/ui';

interface OptimizationHistoryEntry {
  id: string;
  prompt: string;
  score: number;
  timestamp: number;
}

export default function LabScreen(): React.JSX.Element {
  const [prompt, setPrompt] = useState('');
  const [score, setScore] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<OptimizationHistoryEntry[]>([]);

  const currentOrbs = useGamificationStore((s) => s.energy.currentOrbs);
  const maxOrbs = useGamificationStore((s) => s.energy.maxOrbs);
  const isPremium = useGamificationStore((s) => s.isPremium);
  const spendOrb = useGamificationStore((s) => s.useOrb);
  const addXP = useGamificationStore((s) => s.addXP);

  const handleOptimize = useCallback(async (): Promise<void> => {
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
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
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
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (err: unknown) {
      let message = 'Optimierung fehlgeschlagen';
      if (err instanceof Error) {
        message = err.message;
      }
      setErrorMessage(message);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setIsLoading(false);
    }
  }, [prompt, isPremium, spendOrb, addXP]);

  const renderHistoryItem = useCallback<ListRenderItem<OptimizationHistoryEntry>>(
    ({ item }) => {
      const displayPrompt =
        item.prompt.length > 80
          ? `${item.prompt.slice(0, 80)}…`
          : item.prompt;

      return (
        <GlassCard style={styles.historyCard}>
          <Text style={styles.historyPrompt}>{displayPrompt}</Text>
          <Text style={styles.historyScore}>Score {item.score}</Text>
        </GlassCard>
      );
    },
    [],
  );

  const keyExtractor = useCallback(
    (item: OptimizationHistoryEntry) => item.id,
    [],
  );

  const ListHeader = useCallback(
    () => (
      <View style={styles.header}>
        <SFLargeTitle subtitle="Optimiere deine Prompts mit StructAI">
          Prompt Lab
        </SFLargeTitle>

        <GlassCard>
          <SFOrbIndicator
            current={isPremium ? maxOrbs : currentOrbs}
            max={maxOrbs}
            label={`${isPremium ? maxOrbs : currentOrbs}/${maxOrbs} Energie`}
          />
        </GlassCard>

        <GlassCard>
          <SFTextInput
            value={prompt}
            onChangeText={setPrompt}
            multiline
            numberOfLines={6}
            placeholder="Beschreibe, was du erreichen willst…"
          />
        </GlassCard>

        <GradientButton
          label="Optimieren ✨"
          onPress={() => {
            void handleOptimize();
          }}
          gradientColors={theme.colors.gradient.button}
          disabled={isLoading}
        />

        {score !== null ? (
          <GlassCard accentColor={theme.colors.feedback.success}>
            <Text style={styles.scoreLabel}>Score</Text>
            <Text style={styles.scoreValue}>{score}</Text>
          </GlassCard>
        ) : null}

        {errorMessage !== null ? (
          <SFErrorBanner message={errorMessage} />
        ) : null}

        <Text style={styles.sectionTitle}>Verlauf</Text>
      </View>
    ),
    [
      currentOrbs,
      errorMessage,
      handleOptimize,
      isLoading,
      isPremium,
      maxOrbs,
      prompt,
      score,
    ],
  );

  const ListEmpty = useCallback(
    () => (
      <Text style={styles.emptyText}>Noch keine Optimierungen</Text>
    ),
    [],
  );

  return (
    <ScreenBackground>
      <SafeAreaView style={styles.safe}>
        <FlashList
          data={history}
          renderItem={renderHistoryItem}
          keyExtractor={keyExtractor}
          estimatedItemSize={100}
          ListHeaderComponent={ListHeader}
          ListEmptyComponent={ListEmpty}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        />
      </SafeAreaView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  content: {
    paddingBottom: 120,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 8,
    gap: 14,
  },
  scoreLabel: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
  scoreValue: {
    fontSize: theme.typography.fontSize.display,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.feedback.success,
    textAlign: 'center',
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
    marginTop: 4,
  },
  historyCard: {
    marginHorizontal: 16,
    marginTop: 10,
  },
  historyPrompt: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.regular,
    color: theme.colors.text.secondary,
    marginBottom: 8,
  },
  historyScore: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.accent.everyday,
  },
  emptyText: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.regular,
    color: theme.colors.text.muted,
    textAlign: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
  },
});
