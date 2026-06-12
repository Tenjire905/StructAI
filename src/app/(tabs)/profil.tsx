import React, { useCallback, useMemo } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import type { ListRenderItem } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useGamificationStore } from 'src/features/Gamification/model/store';
import { PressableCard } from 'src/shared/ui/PressableCard';
import { GradientButton } from 'src/shared/ui/GradientButton';
import { theme } from 'src/shared/theme/index';

const LEARNING_PATHS_COUNT = 3;
const WEEK_DAYS = ['M', 'D', 'M', 'D', 'F', 'S', 'S'] as const;

type ProfilSection = {
  id: string;
  type: 'level' | 'stats' | 'streak' | 'energy' | 'settings' | 'premium';
};

const SECTIONS: ProfilSection[] = [
  { id: 'level', type: 'level' },
  { id: 'stats', type: 'stats' },
  { id: 'streak', type: 'streak' },
  { id: 'energy', type: 'energy' },
  { id: 'settings', type: 'settings' },
  { id: 'premium', type: 'premium' },
];

export default function ProfilScreen() {
  const router = useRouter();

  const level = useGamificationStore((s) => s.userStats.level);
  const xp = useGamificationStore((s) => s.userStats.xp);
  const streak = useGamificationStore((s) => s.userStats.streak);
  const currentOrbs = useGamificationStore((s) => s.energy.currentOrbs);
  const maxOrbs = useGamificationStore((s) => s.energy.maxOrbs);
  const isPremium = useGamificationStore((s) => s.isPremium);

  const xpThreshold = 100 * level;
  const xpProgress = useMemo(
    () => Math.min(xp / xpThreshold, 1),
    [xp, xpThreshold],
  );

  const handlePremium = useCallback(() => {
    router.push('/paywall');
  }, [router]);

  const handleSettings = useCallback(() => {
    router.push('/settings');
  }, [router]);

  const renderLevel = useCallback(
    () => (
      <PressableCard style={styles.card}>
        <Text style={styles.levelTitle}>Level {level}</Text>
        <Text style={styles.xpLabel}>{xp} XP</Text>
        <View style={styles.xpTrack}>
          <View
            style={[
              styles.xpFill,
              { width: `${xpProgress * 100}%` as `${number}%` },
            ]}
          />
        </View>
        <Text style={styles.xpSubLabel}>
          {xp} / {xpThreshold} XP bis Level {level + 1}
        </Text>
      </PressableCard>
    ),
    [level, xp, xpProgress, xpThreshold],
  );

  const renderStats = useCallback(
    () => (
      <View style={styles.statsRow}>
        <PressableCard style={styles.statCard}>
          <Text style={styles.statValue}>{LEARNING_PATHS_COUNT}</Text>
          <Text style={styles.statLabel}>Lernpfade</Text>
        </PressableCard>
        <PressableCard style={styles.statCard}>
          <Text style={styles.statValue}>{streak}</Text>
          <Text style={styles.statLabel}>Streak Tage</Text>
        </PressableCard>
      </View>
    ),
    [streak],
  );

  const renderStreak = useCallback(
    () => (
      <PressableCard style={styles.card}>
        <Text style={styles.sectionTitle}>Wochen-Streak</Text>
        <View style={styles.orbRow}>
          {WEEK_DAYS.map((day, index) => {
            const filled = index < Math.min(streak, 7);
            return (
              <View key={`streak-${index}`} style={styles.orbColumn}>
                <View
                  style={[
                    styles.orb,
                    filled ? styles.orbFilled : styles.orbEmpty,
                  ]}
                />
                <Text style={styles.dayLabel}>{day}</Text>
              </View>
            );
          })}
        </View>
      </PressableCard>
    ),
    [streak],
  );

  const renderEnergy = useCallback(
    () => (
      <PressableCard style={styles.card}>
        <Text style={styles.sectionTitle}>Energie</Text>
        <View style={styles.orbRow}>
          {Array.from({ length: maxOrbs }).map((_, index) => {
            const filled = index < currentOrbs;
            return (
              <View
                key={`energy-${index}`}
                style={[
                  styles.orb,
                  filled ? styles.orbFilled : styles.orbEmpty,
                ]}
              />
            );
          })}
        </View>
        <Text style={styles.energyLabel}>
          {isPremium ? 'Unbegrenzt ✨' : `${currentOrbs}/${maxOrbs} Orbs`}
        </Text>
      </PressableCard>
    ),
    [currentOrbs, maxOrbs, isPremium],
  );

  const renderSettings = useCallback(
    () => (
      <PressableCard onPress={handleSettings} style={styles.card}>
        <View style={styles.settingsRow}>
          <Text style={styles.settingsText}>Einstellungen</Text>
          <Text style={styles.chevron}>›</Text>
        </View>
      </PressableCard>
    ),
    [handleSettings],
  );

  const renderPremium = useCallback(
    () => (
      <View style={styles.premiumWrapper}>
        <GradientButton
          label={isPremium ? 'Premium Aktiv ✨' : 'Upgrade auf Premium'}
          onPress={handlePremium}
          gradientColors={
            [
              theme.colors.accent.everyday,
              theme.colors.accent.code,
            ] as const
          }
          disabled={isPremium}
        />
      </View>
    ),
    [isPremium, handlePremium],
  );

  const renderItem: ListRenderItem<ProfilSection> = useCallback(
    ({ item }) => {
      switch (item.type) {
        case 'level':
          return renderLevel();
        case 'stats':
          return renderStats();
        case 'streak':
          return renderStreak();
        case 'energy':
          return renderEnergy();
        case 'settings':
          return renderSettings();
        case 'premium':
          return renderPremium();
        default:
          return null;
      }
    },
    [renderLevel, renderStats, renderStreak, renderEnergy, renderSettings, renderPremium],
  );

  const ListHeader = useCallback(
    () => (
      <View style={styles.header}>
        <Text style={styles.brandTitle}>StructAI</Text>
        <Text style={styles.slogan}>
          Master Prompting. Build Real Intelligence.
        </Text>
      </View>
    ),
    [],
  );

  const ItemSeparator = useCallback(
    () => <View style={styles.separator} />,
    [],
  );

  return (
    <SafeAreaView style={styles.root}>
      <FlatList
        data={SECTIONS}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListHeaderComponent={ListHeader}
        ItemSeparatorComponent={ItemSeparator}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  header: {
    paddingTop: 16,
    paddingBottom: 20,
    alignItems: 'center',
  },
  brandTitle: {
    fontSize: theme.typography.fontSize.xxl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: 6,
  },
  slogan: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.regular,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
  card: {
    borderRadius: 20,
  },
  separator: {
    height: 12,
  },
  levelTitle: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: 4,
  },
  xpLabel: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.feedback.warning,
    marginBottom: 10,
  },
  xpTrack: {
    height: 10,
    borderRadius: 8,
    backgroundColor: theme.colors.background.secondary,
    overflow: 'hidden',
    marginBottom: 6,
  },
  xpFill: {
    height: '100%',
    borderRadius: 8,
    backgroundColor: theme.colors.feedback.warning,
  },
  xpSubLabel: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.regular,
    color: theme.colors.text.muted,
    marginTop: 2,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    borderRadius: 20,
  },
  statValue: {
    fontSize: theme.typography.fontSize.xxl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.regular,
    color: theme.colors.text.muted,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
    marginBottom: 14,
  },
  orbRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  orbColumn: {
    alignItems: 'center',
    gap: 4,
  },
  orb: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  orbFilled: {
    backgroundColor: theme.colors.accent.everyday,
  },
  orbEmpty: {
    backgroundColor: theme.colors.background.card,
    borderWidth: 1,
    borderColor: theme.colors.border.subtle,
  },
  dayLabel: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.regular,
    color: theme.colors.text.muted,
  },
  energyLabel: {
    marginTop: 12,
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text.secondary,
  },
  settingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  settingsText: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text.primary,
  },
  chevron: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.regular,
    color: theme.colors.text.muted,
  },
  premiumWrapper: {
    marginTop: 4,
  },
});