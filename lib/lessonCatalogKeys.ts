import type { LessonCatalogStep, MockLessonCatalog } from '@/data/mockLessons.types';

function pushUnique(keys: Set<string>, key: string | undefined) {
  if (key) {
    keys.add(key);
  }
}

function pushKeysFromStep(keys: Set<string>, step: LessonCatalogStep) {
  switch (step.type) {
    case 'info':
      pushUnique(keys, step.titleKey);
      pushUnique(keys, step.bodyKey);
      break;
    case 'choice':
      pushUnique(keys, step.questionKey);
      step.optionKeys.forEach((key) => pushUnique(keys, key));
      pushUnique(keys, step.explanationKey);
      break;
    case 'fill_blank':
      pushUnique(keys, step.prefixKey);
      pushUnique(keys, step.suffixKey);
      step.optionKeys.forEach((key) => pushUnique(keys, key));
      pushUnique(keys, step.explanationKey);
      break;
    case 'true_false':
      pushUnique(keys, step.statementKey);
      pushUnique(keys, step.explanationKey);
      break;
    case 'reorder':
      pushUnique(keys, step.instructionKey);
      step.itemKeys.forEach((key) => pushUnique(keys, key));
      pushUnique(keys, step.explanationKey);
      break;
    case 'matching':
      pushUnique(keys, step.instructionKey);
      step.pairs.forEach((pair) => {
        pushUnique(keys, pair.termKey);
        pushUnique(keys, pair.definitionKey);
      });
      pushUnique(keys, step.explanationKey);
      break;
    case 'error_finding':
      pushUnique(keys, step.instructionKey);
      step.textSegments.forEach((segment) => pushUnique(keys, segment.segmentKey));
      pushUnique(keys, step.explanationKey);
      break;
    case 'categorize':
      pushUnique(keys, step.instructionKey);
      step.categoryLabelKeys.forEach((key) => pushUnique(keys, key));
      step.items.forEach((item) => pushUnique(keys, item.itemKey));
      pushUnique(keys, step.explanationKey);
      break;
  }
}

export function collectCatalogTextKeys(catalog: MockLessonCatalog, steps: LessonCatalogStep[]): string[] {
  const keys = new Set<string>();

  pushUnique(keys, catalog.titleKey);
  steps.forEach((step) => pushKeysFromStep(keys, step));

  return [...keys].sort();
}
