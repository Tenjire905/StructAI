import { Platform, type TextStyle, type ViewStyle } from 'react-native';

export type ThemeMode = 'playful' | 'focus';
export type ThemeAppearance = 'dark' | 'light';

export type ShadowLevel = 1 | 2 | 'glow';

export type SpringPreset = 'default' | 'bouncy';

/** Dark appearance — canonical StructAI night palette. */
export const darkColors = {
  background: {
    base: '#0A0612',
    elevated: '#120B1E',
  },
  surface: {
    card: '#1A1225',
    inset: '#120B1E',
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
    primarySoft: 'rgba(139,92,246,0.22)',
    structure: '#22D3EE',
    structureDim: '#0E7490',
    structureSoft: 'rgba(34,211,238,0.18)',
    warning: '#F59E0B',
    warningSoft: 'rgba(245,158,11,0.20)',
    danger: '#EF4444',
    dangerSoft: 'rgba(239,68,68,0.18)',
    success: '#34D399',
    successSoft: 'rgba(52,211,153,0.18)',
  },
  text: {
    primary: '#F5F3FA',
    secondary: '#9B93AA',
    tertiary: '#635B75',
    onAccent: '#FFFFFF',
  },
} as const;

/**
 * Light appearance — recessed page, raised white cards, scarce deep violet.
 * Inspired by Linear/Stripe light: hierarchy via inset/chrome/card, not neon fill.
 */
export const lightColors = {
  background: {
    base: '#F3F0F8',
    elevated: '#FAF8FC',
  },
  surface: {
    card: '#FFFFFF',
    inset: '#F0ECF6',
    cardHover: '#EFEAF7',
    glass: 'rgba(255,255,255,0.78)',
  },
  border: {
    subtle: 'rgba(26,18,37,0.10)',
    strong: 'rgba(26,18,37,0.18)',
  },
  accent: {
    primary: '#6D28D9',
    primaryDim: '#5B21B6',
    primarySoft: 'rgba(109,40,217,0.10)',
    structure: '#0E7490',
    structureDim: '#155E75',
    structureSoft: 'rgba(14,116,144,0.12)',
    warning: '#B45309',
    warningSoft: 'rgba(180,83,9,0.12)',
    danger: '#DC2626',
    dangerSoft: 'rgba(220,38,38,0.10)',
    success: '#047857',
    successSoft: 'rgba(4,120,87,0.10)',
  },
  text: {
    primary: '#1A1225',
    secondary: '#4F4763',
    tertiary: '#6B6478',
    onAccent: '#FFFFFF',
  },
} as const;

/** @deprecated Use tokens.colors from useThemeMode(); kept as dark default for boot. */
export const colors = darkColors;

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

export type ColorPalette = {
  background: {
    base: string;
    elevated: string;
  };
  surface: {
    card: string;
    /** Nested recessed blocks inside cards (stats, chips, tracks). */
    inset: string;
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
    primarySoft: string;
    structure: string;
    structureDim: string;
    structureSoft: string;
    warning: string;
    warningSoft: string;
    danger: string;
    dangerSoft: string;
    success: string;
    successSoft: string;
  };
  text: {
    primary: string;
    secondary: string;
    tertiary: string;
    onAccent: string;
  };
};

export type ThemeGradients = {
  primaryButton: {
    colors: readonly [string, string];
    start: { x: number; y: number };
    end: { x: number; y: number };
  };
  heroBackground: {
    colors: readonly [string, string];
    start: { x: number; y: number };
    end: { x: number; y: number };
  };
  orbActive: {
    colors: readonly [string, string];
  };
  cardOverlay: {
    colors: readonly [string, string];
    start: { x: number; y: number };
    end: { x: number; y: number };
  };
};

export type BaseTypography = typeof typography;
export type BaseSpacing = typeof spacing;
export type BaseRadius = typeof radius;
export type BaseMotion = typeof motion;
export type BaseIcons = typeof icons;
export type BaseBlur = {
  glassIntensity: number;
};
/** @deprecated Prefer ThemeGradients from resolved tokens. */
export type BaseGradients = ThemeGradients;

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
  appearance: ThemeAppearance;
  colors: ColorPalette;
  typography: BaseTypography;
  spacing: BaseSpacing;
  radius: BaseRadius;
  motion: BaseMotion;
  icons: BaseIcons;
  blur: BaseBlur;
  gradients: ThemeGradients;
  presentation: ThemePresentation;
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
      // Soft fills stay as authored — already low-chroma washes.
    },
  };
}

function resolveGradients(
  palette: ColorPalette,
  appearance: ThemeAppearance,
): ThemeGradients {
  return {
    primaryButton: {
      colors: [palette.accent.primary, palette.accent.primaryDim],
      start: { x: 0, y: 0 },
      end: { x: 1, y: 1 },
    },
    heroBackground: {
      colors:
        appearance === 'light'
          ? [palette.background.elevated, palette.background.base]
          : [palette.surface.card, palette.background.base],
      start: { x: 0, y: 0 },
      end: { x: 0, y: 1 },
    },
    orbActive: {
      colors: [palette.accent.structure, palette.accent.primary],
    },
    cardOverlay: {
      colors:
        appearance === 'light'
          ? ['transparent', 'rgba(26,18,37,0.18)']
          : ['transparent', 'rgba(0,0,0,0.4)'],
      start: { x: 0, y: 0 },
      end: { x: 0, y: 1 },
    },
  };
}

/** Boot-time dark gradients (pre-hydrate). Prefer tokens.gradients. */
export const gradients: ThemeGradients = resolveGradients(darkColors, 'dark');

export function resolveThemeTokens(
  mode: ThemeMode,
  appearance: ThemeAppearance = 'dark',
): ResolvedThemeTokens {
  const basePalette: ColorPalette =
    appearance === 'light' ? { ...lightColors } : { ...darkColors };
  const resolvedColors =
    mode === 'focus' ? resolveFocusColors(basePalette) : basePalette;

  return {
    appearance,
    colors: resolvedColors,
    typography,
    spacing,
    radius,
    motion,
    icons,
    blur: {
      glassIntensity: appearance === 'light' ? 26 : blur.glassIntensity,
    },
    gradients: resolveGradients(resolvedColors, appearance),
    presentation: MODE_PRESENTATION[mode],
  };
}

export function getShadow(
  level: ShadowLevel,
  appearance: ThemeAppearance = 'dark',
): ViewStyle {
  const isLight = appearance === 'light';
  const shadowInk = isLight ? '#1A1225' : '#000000';

  switch (level) {
    case 1:
      return Platform.select({
        ios: {
          shadowColor: shadowInk,
          shadowOpacity: isLight ? 0.12 : 0.2,
          shadowRadius: isLight ? 12 : 8,
          shadowOffset: { width: 0, height: isLight ? 3 : 2 },
        },
        android: { elevation: isLight ? 4 : 3 },
        default: {},
      }) as ViewStyle;
    case 2:
      return Platform.select({
        ios: {
          shadowColor: shadowInk,
          shadowOpacity: isLight ? 0.16 : 0.3,
          shadowRadius: isLight ? 20 : 16,
          shadowOffset: { width: 0, height: isLight ? 8 : 6 },
        },
        android: { elevation: isLight ? 10 : 8 },
        default: {},
      }) as ViewStyle;
    case 'glow':
      return Platform.select({
        ios: {
          shadowColor: isLight ? lightColors.accent.primary : darkColors.accent.primary,
          shadowOpacity: isLight ? 0.14 : 0.45,
          shadowRadius: isLight ? 16 : 20,
          shadowOffset: { width: 0, height: 0 },
        },
        android: { elevation: isLight ? 4 : 6 },
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
    color: darkColors.text.primary,
  };
}
