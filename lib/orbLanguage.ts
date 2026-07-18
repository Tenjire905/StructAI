import type { OrbCompanionState } from '@/hooks/useOrbCompanionState';
import type { ThemeMode } from '@/theme';

export type OrbLessonMoment =
  | 'reading_start'
  | 'reading'
  | 'practicing'
  | 'feedback_correct'
  | 'feedback_wrong';

/** Info-step settle delay before switching attentive → think. */
export const ORB_READING_THINK_DELAY_MS = 1600;

/**
 * Playful speaks through the lesson (companion coach).
 * Focus stays quiet while reading/practicing, then gives a tip after check.
 */
const PLAYFUL_MOMENT_SPEECH: Record<OrbLessonMoment, readonly string[]> = {
  reading_start: [
    'orb.speech.readingStart.a',
    'orb.speech.readingStart.b',
    'orb.speech.readingStart.c',
  ],
  reading: [
    'orb.speech.reading.a',
    'orb.speech.reading.b',
    'orb.speech.reading.c',
  ],
  practicing: [
    'orb.speech.practicing.a',
    'orb.speech.practicing.b',
    'orb.speech.practicing.c',
  ],
  feedback_correct: [
    'orb.speech.correct.a',
    'orb.speech.correct.b',
    'orb.speech.correct.c',
  ],
  feedback_wrong: [
    'orb.speech.wrong.a',
    'orb.speech.wrong.b',
    'orb.speech.wrong.c',
  ],
};

/** Focus: tip lines only after a checked answer. */
const FOCUS_FEEDBACK_SPEECH: Record<
  'feedback_correct' | 'feedback_wrong',
  readonly string[]
> = {
  feedback_correct: [
    'orb.speech.focus.correctTip.a',
    'orb.speech.focus.correctTip.b',
    'orb.speech.focus.correctTip.c',
  ],
  feedback_wrong: [
    'orb.speech.focus.wrongTip.a',
    'orb.speech.focus.wrongTip.b',
    'orb.speech.focus.wrongTip.c',
  ],
};

const STATE_SPEECH_PLAYFUL: Partial<Record<OrbCompanionState, readonly string[]>> = {
  celebrating: [
    'orb.speech.celebrating.a',
    'orb.speech.celebrating.b',
    'orb.speech.celebrating.c',
  ],
  happy: ['orb.speech.correct.a', 'orb.speech.correct.b', 'orb.speech.correct.c'],
  worry: ['orb.speech.wrong.a', 'orb.speech.wrong.b', 'orb.speech.wrong.c'],
  think: ['orb.speech.reading.a', 'orb.speech.reading.b', 'orb.speech.reading.c'],
  attentive: [
    'orb.speech.practicing.a',
    'orb.speech.practicing.b',
    'orb.speech.practicing.c',
  ],
  low_energy: [
    'orb.speech.lowEnergy.a',
    'orb.speech.lowEnergy.b',
    'orb.speech.lowEnergy.c',
  ],
};

const STATE_SPEECH_FOCUS: Partial<Record<OrbCompanionState, readonly string[]>> = {
  celebrating: [
    'orb.speech.focus.celebrating.a',
    'orb.speech.focus.celebrating.b',
  ],
  happy: [
    'orb.speech.focus.correctTip.a',
    'orb.speech.focus.correctTip.b',
    'orb.speech.focus.correctTip.c',
  ],
  worry: [
    'orb.speech.focus.wrongTip.a',
    'orb.speech.focus.wrongTip.b',
    'orb.speech.focus.wrongTip.c',
  ],
  low_energy: [
    'orb.speech.focus.lowEnergy.a',
    'orb.speech.focus.lowEnergy.b',
  ],
};

function pickVariant(keys: readonly string[], seed: number): string {
  if (keys.length === 0) {
    return '';
  }

  const index = Math.abs(seed) % keys.length;
  return keys[index] ?? keys[0];
}

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
 * Lesson voice:
 * - Playful: companion talks while reading/practicing/feedback
 * - Focus: animated orb always; speech only after check (clever tip)
 */
export function resolveLessonSpeechCopyKey(
  moment: OrbLessonMoment,
  mode: ThemeMode,
  seed: number,
): string | null {
  if (mode === 'focus') {
    if (moment !== 'feedback_correct' && moment !== 'feedback_wrong') {
      return null;
    }

    return pickVariant(FOCUS_FEEDBACK_SPEECH[moment], seed);
  }

  return pickVariant(PLAYFUL_MOMENT_SPEECH[moment], seed);
}

/**
 * Fallback voice from mood (milestones, home, completion).
 * Focus only speaks on tip-worthy moods.
 */
export function resolveOrbSpeechCopyKey(
  state: OrbCompanionState,
  mode: ThemeMode,
  seed = 0,
): string | null {
  const variants =
    mode === 'playful' ? STATE_SPEECH_PLAYFUL[state] : STATE_SPEECH_FOCUS[state];

  if (!variants) {
    return null;
  }

  return pickVariant(variants, seed);
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
