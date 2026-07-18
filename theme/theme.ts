import { Platform, type TextStyle, type ViewStyle } from 'react-native';

export type ThemeMode = 'playful' | 'focus';

export type ShadowLevel = 1 | 2 | 'glow';

export type SpringPreset = 'default' | 'bouncy';

export const colors = {
  background: {
    base: '#0A0612',
    elevated: '#120B1E',
  },
  surface: {
    card: '#1A1225',
    cardHover: '#221831',
    glass: 'rgba(255,255,255,0.06)',
  },
  border: {
    subtle: 'rgba(255,255,255,0.08)',
    strong: 'rgba(255,255,255,0.16)',
  },
  accent: {
    primary: '#8B5CF6',
    primaryDim: '#6D28D9',
    structure: '#22D3EE',
    structureDim: '#0E7490',
    warning: '#F59E0B',
    danger: '#EF4444',
    success: '#34D399',
  },
  text: {
    primary: '#F5F3FA',
    secondary: '#9B93AA',
    tertiary: '#635B75',
    onAccent: '#FFFFFF',
  },
} as const;

export const typography = {
  fontFamily: {
    display: 'ClashDisplay-Semibold',
    heading: 'ClashDisplay-Medium',
    body: 'GeneralSans-Regular',
    bodyMedium: 'GeneralSans-Medium',
    mono: 'SpaceMono-Regular',
  },
  fontSize: {
    displayXl: 40,
    displayLg: 32,
    headingLg: 22,
    headingMd: 18,
    bodyLg: 16,
    bodyMd: 14,
    bodySm: 12,
  },
} as const;

export const spacing = {
  space1: 4,
  space2: 8,
  space3: 12,
  space4: 16,
  space5: 24,
  space6: 32,
  space7: 48,
  space8: 64,
  screenPadding: 16,
  screenPaddingHero: 24,
} as const;

export const radius = {
  sm: 12,
  md: 16,
  lg: 20,
  xl: 28,
  pill: 999,
} as const;

export const motion = {
  duration: {
    instant: 100,
    fast: 200,
    medium: 300,
    celebration: 600,
  },
  spring: {
    default: { damping: 15, stiffness: 150 },
    bouncy: { damping: 10, stiffness: 120 },
  },
} as const;

export const icons = {
  strokeWidth: 1.75,
  sizes: {
    sm: 16,
    md: 20,
    lg: 24,
    xl: 32,
  },
} as const;

export const blur = {
  glassIntensity: 40,
} as const;

export const gradients = {
  primaryButton: {
    colors: [colors.accent.primary, colors.accent.primaryDim] as const,
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
  heroBackground: {
    colors: ['#1A1225', '#0A0612'] as const,
    start: { x: 0, y: 0 },
    end: { x: 0, y: 1 },
  },
  orbActive: {
    colors: [colors.accent.structure, colors.accent.primary] as const,
  },
  cardOverlay: {
    colors: ['transparent', 'rgba(0,0,0,0.4)'] as const,
    start: { x: 0, y: 0 },
    end: { x: 0, y: 1 },
  },
} as const;

export type BaseColors = typeof colors;

export type ColorPalette = {
  background: {
    base: string;
    elevated: string;
  };
  surface: {
    card: string;
    cardHover: string;
    glass: string;
  };
  border: {
    subtle: string;
    strong: string;
  };
  accent: {
    primary: string;
    primaryDim: string;
    structure: string;
    structureDim: string;
    warning: string;
    danger: string;
    success: string;
  };
  text: {
    primary: string;
    secondary: string;
    tertiary: string;
    onAccent: string;
  };
};
export type BaseTypography = typeof typography;
export type BaseSpacing = typeof spacing;
export type BaseRadius = typeof radius;
export type BaseMotion = typeof motion;
export type BaseIcons = typeof icons;
export type BaseBlur = typeof blur;
export type BaseGradients = typeof gradients;

export type ThemePresentation = {
  preferredCardRadius: number;
  /** Inner padding for Card and card-like strips — Focus one step denser. */
  preferredCardPadding: number;
  /** Vertical stack gap between Home/Profile sections — Focus one step denser. */
  preferredSectionGap: number;
  springPreset: SpringPreset;
  allowCelebrationSpring: boolean;
  soundEnabled: boolean;
  confettiEnabled: boolean;
  leaderboardVisible: boolean;
  orbStyle: 'illustrated' | 'minimal';
};

export type ResolvedThemeTokens = {
  colors: ColorPalette;
  typography: BaseTypography;
  spacing: BaseSpacing;
  radius: BaseRadius;
  motion: BaseMotion;
  icons: BaseIcons;
  blur: BaseBlur;
  gradients: BaseGradients;
  presentation: ThemePresentation;
};

export const BASE_TOKENS: Omit<ResolvedThemeTokens, 'presentation'> = {
  colors,
  typography,
  spacing,
  radius,
  motion,
  icons,
  blur,
  gradients,
};

const MODE_PRESENTATION: Record<ThemeMode, ThemePresentation> = {
  playful: {
    preferredCardRadius: radius.xl,
    preferredCardPadding: spacing.space4,
    preferredSectionGap: spacing.space5,
    springPreset: 'bouncy',
    allowCelebrationSpring: true,
    soundEnabled: true,
    confettiEnabled: true,
    leaderboardVisible: true,
    orbStyle: 'illustrated',
  },
  focus: {
    // THEME_MODES §7: Focus keeps radius-md (not lg/xl) for core layout density.
    preferredCardRadius: radius.md,
    preferredCardPadding: spacing.space3,
    preferredSectionGap: spacing.space4,
    springPreset: 'default',
    allowCelebrationSpring: false,
    soundEnabled: false,
    confettiEnabled: false,
    leaderboardVisible: false,
    orbStyle: 'minimal',
  },
};

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const normalized = hex.replace('#', '');
  const value =
    normalized.length === 3
      ? normalized
          .split('')
          .map((char) => char + char)
          .join('')
      : normalized;

  return {
    r: parseInt(value.slice(0, 2), 16),
    g: parseInt(value.slice(2, 4), 16),
    b: parseInt(value.slice(4, 6), 16),
  };
}

function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (channel: number) =>
    Math.round(Math.min(255, Math.max(0, channel)))
      .toString(16)
      .padStart(2, '0');

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

function desaturateHex(hex: string, amount: number): string {
  const { r, g, b } = hexToRgb(hex);
  const gray = 0.299 * r + 0.587 * g + 0.114 * b;

  return rgbToHex(
    r + (gray - r) * amount,
    g + (gray - g) * amount,
    b + (gray - b) * amount,
  );
}

function resolveFocusColors(base: ColorPalette): ColorPalette {
  const saturationReduction = 0.15;

  return {
    ...base,
    accent: {
      ...base.accent,
      primary: desaturateHex(base.accent.primary, saturationReduction),
      primaryDim: desaturateHex(base.accent.primaryDim, saturationReduction),
      structure: desaturateHex(base.accent.structure, saturationReduction),
      structureDim: desaturateHex(base.accent.structureDim, saturationReduction),
      warning: desaturateHex(base.accent.warning, saturationReduction),
    },
  };
}

export function resolveThemeTokens(mode: ThemeMode): ResolvedThemeTokens {
  const resolvedColors =
    mode === 'focus' ? resolveFocusColors(BASE_TOKENS.colors) : BASE_TOKENS.colors;

  return {
    ...BASE_TOKENS,
    colors: resolvedColors,
    presentation: MODE_PRESENTATION[mode],
  };
}

export function getShadow(level: ShadowLevel): ViewStyle {
  switch (level) {
    case 1:
      return Platform.select({
        ios: {
          shadowColor: '#000000',
          shadowOpacity: 0.2,
          shadowRadius: 8,
          shadowOffset: { width: 0, height: 2 },
        },
        android: { elevation: 3 },
        default: {},
      }) as ViewStyle;
    case 2:
      return Platform.select({
        ios: {
          shadowColor: '#000000',
          shadowOpacity: 0.3,
          shadowRadius: 16,
          shadowOffset: { width: 0, height: 6 },
        },
        android: { elevation: 8 },
        default: {},
      }) as ViewStyle;
    case 'glow':
      return Platform.select({
        ios: {
          shadowColor: colors.accent.primary,
          shadowOpacity: 0.45,
          shadowRadius: 20,
          shadowOffset: { width: 0, height: 0 },
        },
        android: { elevation: 6 },
        default: {},
      }) as ViewStyle;
    default:
      return {};
  }
}

export function getTypographyStyle(
  variant: keyof typeof typography.fontSize,
  family: keyof typeof typography.fontFamily = 'body',
): TextStyle {
  return {
    fontFamily: typography.fontFamily[family],
    fontSize: typography.fontSize[variant],
    color: colors.text.primary,
  };
}
