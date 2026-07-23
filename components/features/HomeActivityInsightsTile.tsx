import { ChevronDown } from 'lucide-react-native';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Text, View } from 'react-native';
import Animated, {
  Easing,
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { PressableScale } from '@/components/ui/PressableScale';
import { getTodayDateKey } from '@/lib/dailyOrbGoal';
import {
  ACTIVITY_CHART_DAY_COUNT,
  computeProductivityPercent,
  getRecentDailyOrbEntries,
} from '@/lib/dailyOrbHistory';
import { getShadow, useThemeMode, type Locale } from '@/theme';

import { ScoreChart } from './ScoreChart';
import { StatBlock } from './StatBlock';
import { StreakTracker } from './StreakTracker';

const DATE_LOCALE: Record<Locale, string> = {
  de: 'de-DE',
  en: 'en-US',
  fr: 'fr-FR',
  ru: 'ru-RU',
};

type HomeActivityInsightsTileProps = {
  completedLessons: number;
  currentStreak: number;
  streakDays: boolean[];
  dailyOrbHistory: Record<string, number>;
  dailyOrbGoal: number;
  orbsEarnedToday: number;
};

const COLLAPSED_HEIGHT = 228;
const EXPANDED_HEIGHT = 352;

/** Apple-like ease — soft decelerate, no overshoot. */
const MORPH_EASING = Easing.bezier(0.25, 0.1, 0.25, 1);

export function HomeActivityInsightsTile({
  completedLessons,
  currentStreak,
  streakDays,
  dailyOrbHistory,
  dailyOrbGoal,
  orbsEarnedToday,
}: HomeActivityInsightsTileProps) {
  const { tokens, t, locale } = useThemeMode();
  const [expanded, setExpanded] = useState(false);
  const [selectedPointIndex, setSelectedPointIndex] = useState<number | null>(null);
  const suppressToggleRef = useRef(false);
  const expandProgress = useSharedValue(0);

  const chartEntries = useMemo(() => {
    const historyWithToday = { ...dailyOrbHistory };
    const todayKey = getTodayDateKey();

    if (orbsEarnedToday > 0) {
      historyWithToday[todayKey] = Math.max(
        historyWithToday[todayKey] ?? 0,
        orbsEarnedToday,
      );
    }

    return getRecentDailyOrbEntries(
      historyWithToday,
      ACTIVITY_CHART_DAY_COUNT,
      new Date(),
      DATE_LOCALE[locale],
    );
  }, [dailyOrbHistory, locale, orbsEarnedToday]);

  const chartScores = useMemo(() => {
    const peak = Math.max(
      ...chartEntries.map((entry) => entry.orbs),
      dailyOrbGoal,
      1,
    );

    return chartEntries.map((entry) => Math.round((entry.orbs / peak) * 100));
  }, [chartEntries, dailyOrbGoal]);

  const productivityPercent = useMemo(
    () => computeProductivityPercent(chartEntries, dailyOrbGoal),
    [chartEntries, dailyOrbGoal],
  );

  useEffect(() => {
    expandProgress.value = withTiming(expanded ? 1 : 0, {
      duration: tokens.motion.duration.medium,
      easing: MORPH_EASING,
    });
  }, [expandProgress, expanded, tokens.motion.duration.medium]);

  const containerStyle = useAnimatedStyle(() => ({
    minHeight: interpolate(
      expandProgress.value,
      [0, 1],
      [COLLAPSED_HEIGHT, EXPANDED_HEIGHT],
      Extrapolation.CLAMP,
    ),
  }));

  const summaryStyle = useAnimatedStyle(() => ({
    opacity: interpolate(expandProgress.value, [0, 0.45], [1, 0], Extrapolation.CLAMP),
  }));

  const detailStyle = useAnimatedStyle(() => ({
    opacity: interpolate(expandProgress.value, [0.4, 1], [0, 1], Extrapolation.CLAMP),
  }));

  const chevronStyle = useAnimatedStyle(() => ({
    opacity: interpolate(expandProgress.value, [0, 1], [0.4, 0.7], Extrapolation.CLAMP),
    transform: [
      {
        rotate: `${interpolate(expandProgress.value, [0, 1], [0, 180], Extrapolation.CLAMP)}deg`,
      },
    ],
  }));

  const toggleExpanded = () => {
    if (suppressToggleRef.current) {
      suppressToggleRef.current = false;
      return;
    }

    setExpanded((current) => {
      if (current) {
        setSelectedPointIndex(null);
      }

      return !current;
    });
  };

  const handlePointPress = (index: number) => {
    suppressToggleRef.current = true;
    setSelectedPointIndex((current) => (current === index ? null : index));
  };

  const productivityCopyKey =
    dailyOrbGoal > 0
      ? 'home.activityInsights.productivityWithGoal'
      : 'home.activityInsights.productivityNoGoal';

  return (
    <PressableScale
      accessibilityHint={t(
        expanded ? 'home.activityInsights.collapseHint' : 'home.activityInsights.expandHint',
      )}
      accessibilityLabel={t('home.activityInsights.title')}
      accessibilityRole="button"
      accessibilityState={{ expanded }}
      onPress={toggleExpanded}
      pressFeedbackDisabled
      style={[
        getShadow(1, tokens.appearance),
        {
          backgroundColor: tokens.colors.surface.card,
          borderColor: tokens.colors.border.subtle,
          borderRadius: tokens.presentation.preferredCardRadius,
          borderWidth: tokens.appearance === 'light' ? 1 : 0,
          overflow: 'hidden',
          padding: tokens.spacing.space4,
        },
      ]}>
      <Animated.View style={[{ gap: tokens.spacing.space3 }, containerStyle]}>
        <View style={{ alignItems: 'flex-end' }}>
          <Animated.View style={chevronStyle}>
            <ChevronDown
              color={tokens.colors.text.tertiary}
              size={tokens.icons.sizes.sm}
              strokeWidth={tokens.icons.strokeWidth}
            />
          </Animated.View>
        </View>

        <Animated.View
          pointerEvents={expanded ? 'none' : 'auto'}
          style={[{ gap: tokens.spacing.space4, marginTop: -tokens.spacing.space3 }, summaryStyle]}>
          <StreakTracker completedDays={streakDays} />
          <View style={{ flexDirection: 'row', gap: tokens.spacing.space3 }}>
            <StatBlock copyKey="statBlock.completedLessons" embedded value={completedLessons} />
            <StatBlock copyKey="statBlock.currentStreak" embedded value={currentStreak} />
          </View>
        </Animated.View>

        <Animated.View
          pointerEvents={expanded ? 'auto' : 'none'}
          style={[
            {
              gap: tokens.spacing.space4,
              left: tokens.spacing.space4,
              position: 'absolute',
              right: tokens.spacing.space4,
              top: tokens.spacing.space4 + tokens.spacing.space3 + tokens.typography.fontSize.bodySm,
            },
            detailStyle,
          ]}>
          <View style={{ gap: tokens.spacing.space1 }}>
            <Text
              style={{
                color: tokens.colors.text.primary,
                fontFamily: tokens.typography.fontFamily.heading,
                fontSize: tokens.typography.fontSize.headingMd,
              }}>
              {t('home.activityInsights.chartTitle')}
            </Text>
            <Text
              style={{
                color: tokens.colors.text.tertiary,
                fontFamily: tokens.typography.fontFamily.body,
                fontSize: tokens.typography.fontSize.bodySm,
              }}>
              {t('home.activityInsights.period', { days: ACTIVITY_CHART_DAY_COUNT })}
            </Text>
          </View>

          <ScoreChart
            onPointPress={handlePointPress}
            pointValues={chartEntries.map((entry) => entry.orbs)}
            scores={chartScores}
            selectedIndex={selectedPointIndex}
          />

          <View
            style={{
              alignItems: 'center',
              backgroundColor: tokens.colors.surface.inset,
              borderRadius: tokens.radius.lg,
              gap: tokens.spacing.space1,
              paddingHorizontal: tokens.spacing.space4,
              paddingVertical: tokens.spacing.space3,
            }}>
            <Text
              style={{
                color: tokens.colors.accent.structure,
                fontFamily: tokens.typography.fontFamily.display,
                fontSize: tokens.typography.fontSize.displayLg,
              }}>
              {t('home.activityInsights.productivityValue', { percent: productivityPercent })}
            </Text>
            <Text
              style={{
                color: tokens.colors.text.secondary,
                fontFamily: tokens.typography.fontFamily.body,
                fontSize: tokens.typography.fontSize.bodySm,
                textAlign: 'center',
              }}>
              {t(productivityCopyKey, { goal: dailyOrbGoal })}
            </Text>
          </View>
        </Animated.View>
      </Animated.View>
    </PressableScale>
  );
}
