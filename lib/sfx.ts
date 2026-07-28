import { isRunningInExpoGo } from 'expo';
import { requireOptionalNativeModule } from 'expo-modules-core';
import { Platform } from 'react-native';

/**
 * Short game-like UI SFX (start / tap / success) — not coach voiceover.
 * Expo Go / builds without ExpoAudio: silent no-op (never crash).
 *
 * Policy (Playful on / Focus off via presentation.soundEnabled):
 * - start: session begin (onboarding entry, Daily Challenge start)
 * - tap: primary confirmations (Weiter, start lesson, continue after check)
 * - success: correct answers + real milestones (lesson/path done, BYOK ok, Lab score)
 * - wrong answers: NEVER play a fail sound (haptic + coaching only)
 * - no SFX on micro-taps (glossary, skip, scroll, counters, bubbles)
 */

export type SfxId = 'start' | 'tap' | 'success';

type AudioPlayer = {
  play: () => void;
  seekTo: (seconds: number) => Promise<void> | void;
  remove: () => void;
};

type AudioModule = {
  createAudioPlayer: (
    source: number,
    options?: { volume?: number },
  ) => AudioPlayer;
  setAudioModeAsync: (mode: {
    playsInSilentMode?: boolean;
    shouldPlayInBackground?: boolean;
    interruptionMode?: 'mixWithOthers' | 'doNotMix' | 'duckOthers';
  }) => Promise<void>;
};

const SOURCES: Record<SfxId, number> = {
  start: require('../assets/sfx/start.mp3'),
  tap: require('../assets/sfx/tap.mp3'),
  success: require('../assets/sfx/success.mp3'),
};

let audioModulePromise: Promise<AudioModule | null> | null = null;
let modeReady = false;
const players = new Map<SfxId, AudioPlayer>();

function canUseNativeAudio(): boolean {
  if (Platform.OS === 'web') {
    return true;
  }

  if (isRunningInExpoGo()) {
    return false;
  }

  try {
    return requireOptionalNativeModule('ExpoAudio') != null;
  } catch {
    return false;
  }
}

async function loadAudioModule(): Promise<AudioModule | null> {
  if (!canUseNativeAudio()) {
    return null;
  }

  if (!audioModulePromise) {
    audioModulePromise = import('expo-audio')
      .then((mod) => mod as unknown as AudioModule)
      .catch(() => null);
  }

  return audioModulePromise;
}

async function ensureMode(mod: AudioModule): Promise<void> {
  if (modeReady) {
    return;
  }

  try {
    await mod.setAudioModeAsync({
      playsInSilentMode: true,
      shouldPlayInBackground: false,
      interruptionMode: 'mixWithOthers',
    });
    modeReady = true;
  } catch {
    // Non-critical — still try to play.
  }
}

async function getPlayer(id: SfxId): Promise<AudioPlayer | null> {
  const mod = await loadAudioModule();
  if (!mod) {
    return null;
  }

  await ensureMode(mod);

  let player = players.get(id);
  if (!player) {
    try {
      player = mod.createAudioPlayer(SOURCES[id], { volume: 0.7 });
      players.set(id, player);
    } catch {
      return null;
    }
  }

  return player;
}

/**
 * Fire-and-forget UI sound. Respects Focus (soundEnabled=false) via caller.
 */
export function playSfx(id: SfxId, enabled = true): void {
  if (!enabled) {
    return;
  }

  void (async () => {
    try {
      const player = await getPlayer(id);
      if (!player) {
        return;
      }

      await player.seekTo(0);
      player.play();
    } catch {
      // SFX must never surface errors.
    }
  })();
}
