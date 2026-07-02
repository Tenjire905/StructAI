import { getLessonText } from '@/data/lessonContent';
import {
  getAllMockLessonCatalogIds,
  getMockLessonCatalog,
} from '@/data/mockLessons.catalog';
import type { MockLessonCatalog } from '@/data/mockLessons.types';
import type {
  LessonCatalogStep,
  LessonChoiceCatalogStep,
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

export type ResolvedLessonStep =
  | ResolvedInfoStep
  | ResolvedChoiceStep
  | ResolvedFillBlankStep
  | ResolvedTrueFalseStep
  | ResolvedReorderStep;

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

function resolveCatalogStep(step: LessonCatalogStep, locale: Locale): ResolvedLessonStep {
  if (step.type === 'info') {
    return {
      type: 'info',
      title: getLessonText(step.titleKey, locale),
      body: getLessonText(step.bodyKey, locale),
    };
  }

  return resolveChoiceStep(step, locale);
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
