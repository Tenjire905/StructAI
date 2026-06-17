import { Ionicons } from '@expo/vector-icons';
import { FlashList } from '@shopify/flash-list';
import { useCallback } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useGamificationStore } from 'src/features/Gamification/model/store';
import { theme } from 'src/shared/theme';
import {
  GlassCard,
  ScreenBackground,
  SFProgressPill,
  SFLargeTitle,
} from 'src/shared/ui';

interface LearningPath {
  id: string;
  title: string;
  description: string;
  progress: number;
  accentColor: string;
  icon: keyof typeof Ionicons.glyphMap;
}

const LEARNING_PATHS: readonly LearningPath[] = [
  {
    id: 'everyday',
    title: 'Everyday Mastery',
    description: 'Alltags-Prompting für klare, effektive Ergebnisse.',
    progress: 0.62,
    accentColor: theme.colors.accent.everyday,
    icon: 'book-outline',
  },
  {
    id: 'code',
    title: 'Code & Development',
    description: 'Dev-Prompting für sauberen, präzisen Code.',
    progress: 0.35,
    accentColor: theme.colors.accent.code,
    icon: 'code-slash-outline',
  },
  {
    id: 'visual',
    title: 'Visual Creation',
    description: 'Bild- und KI-Design via durchdachte Prompts.',
    progress: 0.18,
    accentColor: theme.colors.accent.visual,
    icon: 'color-palette-outline',
  },
];

export default function AkademieScreen(): React.JSX.Element {
  const xp = useGamificationStore((state) => state.userStats.xp);
  const safeXp =
    typeof xp === 'number' && Number.isFinite(xp) ? xp : 0;

  const keyExtractor = useCallback((item: LearningPath): string => item.id, []);

  const renderItem = useCallback(
    ({ item }: { item: LearningPath }) => {
      const percent = Math.round(item.progress * 100);
      return (
        <GlassCard accentColor={item.accentColor} style={styles.card}>
          <View style={styles.cardHeader}>
            <View
              style={[
                styles.iconWrap,
                {
                  borderColor: item.accentColor,
                  shadowColor: item.accentColor,
                },
              ]}
            >
              <Ionicons name={item.icon} size={20} color={item.accentColor} />
            </View>
            <View style={styles.cardText}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardDescription}>{item.description}</Text>
            </View>
            <Pressable
              accessibilityRole="button"
              style={styles.arrowButton}
              hitSlop={8}
            >
              <Ionicons
                name="chevron-forward"
                size={20}
                color={theme.colors.text.muted}
              />
            </Pressable>
          </View>
          <SFProgressPill
            progress={item.progress}
            height={12}
            accentColor={item.accentColor}
            label={`${percent}% abgeschlossen`}
            showPercent
          />
        </GlassCard>
      );
    },
    [],
  );

  const ListHeader = useCallback(
    () => (
      <View style={styles.header}>
        <SFLargeTitle
          subtitle={`${safeXp} XP gesammelt`}
        >
          Deine Lernpfade
        </SFLargeTitle>
      </View>
    ),
    [safeXp],
  );

  return (
    <ScreenBackground>
      <SafeAreaView style={styles.safe} edges={['top']}>
        <FlashList
          data={LEARNING_PATHS as LearningPath[]}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          estimatedItemSize={160}
          ListHeaderComponent={ListHeader}
          contentContainerStyle={styles.listContent}
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
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 120,
  },
  header: {
    marginBottom: 20,
    paddingTop: 8,
  },
  card: {
    marginBottom: 14,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 14,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.background.card,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  cardText: {
    flex: 1,
    gap: 4,
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
  arrowButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
