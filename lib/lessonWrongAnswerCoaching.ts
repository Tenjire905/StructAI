import { resolveLessonLearningBeat, type LessonLearningBeat } from '@/lib/lessonLearningBeat';
import type { Locale } from '@/theme/locale';
import type { ThemeMode } from '@/theme/theme';

export type WrongAnswerCoaching = {
  why: string;
  /** Concrete next-step text when a step hint exists. */
  nextHint: string | null;
  beat: LessonLearningBeat | null;
};

/**
 * Wrong-answer coaching: why it fails + optional next hint + pattern beat.
 * Transforms a quiz miss into a skill acquisition beat (AiQ-style rewrite path).
 */
export function resolveWrongAnswerCoaching(
  explanation: string,
  hint: string | undefined,
  locale: Locale,
  mode: ThemeMode,
): WrongAnswerCoaching {
  const why = explanation.trim();
  const nextHint = hint?.trim() ? hint.trim() : null;
  const beat = resolveLessonLearningBeat([why, nextHint ?? ''].join('\n'), locale, mode);

  return {
    why,
    nextHint,
    beat,
  };
}
