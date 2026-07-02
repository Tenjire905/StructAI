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
 * Priority when no override is set: celebrating > low_energy > sleepy > idle
 *
 * @example
 * // celebrating beats low_energy:
 * // lastEvent.isActive === true AND orbCount/orbMax === 0.05 → 'celebrating'
 *
 * @example
 * // low_energy beats sleepy:
 * // playful background >60s, no celebration, orbCount/orbMax === 0.10 → 'low_energy'
 *
 * @example
 * // celebrating beats sleepy:
 * // playful background >60s AND lastEvent.isActive === true → 'celebrating'
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

  if (companionOverride !== undefined) {
    return companionOverride;
  }

  if (lastEvent?.isActive) {
    return 'celebrating';
  }

  if (isLowEnergy(orbCount, orbMax)) {
    return 'low_energy';
  }

  if (mode === 'playful' && isBackgroundSleepy) {
    return 'sleepy';
  }

  return 'idle';
}
