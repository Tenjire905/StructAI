import { useState } from 'react';
import { Pressable, Text, View, type LayoutChangeEvent } from 'react-native';
import Svg, { Circle, Line, Polyline } from 'react-native-svg';

import { useThemeMode } from '@/theme';

import { OrbIcon } from './OrbIcon';

type ScoreChartProps = {
  /** Scores 0–100, chronologisch von alt nach neu (for y-position). */
  scores: number[];
  height?: number;
  /**
   * Absolute values for the point peek (e.g. orbs). When set with
   * `onPointPress`, points become tappable.
   */
  pointValues?: number[];
  selectedIndex?: number | null;
  onPointPress?: (index: number) => void;
};

const HIT_SIZE = 28;

export function ScoreChart({
  scores,
  height = 120,
  pointValues,
  selectedIndex = null,
  onPointPress,
}: ScoreChartProps) {
  const { tokens, t } = useThemeMode();
  const [width, setWidth] = useState(0);

  const handleLayout = (event: LayoutChangeEvent) => {
    setWidth(event.nativeEvent.layout.width);
  };

  const padding = tokens.spacing.space2;
  const chartWidth = Math.max(0, width - padding * 2);
  const chartHeight = height - padding * 2;
  const interactive = Boolean(onPointPress && pointValues && pointValues.length === scores.length);

  const points = scores.map((score, index) => {
    const x =
      padding +
      (scores.length === 1 ? chartWidth / 2 : (index / (scores.length - 1)) * chartWidth);
    const y = padding + chartHeight * (1 - Math.min(100, Math.max(0, score)) / 100);
    return { x, y, value: pointValues?.[index] ?? score };
  });

  const polylinePoints = points.map((point) => `${point.x},${point.y}`).join(' ');
  const selectedPoint =
    selectedIndex !== null && selectedIndex >= 0 && selectedIndex < points.length
      ? points[selectedIndex]
      : null;

  return (
    <View onLayout={handleLayout} style={{ height, width: '100%' }}>
      {width > 0 && scores.length > 0 ? (
        <>
          <Svg height={height} width={width}>
            {[0.25, 0.5, 0.75].map((fraction) => (
              <Line
                key={fraction}
                stroke={tokens.colors.border.subtle}
                strokeWidth={1}
                x1={padding}
                x2={width - padding}
                y1={padding + chartHeight * fraction}
                y2={padding + chartHeight * fraction}
              />
            ))}

            {points.length > 1 ? (
              <Polyline
                fill="none"
                points={polylinePoints}
                stroke={tokens.colors.accent.structure}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
              />
            ) : null}

            {points.map((point, index) => {
              const isSelected = selectedIndex === index;
              const isLatest = index === points.length - 1;

              return (
                <Circle
                  cx={point.x}
                  cy={point.y}
                  fill={
                    isSelected || isLatest
                      ? tokens.colors.accent.structure
                      : tokens.colors.background.elevated
                  }
                  key={`${point.x}-${point.y}-${index}`}
                  r={isSelected ? 6 : isLatest ? 5 : 4}
                  stroke={tokens.colors.accent.structure}
                  strokeWidth={1.5}
                />
              );
            })}
          </Svg>

          {interactive
            ? points.map((point, index) => (
                <Pressable
                  accessibilityLabel={t('home.activityInsights.orbPeekA11y', {
                    count: point.value,
                  })}
                  accessibilityRole="button"
                  hitSlop={6}
                  key={`hit-${index}`}
                  onPress={(event) => {
                    event.stopPropagation?.();
                    onPointPress?.(index);
                  }}
                  style={{
                    height: HIT_SIZE,
                    left: point.x - HIT_SIZE / 2,
                    position: 'absolute',
                    top: point.y - HIT_SIZE / 2,
                    width: HIT_SIZE,
                  }}
                />
              ))
            : null}

          {selectedPoint ? (
            <View
              pointerEvents="none"
              style={{
                alignItems: 'center',
                left: Math.min(
                  Math.max(selectedPoint.x - 36, 0),
                  Math.max(0, width - 72),
                ),
                position: 'absolute',
                top:
                  selectedPoint.y < tokens.spacing.space7
                    ? selectedPoint.y + tokens.spacing.space3
                    : Math.max(0, selectedPoint.y - tokens.spacing.space7),
              }}>
              <View
                style={{
                  alignItems: 'center',
                  backgroundColor: tokens.colors.background.elevated,
                  borderColor: tokens.colors.border.subtle,
                  borderRadius: tokens.radius.pill,
                  borderWidth: 1,
                  flexDirection: 'row',
                  gap: tokens.spacing.space1,
                  paddingHorizontal: tokens.spacing.space2,
                  paddingVertical: tokens.spacing.space1,
                }}>
                <OrbIcon size={tokens.icons.sizes.sm} />
                <Text
                  style={{
                    color: tokens.colors.text.primary,
                    fontFamily: tokens.typography.fontFamily.mono,
                    fontSize: tokens.typography.fontSize.bodySm,
                  }}>
                  {selectedPoint.value}
                </Text>
              </View>
            </View>
          ) : null}
        </>
      ) : null}
    </View>
  );
}
