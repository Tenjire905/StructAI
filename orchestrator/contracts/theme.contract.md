# StructAI Theme Contract (bindend für alle Agenten)

## colors.ts — exaktes Schema
```typescript
export const AppColors = {
  background: { primary: '#0F172A', secondary: '#020617', card: 'rgba(255,255,255,0.04)' },
  border: { subtle: 'rgba(255,255,255,0.08)' },
  text: { primary: '#FFFFFF', secondary: 'rgba(255,255,255,0.75)', muted: 'rgba(255,255,255,0.5)' },
  accent: { everyday: '#007AFF', code: '#00E5FF', visual: '#FF007F' },
  feedback: { success: '#22C55E', warning: '#F59E0B', danger: '#EF4444' },
} as const;
export type AppColorPalette = typeof AppColors;
```

## typography.ts — exaktes Schema
```typescript
export const AppTypography = {
  fontSize: { xs: 12, sm: 14, md: 16, lg: 18, xl: 20, xxl: 24, display: 32 },
  fontWeight: { regular: '400', medium: '500', semibold: '600', bold: '700' },
} as const;
export type AppTypographyTokens = typeof AppTypography;
```

## index.ts — exaktes Schema
```typescript
import { AppColors } from './colors';
import { AppTypography } from './typography';
export const theme = { colors: AppColors, typography: AppTypography } as const;
export type Theme = typeof theme;
export { AppColors, AppTypography };
```
WICHTIG: `colors: AppColors` hier ist WERT-Zuweisung (erlaubt), kein Typ.

## UI-Dateien — erlaubte theme.* Zugriffe
- theme.colors.background.primary | secondary | card
- theme.colors.border.subtle
- theme.colors.text.primary | secondary | muted
- theme.colors.accent.everyday | code | visual
- theme.colors.feedback.success | warning | danger
- theme.typography.fontSize.xs | sm | md | lg | xl | xxl | display
- theme.typography.fontWeight.regular | medium | semibold | bold

VERBOTEN: @/ Alias, theme/tokens, erfundene Keys, Hex/rgba in UI-Dateien.
