/**
 * Local Orb coach voice — device TTS (expo-speech) when native module exists.
 * Never top-level-import expo-speech: missing ExpoSpeech crashes route load
 * (ErrorBoundary of undefined). Probe first, same pattern as dictation.
 */

import { requireOptionalNativeModule } from 'expo-modules-core';
import { AccessibilityInfo } from 'react-native';

import type { Locale } from '@/theme';

const SPEECH_LOCALE: Record<Locale, string> = {
  de: 'de-DE',
  en: 'en-US',
  fr: 'fr-FR',
  ru: 'ru-RU',
};

export type OrbCoachVoiceOptions = {
  text: string;
  locale: Locale;
  /** From theme presentation — Focus defaults off. */
  soundEnabled: boolean;
  /** Slightly distinct coach character without sounding cartoonish. */
  playful?: boolean;
};

type SpeechModule = typeof import('expo-speech');

let speechModulePromise: Promise<SpeechModule | null> | null = null;
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

/** Stop any in-flight coach line (screen change / unmount). */
export function stopOrbCoachVoice(): void {
  void loadSpeechModule().then((Speech) => {
    try {
      Speech?.stop();
    } catch {
      // ignore
    }
  });
}

/**
 * Speak a coach line once per unique key. Empty text, disabled sound, or
 * missing native TTS = no-op (visual coach still works).
 */
export async function speakOrbCoachLine(
  key: string,
  options: OrbCoachVoiceOptions,
): Promise<void> {
  const trimmed = options.text.trim();
  if (!options.soundEnabled || trimmed.length === 0) {
    return;
  }

  if (await isReduceMotion()) {
    return;
  }

  const Speech = await loadSpeechModule();
  if (!Speech) {
    return;
  }

  const dedupe = `${key}::${trimmed}`;
  if (dedupe === lastSpokenKey) {
    return;
  }
  lastSpokenKey = dedupe;

  try {
    Speech.stop();
  } catch {
    // ignore
  }

  try {
    Speech.speak(trimmed, {
      language: SPEECH_LOCALE[options.locale] ?? SPEECH_LOCALE.de,
      pitch: options.playful ? 1.05 : 1.0,
      rate: options.playful ? 0.96 : 0.92,
    });
  } catch {
    // TTS unavailable — coach still works visually + text bubble.
  }
}

/** Reset dedupe when navigating away so the same tip can replay later. */
export function resetOrbCoachVoiceDedupe(): void {
  lastSpokenKey = '';
}
