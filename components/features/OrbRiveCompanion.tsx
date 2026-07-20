import { useEffect } from 'react';
import { View } from 'react-native';
import {
  Fit,
  RiveView,
  useRive,
  useRiveFile,
} from '@rive-app/react-native';

import type { OrbCompanionState } from '@/hooks/useOrbCompanionState';
import {
  ORB_RIVE_ARTBOARD,
  ORB_RIVE_MOOD_INPUT,
  ORB_RIVE_REACT_TRIGGER,
  ORB_RIVE_STATE_MACHINE,
  ORB_RIVE_WATCH_INPUT,
  moodValueForState,
} from '@/lib/orbRiveContract';
import { structAiOrbRiv } from '@/assets/rive/source';

import { OrbSvgCompanion } from './OrbSvgCompanion';

type OrbRiveCompanionProps = {
  state: OrbCompanionState;
  size?: number;
  interaction?: 'none' | 'enter' | 'watch' | 'react';
};

/**
 * Rive-backed Orb. Only import this module when native Rive is available
 * (never from Expo Go via a static import in the hot path).
 */
export function OrbRiveCompanion({
  state,
  size = 24,
  interaction = 'none',
}: OrbRiveCompanionProps) {
  const source = structAiOrbRiv;
  const { riveViewRef, setHybridRef } = useRive();
  const { riveFile, error } = useRiveFile(source ?? undefined);

  useEffect(() => {
    if (!riveViewRef || source == null) {
      return;
    }

    try {
      riveViewRef.setNumberInputValue(ORB_RIVE_MOOD_INPUT, moodValueForState(state));
      riveViewRef.setBooleanInputValue(
        ORB_RIVE_WATCH_INPUT,
        interaction === 'watch' || interaction === 'enter',
      );

      if (interaction === 'react' || interaction === 'enter' || state === 'celebrating') {
        riveViewRef.triggerInput(ORB_RIVE_REACT_TRIGGER);
      }

      riveViewRef.play?.();
    } catch {
      // Inputs may be missing while the .riv is still being authored — keep playing.
    }
  }, [interaction, riveViewRef, source, state]);

  if (source == null || error || !riveFile) {
    return <OrbSvgCompanion interaction={interaction} size={size} state={state} />;
  }

  return (
    <View style={{ height: size, width: size }}>
      <RiveView
        artboardName={ORB_RIVE_ARTBOARD}
        autoPlay
        file={riveFile}
        fit={Fit.Contain}
        hybridRef={setHybridRef}
        stateMachineName={ORB_RIVE_STATE_MACHINE}
        style={{ height: size, width: size }}
      />
    </View>
  );
}
