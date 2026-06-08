import { useCallback } from 'react';
import {
  FlatList,
  ListRenderItem,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PressableCard } from 'src/shared/ui/PressableCard';
import { theme } from 'src/shared/theme/index';
import { useGamificationStore } from 'src/features/Gamification/model/store';

interface LernpfadItem {
  id: string;
  title: string;
  description: string;
  accentColor: string;
  progress: number;
}

const LERNPFADE: LernpfadItem[] = [
  {
    id: 'everyday',
    title: 'Everyday Mastery',
    description: 'Alltags-Prompting meistern – klar, strukturiert, wirksam.',
    accentColor: theme.colors.accent.everyday,
    progress: 0,
  },
  {
    id: 'code',
    title: 'Code & Development',
    description: 'Technische Prompts für Entwickler und Power-User.',
    accentColor: theme.colors.accent.code,
    progress: 0,
  },
  {
    id: 'visual',
    title: 'Visual Creation',
    description: 'Bildprompting und visuelle KI-Kreation.',
    accentColor: theme.colors.accent.visual,
    progress: 0,
  },
];

export default function AkademieScreen() {
  const xp = useGamificationStore((state) => state.userStats.xp);

  const renderItem: ListRenderItem<LernpfadItem> = useCallback(
    ({ item }) => (
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
        <Text style={styles.progressLabel}>{item.progress}% abgeschlossen</Text>
      </PressableCard>
    ),
    [],
  );

  const keyExtractor = useCallback((item: LernpfadItem) => item.id, []);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <FlatList
        data={LERNPFADE}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.brand}>StructAI</Text>
            <Text style={styles.slogan}>
              Master Prompting. Build Real Intelligence.
            </Text>
            <Text style={styles.title}>Deine Lernpfade</Text>
            <Text style={styles.subtitle}>{xp} XP gesammelt</Text>
          </View>
        }
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
    padding: 20,
    gap: 16,
  },
  header: {
    marginBottom: 8,
  },
  brand: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.fontSize.xxl,
    fontWeight: theme.typography.fontWeight.bold,
  },
  slogan: {
    marginTop: 4,
    marginBottom: 16,
    color: theme.colors.text.secondary,
    fontSize: theme.typography.fontSize.sm,
  },
  title: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.fontSize.display,
    fontWeight: theme.typography.fontWeight.bold,
  },
  subtitle: {
    marginTop: 8,
    color: theme.colors.text.secondary,
    fontSize: theme.typography.fontSize.md,
  },
  card: {
    marginBottom: 4,
  },
  cardTitle: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
    marginBottom: 6,
  },
  cardDescription: {
    color: theme.colors.text.secondary,
    fontSize: theme.typography.fontSize.sm,
    marginBottom: 14,
  },
  progressTrack: {
    height: 8,
    borderRadius: 8,
    backgroundColor: theme.colors.background.secondary,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 8,
  },
  progressLabel: {
    marginTop: 8,
    color: theme.colors.text.muted,
    fontSize: theme.typography.fontSize.xs,
  },
});
