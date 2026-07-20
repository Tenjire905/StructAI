/**
 * Local Orb coach voiceover — works in Expo Go via `expo-audio` (ExpoAudio).
 *
 * Never top-level-import audio packages: probe native module first.
 *
 * Priority:
 * 1. Bundled MP3 via expo-audio when ExpoAudio exists ($0 runtime, Expo Go OK)
 * 2. Device TTS when ExpoSpeech exists
 * 3. Otherwise silent (visual coach still works)
 */

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

type AudioModule = typeof import('expo-audio');
type SpeechModule = typeof import('expo-speech');
type AudioPlayer = {
  play: () => void;
  pause: () => void;
  seekTo: (seconds: number) => void | Promise<void>;
  remove?: () => void;
  release?: () => void;
  volume: number;
};

let audioModulePromise: Promise<AudioModule | null> | null = null;
let speechModulePromise: Promise<SpeechModule | null> | null = null;
let activePlayer: AudioPlayer | null = null;
let audioModeReady = false;
let lastSpokenKey = '';
let reduceMotionCached: boolean | null = null;

function canUseNativeAudio(): boolean {
  try {
    return requireOptionalNativeModule('ExpoAudio') != null;
  } catch {
    return false;
  }
}

function canUseNativeSpeech(): boolean {
  try {
    return requireOptionalNativeModule('ExpoSpeech') != null;
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
      .then((mod) => mod)
      .catch(() => null);
  }

  return audioModulePromise;
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

async function ensureAudioMode(audio: AudioModule): Promise<void> {
  if (audioModeReady) {
    return;
  }
  try {
    await audio.setAudioModeAsync({
      playsInSilentMode: true,
      interruptionMode: 'duckOthers',
      shouldPlayInBackground: false,
    });
    audioModeReady = true;
  } catch {
    // Still attempt playback.
  }
}

function releaseActivePlayer(): void {
  if (!activePlayer) {
    return;
  }
  try {
    activePlayer.pause();
  } catch {
    // ignore
  }
  try {
    activePlayer.release?.();
  } catch {
    // ignore
  }
  try {
    activePlayer.remove?.();
  } catch {
    // ignore
  }
  activePlayer = null;
}

/** Stop any in-flight coach line (screen change / unmount). */
export function stopOrbCoachVoice(): void {
  releaseActivePlayer();
  void loadSpeechModule().then((Speech) => {
    try {
      Speech?.stop();
    } catch {
      // ignore
    }
  });
}

async function playBundledClip(asset: number): Promise<boolean> {
  const audio = await loadAudioModule();
  if (!audio) {
    return false;
  }

  try {
    await ensureAudioMode(audio);
    releaseActivePlayer();

    const player = audio.createAudioPlayer(asset) as AudioPlayer;
    activePlayer = player;
    player.volume = 1;
    // Fresh player starts at 0; seek defensively for replay edge cases.
    await Promise.resolve(player.seekTo(0));
    player.play();
    return true;
  } catch {
    releaseActivePlayer();
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

  await playDeviceTts(trimmed, options.locale, options.mode === 'playful');
}

/** Reset dedupe when navigating away so the same tip can replay later. */
export function resetOrbCoachVoiceDedupe(): void {
  lastSpokenKey = '';
}
