/**
 * Local Orb coach voiceover.
 *
 * Priority (cheap + offline):
 * 1. Bundled MP3 clips (`assets/orb-voice`) via expo-av — $0 runtime
 * 2. Optional device TTS (expo-speech) only if native module exists
 *
 * No paid cloud TTS API at runtime. Regenerate clips with edge-tts (free).
 */

import {
  Audio,
  InterruptionModeAndroid,
  InterruptionModeIOS,
} from 'expo-av';
import { requireOptionalNativeModule } from 'expo-modules-core';
import { AccessibilityInfo } from 'react-native';

import { resolveOrbVoiceAsset } from '@/lib/orbVoiceAssets';
import type { Locale, ThemeMode } from '@/theme';

export type OrbCoachVoiceOptions = {
  text: string;
  locale: Locale;
  mode: ThemeMode;
  /** From theme presentation — Focus defaults off for ambient sound. */
  soundEnabled: boolean;
  /**
   * When true, play even if soundEnabled is false (explicit coach beat).
   * Used sparingly for onboarding voiceKey lines in Focus.
   */
  force?: boolean;
};

type SpeechModule = typeof import('expo-speech');

let speechModulePromise: Promise<SpeechModule | null> | null = null;
let activeSound: Audio.Sound | null = null;
let audioModeReady = false;
let lastSpokenKey = '';
let reduceMotionCached: boolean | null = null;

function canUseNativeSpeech(): boolean {
  try {
    return requireOptionalNativeModule('ExpoSpeech') != null;
  } catch {
    return false;
  }
}

async function loadSpeechModule(): Promise<SpeechModule | null> {
  if (!canUseNativeSpeech()) {
    return null;
  }

  if (!speechModulePromise) {
    speechModulePromise = import('expo-speech')
      .then((mod) => mod)
      .catch(() => null);
  }

  return speechModulePromise;
}

async function isReduceMotion(): Promise<boolean> {
  if (reduceMotionCached != null) {
    return reduceMotionCached;
  }
  try {
    reduceMotionCached = await AccessibilityInfo.isReduceMotionEnabled();
  } catch {
    reduceMotionCached = false;
  }
  return reduceMotionCached;
}

async function ensureAudioMode(): Promise<void> {
  if (audioModeReady) {
    return;
  }
  try {
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      playsInSilentModeIOS: true,
      staysActiveInBackground: false,
      interruptionModeIOS: InterruptionModeIOS.DuckOthers,
      interruptionModeAndroid: InterruptionModeAndroid.DuckOthers,
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: false,
    });
    audioModeReady = true;
  } catch {
    // Expo Go / web may restrict audio mode — still try playback.
  }
}

async function stopClip(): Promise<void> {
  if (!activeSound) {
    return;
  }
  try {
    await activeSound.stopAsync();
  } catch {
    // ignore
  }
  try {
    await activeSound.unloadAsync();
  } catch {
    // ignore
  }
  activeSound = null;
}

/** Stop any in-flight coach line (screen change / unmount). */
export function stopOrbCoachVoice(): void {
  void stopClip();
  void loadSpeechModule().then((Speech) => {
    try {
      Speech?.stop();
    } catch {
      // ignore
    }
  });
}

async function playBundledClip(asset: number): Promise<boolean> {
  try {
    await ensureAudioMode();
    await stopClip();
    const { sound } = await Audio.Sound.createAsync(asset, {
      shouldPlay: true,
      volume: 1,
    });
    activeSound = sound;
    sound.setOnPlaybackStatusUpdate((status) => {
      if (!status.isLoaded) {
        return;
      }
      if (status.didJustFinish) {
        void sound.unloadAsync().catch(() => undefined);
        if (activeSound === sound) {
          activeSound = null;
        }
      }
    });
    return true;
  } catch {
    return false;
  }
}

const SPEECH_LOCALE: Record<Locale, string> = {
  de: 'de-DE',
  en: 'en-US',
  fr: 'fr-FR',
  ru: 'ru-RU',
};

async function playDeviceTts(
  text: string,
  locale: Locale,
  playful: boolean,
): Promise<boolean> {
  const Speech = await loadSpeechModule();
  if (!Speech) {
    return false;
  }
  try {
    Speech.stop();
  } catch {
    // ignore
  }
  try {
    Speech.speak(text, {
      language: SPEECH_LOCALE[locale] ?? SPEECH_LOCALE.de,
      pitch: playful ? 1.05 : 1.0,
      rate: playful ? 0.96 : 0.92,
    });
    return true;
  } catch {
    return false;
  }
}

/**
 * Speak a coach line: bundled voiceover first, device TTS fallback.
 * Dedupes identical consecutive keys so re-renders don't restart mid-line.
 */
export async function speakOrbCoachLine(
  key: string,
  options: OrbCoachVoiceOptions,
): Promise<void> {
  const trimmed = options.text.trim();
  if (trimmed.length === 0) {
    return;
  }

  if (!options.force && !options.soundEnabled) {
    return;
  }

  if (await isReduceMotion()) {
    return;
  }

  const dedupe = `${key}::${options.locale}::${options.mode}`;
  if (dedupe === lastSpokenKey) {
    return;
  }
  lastSpokenKey = dedupe;

  const asset = resolveOrbVoiceAsset(key, options.locale, options.mode);
  if (asset != null) {
    const played = await playBundledClip(asset);
    if (played) {
      return;
    }
  }

  // Fallback only when no clip / clip failed — still free (device TTS).
  await playDeviceTts(trimmed, options.locale, options.mode === 'playful');
}

/** Reset dedupe when navigating away so the same tip can replay later. */
export function resetOrbCoachVoiceDedupe(): void {
  lastSpokenKey = '';
}
