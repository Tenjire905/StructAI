import { getLessonText } from '@/data/lessonContent';
import { getDevBlockJMixedLesson } from '@/data/devBlockJMixedLesson';
import {
  getAllMockLessonCatalogIds,
  getMockLessonCatalog,
} from '@/data/mockLessons.catalog';
import type {
  LessonCatalogStep,
  LessonCategorizeCatalogStep,
  LessonChoiceCatalogStep,
  LessonErrorFindingCatalogStep,
  LessonFillBlankCatalogStep,
  LessonMatchingCatalogStep,
  LessonReorderCatalogStep,
  LessonTrueFalseCatalogStep,
  MockLessonCatalog,
} from '@/data/mockLessons.types';
import type { Locale } from '@/theme/locale';

export type ResolvedInfoStep = {
  type: 'info';
  title: string;
  body: string;
};

export type ResolvedChoiceStep = {
  type: 'choice';
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};

export type ResolvedFillBlankStep = {
  type: 'fill_blank';
  prefix: string;
  suffix: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};

export type ResolvedTrueFalseStep = {
  type: 'true_false';
  statement: string;
  correct: boolean;
  explanation: string;
};

export type ResolvedReorderStep = {
  type: 'reorder';
  instruction: string;
  items: string[];
  correctOrder: number[];
  explanation: string;
};

export type ResolvedMatchingStep = {
  type: 'matching';
  instruction: string;
  pairs: { term: string; definition: string }[];
  /** Display order for the right column (indices into `pairs`). Left terms stay fixed. */
  definitionOrder: number[];
  explanation: string;
};

export type ResolvedErrorFindingStep = {
  type: 'error_finding';
  instruction: string;
  textSegments: { text: string; isError: boolean }[];
  explanation: string;
};

export type ResolvedCategorizeStep = {
  type: 'categorize';
  instruction: string;
  categories: string[];
  items: { text: string; correctCategoryIndex: number }[];
  explanation: string;
};

export type ResolvedLessonStep =
  | ResolvedInfoStep
  | ResolvedChoiceStep
  | ResolvedFillBlankStep
  | ResolvedTrueFalseStep
  | ResolvedReorderStep
  | ResolvedMatchingStep
  | ResolvedErrorFindingStep
  | ResolvedCategorizeStep;

export type ResolvedLesson = {
  id: string;
  title: string;
  orbsReward: number;
  steps: ResolvedLessonStep[];
};

function resolveChoiceStep(
  step: LessonChoiceCatalogStep,
  locale: Locale,
): ResolvedChoiceStep {
  return {
    type: 'choice',
    question: getLessonText(step.questionKey, locale),
    options: step.optionKeys.map((key) => getLessonText(key, locale)),
    correctIndex: step.correctIndex,
    explanation: getLessonText(step.explanationKey, locale),
  };
}

function resolveFillBlankStep(
  step: LessonFillBlankCatalogStep,
  locale: Locale,
): ResolvedFillBlankStep {
  return {
    type: 'fill_blank',
    prefix: getLessonText(step.prefixKey, locale),
    suffix: getLessonText(step.suffixKey, locale),
    options: step.optionKeys.map((key) => getLessonText(key, locale)),
    correctIndex: step.correctIndex,
    explanation: getLessonText(step.explanationKey, locale),
  };
}

function resolveTrueFalseStep(
  step: LessonTrueFalseCatalogStep,
  locale: Locale,
): ResolvedTrueFalseStep {
  return {
    type: 'true_false',
    statement: getLessonText(step.statementKey, locale),
    correct: step.correct,
    explanation: getLessonText(step.explanationKey, locale),
  };
}

function resolveReorderStep(
  step: LessonReorderCatalogStep,
  locale: Locale,
): ResolvedReorderStep {
  return {
    type: 'reorder',
    instruction: getLessonText(step.instructionKey, locale),
    items: step.itemKeys.map((key) => getLessonText(key, locale)),
    correctOrder: [...step.correctOrder],
    explanation: getLessonText(step.explanationKey, locale),
  };
}

export function resolveMatchingStep(
  step: LessonMatchingCatalogStep,
  locale: Locale,
): ResolvedMatchingStep {
  return {
    type: 'matching',
    instruction: getLessonText(step.instructionKey, locale),
    pairs: step.pairs.map((pair) => ({
      term: getLessonText(pair.termKey, locale),
      definition: getLessonText(pair.definitionKey, locale),
    })),
    definitionOrder: step.pairs.map((_, index) => index),
    explanation: getLessonText(step.explanationKey, locale),
  };
}

export function resolveErrorFindingStep(
  step: LessonErrorFindingCatalogStep,
  locale: Locale,
): ResolvedErrorFindingStep {
  return {
    type: 'error_finding',
    instruction: getLessonText(step.instructionKey, locale),
    textSegments: step.textSegments.map((segment) => ({
      text: getLessonText(segment.segmentKey, locale),
      isError: segment.isError,
    })),
    explanation: getLessonText(step.explanationKey, locale),
  };
}

export function resolveCategorizeStep(
  step: LessonCategorizeCatalogStep,
  locale: Locale,
): ResolvedCategorizeStep {
  return {
    type: 'categorize',
    instruction: getLessonText(step.instructionKey, locale),
    categories: step.categoryLabelKeys.map((key) => getLessonText(key, locale)),
    items: step.items.map((item) => ({
      text: getLessonText(item.itemKey, locale),
      correctCategoryIndex: item.correctCategoryIndex,
    })),
    explanation: getLessonText(step.explanationKey, locale),
  };
}

function resolveCatalogStep(step: LessonCatalogStep, locale: Locale): ResolvedLessonStep {
  switch (step.type) {
    case 'info':
      return {
        type: 'info',
        title: getLessonText(step.titleKey, locale),
        body: getLessonText(step.bodyKey, locale),
      };
    case 'choice':
      return resolveChoiceStep(step, locale);
    case 'fill_blank':
      return resolveFillBlankStep(step, locale);
    case 'true_false':
      return resolveTrueFalseStep(step, locale);
    case 'reorder':
      return resolveReorderStep(step, locale);
    case 'matching':
      return resolveMatchingStep(step, locale);
    case 'error_finding':
      return resolveErrorFindingStep(step, locale);
    case 'categorize':
      return resolveCategorizeStep(step, locale);
  }
}

export function resolveCatalogLesson(
  catalog: MockLessonCatalog,
  locale: Locale,
): ResolvedLesson {
  return {
    id: catalog.id,
    title: getLessonText(catalog.titleKey, locale),
    orbsReward: catalog.orbsReward,
    steps: catalog.steps.map((step) => resolveCatalogStep(step, locale)),
  };
}

export function getMockLesson(id: string, locale: Locale): ResolvedLesson | undefined {
  if (__DEV__ && id === 'dev-j-mixed') {
    return getDevBlockJMixedLesson();
  }

  const catalog = getMockLessonCatalog(id);

  if (!catalog) {
    return undefined;
  }

  return resolveCatalogLesson(catalog, locale);
}

export function getAllMockLessonIds(): string[] {
  return getAllMockLessonCatalogIds();
}

export type { LessonChoiceCatalogStep as LessonChoiceStep };
