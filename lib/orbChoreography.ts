/**
 * Abstract Orb motion helpers — energy choreography (no gaze / face).
 */

import type { OrbCompanionState } from '@/hooks/useOrbCompanionState';

/** Soft idle shimmer offsets for asymmetric corona (normalized 0–1 phase targets). */
export const IDLE_ENERGY_BEATS: readonly { holdMs: number; flare: number }[] = [
  { holdMs: 1800, flare: 0.35 },
  { holdMs: 1200, flare: 0.7 },
  { holdMs: 1600, flare: 0.45 },
  { holdMs: 900, flare: 0.85 },
  { holdMs: 2000, flare: 0.4 },
];

export function bodyOpacityForState(state: OrbCompanionState): number {
  switch (state) {
    case 'low_energy':
      return 0.72;
    case 'sleepy':
      return 0.68;
    case 'worry':
      return 0.82;
    case 'think':
      return 0.98;
    default:
      return 1;
  }
}
