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

function pickCatalogSteps(catalog: MockLessonCatalog, mode: ThemeMode) {
  if (mode === 'playful' && catalog.playfulSteps && catalog.playfulSteps.length > 0) {
    return catalog.playfulSteps;
  }

  return catalog.steps;
}

export function resolveCatalogLesson(
  catalog: MockLessonCatalog,
  locale: Locale,
  mode: ThemeMode,
): ResolvedLesson {
  const hasPlayfulDepth = Boolean(catalog.playfulSteps && catalog.playfulSteps.length > 0);
  const catalogSteps = pickCatalogSteps(catalog, mode);

  return {
    id: catalog.id,
    title: resolveCatalogTitle(catalog, locale, mode),
    orbsReward: catalog.orbsReward,
    steps: catalogSteps.map((step) => resolveStepCopy(step, locale, mode)),
    depthBadge: hasPlayfulDepth ? mode : undefined,
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

export {
  resolveCategorizeStep,
  resolveErrorFindingStep,
  resolveMatchingStep,
};
