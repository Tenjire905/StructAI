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
import { GradientButton } from 'src/shared/ui/GradientButton';
import { theme } from 'src/shared/theme/index';
import { useGamificationStore } from 'src/features/Gamification/model/store';

const WEEKDAY_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
const ORB_INDICES = [0, 1, 2, 3, 4];

type ProfilSection =
  | { id: 'header' }
  | { id: 'stats' }
  | { id: 'streak' }
  | { id: 'energy' }
  | { id: 'premium' };

const SECTIONS: ProfilSection[] = [
  { id: 'header' },
  { id: 'stats' },
  { id: 'streak' },
  { id: 'energy' },
  { id: 'premium' },
];

const LERNPFAD_COUNT = 3;

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

export default function ProfilScreen() {
  const level = useGamificationStore((state) => state.userStats.level);
  const xp = useGamificationStore((state) => state.userStats.xp);
  const streak = useGamificationStore((state) => state.userStats.streak);
  const currentOrbs = useGamificationStore((state) => state.energy.currentOrbs);
  const maxOrbs = useGamificationStore((state) => state.energy.maxOrbs);
  const isPremium = useGamificationStore((state) => state.isPremium);
  const setPremium = useGamificationStore((state) => state.setPremium);

  const xpThreshold = level * 100;
  const xpProgress = Math.min((xp / xpThreshold) * 100, 100);

  const handleUpgrade = useCallback(() => {
    try {
      setPremium(true);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Unbekannter Fehler';
      console.error('[ProfilScreen] Premium-Aktivierung fehlgeschlagen:', message);
    }
  }, [setPremium]);

  const renderSection: ListRenderItem<ProfilSection> = useCallback(
    ({ item }) => {
      if (item.id === 'header') {
        return (
          <View style={styles.header}>
            <Text style={styles.brand}>StructAI</Text>
            <Text style={styles.slogan}>
              Master Prompting. Build Real Intelligence.
            </Text>
            <Text style={styles.levelTitle}>Level {level}</Text>
            <Text style={styles.xpSubtitle}>{xp} XP</Text>
            <View style={styles.progressTrack}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${xpProgress}%`,
                    backgroundColor: theme.colors.feedback.warning,
                  },
                ]}
              />
            </View>
          </View>
        );
      }

      if (item.id === 'stats') {
        return (
          <View style={styles.statsRow}>
            <PressableCard style={styles.statCard}>
              <Text style={styles.statLabel}>Lernpfade</Text>
              <Text style={styles.statValue}>{LERNPFAD_COUNT}</Text>
            </PressableCard>
            <PressableCard
              style={styles.statCard}
              accentColor={theme.colors.accent.everyday}
            >
              <Text style={styles.statLabel}>Streak</Text>
              <Text style={styles.statValue}>{streak} Tage</Text>
            </PressableCard>
          </View>
        );
      }

      if (item.id === 'streak') {
        return (
          <PressableCard style={styles.sectionCard}>
            <Text style={styles.streakTitle}>🔥 {streak} Tage</Text>
            <View style={styles.weekRow}>
              {WEEKDAY_LABELS.map((label, index) => {
                const filled = index < Math.min(streak, 7);
                return (
                  <View key={`${label}-${index}`} style={styles.dayCell}>
                    <View
                      style={[
                        styles.dayDot,
                        filled ? styles.dayDotFilled : styles.dayDotEmpty,
                      ]}
                    />
                    <Text style={styles.dayLabel}>{label}</Text>
                  </View>
                );
              })}
            </View>
          </PressableCard>
        );
      }

      if (item.id === 'energy') {
        return (
          <PressableCard style={styles.sectionCard}>
            <Text style={styles.energyTitle}>
              ⚡ {currentOrbs}/{maxOrbs} Orbs
            </Text>
            <EnergyOrbs currentOrbs={currentOrbs} maxOrbs={maxOrbs} />
          </PressableCard>
        );
      }

      return (
        <View style={styles.premiumSection}>
          {isPremium ? (
            <GradientButton
              label="Premium Aktiv ✨"
              onPress={() => undefined}
              disabled
              gradientColors={[
                theme.colors.feedback.warning,
                theme.colors.feedback.warning,
              ]}
            />
          ) : (
            <GradientButton
              label="Upgrade auf Premium"
              onPress={handleUpgrade}
              gradientColors={[
                theme.colors.accent.everyday,
                theme.colors.accent.visual,
              ]}
            />
          )}
        </View>
      );
    },
    [
      currentOrbs,
      handleUpgrade,
      isPremium,
      level,
      maxOrbs,
      streak,
      xp,
      xpProgress,
    ],
  );

  const keyExtractor = useCallback((item: ProfilSection) => item.id, []);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <FlatList
        data={SECTIONS}
        keyExtractor={keyExtractor}
        renderItem={renderSection}
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
    padding: 20,
    gap: 16,
  },
  header: {
    marginBottom: 8,
  },
  brand: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
  },
  slogan: {
    marginTop: 4,
    marginBottom: 12,
    color: theme.colors.text.secondary,
    fontSize: theme.typography.fontSize.sm,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 4,
  },
  statCard: {
    flex: 1,
  },
  statLabel: {
    color: theme.colors.text.muted,
    fontSize: theme.typography.fontSize.sm,
    marginBottom: 6,
  },
  statValue: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.fontSize.xxl,
    fontWeight: theme.typography.fontWeight.bold,
  },
  levelTitle: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.fontSize.display,
    fontWeight: theme.typography.fontWeight.bold,
  },
  xpSubtitle: {
    marginTop: 6,
    color: theme.colors.text.secondary,
    fontSize: theme.typography.fontSize.lg,
  },
  progressTrack: {
    marginTop: 16,
    height: 8,
    borderRadius: 8,
    backgroundColor: theme.colors.background.secondary,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 8,
  },
  sectionCard: {
    marginBottom: 4,
  },
  streakTitle: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    marginBottom: 16,
  },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayCell: {
    alignItems: 'center',
    gap: 6,
  },
  dayDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: theme.colors.border.subtle,
  },
  dayDotFilled: {
    backgroundColor: theme.colors.accent.everyday,
    borderColor: theme.colors.accent.everyday,
  },
  dayDotEmpty: {
    backgroundColor: theme.colors.background.card,
  },
  dayLabel: {
    color: theme.colors.text.muted,
    fontSize: theme.typography.fontSize.xs,
  },
  energyTitle: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.semibold,
    marginBottom: 12,
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
  premiumSection: {
    marginTop: 8,
  },
});
