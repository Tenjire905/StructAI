/**
 * StructAI Orb expression palette — Liftoff-level mimik without cartoon mouths.
 * Values drive Reanimated SVG/View layers (brows, lids, cheeks, cue, ring).
 */

import type { OrbCompanionState } from '@/hooks/useOrbCompanionState';

export type OrbExpression = {
  /** Left brow rotation in degrees (negative = raised / curious). */
  browLeftDeg: number;
  browRightDeg: number;
  /** Vertical offset for both brows (negative = higher). */
  browY: number;
  /** Lid openness multiplier (1 = normal, <1 = squint/sleepy). */
  eyeOpen: number;
  /** Horizontal sclera scale. */
  eyeWidth: number;
  irisScale: number;
  cheekOpacity: number;
  /** Soft structure cue under eyes (coach mark, not a smile). */
  cueOpacity: number;
  cueWidth: number;
  ringEnergy: number;
  bodyBreathPeak: number;
  highlightPeak: number;
  /** Warm vs cool body bias: 0 = structure, 1 = warning-leaning dim. */
  warmth: number;
};

const BASE: OrbExpression = {
  browLeftDeg: 0,
  browRightDeg: 0,
  browY: 0,
  eyeOpen: 1,
  eyeWidth: 1,
  irisScale: 1,
  cheekOpacity: 0,
  cueOpacity: 0.35,
  cueWidth: 1,
  ringEnergy: 0.45,
  bodyBreathPeak: 1.028,
  highlightPeak: 0.32,
  warmth: 0,
};

export function expressionForState(state: OrbCompanionState): OrbExpression {
  switch (state) {
    case 'attentive':
      return {
        ...BASE,
        browLeftDeg: -8,
        browRightDeg: -8,
        browY: -0.35,
        eyeOpen: 1.18,
        eyeWidth: 1.06,
        irisScale: 1.08,
        cueOpacity: 0.5,
        cueWidth: 1.05,
        ringEnergy: 0.72,
        bodyBreathPeak: 1.045,
        highlightPeak: 0.4,
      };
    case 'think':
      return {
        ...BASE,
        browLeftDeg: -12,
        browRightDeg: 4,
        browY: -0.2,
        eyeOpen: 0.9,
        eyeWidth: 0.96,
        irisScale: 0.95,
        cueOpacity: 0.28,
        cueWidth: 0.85,
        ringEnergy: 0.55,
        bodyBreathPeak: 1.02,
        highlightPeak: 0.26,
      };
    case 'happy':
      return {
        ...BASE,
        browLeftDeg: -6,
        browRightDeg: -6,
        browY: -0.15,
        eyeOpen: 1.05,
        eyeWidth: 1.08,
        irisScale: 1.04,
        cheekOpacity: 0.35,
        cueOpacity: 0.55,
        cueWidth: 1.15,
        ringEnergy: 0.7,
        bodyBreathPeak: 1.06,
        highlightPeak: 0.42,
      };
    case 'celebrating':
      return {
        ...BASE,
        browLeftDeg: -14,
        browRightDeg: -14,
        browY: -0.45,
        eyeOpen: 1.2,
        eyeWidth: 1.12,
        irisScale: 1.1,
        cheekOpacity: 0.45,
        cueOpacity: 0.7,
        cueWidth: 1.25,
        ringEnergy: 1,
        bodyBreathPeak: 1.1,
        highlightPeak: 0.5,
      };
    case 'worry':
      return {
        ...BASE,
        browLeftDeg: 10,
        browRightDeg: 12,
        browY: 0.25,
        eyeOpen: 0.78,
        eyeWidth: 0.92,
        irisScale: 0.9,
        cheekOpacity: 0.08,
        cueOpacity: 0.18,
        cueWidth: 0.7,
        ringEnergy: 0.22,
        bodyBreathPeak: 0.97,
        highlightPeak: 0.18,
        warmth: 0.55,
      };
    case 'low_energy':
      return {
        ...BASE,
        browLeftDeg: 4,
        browRightDeg: 4,
        browY: 0.35,
        eyeOpen: 0.5,
        eyeWidth: 0.9,
        irisScale: 0.88,
        cueOpacity: 0.15,
        cueWidth: 0.65,
        ringEnergy: 0.18,
        bodyBreathPeak: 1.012,
        highlightPeak: 0.14,
        warmth: 0.7,
      };
    case 'sleepy':
      return {
        ...BASE,
        browLeftDeg: 2,
        browRightDeg: 2,
        browY: 0.4,
        eyeOpen: 0.22,
        eyeWidth: 1.05,
        irisScale: 0.85,
        cueOpacity: 0.1,
        cueWidth: 0.55,
        ringEnergy: 0.12,
        bodyBreathPeak: 1.015,
        highlightPeak: 0.1,
        warmth: 0.35,
      };
    case 'idle':
    default:
      return BASE;
  }
}

/** Interaction overlays — brief beats on top of mood. */
export function interactionExpressionBoost(
  interaction: 'none' | 'enter' | 'watch' | 'react',
): Partial<OrbExpression> {
  switch (interaction) {
    case 'enter':
      return {
        eyeOpen: 1.22,
        irisScale: 1.12,
        ringEnergy: 0.95,
        browY: -0.5,
        browLeftDeg: -10,
        browRightDeg: -10,
      };
    case 'watch':
      return {
        eyeOpen: 1.08,
        ringEnergy: 0.6,
        cueOpacity: 0.45,
      };
    case 'react':
      return {
        eyeOpen: 1.15,
        cheekOpacity: 0.3,
        ringEnergy: 0.85,
        cueWidth: 1.2,
      };
    default:
      return {};
  }
}

export function mergeExpression(
  base: OrbExpression,
  boost: Partial<OrbExpression>,
): OrbExpression {
  return { ...base, ...boost };
}
