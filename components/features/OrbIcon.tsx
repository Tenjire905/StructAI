import Svg, { Circle, Defs, RadialGradient, Stop } from 'react-native-svg';

import { useThemeMode } from '@/theme';

type OrbIconProps = {
  size?: number;
};

export function OrbIcon({ size = 24 }: OrbIconProps) {
  const { tokens } = useThemeMode();

  return (
    <Svg height={size} viewBox="0 0 24 24" width={size}>
      <Defs>
        <RadialGradient cx="35%" cy="30%" id="orbGradient" rx="70%" ry="70%">
          <Stop offset="0%" stopColor={tokens.colors.accent.structure} />
          <Stop offset="100%" stopColor={tokens.colors.accent.primary} />
        </RadialGradient>
      </Defs>
      <Circle cx="12" cy="12" fill="url(#orbGradient)" r="10" />
      <Circle
        cx="9"
        cy="9"
        fill={tokens.colors.text.onAccent}
        opacity={0.25}
        r="3"
      />
    </Svg>
  );
}
