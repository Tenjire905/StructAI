export type LessonAnswerResult = {
  stepIndex: number;
  kind:
    | 'choice'
    | 'fill_blank'
    | 'true_false'
    | 'reorder'
    | 'matching'
    | 'error_finding'
    | 'categorize';
  correct: boolean;
  attempts: number;
};

export const GRADED_ANSWER_KINDS = [
  'choice',
  'fill_blank',
  'true_false',
  'reorder',
  'matching',
  'error_finding',
  'categorize',
] as const satisfies ReadonlyArray<LessonAnswerResult['kind']>;

export const LESSON_PASS_THRESHOLD = 0.6;

export function filterGradedResults(results: LessonAnswerResult[]): LessonAnswerResult[] {
  return results.filter((result) =>
    GRADED_ANSWER_KINDS.includes(result.kind),
  );
}

export function computeLessonPassRatio(results: LessonAnswerResult[]): {
  passRatio: number;
  correctCount: number;
  gradedCount: number;
} {
  const graded = filterGradedResults(results);

  if (graded.length === 0) {
    return { passRatio: 1, correctCount: 0, gradedCount: 0 };
  }

  const correctCount = graded.filter((result) => result.correct).length;

  return {
    passRatio: correctCount / graded.length,
    correctCount,
    gradedCount: graded.length,
  };
}

export function hasPassedLessonThreshold(results: LessonAnswerResult[]): boolean {
  const { passRatio } = computeLessonPassRatio(results);
  return passRatio > LESSON_PASS_THRESHOLD;
}

/**
 * Orb-Gewinn skaliert mit Antwortqualität:
 * - 100 % korrekt beim ersten Versuch → volle Base-Reward
 * - Teilweise falsch/mehrere Versuche → 40–100 % der Base
 */
export function computeLessonOrbReward(
  baseReward: number,
  results: LessonAnswerResult[],
): number {
  const graded = filterGradedResults(results);

  if (graded.length === 0) {
    return baseReward;
  }

  const scoreSum = graded.reduce((sum, result) => {
    if (!result.correct) {
      return sum + 0.25;
    }

    if (result.attempts === 1) {
      return sum + 1;
    }

    if (result.attempts === 2) {
      return sum + 0.7;
    }

    return sum + 0.45;
  }, 0);

  const ratio = scoreSum / graded.length;
  const minRatio = 0.4;
  const scaled = minRatio + (1 - minRatio) * ratio;

  return Math.max(1, Math.round(baseReward * scaled));
}
