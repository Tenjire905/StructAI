import Svg, { Circle, Defs, RadialGradient, Stop } from 'react-native-svg';

import { useThemeMode } from '@/theme';

type OrbIconProps = {
  size?: number;
};

/** Static abstract orb mark — matches animated companion (eclipse + corona). */
export function OrbIcon({ size = 24 }: OrbIconProps) {
  const { tokens } = useThemeMode();
  const primary = tokens.colors.accent.primary;
  const primaryDim = tokens.colors.accent.primaryDim;
  const structure = tokens.colors.accent.structure;
  const core = tokens.colors.background.base;
  const rim = tokens.colors.text.onAccent;

  return (
    <Svg height={size} viewBox="0 0 24 24" width={size}>
      <Defs>
        <RadialGradient cx="50%" cy="50%" id="orbIconAura" rx="50%" ry="50%">
          <Stop offset="0%" stopColor={core} stopOpacity="1" />
          <Stop offset="60%" stopColor={core} stopOpacity="1" />
          <Stop offset="78%" stopColor={primary} stopOpacity="0.9" />
          <Stop offset="100%" stopColor={primaryDim} stopOpacity="0" />
        </RadialGradient>
      </Defs>
      <Circle cx="12" cy="12" fill={`url(#orbIconAura)`} r="10.5" />
      <Circle cx="12" cy="12" fill={core} r="7.1" />
      <Circle
        cx="12"
        cy="12"
        fill="none"
        r="7.15"
        stroke={rim}
        strokeOpacity={0.85}
        strokeWidth={0.45}
      />
      <Circle
        cx="12"
        cy="12"
        fill="none"
        r="7.55"
        stroke={structure}
        strokeOpacity={0.65}
        strokeWidth={0.9}
      />
    </Svg>
  );
}
