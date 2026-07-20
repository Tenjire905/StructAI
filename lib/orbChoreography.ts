/**
 * StructAI Orb choreography — motion-first personality (not mascot smiles).
 * Gaze is applied via View transform (never animated SVG cx — Expo Go crash).
 */

import type { OrbCompanionState } from '@/hooks/useOrbCompanionState';

export type OrbGaze = {
  x: number;
  y: number;
};

export type OrbIdleBeat = {
  gaze: OrbGaze;
  holdMs: number;
  /** 1 = open, ~0.15 = near-closed blink */
  lid?: number;
  eyeScale?: number;
};

/** Curiosity scan — looks like evaluating structure, not doodling. */
export const IDLE_CURIOSITY_BEATS: OrbIdleBeat[] = [
  { gaze: { x: 0, y: 0 }, holdMs: 1600, eyeScale: 1 },
  { gaze: { x: 1.4, y: -0.2 }, holdMs: 900, eyeScale: 1.05 },
  { gaze: { x: 1.4, y: -0.2 }, holdMs: 120, lid: 0.12, eyeScale: 1.05 },
  { gaze: { x: 0.6, y: 1.1 }, holdMs: 700, eyeScale: 0.95 },
  { gaze: { x: 0, y: 0 }, holdMs: 1100, eyeScale: 1 },
  { gaze: { x: -1.3, y: 0.15 }, holdMs: 850, eyeScale: 1.04 },
  { gaze: { x: -0.4, y: -0.9 }, holdMs: 650, eyeScale: 1.12 },
  { gaze: { x: 0, y: 0 }, holdMs: 1400, eyeScale: 1 },
  { gaze: { x: 0.9, y: 0.4 }, holdMs: 500, eyeScale: 1.02 },
  { gaze: { x: 0, y: 0 }, holdMs: 1800, eyeScale: 1 },
];

export function defaultGazeForState(state: OrbCompanionState): OrbGaze {
  switch (state) {
    case 'think':
      return { x: 1.5, y: -0.35 };
    case 'worry':
      return { x: -0.35, y: 1.2 };
    case 'happy':
      return { x: 0, y: -0.55 };
    case 'celebrating':
      return { x: 0, y: -0.8 };
    case 'attentive':
      return { x: 0, y: -0.15 };
    case 'sleepy':
      return { x: 0.2, y: 0.6 };
    case 'low_energy':
      return { x: 0, y: 0.45 };
    default:
      return { x: 0, y: 0 };
  }
}

export function eyeOpennessForState(state: OrbCompanionState): number {
  switch (state) {
    case 'sleepy':
      return 0.18;
    case 'low_energy':
      return 0.45;
    case 'worry':
      return 0.72;
    case 'attentive':
      return 1.18;
    case 'happy':
    case 'celebrating':
      return 1.08;
    case 'think':
      return 0.92;
    default:
      return 1;
  }
}
