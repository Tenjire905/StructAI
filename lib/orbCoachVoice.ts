/**
 * Local Orb coach voiceover — Expo Go via expo-audio when available.
 *
 * Playback UI lives in OrbCoachVoicePlayer (useAudioPlayer).
 * This module only resolves assets + optional device-TTS fallback.
 * Never top-level-import expo-audio here (route-load crash if missing).
 */

import { requireOptionalNativeModule } from 'expo-modules-core';
import { AccessibilityInfo } from 'react-native';

import { resolveOrbVoiceAsset } from '@/lib/orbVoiceAssets';
import type { Locale, ThemeMode } from '@/theme';

export type OrbCoachVoiceOptions = {
  text: string;
  locale: Locale;
  mode: ThemeMode;
  soundEnabled: boolean;
  force?: boolean;
};

type SpeechModule = typeof import('expo-speech');

let speechModulePromise: Promise<SpeechModule | null> | null = null;
let lastTtsKey = '';

export function isOrbAudioNativeAvailable(): boolean {
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

const SPEECH_LOCALE: Record<Locale, string> = {
  de: 'de-DE',
  en: 'en-US',
  fr: 'fr-FR',
  ru: 'ru-RU',
};

/**
 * Resolve a bundled clip for OrbPresence to mount OrbCoachVoicePlayer.
 * Returns null when gated off or no asset.
 */
export function resolveOrbCoachClip(options: {
  speechKey: string | null | undefined;
  locale: Locale;
  mode: ThemeMode;
  soundEnabled: boolean;
  force?: boolean;
}): number | null {
  if (!options.speechKey) {
    return null;
  }
  if (!options.force && !options.soundEnabled) {
    return null;
  }
  return resolveOrbVoiceAsset(options.speechKey, options.locale, options.mode);
}

/** Device TTS fallback when ExpoAudio / clip path is unavailable. */
export async function speakOrbCoachTtsFallback(
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

  // Do NOT gate on Reduce Motion — that is visual-only; coach voice stays.

  const dedupe = `${key}::${options.locale}::${options.mode}`;
  if (dedupe === lastTtsKey) {
    return;
  }
  lastTtsKey = dedupe;

  const Speech = await loadSpeechModule();
  if (!Speech) {
    return;
  }
  try {
    Speech.stop();
  } catch {
    // ignore
  }
  try {
    Speech.speak(trimmed, {
      language: SPEECH_LOCALE[options.locale] ?? SPEECH_LOCALE.de,
      pitch: options.mode === 'playful' ? 1.05 : 1.0,
      rate: options.mode === 'playful' ? 0.96 : 0.92,
    });
  } catch {
    // ignore
  }
}

export function stopOrbCoachVoice(): void {
  void loadSpeechModule().then((Speech) => {
    try {
      Speech?.stop();
    } catch {
      // ignore
    }
  });
}

export function resetOrbCoachVoiceDedupe(): void {
  lastTtsKey = '';
}

/** @deprecated Use resolveOrbCoachClip + OrbCoachVoicePlayer. Kept for callers. */
export async function speakOrbCoachLine(
  key: string,
  options: OrbCoachVoiceOptions,
): Promise<void> {
  // Prefer clip path in UI; TTS only as last resort when no native audio.
  if (isOrbAudioNativeAvailable() && resolveOrbVoiceAsset(key, options.locale, options.mode)) {
    return;
  }
  await speakOrbCoachTtsFallback(key, options);
}

export async function isReduceMotionEnabled(): Promise<boolean> {
  try {
    return await AccessibilityInfo.isReduceMotionEnabled();
  } catch {
    return false;
  }
}
