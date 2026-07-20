/**
 * Abstract Orb energy profile — light/motion only (no face).
 * Maps companion moods onto Entry / Idle / Calcul-style presence.
 */

import type { OrbCompanionState } from '@/hooks/useOrbCompanionState';

export type OrbEnergy = {
  /** Outer aura breath peak scale. */
  breathPeak: number;
  /** Base aura opacity (0–1). */
  auraOpacity: number;
  /** Bright rim intensity. */
  rimOpacity: number;
  /** Hotspot / corona spin period in ms (lower = Calcul). */
  spinMs: number;
  /** Pulse period in ms. */
  pulseMs: number;
  /** Inner core opacity (dark disk). */
  coreOpacity: number;
  /** 0 = violet brand, 1 = warning-leaning dim states. */
  warmth: number;
  /** Extra bloom punch for celebrate / enter. */
  bloomBoost: number;
};

const IDLE: OrbEnergy = {
  breathPeak: 1.035,
  auraOpacity: 0.55,
  rimOpacity: 0.85,
  spinMs: 12000,
  pulseMs: 2200,
  coreOpacity: 1,
  warmth: 0,
  bloomBoost: 0,
};

export function energyForState(state: OrbCompanionState): OrbEnergy {
  switch (state) {
    case 'attentive':
      return {
        ...IDLE,
        breathPeak: 1.05,
        auraOpacity: 0.72,
        rimOpacity: 1,
        spinMs: 7000,
        pulseMs: 1400,
        bloomBoost: 0.15,
      };
    case 'think':
      // Calcul — faster energy, tighter breath
      return {
        ...IDLE,
        breathPeak: 1.028,
        auraOpacity: 0.8,
        rimOpacity: 1,
        spinMs: 2800,
        pulseMs: 900,
        bloomBoost: 0.2,
      };
    case 'happy':
      return {
        ...IDLE,
        breathPeak: 1.06,
        auraOpacity: 0.78,
        rimOpacity: 1,
        spinMs: 5000,
        pulseMs: 1100,
        bloomBoost: 0.25,
      };
    case 'celebrating':
      return {
        ...IDLE,
        breathPeak: 1.1,
        auraOpacity: 0.95,
        rimOpacity: 1,
        spinMs: 1800,
        pulseMs: 420,
        bloomBoost: 0.45,
      };
    case 'worry':
      return {
        ...IDLE,
        breathPeak: 1.015,
        auraOpacity: 0.35,
        rimOpacity: 0.45,
        spinMs: 16000,
        pulseMs: 2800,
        warmth: 0.55,
        bloomBoost: 0,
      };
    case 'low_energy':
      return {
        ...IDLE,
        breathPeak: 1.012,
        auraOpacity: 0.28,
        rimOpacity: 0.35,
        spinMs: 18000,
        pulseMs: 3200,
        warmth: 0.7,
        bloomBoost: 0,
      };
    case 'sleepy':
      return {
        ...IDLE,
        breathPeak: 1.01,
        auraOpacity: 0.22,
        rimOpacity: 0.28,
        spinMs: 22000,
        pulseMs: 3600,
        warmth: 0.25,
        bloomBoost: 0,
      };
    case 'idle':
    default:
      return IDLE;
  }
}

export function energyForInteraction(
  interaction: 'none' | 'enter' | 'watch' | 'react',
): Partial<OrbEnergy> {
  switch (interaction) {
    case 'enter':
      return {
        breathPeak: 1.08,
        auraOpacity: 0.9,
        rimOpacity: 1,
        bloomBoost: 0.5,
        spinMs: 4000,
      };
    case 'watch':
      return {
        auraOpacity: 0.65,
        rimOpacity: 0.92,
        spinMs: 9000,
      };
    case 'react':
      return {
        breathPeak: 1.09,
        bloomBoost: 0.4,
        spinMs: 2200,
        pulseMs: 500,
      };
    default:
      return {};
  }
}

export function mergeEnergy(base: OrbEnergy, boost: Partial<OrbEnergy>): OrbEnergy {
  return { ...base, ...boost };
}
