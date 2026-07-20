/**
 * Local Orb coach voice — device TTS (expo-speech).
 * Sparse, mode-aware: Playful may speak; Focus stays quiet (soundEnabled=false).
 */

import { AccessibilityInfo } from 'react-native';
import * as Speech from 'expo-speech';

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

let lastSpokenKey = '';
let reduceMotionCached: boolean | null = null;

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
  try {
    Speech.stop();
  } catch {
    // Expo Go / web may throw if speech unavailable — ignore.
  }
}

/**
 * Speak a coach line once per unique key. Empty text or disabled sound = no-op.
 * Dedupes identical consecutive lines so re-renders don't restart mid-sentence.
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

  const dedupe = `${key}::${trimmed}`;
  if (dedupe === lastSpokenKey) {
    return;
  }
  lastSpokenKey = dedupe;

  stopOrbCoachVoice();

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
