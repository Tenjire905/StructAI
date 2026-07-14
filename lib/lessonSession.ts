import type {
  ResolvedCategorizeStep,
  ResolvedChoiceStep,
  ResolvedFillBlankStep,
  ResolvedLessonStep,
  ResolvedMatchingStep,
  ResolvedReorderStep,
} from '@/data/mockLessons.resolve';

function hashSeed(input: string): number {
  let hash = 0;

  for (let index = 0; index < input.length; index += 1) {
    hash = (hash << 5) - hash + input.charCodeAt(index);
    hash |= 0;
  }

  return Math.abs(hash);
}

function mulberry32(seed: number): () => number {
  let t = seed + 0x6d2b79f5;

  return () => {
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);

    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffleWithSeed<T>(items: T[], seed: number): T[] {
  const random = mulberry32(seed);
  const copy = [...items];

  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }

  return copy;
}

function shuffleChoiceLike(
  step: ResolvedChoiceStep | ResolvedFillBlankStep,
  seed: number,
): ResolvedChoiceStep | ResolvedFillBlankStep {
  const indexed = step.options.map((option, index) => ({ option, index }));
  const shuffled = shuffleWithSeed(indexed, seed);
  const correctIndex = shuffled.findIndex((entry) => entry.index === step.correctIndex);

  return {
    ...step,
    options: shuffled.map((entry) => entry.option),
    correctIndex,
  };
}

function shuffleReorder(step: ResolvedReorderStep, seed: number): ResolvedReorderStep {
  const indexed = step.items.map((item, index) => ({ item, index }));
  let shuffled = shuffleWithSeed(indexed, seed);

  if (shuffled.every((entry, index) => entry.index === step.correctOrder[index])) {
    shuffled = shuffleWithSeed(indexed, seed + 1);
  }

  return {
    ...step,
    items: shuffled.map((entry) => entry.item),
    correctOrder: step.correctOrder.map((originalIndex) =>
      shuffled.findIndex((entry) => entry.index === originalIndex),
    ),
  };
}

function shuffleIndexedEntries<T>(entries: T[], seed: number): T[] {
  const indexed = entries.map((entry, index) => ({ entry, index }));
  const shuffled = shuffleWithSeed(indexed, seed);

  return shuffled.map((item) => item.entry);
}

function shuffleMatching(step: ResolvedMatchingStep, seed: number): ResolvedMatchingStep {
  return {
    ...step,
    definitionOrder: shuffleWithSeed(step.definitionOrder, seed),
  };
}

function shuffleCategorize(step: ResolvedCategorizeStep, seed: number): ResolvedCategorizeStep {
  return {
    ...step,
    items: shuffleIndexedEntries(step.items, seed),
  };
}

/**
 * Prepares one authored catalog step for a session.
 *
 * Authored step types are preserved exactly — a `choice` stays a `choice`,
 * a `fill_blank` stays a `fill_blank`. Only answer/display order is shuffled
 * for anti-memorization, with correctIndex/correctOrder remapped accordingly.
 *
 * We intentionally do NOT synthesize `fill_blank`, `true_false`, or `reorder`
 * variants from `choice` steps: those transforms produced grammatically broken
 * questions (e.g. inserting whole answer sentences into the middle of a blank).
 */
function prepareStep(step: ResolvedLessonStep, stepSeed: number): ResolvedLessonStep {
  switch (step.type) {
    case 'info':
    case 'true_false':
    case 'error_finding':
      return step;
    case 'choice':
    case 'fill_blank':
      return shuffleChoiceLike(step, stepSeed);
    case 'reorder':
      return shuffleReorder(step, stepSeed);
    case 'matching':
      return shuffleMatching(step, stepSeed);
    case 'categorize':
      return shuffleCategorize(step, stepSeed);
  }
}

export function prepareLessonSteps(
  steps: ResolvedLessonStep[],
  lessonId: string,
  sessionNonce: string | number = Date.now(),
): ResolvedLessonStep[] {
  // Dev smoke lessons: keep authored step order without shuffling.
  if (lessonId === 'dev-j-mixed' || lessonId === 'dev-j-new-types') {
    return steps;
  }

  const seed = hashSeed(`${lessonId}-${sessionNonce}`);

  return steps.map((step, stepIndex) => prepareStep(step, seed + stepIndex * 17));
}
