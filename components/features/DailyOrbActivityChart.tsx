import { useEffect, useMemo, useState } from 'react';
import { Text, View, type LayoutChangeEvent } from 'react-native';
import Animated, {
  type SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
} from 'react-native-reanimated';

import type { DailyOrbDayEntry } from '@/lib/dailyOrbHistory';
import { useThemeMode } from '@/theme';

type DailyOrbActivityChartProps = {
  entries: DailyOrbDayEntry[];
  dailyOrbGoal: number;
  revealNonce?: number;
};

const CHART_HEIGHT = 132;

export function DailyOrbActivityChart({
  entries,
  dailyOrbGoal,
  revealNonce = 0,
}: DailyOrbActivityChartProps) {
  const { tokens } = useThemeMode();
  const [width, setWidth] = useState(0);
  const barProgress = useSharedValue(0);

  useEffect(() => {
    barProgress.value = 0;
    barProgress.value = withDelay(80, withSpring(1, tokens.motion.spring.default));
  }, [barProgress, entries, revealNonce, tokens.motion.spring.default]);

  const maxOrbs = useMemo(() => {
    const peak = Math.max(...entries.map((entry) => entry.orbs), 0);
    const goalBaseline = dailyOrbGoal > 0 ? dailyOrbGoal : 0;

    return Math.max(peak, goalBaseline, 1);
  }, [dailyOrbGoal, entries]);

  const handleLayout = (event: LayoutChangeEvent) => {
    setWidth(event.nativeEvent.layout.width);
  };

  const paddingX = tokens.spacing.space1;
  const chartWidth = Math.max(0, width - paddingX * 2);
  const barGap = tokens.spacing.space1 / 2;
  const barWidth =
    entries.length > 0
      ? Math.max(4, (chartWidth - barGap * (entries.length - 1)) / entries.length)
      : 0;

  return (
    <View onLayout={handleLayout} style={{ gap: tokens.spacing.space2, width: '100%' }}>
      {width > 0 ? (
        <View style={{ height: CHART_HEIGHT, justifyContent: 'flex-end' }}>
          {dailyOrbGoal > 0 ? (
            <View
              pointerEvents="none"
              style={{
                borderColor: tokens.colors.border.subtle,
                borderStyle: 'dashed',
                borderWidth: 1,
                bottom:
                  paddingX + (dailyOrbGoal / maxOrbs) * (CHART_HEIGHT - tokens.spacing.space4),
                left: paddingX,
                position: 'absolute',
                right: paddingX,
              }}
            />
          ) : null}

          <View
            style={{
              alignItems: 'flex-end',
              flexDirection: 'row',
              gap: barGap,
              height: CHART_HEIGHT - tokens.spacing.space4,
              paddingHorizontal: paddingX,
            }}>
            {entries.map((entry, index) => (
              <ActivityBar
                barProgress={barProgress}
                barWidth={barWidth}
                chartHeight={CHART_HEIGHT - tokens.spacing.space4}
                index={index}
                key={entry.dateKey}
                maxOrbs={maxOrbs}
                orbs={entry.orbs}
              />
            ))}
          </View>
        </View>
      ) : null}

      <View
        style={{
          flexDirection: 'row',
          gap: barGap,
          paddingHorizontal: paddingX,
        }}>
        {entries.map((entry) => (
          <Text
            key={`${entry.dateKey}-label`}
            style={{
              color: tokens.colors.text.tertiary,
              flex: 1,
              fontFamily: tokens.typography.fontFamily.mono,
              fontSize: tokens.typography.fontSize.bodySm,
              textAlign: 'center',
            }}>
            {entry.label}
          </Text>
        ))}
      </View>
    </View>
  );
}

function ActivityBar({
  barProgress,
  barWidth,
  chartHeight,
  maxOrbs,
  orbs,
}: {
  barProgress: SharedValue<number>;
  barWidth: number;
  chartHeight: number;
  index: number;
  maxOrbs: number;
  orbs: number;
}) {
  const { tokens } = useThemeMode();

  const animatedStyle = useAnimatedStyle(() => {
    const targetHeight = (orbs / maxOrbs) * chartHeight;

    return {
      height: Math.max(orbs > 0 ? 6 : 4, targetHeight * barProgress.value),
      opacity: orbs > 0 ? 0.4 + barProgress.value * 0.6 : 0.35,
    };
  });

  return (
    <Animated.View
      style={[
        animatedStyle,
        {
          backgroundColor:
            orbs > 0 ? tokens.colors.accent.structure : tokens.colors.surface.cardHover,
          borderRadius: tokens.radius.sm,
          width: barWidth,
        },
      ]}
    />
  );
}
