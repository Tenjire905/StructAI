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

/** Curiosity scan — evaluating structure, not doodling. Richer than a blink loop. */
export const IDLE_CURIOSITY_BEATS: OrbIdleBeat[] = [
  { gaze: { x: 0, y: 0 }, holdMs: 1500, eyeScale: 1 },
  { gaze: { x: 1.5, y: -0.25 }, holdMs: 850, eyeScale: 1.06 },
  { gaze: { x: 1.5, y: -0.25 }, holdMs: 110, lid: 0.12, eyeScale: 1.06 },
  { gaze: { x: 0.7, y: 1.15 }, holdMs: 650, eyeScale: 0.94 },
  { gaze: { x: 0, y: 0 }, holdMs: 1000, eyeScale: 1 },
  { gaze: { x: -1.4, y: 0.1 }, holdMs: 800, eyeScale: 1.05 },
  { gaze: { x: -0.5, y: -1.0 }, holdMs: 600, eyeScale: 1.14 },
  { gaze: { x: -0.5, y: -1.0 }, holdMs: 100, lid: 0.15, eyeScale: 1.1 },
  { gaze: { x: 0, y: 0 }, holdMs: 1300, eyeScale: 1 },
  { gaze: { x: 1.1, y: 0.35 }, holdMs: 480, eyeScale: 1.03 },
  { gaze: { x: -1.0, y: 0.5 }, holdMs: 520, eyeScale: 1.02 },
  { gaze: { x: 0, y: 0 }, holdMs: 1700, eyeScale: 1 },
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
