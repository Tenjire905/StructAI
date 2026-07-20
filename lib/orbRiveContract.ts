import type { OrbCompanionState } from '@/hooks/useOrbCompanionState';

/**
 * Contract for the StructAI Orb Rive graphic.
 * Build the .riv in the Rive editor to match these names exactly.
 */

export const ORB_RIVE_ARTBOARD = 'StructAI Orb';
export const ORB_RIVE_STATE_MACHINE = 'Orb Mood';

/** Number input on the state machine — drives which mood animation plays. */
export const ORB_RIVE_MOOD_INPUT = 'mood';

/**
 * Optional boolean: true while the orb should lean into “listening / watching”.
 * Map from interaction === 'watch' | 'enter'.
 */
export const ORB_RIVE_WATCH_INPUT = 'watch';

/** Fire once on enter / celebrate punch (optional trigger on the SM). */
export const ORB_RIVE_REACT_TRIGGER = 'react';

/**
 * mood values — use these exact numbers in Rive conditions.
 * Example: mood == 0 → Idle, mood == 3 → Happy, …
 */
export const ORB_RIVE_MOOD_VALUE: Record<OrbCompanionState, number> = {
  idle: 0,
  attentive: 1,
  think: 2,
  happy: 3,
  worry: 4,
  low_energy: 5,
  celebrating: 6,
  sleepy: 7,
};

export function moodValueForState(state: OrbCompanionState): number {
  return ORB_RIVE_MOOD_VALUE[state];
}
