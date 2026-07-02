import { useState } from 'react';
import { View, type LayoutChangeEvent } from 'react-native';
import Svg, { Circle, Line, Polyline } from 'react-native-svg';

import { useThemeMode } from '@/theme';

type ScoreChartProps = {
  /** Scores 0–100, chronologisch von alt nach neu. */
  scores: number[];
  height?: number;
};

export function ScoreChart({ scores, height = 120 }: ScoreChartProps) {
  const { tokens } = useThemeMode();
  const [width, setWidth] = useState(0);

  const handleLayout = (event: LayoutChangeEvent) => {
    setWidth(event.nativeEvent.layout.width);
  };

  const padding = tokens.spacing.space2;
  const chartWidth = Math.max(0, width - padding * 2);
  const chartHeight = height - padding * 2;

  const points = scores.map((score, index) => {
    const x =
      padding +
      (scores.length === 1 ? chartWidth / 2 : (index / (scores.length - 1)) * chartWidth);
    const y = padding + chartHeight * (1 - Math.min(100, Math.max(0, score)) / 100);
    return { x, y };
  });

  const polylinePoints = points.map((point) => `${point.x},${point.y}`).join(' ');

  return (
    <View onLayout={handleLayout} style={{ height, width: '100%' }}>
      {width > 0 && scores.length > 0 ? (
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

          {points.map((point, index) => (
            <Circle
              cx={point.x}
              cy={point.y}
              fill={
                index === points.length - 1
                  ? tokens.colors.accent.structure
                  : tokens.colors.background.elevated
              }
              key={`${point.x}-${point.y}`}
              r={index === points.length - 1 ? 5 : 4}
              stroke={tokens.colors.accent.structure}
              strokeWidth={1.5}
            />
          ))}
        </Svg>
      ) : null}
    </View>
  );
}
