import { isRunningInExpoGo } from 'expo';
import { useEffect, useState, type ComponentType } from 'react';

import type { OrbCompanionState } from '@/hooks/useOrbCompanionState';
import { isOrbRiveAssetConfigured } from '@/assets/rive/source';

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

type OrbRenderer = ComponentType<OrbCompanionProps>;

/**
 * Public Orb entry.
 * Prefers Rive when a .riv is configured + native module exists;
 * otherwise keeps the SVG structure-coach (Expo Go safe).
 */
export function OrbCompanion(props: OrbCompanionProps) {
  const [RiveRenderer, setRiveRenderer] = useState<OrbRenderer | null>(null);
  const wantRive = isOrbRiveAssetConfigured() && !isRunningInExpoGo();

  useEffect(() => {
    if (!wantRive) {
      setRiveRenderer(null);
      return;
    }

    let cancelled = false;

    void import('./OrbRiveCompanion')
      .then((mod) => {
        if (!cancelled) {
          setRiveRenderer(() => mod.OrbRiveCompanion);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setRiveRenderer(null);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [wantRive]);

  if (RiveRenderer) {
    return <RiveRenderer {...props} />;
  }

  return <OrbSvgCompanion {...props} />;
}
