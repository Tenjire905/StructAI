import type { OrbCompanionState } from '@/hooks/useOrbCompanionState';
import type { ThemeMode } from '@/theme';

export type OrbLessonMoment =
  | 'reading_start'
  | 'reading'
  | 'practicing'
  | 'feedback_correct'
  | 'feedback_wrong';

const SPEECH_COPY_KEY: Partial<Record<OrbCompanionState, string>> = {
  think: 'orb.speech.think',
  happy: 'orb.speech.happy',
  worry: 'orb.speech.worry',
  celebrating: 'orb.speech.celebrating',
  low_energy: 'orb.speech.lowEnergy',
};

/** Info-step settle delay before switching attentive → think. */
export const ORB_READING_THINK_DELAY_MS = 2000;

export function resolveLessonOrbState(moment: OrbLessonMoment): OrbCompanionState {
  switch (moment) {
    case 'reading_start':
      return 'attentive';
    case 'reading':
      return 'think';
    case 'practicing':
      return 'attentive';
    case 'feedback_correct':
      return 'happy';
    case 'feedback_wrong':
      return 'worry';
  }
}

/**
 * Playful-only speech keys. Focus stays silent — same facts, lower volume.
 */
export function resolveOrbSpeechCopyKey(
  state: OrbCompanionState,
  mode: ThemeMode,
): string | null {
  if (mode !== 'playful') {
    return null;
  }

  return SPEECH_COPY_KEY[state] ?? null;
}

export function resolveLessonMoment(input: {
  isInfoStep: boolean;
  isChecked: boolean;
  isAnswerCorrect: boolean;
  readingSettled: boolean;
}): OrbLessonMoment {
  if (input.isInfoStep) {
    return input.readingSettled ? 'reading' : 'reading_start';
  }

  if (!input.isChecked) {
    return 'practicing';
  }

  return input.isAnswerCorrect ? 'feedback_correct' : 'feedback_wrong';
}
