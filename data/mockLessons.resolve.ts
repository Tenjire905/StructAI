import { getDevBlockJMixedLesson } from '@/data/devBlockJMixedLesson';
import { getDevBlockJNewTypesLesson } from '@/data/devBlockJNewTypesLesson';
import {
  getAllMockLessonCatalogIds,
  getMockLessonCatalog,
} from '@/data/mockLessons.catalog';
import type { LessonChoiceCatalogStep, MockLessonCatalog } from '@/data/mockLessons.types';
import type {
  ResolvedCategorizeStep,
  ResolvedChoiceStep,
  ResolvedErrorFindingStep,
  ResolvedFillBlankStep,
  ResolvedLesson,
  ResolvedLessonStep,
  ResolvedMatchingStep,
  ResolvedReorderStep,
  ResolvedTrueFalseStep,
} from '@/data/mockLessons.resolved.types';
import {
  resolveCatalogTitle,
  resolveCategorizeStep,
  resolveErrorFindingStep,
  resolveMatchingStep,
  resolveStepCopy,
} from '@/lib/resolveLessonContent';
import type { Locale } from '@/theme/locale';
import type { ThemeMode } from '@/theme/theme';

export type {
  ResolvedCategorizeStep,
  ResolvedChoiceStep,
  ResolvedErrorFindingStep,
  ResolvedFillBlankStep,
  ResolvedInfoStep,
  ResolvedLesson,
  ResolvedLessonStep,
  ResolvedMatchingStep,
  ResolvedReorderStep,
  ResolvedTrueFalseStep,
} from '@/data/mockLessons.resolved.types';

export function resolveCatalogLesson(
  catalog: MockLessonCatalog,
  locale: Locale,
  mode: ThemeMode,
): ResolvedLesson {
  return {
    id: catalog.id,
    title: resolveCatalogTitle(catalog, locale, mode),
    orbsReward: catalog.orbsReward,
    steps: catalog.steps.map((step) => resolveStepCopy(step, locale, mode)),
  };
}

export function getMockLesson(
  id: string,
  locale: Locale,
  mode: ThemeMode = 'focus',
): ResolvedLesson | undefined {
  if (__DEV__ && id === 'dev-j-mixed') {
    return getDevBlockJMixedLesson();
  }

  if (__DEV__ && id === 'dev-j-new-types') {
    return getDevBlockJNewTypesLesson();
  }

  const catalog = getMockLessonCatalog(id);

  if (!catalog) {
    return undefined;
  }

  return resolveCatalogLesson(catalog, locale, mode);
}

export function getAllMockLessonIds(): string[] {
  return getAllMockLessonCatalogIds();
}

export type { LessonChoiceCatalogStep as LessonChoiceStep };

// Re-export step resolvers used by tests or dev tooling.
export {
  resolveCategorizeStep,
  resolveErrorFindingStep,
  resolveMatchingStep,
};
