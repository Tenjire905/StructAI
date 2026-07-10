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

type VariantKind = 'choice' | 'fill_blank' | 'true_false' | 'reorder';

function pickVariantKind(seed: number, stepIndex: number): VariantKind {
  const random = mulberry32(seed + stepIndex * 31);
  const roll = random();

  if (roll < 0.45) {
    return 'choice';
  }

  if (roll < 0.7) {
    return 'fill_blank';
  }

  if (roll < 0.85) {
    return 'true_false';
  }

  return 'reorder';
}

function toFillBlank(step: ResolvedChoiceStep): ResolvedFillBlankStep {
  const correct = step.options[step.correctIndex] ?? step.options[0] ?? '';
  const words = step.question.split(' ');
  const mid = Math.max(1, Math.floor(words.length / 2));

  return {
    type: 'fill_blank',
    prefix: `${words.slice(0, mid).join(' ')} `,
    suffix: ` ${words.slice(mid).join(' ')}`.trim() || ` (${correct})`,
    options: step.options,
    correctIndex: step.correctIndex,
    explanation: step.explanation,
  };
}

function toTrueFalse(step: ResolvedChoiceStep, seed: number): ResolvedLessonStep {
  const random = mulberry32(seed);
  const useCorrect = random() > 0.5;
  const wrongIndex = step.options.findIndex((_, index) => index !== step.correctIndex);
  const pickedIndex = useCorrect ? step.correctIndex : wrongIndex >= 0 ? wrongIndex : 0;

  return {
    type: 'true_false',
    statement: step.options[pickedIndex] ?? step.question,
    correct: pickedIndex === step.correctIndex,
    explanation: step.explanation,
  };
}

function toReorder(step: ResolvedChoiceStep, instruction: string): ResolvedReorderStep {
  return {
    type: 'reorder',
    instruction,
    items: [...step.options],
    correctOrder: step.options.map((_, index) => index),
    explanation: step.explanation,
  };
}

/**
 * Native catalog steps only — never derived from prepareChoiceStep().
 *
 * matching, error_finding, and categorize are authored in the catalog and must
 * NOT appear in pickVariantKind() / prepareChoiceStep(). They pass through here
 * (matching/categorize: display-order shuffle with index remapping;
 * error_finding: fixed segment order).
 */
function prepareNativeStep(step: ResolvedLessonStep, stepSeed: number): ResolvedLessonStep {
  switch (step.type) {
    case 'info':
    case 'true_false':
    case 'error_finding':
      return step;
    case 'fill_blank':
      return shuffleChoiceLike(step, stepSeed);
    case 'reorder':
      return shuffleReorder(step, stepSeed);
    case 'matching':
      return shuffleMatching(step, stepSeed);
    case 'categorize':
      return shuffleCategorize(step, stepSeed);
    case 'choice':
      return step;
  }
}

function prepareChoiceStep(
  step: ResolvedChoiceStep,
  stepSeed: number,
  seed: number,
  stepIndex: number,
  reorderHint: string,
): ResolvedLessonStep {
  const shuffledChoice = shuffleChoiceLike(step, stepSeed) as ResolvedChoiceStep;
  const variant = pickVariantKind(seed, stepIndex);

  switch (variant) {
    case 'choice':
      return shuffledChoice;
    case 'fill_blank':
      return shuffleChoiceLike(toFillBlank(shuffledChoice), stepSeed + 3);
    case 'true_false':
      return toTrueFalse(shuffledChoice, stepSeed + 5);
    case 'reorder':
      return shuffleReorder(toReorder(shuffledChoice, reorderHint), stepSeed + 7);
  }
}

export function prepareLessonSteps(
  steps: ResolvedLessonStep[],
  lessonId: string,
  reorderHint: string,
  sessionNonce: string | number = Date.now(),
): ResolvedLessonStep[] {
  // Dev smoke lesson: keep authored step types and order (no choice-variant morph).
  if (lessonId === 'dev-j-mixed') {
    return steps;
  }

  const seed = hashSeed(`${lessonId}-${sessionNonce}`);

  return steps.map((step, stepIndex) => {
    const stepSeed = seed + stepIndex * 17;

    if (step.type === 'choice') {
      return prepareChoiceStep(step, stepSeed, seed, stepIndex, reorderHint);
    }

    return prepareNativeStep(step, stepSeed);
  });
}
