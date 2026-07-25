import { useId } from 'react';
import Svg, { Circle, Defs, RadialGradient, Stop } from 'react-native-svg';

import { useThemeMode } from '@/theme';

type OrbIconProps = {
  size?: number;
};

/** Static abstract orb mark — matches animated companion (eclipse + corona). */
export function OrbIcon({ size = 24 }: OrbIconProps) {
  const { tokens } = useThemeMode();
  // Unique gradient ids — shared hardcoded ids collapse fills to empty rings ("O").
  const auraId = `orbIconAura-${useId().replace(/:/g, '')}`;
  const primary = tokens.colors.accent.primary;
  const primaryDim = tokens.colors.accent.primaryDim;
  const structure = tokens.colors.accent.structure;
  const isLight = tokens.appearance === 'light';
  // Light: near-ink core so the eclipse reads on paper; dark keeps page ink.
  const core = isLight ? tokens.colors.text.primary : tokens.colors.background.base;
  // Light rim must not be white-on-paper (reads as hollow "O") — use brand violet.
  const rim = isLight ? primary : tokens.colors.text.onAccent;

  return (
    <Svg height={size} viewBox="0 0 24 24" width={size}>
      <Defs>
        <RadialGradient cx="50%" cy="50%" id={auraId} rx="50%" ry="50%">
          <Stop offset="0%" stopColor={core} stopOpacity="1" />
          <Stop offset="55%" stopColor={core} stopOpacity="1" />
          <Stop offset="78%" stopColor={primary} stopOpacity="0.95" />
          <Stop offset="100%" stopColor={primaryDim} stopOpacity="0" />
        </RadialGradient>
      </Defs>
      <Circle cx="12" cy="12" fill={`url(#${auraId})`} r="10.5" />
      <Circle cx="12" cy="12" fill={core} r="7.1" />
      <Circle
        cx="12"
        cy="12"
        fill="none"
        r="7.15"
        stroke={rim}
        strokeOpacity={isLight ? 0.95 : 0.85}
        strokeWidth={isLight ? 0.7 : 0.45}
      />
      <Circle
        cx="12"
        cy="12"
        fill="none"
        r="7.55"
        stroke={structure}
        strokeOpacity={isLight ? 0.8 : 0.65}
        strokeWidth={isLight ? 1.05 : 0.9}
      />
    </Svg>
  );
}
