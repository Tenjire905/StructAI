/**
 * Bundled Orb coach voiceovers — local MP3s (no runtime TTS API cost).
 * Generate / refresh with: `node scripts/generate-orb-voice.mjs`
 *
 * Keys match `orb.speech.*` copy keys. Missing clip → silent / optional device TTS.
 */

import type { Locale } from '@/theme';
import type { ThemeMode } from '@/theme';

type ModeClip = {
  playful?: number;
  focus?: number;
};

type LocaleClips = Partial<Record<Locale, ModeClip>>;

/**
 * Metro `require` map. Only ship locales/modes we have generated.
 * Expand via generate-orb-voice.mjs before release polish.
 */
export const ORB_VOICE_ASSETS: Record<string, LocaleClips> = {
  'orb.speech.onboarding.welcome': {
    de: {
      playful: require('../assets/orb-voice/de/onboarding.welcome.playful.mp3'),
      focus: require('../assets/orb-voice/de/onboarding.welcome.focus.mp3'),
    },
  },
  'orb.speech.onboarding.mode': {
    de: {
      playful: require('../assets/orb-voice/de/onboarding.mode.playful.mp3'),
      focus: require('../assets/orb-voice/de/onboarding.mode.focus.mp3'),
    },
  },
  'orb.speech.onboarding.loop': {
    de: {
      playful: require('../assets/orb-voice/de/onboarding.loop.playful.mp3'),
      focus: require('../assets/orb-voice/de/onboarding.loop.focus.mp3'),
    },
  },
  'orb.speech.onboarding.proof': {
    de: {
      playful: require('../assets/orb-voice/de/onboarding.proof.playful.mp3'),
      focus: require('../assets/orb-voice/de/onboarding.proof.focus.mp3'),
    },
  },
  'orb.speech.onboarding.proofDone': {
    de: {
      playful: require('../assets/orb-voice/de/onboarding.proofDone.playful.mp3'),
      focus: require('../assets/orb-voice/de/onboarding.proofDone.focus.mp3'),
    },
  },
  'orb.speech.onboarding.dailyGoal': {
    de: {
      playful: require('../assets/orb-voice/de/onboarding.dailyGoal.playful.mp3'),
      focus: require('../assets/orb-voice/de/onboarding.dailyGoal.focus.mp3'),
    },
  },
  'orb.speech.readingStart.a': {
    de: {
      playful: require('../assets/orb-voice/de/readingStart.a.playful.mp3'),
    },
  },
  'orb.speech.correct.a': {
    de: {
      playful: require('../assets/orb-voice/de/correct.a.playful.mp3'),
    },
  },
  'orb.speech.wrong.a': {
    de: {
      playful: require('../assets/orb-voice/de/wrong.a.playful.mp3'),
    },
  },
};

export function resolveOrbVoiceAsset(
  speechKey: string,
  locale: Locale,
  mode: ThemeMode,
): number | null {
  const byLocale = ORB_VOICE_ASSETS[speechKey];
  if (!byLocale) {
    return null;
  }

  const clips = byLocale[locale] ?? byLocale.de;
  if (!clips) {
    return null;
  }

  if (mode === 'focus') {
    return clips.focus ?? clips.playful ?? null;
  }

  return clips.playful ?? clips.focus ?? null;
}
