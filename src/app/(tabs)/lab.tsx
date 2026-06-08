import { useCallback, useState } from 'react';
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GradientButton } from 'src/shared/ui/GradientButton';
import { PressableCard } from 'src/shared/ui/PressableCard';
import { theme } from 'src/shared/theme/index';
import { useGamificationStore } from 'src/features/Gamification/model/store';
import {
  optimizePrompt,
  type OptimizerError,
} from 'src/features/PromptLab/api/optimizer';

const ORB_INDICES = [0, 1, 2, 3, 4];

function EnergyOrbs({
  currentOrbs,
  maxOrbs,
}: {
  currentOrbs: number;
  maxOrbs: number;
}) {
  return (
    <View style={styles.orbRow}>
      {ORB_INDICES.slice(0, maxOrbs).map((index) => {
        const filled = index < currentOrbs;
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
  );
}

export default function LabScreen() {
  const energy = useGamificationStore((state) => state.energy);
  const isPremium = useGamificationStore((state) => state.isPremium);
  const useOrb = useGamificationStore((state) => state.useOrb);

  const [prompt, setPrompt] = useState('');
  const [score, setScore] = useState<number | null>(null);
  const [errorBanner, setErrorBanner] = useState<string | null>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);

  const handleOptimize = useCallback(async () => {
    setErrorBanner(null);

    try {
      const hasEnergy = isPremium || useOrb();
      if (!hasEnergy) {
        Alert.alert('Keine Energie', 'Upgrade auf Premium!');
        return;
      }

      if (!prompt.trim()) {
        setErrorBanner('Bitte gib zuerst einen Prompt ein.');
        return;
      }

      setIsOptimizing(true);
      const result = await optimizePrompt({
        rawPrompt: prompt.trim(),
        provider: 'openai',
      });
      setScore(result.score);
      setPrompt(result.optimizedPrompt);
    } catch (error: unknown) {
      const optimizerError = error as OptimizerError;
      const message =
        optimizerError.message ??
        (error instanceof Error ? error.message : 'Unbekannter Fehler');
      setErrorBanner(message);
      setScore(null);
    } finally {
      setIsOptimizing(false);
    }
  }, [isPremium, prompt, useOrb]);

  const listHeader = (
    <View style={styles.content}>
      <Text style={styles.screenTitle}>Prompt-Lab</Text>
      <Text style={styles.screenSubtitle}>
        Optimiere Prompts und verbrauche Energie-Orbs.
      </Text>
      <Text style={styles.sectionTitle}>Energie</Text>
      <EnergyOrbs
        currentOrbs={energy.currentOrbs}
        maxOrbs={energy.maxOrbs}
      />
      <Text style={styles.energyLabel}>
        {energy.currentOrbs}/{energy.maxOrbs} Energie
      </Text>

      <TextInput
        style={styles.input}
        multiline
        value={prompt}
        onChangeText={setPrompt}
        placeholder="Gib deinen Prompt ein..."
        placeholderTextColor={theme.colors.text.muted}
        selectionColor={theme.colors.accent.code}
      />

      <GradientButton
        label={isOptimizing ? 'Optimiere…' : 'Optimieren ✨'}
        onPress={handleOptimize}
        disabled={isOptimizing}
        gradientColors={[
          theme.colors.accent.everyday,
          theme.colors.accent.code,
        ]}
      />

      {errorBanner ? (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>{errorBanner}</Text>
        </View>
      ) : null}

      <PressableCard style={styles.scoreCard}>
        <Text style={styles.scoreTitle}>
          Prompt Score: {score !== null ? score : '–'}
        </Text>
      </PressableCard>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <FlatList
        data={[]}
        renderItem={() => null}
        ListHeaderComponent={listHeader}
        keyExtractor={() => 'lab-header'}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
  listContent: {
    paddingBottom: 24,
  },
  content: {
    padding: 20,
    gap: 16,
  },
  screenTitle: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.fontSize.display,
    fontWeight: theme.typography.fontWeight.bold,
  },
  screenSubtitle: {
    color: theme.colors.text.secondary,
    fontSize: theme.typography.fontSize.sm,
    marginBottom: 4,
  },
  sectionTitle: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
  },
  orbRow: {
    flexDirection: 'row',
    gap: 10,
  },
  orb: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: theme.colors.border.subtle,
  },
  orbFilled: {
    backgroundColor: theme.colors.accent.everyday,
    borderColor: theme.colors.accent.everyday,
  },
  orbEmpty: {
    backgroundColor: theme.colors.background.card,
  },
  energyLabel: {
    color: theme.colors.text.secondary,
    fontSize: theme.typography.fontSize.sm,
  },
  input: {
    minHeight: 140,
    backgroundColor: theme.colors.background.card,
    borderWidth: 1,
    borderColor: theme.colors.border.subtle,
    borderRadius: 16,
    padding: 16,
    color: theme.colors.text.primary,
    fontSize: theme.typography.fontSize.md,
    textAlignVertical: 'top',
  },
  errorBanner: {
    backgroundColor: theme.colors.background.card,
    borderWidth: 1,
    borderColor: theme.colors.feedback.danger,
    borderRadius: 16,
    padding: 12,
  },
  errorText: {
    color: theme.colors.feedback.danger,
    fontSize: theme.typography.fontSize.sm,
  },
  scoreCard: {
    borderRadius: 16,
  },
  scoreTitle: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.medium,
  },
});
