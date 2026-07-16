import type { LessonCatalogStep } from '@/data/mockLessons.types';

function simplifyGradedStep(step: LessonCatalogStep): LessonCatalogStep {
  switch (step.type) {
    case 'matching':
      if (step.pairs.length <= 2) {
        return step;
      }
      return { ...step, pairs: step.pairs.slice(0, 2) };
    case 'categorize':
      if (step.items.length <= 3) {
        return step;
      }
      return { ...step, items: step.items.slice(0, 3) };
    case 'reorder': {
      if (step.itemKeys.length <= 3) {
        return step;
      }

      const keepCount = 3;
      const keptOriginalIndices = new Set(Array.from({ length: keepCount }, (_, index) => index));
      const newCorrectOrder = step.correctOrder
        .map((originalIndex, displayPosition) => ({ originalIndex, displayPosition }))
        .filter(({ originalIndex }) => keptOriginalIndices.has(originalIndex))
        .sort((left, right) => left.displayPosition - right.displayPosition)
        .map(({ originalIndex }) => originalIndex);

      return {
        ...step,
        itemKeys: step.itemKeys.slice(0, keepCount),
        correctOrder: newCorrectOrder,
      };
    }
    case 'error_finding':
      if (step.textSegments.length <= 4) {
        return step;
      }
      return { ...step, textSegments: step.textSegments.slice(0, 4) };
    default:
      return step;
  }
}

/**
 * Derives a shorter Playful step sequence from the Focus catalog steps.
 * Rules: keep intro info (if any) + one foundational graded step; drop deepening follow-ups.
 */
export function derivePlayfulSteps(focusSteps: LessonCatalogStep[]): LessonCatalogStep[] {
  if (focusSteps.length <= 2) {
    return focusSteps.map((step) => (step.type === 'info' ? step : simplifyGradedStep(step)));
  }

  const gradedSteps = focusSteps.filter((step) => step.type !== 'info');

  if (gradedSteps.length === 0) {
    return focusSteps;
  }

  const firstInfo = focusSteps.find((step) => step.type === 'info');
  const firstGraded = simplifyGradedStep(gradedSteps[0]);

  if (firstInfo) {
    return [firstInfo, firstGraded];
  }

  return [firstGraded];
}

export function countGradedSteps(steps: LessonCatalogStep[]): number {
  return steps.filter((step) => step.type !== 'info').length;
}
