/**
 * Abstract Orb energy profile — light/motion only (no face).
 * Maps companion moods onto Entry / Idle / Calcul wave forms.
 */

import type { OrbCompanionState } from '@/hooks/useOrbCompanionState';

export type OrbEnergy = {
  /** Outer aura breath peak scale. */
  breathPeak: number;
  /** Base aura opacity (0–1). */
  auraOpacity: number;
  /** Bright rim intensity. */
  rimOpacity: number;
  /** Primary corona spin period in ms (lower = Calcul). */
  spinMs: number;
  /** Counter-rotating wave ring period in ms. */
  counterSpinMs: number;
  /** Pulse period in ms. */
  pulseMs: number;
  /** Inner core opacity (dark disk). */
  coreOpacity: number;
  /** 0 = violet brand, 1 = warning-leaning dim states. */
  warmth: number;
  /** Extra bloom punch for celebrate / enter. */
  bloomBoost: number;
  /** Outer corona horizontal stretch (wave form). */
  waveRx: number;
  /** Outer corona vertical stretch. */
  waveRy: number;
  /** Primary wave stroke dash pattern density (higher = more segments). */
  waveSegments: number;
  /** Wave stroke thickness. */
  waveStroke: number;
  /** Secondary plasma lobe strength (0–1). */
  lobeStrength: number;
};

const IDLE: OrbEnergy = {
  breathPeak: 1.04,
  auraOpacity: 0.58,
  rimOpacity: 0.88,
  spinMs: 14000,
  counterSpinMs: 9000,
  pulseMs: 2400,
  coreOpacity: 1,
  warmth: 0,
  bloomBoost: 0.05,
  waveRx: 10.4,
  waveRy: 9.6,
  waveSegments: 5,
  waveStroke: 1.35,
  lobeStrength: 0.55,
};

export function energyForState(state: OrbCompanionState): OrbEnergy {
  switch (state) {
    case 'attentive':
      return {
        ...IDLE,
        breathPeak: 1.055,
        auraOpacity: 0.75,
        rimOpacity: 1,
        spinMs: 7500,
        counterSpinMs: 5200,
        pulseMs: 1400,
        bloomBoost: 0.2,
        waveRx: 10.6,
        waveRy: 10.2,
        waveSegments: 6,
        waveStroke: 1.5,
        lobeStrength: 0.7,
      };
    case 'think':
      // Calcul — fast counter-spin, tighter elliptical waves
      return {
        ...IDLE,
        breathPeak: 1.03,
        auraOpacity: 0.85,
        rimOpacity: 1,
        spinMs: 2600,
        counterSpinMs: 1800,
        pulseMs: 780,
        bloomBoost: 0.28,
        waveRx: 10.8,
        waveRy: 8.9,
        waveSegments: 8,
        waveStroke: 1.7,
        lobeStrength: 0.9,
      };
    case 'happy':
      return {
        ...IDLE,
        breathPeak: 1.07,
        auraOpacity: 0.8,
        rimOpacity: 1,
        spinMs: 4800,
        counterSpinMs: 3600,
        pulseMs: 1000,
        bloomBoost: 0.3,
        waveRx: 10.5,
        waveRy: 10.5,
        waveSegments: 6,
        waveStroke: 1.55,
        lobeStrength: 0.75,
      };
    case 'celebrating':
      return {
        ...IDLE,
        breathPeak: 1.12,
        auraOpacity: 0.95,
        rimOpacity: 1,
        spinMs: 1600,
        counterSpinMs: 1100,
        pulseMs: 380,
        bloomBoost: 0.55,
        waveRx: 11.0,
        waveRy: 11.0,
        waveSegments: 9,
        waveStroke: 1.9,
        lobeStrength: 1,
      };
    case 'worry':
      return {
        ...IDLE,
        breathPeak: 1.018,
        auraOpacity: 0.32,
        rimOpacity: 0.42,
        spinMs: 17000,
        counterSpinMs: 14000,
        pulseMs: 3000,
        warmth: 0.55,
        bloomBoost: 0,
        waveRx: 9.8,
        waveRy: 10.6,
        waveSegments: 3,
        waveStroke: 1.0,
        lobeStrength: 0.25,
      };
    case 'low_energy':
      return {
        ...IDLE,
        breathPeak: 1.012,
        auraOpacity: 0.26,
        rimOpacity: 0.32,
        spinMs: 20000,
        counterSpinMs: 16000,
        pulseMs: 3400,
        warmth: 0.7,
        bloomBoost: 0,
        waveRx: 9.5,
        waveRy: 10.4,
        waveSegments: 3,
        waveStroke: 0.9,
        lobeStrength: 0.18,
      };
    case 'sleepy':
      return {
        ...IDLE,
        breathPeak: 1.01,
        auraOpacity: 0.2,
        rimOpacity: 0.25,
        spinMs: 24000,
        counterSpinMs: 20000,
        pulseMs: 4000,
        warmth: 0.25,
        bloomBoost: 0,
        waveRx: 9.4,
        waveRy: 10.2,
        waveSegments: 2,
        waveStroke: 0.8,
        lobeStrength: 0.12,
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
        breathPeak: 1.1,
        auraOpacity: 0.92,
        rimOpacity: 1,
        bloomBoost: 0.55,
        spinMs: 3800,
        counterSpinMs: 2600,
        waveSegments: 7,
        lobeStrength: 0.95,
      };
    case 'watch':
      return {
        auraOpacity: 0.68,
        rimOpacity: 0.94,
        spinMs: 10000,
        counterSpinMs: 7000,
        waveRx: 10.5,
        waveRy: 9.9,
      };
    case 'react':
      return {
        breathPeak: 1.1,
        bloomBoost: 0.45,
        spinMs: 2000,
        counterSpinMs: 1400,
        pulseMs: 420,
        waveSegments: 8,
        lobeStrength: 1,
      };
    default:
      return {};
  }
}

export function mergeEnergy(base: OrbEnergy, boost: Partial<OrbEnergy>): OrbEnergy {
  return { ...base, ...boost };
}

/** strokeDasharray string from segment count (wave “teeth”). */
export function waveDashForSegments(segments: number): string {
  const gap = Math.max(2, 14 - segments);
  const dash = Math.max(2.5, segments * 0.55);
  return `${dash} ${gap}`;
}
