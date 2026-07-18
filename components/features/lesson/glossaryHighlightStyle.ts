import type { TextStyle } from 'react-native';

import type { ResolvedThemeTokens } from '@/theme/theme';

/**
 * Quiet glossary illumination — color + weight, hairline halo only.
 * Shared by InlineGlossaryText and LearningBeatStrip (onboarding + normal lessons).
 */
export function getGlossaryTermHighlightStyle(tokens: ResolvedThemeTokens): TextStyle {
  return {
    color: tokens.colors.accent.primary,
    fontFamily: tokens.typography.fontFamily.bodyMedium,
    // Soften: dimmed halo, 1px radius (¼ of space-1) — readable, not neon.
    textShadowColor: tokens.colors.accent.primaryDim,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: tokens.spacing.space1 / 4,
  };
}
