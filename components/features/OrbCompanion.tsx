import type { OrbCompanionState } from '@/hooks/useOrbCompanionState';

import { OrbSvgCompanion } from './OrbSvgCompanion';

export type OrbCompanionProps = {
  state: OrbCompanionState;
  size?: number;
  /**
   * Interaction beat layered on top of mood:
   * enter = first-seen presence, watch = user is reading, react = short punch.
   */
  interaction?: 'none' | 'enter' | 'watch' | 'react';
};

/**
 * Public Orb entry — premium SVG coach (Reanimated).
 * No Rive dependency: quality lives in expression choreography + speech bubbles.
 */
export function OrbCompanion(props: OrbCompanionProps) {
  return <OrbSvgCompanion {...props} />;
}
