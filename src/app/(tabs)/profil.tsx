import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCallback, useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useGamificationStore } from 'src/features/Gamification/model/store';
import { theme } from 'src/shared/theme';
import {
  GlassCard,
  GradientButton,
  ScreenBackground,
  SFListRow,
  SFOrbIndicator,
  SFProgressPill,
  SFStatCard,
  SFStreakDot,
} from 'src/shared/ui';

const WEEK_DAYS = ['M', 'D', 'M', 'D', 'F', 'S', 'S'] as const;
const LEARNING_PATHS_COUNT = 3;

export default function ProfilScreen(): React.JSX.Element {
  const router = useRouter();

  const level = useGamificationStore((s) => s.userStats.level);
  const xp = useGamificationStore((s) => s.userStats.xp);
  const streak = useGamificationStore((s) => s.userStats.streak);
  const currentOrbs = useGamificationStore((s) => s.energy.currentOrbs);
  const maxOrbs = useGamificationStore((s) => s.energy.maxOrbs);
  const isPremium = useGamificationStore((s) => s.isPremium);

  const xpThreshold = 100 * level;
  const xpProgress = useMemo(
    () => (xpThreshold > 0 ? xp / xpThreshold : 0),
    [xp, xpThreshold],
  );

  const activeDays = useMemo(
    () => Array.from({ length: 7 }, (_, index) => index < Math.min(streak, 7)),
    [streak],
  );

  const openPaywall = useCallback((): void => {
    router.push('/paywall');
  }, [router]);

  const openSettings = useCallback((): void => {
    router.push('/settings');
  }, [router]);

  const orbCount = isPremium ? maxOrbs : currentOrbs;
  const energyLabel = isPremium
    ? 'Unbegrenzt ✨'
    : `${currentOrbs}/${maxOrbs} Orbs`;

  return (
    <ScreenBackground>
      <SafeAreaView style={styles.safe} edges={['top']}>
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={styles.greeting}>StructAI Learner</Text>
            <Text style={styles.slogan}>
              Master Prompting. Build Real Intelligence.
            </Text>
          </View>

          <GlassCard accentColor={theme.colors.feedback.warning} style={styles.block}>
            <View style={styles.levelRow}>
              <View style={styles.levelBadge}>
                <Text style={styles.levelBadgeText}>Lv {level}</Text>
              </View>
              <View style={styles.levelMeta}>
                <Text style={styles.levelTitle}>Level {level}</Text>
                <Text style={styles.xpText}>{xp} XP</Text>
              </View>
            </View>
            <SFProgressPill
              progress={xpProgress}
              height={12}
              accentColor={theme.colors.feedback.warning}
              label={`${xp} / ${xpThreshold} XP`}
              showPercent
            />
          </GlassCard>

          <View style={styles.statsRow}>
            <SFStatCard
              value={String(LEARNING_PATHS_COUNT)}
              label="Lernpfade"
              icon="book-outline"
            />
            <SFStatCard
              value={`${streak}`}
              label="Tage Streak"
              icon="flash-outline"
            />
          </View>

          <GlassCard style={styles.block}>
            <Text style={styles.sectionTitle}>Daily Streaks</Text>
            <View style={styles.streakRow}>
              {WEEK_DAYS.map((day, index) => (
                <SFStreakDot
                  key={`day-${index}`}
                  label={day}
                  active={activeDays[index] ?? false}
                />
              ))}
            </View>
          </GlassCard>

          <GlassCard style={styles.block}>
            <Text style={styles.sectionTitle}>Energie</Text>
            <SFOrbIndicator
              current={orbCount}
              max={maxOrbs}
              label={energyLabel}
            />
          </GlassCard>

          {!isPremium ? (
            <GradientButton
              label="Premium freischalten ✨"
              onPress={openPaywall}
              gradientColors={theme.colors.gradient.button}
            />
          ) : null}

    <GlassCard style={styles.block}>
            <SFListRow
              label="Einstellungen"
              icon="settings-outline"
              onPress={openSettings}
            />
          </GlassCard>
        </ScrollView>
      </SafeAreaView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 120,
    gap: 14,
  },
  header: {
    paddingTop: 8,
    paddingBottom: 4,
  },
  greeting: {
    fontSize: theme.typography.fontSize.xxl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
  },
  slogan: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.regular,
    color: theme.colors.text.muted,
    marginTop: 6,
  },
  block: {
    marginTop: 0,
  },
  levelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 14,
  },
  levelBadge: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.background.card,
    borderWidth: 1,
    borderColor: theme.colors.feedback.warning,
    shadowColor: theme.colors.feedback.warning,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
  },
  levelBadgeText: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.feedback.warning,
  },
  levelMeta: {
    flex: 1,
    gap: 4,
  },
  levelTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
  },
  xpText: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.feedback.warning,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
    marginBottom: 14,
  },
  streakRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 4,
  },
});
