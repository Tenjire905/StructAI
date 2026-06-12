import React, { useCallback } from 'react';
import {
  FlatList,
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PressableCard } from 'src/shared/ui/PressableCard';
import { theme } from 'src/shared/theme/index';
import { useGamificationStore } from 'src/features/Gamification/model/store';

interface LearningPath {
  id: string;
  title: string;
  description: string;
  progress: number;
  accentColor: string;
}

interface RenderItemArg {
  item: LearningPath;
}

const LEARNING_PATHS: readonly LearningPath[] = [
  {
    id: 'everyday',
    title: 'Everyday Mastery',
    description: 'Alltags-Prompting für klare, effektive Ergebnisse.',
    progress: 0,
    accentColor: theme.colors.accent.everyday,
  },
  {
    id: 'code',
    title: 'Code & Development',
    description: 'Dev-Prompting für sauberen, präzisen Code.',
    progress: 0,
    accentColor: theme.colors.accent.code,
  },
  {
    id: 'visual',
    title: 'Visual Creation',
    description: 'Bild- und KI-Design via durchdachte Prompts.',
    progress: 0,
    accentColor: theme.colors.accent.visual,
  },
];

function resolveSafeXp(rawXp: number): number {
  try {
    return typeof rawXp === 'number' && Number.isFinite(rawXp) ? rawXp : 0;
  } catch (error) {
    console.error('AkademieScreen: Fehler beim Lesen der XP.', error);
    return 0;
  }
}

export default function AkademieScreen() {
  const xp = useGamificationStore((state) => state.xp);

  const safeXp: number = resolveSafeXp(xp);

  const keyExtractor = useCallback((item: LearningPath): string => item.id, []);

  // renderItem benötigt keine Dependencies: alle dynamischen Werte
  // (inkl. item.accentColor) stammen ausschließlich aus dem item-Argument.
  const renderItem = useCallback(
    ({ item }: RenderItemArg) => (
      <PressableCard accentColor={item.accentColor} style={styles.card}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardDescription}>{item.description}</Text>
        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${item.progress}%`,
                backgroundColor: item.accentColor,
              },
            ]}
          />
        </View>
        <Text style={styles.progressLabel}>
          {`${item.progress}% abgeschlossen`}
        </Text>
      </PressableCard>
    ),
    [],
  );

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <FlatList
        data={LEARNING_PATHS}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Deine Lernpfade</Text>
            <Text style={styles.headerSubtitle}>{`${safeXp} XP gesammelt`}</Text>
          </View>
        }
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
  listContent: {
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: theme.typography.fontSize.display,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
  },
  headerSubtitle: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.regular,
    color: theme.colors.text.muted,
    marginTop: 4,
  },
  card: {
    gap: 8,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
  },
  cardDescription: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.regular,
    color: theme.colors.text.secondary,
  },
  progressTrack: {
    height: 8,
    borderRadius: 8,
    backgroundColor: theme.colors.background.secondary,
    overflow: 'hidden',
    marginTop: 4,
  },
  progressFill: {
    height: 8,
    borderRadius: 8,
  },
  progressLabel: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text.muted,
  },
});