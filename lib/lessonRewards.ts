export type LessonAnswerResult = {
  stepIndex: number;
  kind: 'choice' | 'fill_blank' | 'true_false' | 'reorder';
  correct: boolean;
  attempts: number;
};

/**
 * Orb-Gewinn skaliert mit Antwortqualität:
 * - 100 % korrekt beim ersten Versuch → volle Base-Reward
 * - Teilweise falsch/mehrere Versuche → 40–100 % der Base
 */
export function computeLessonOrbReward(
  baseReward: number,
  results: LessonAnswerResult[],
): number {
  const graded = results.filter((result) =>
    ['choice', 'fill_blank', 'true_false', 'reorder'].includes(result.kind),
  );

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
