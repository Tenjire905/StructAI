import { useEffect, useState } from 'react';
import { AppState, type AppStateStatus } from 'react-native';

import { useProgressStore } from '@/store/progressStore';
import { useCelebration, useThemeMode } from '@/theme';

export type OrbCompanionState =
  | 'idle'
  | 'attentive'
  | 'happy'
  | 'low_energy'
  | 'celebrating'
  | 'sleepy';

const BACKGROUND_SLEEPY_MS = 60_000;

function isLowEnergy(orbCount: number, orbMax: number): boolean {
  return orbMax > 0 && orbCount / orbMax < 0.15;
}

/**
 * Derives the orb companion mood from progress, celebrations, theme mode, and
 * optional external overrides (e.g. attentive from step B4).
 *
 * Priority: celebrating > attentive (override) > low_energy > sleepy > idle
 *
 * @example
 * // celebrating beats attentive override:
 * // companionOverride='attentive' AND lastEvent.isActive → 'celebrating'
 *
 * @example
 * // attentive beats low_energy:
 * // companionOverride='attentive' AND orbCount/orbMax === 0.05 → 'attentive'
 *
 * @example
 * // low_energy beats sleepy:
 * // playful background >60s, no celebration, orbCount/orbMax === 0.10 → 'low_energy'
 */
export function useOrbCompanionState(
  companionOverride?: OrbCompanionState,
): OrbCompanionState {
  const orbCount = useProgressStore((state) => state.orbCount);
  const orbMax = useProgressStore((state) => state.orbMax);
  const { lastEvent } = useCelebration();
  const { mode } = useThemeMode();
  const [isBackgroundSleepy, setIsBackgroundSleepy] = useState(false);

  useEffect(() => {
    if (mode !== 'playful') {
      setIsBackgroundSleepy(false);
      return;
    }

    let sleepyTimer: ReturnType<typeof setTimeout> | null = null;

    const clearSleepyTimer = () => {
      if (sleepyTimer) {
        clearTimeout(sleepyTimer);
        sleepyTimer = null;
      }
    };

    const handleAppStateChange = (nextState: AppStateStatus) => {
      clearSleepyTimer();

      if (nextState === 'background' || nextState === 'inactive') {
        sleepyTimer = setTimeout(() => {
          setIsBackgroundSleepy(true);
        }, BACKGROUND_SLEEPY_MS);
        return;
      }

      setIsBackgroundSleepy(false);
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      clearSleepyTimer();
      subscription.remove();
    };
  }, [mode]);

  if (lastEvent?.isActive) {
    return 'celebrating';
  }

  if (companionOverride !== undefined) {
    return companionOverride;
  }

  if (isLowEnergy(orbCount, orbMax)) {
    return 'low_energy';
  }

  if (mode === 'playful' && isBackgroundSleepy) {
    return 'sleepy';
  }

  return 'idle';
}
