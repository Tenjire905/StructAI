import { getLocalizedLessonText } from '@/data/lessonContent/index';
import { simplifyForPlayful } from '@/lib/simplifyPlayfulCopy';
import type {
  LessonCatalogStep,
  LessonCategorizeCatalogStep,
  LessonChoiceCatalogStep,
  LessonErrorFindingCatalogStep,
  LessonFillBlankCatalogStep,
  LessonInfoCatalogStep,
  LessonMatchingCatalogStep,
  LessonReorderCatalogStep,
  LessonTrueFalseCatalogStep,
  ModeContentVariant,
} from '@/data/mockLessons.types';
import type {
  ResolvedCategorizeStep,
  ResolvedChoiceStep,
  ResolvedErrorFindingStep,
  ResolvedFillBlankStep,
  ResolvedInfoStep,
  ResolvedLessonStep,
  ResolvedMatchingStep,
  ResolvedReorderStep,
  ResolvedTrueFalseStep,
} from '@/data/mockLessons.resolved.types';
import type { ResolvedReorderHintRules } from '@/lib/reorderHints';
import type { Locale } from '@/theme/locale';
import type { ThemeMode } from '@/theme/theme';

function lessonTextExists(key: string, locale: Locale): boolean {
  const localized = getLocalizedLessonText(key, locale);
  return localized !== key;
}

/**
 * Resolves a catalog key to localized, mode-aware lesson copy.
 * Resolution order: explicit override key → `{baseKey}.{mode}` suffix → legacy base key.
 */
export function resolveLessonText(
  baseKey: string,
  locale: Locale,
  mode: ThemeMode,
  explicitKey?: string,
): string {
  if (explicitKey && lessonTextExists(explicitKey, locale)) {
    return getLocalizedLessonText(explicitKey, locale);
  }

  const modeSuffixKey = `${baseKey}.${mode}`;
  if (lessonTextExists(modeSuffixKey, locale)) {
    return getLocalizedLessonText(modeSuffixKey, locale);
  }

  const baseText = getLocalizedLessonText(baseKey, locale);

  if (mode === 'playful' && baseText !== baseKey) {
    return simplifyForPlayful(baseText, locale, baseKey);
  }

  return baseText;
}

function resolveReorderHints(
  hints: NonNullable<LessonReorderCatalogStep['reorderHints']>,
  locale: Locale,
): ResolvedReorderHintRules {
  return {
    swappedPairs:
      hints.swappedPairs?.map((rule) => ({
        swappedPair: rule.swappedPair,
        hint: getLocalizedLessonText(rule.hintKey, locale),
      })) ?? [],
    tooEarly:
      hints.tooEarly?.map((rule) => ({
        itemIndex: rule.itemIndex,
        hint: getLocalizedLessonText(rule.hintKey, locale),
      })) ?? [],
    tooLate:
      hints.tooLate?.map((rule) => ({
        itemIndex: rule.itemIndex,
        hint: getLocalizedLessonText(rule.hintKey, locale),
      })) ?? [],
  };
}

function pickModeKey(
  baseKey: string,
  mode: ThemeMode,
  playfulKey?: string,
  focusKey?: string,
): string {
  const explicit = mode === 'playful' ? playfulKey : focusKey;
  return explicit ?? baseKey;
}

function pickModeKeys<T extends string>(
  baseKeys: readonly T[],
  mode: ThemeMode,
  playfulKeys?: readonly T[],
  focusKeys?: readonly T[],
): readonly T[] {
  const explicit = mode === 'playful' ? playfulKeys : focusKeys;
  return explicit ?? baseKeys;
}

function pickNestedContent<T extends Record<string, unknown>>(
  content: ModeContentVariant<T> | undefined,
  mode: ThemeMode,
): Partial<T> | undefined {
  return content?.[mode];
}

function resolveInfoStep(
  step: LessonInfoCatalogStep,
  locale: Locale,
  mode: ThemeMode,
): ResolvedInfoStep {
  const nested = pickNestedContent(step.content, mode);

  const titleKey = nested?.titleKey
    ?? pickModeKey(step.titleKey, mode, step.titleKeyPlayful, step.titleKeyFocus);
  const bodyKey = nested?.bodyKey
    ?? pickModeKey(step.bodyKey, mode, step.bodyKeyPlayful, step.bodyKeyFocus);

  return {
    type: 'info',
    title: resolveLessonText(step.titleKey, locale, mode, titleKey !== step.titleKey ? titleKey : undefined),
    body: resolveLessonText(step.bodyKey, locale, mode, bodyKey !== step.bodyKey ? bodyKey : undefined),
  };
}

function resolveChoiceStep(
  step: LessonChoiceCatalogStep,
  locale: Locale,
  mode: ThemeMode,
): ResolvedChoiceStep {
  const nested = pickNestedContent(step.content, mode);

  const questionKey = nested?.questionKey
    ?? pickModeKey(step.questionKey, mode, step.questionKeyPlayful, step.questionKeyFocus);
  const optionKeys = nested?.optionKeys
    ?? pickModeKeys(step.optionKeys, mode, step.optionKeysPlayful, step.optionKeysFocus);
  const explanationKey = nested?.explanationKey
    ?? pickModeKey(step.explanationKey, mode, step.explanationKeyPlayful, step.explanationKeyFocus);

  return {
    type: 'choice',
    question: resolveLessonText(
      step.questionKey,
      locale,
      mode,
      questionKey !== step.questionKey ? questionKey : undefined,
    ),
    options: optionKeys.map((key, index) =>
      resolveLessonText(
        step.optionKeys[index] ?? key,
        locale,
        mode,
        key !== step.optionKeys[index] ? key : undefined,
      ),
    ),
    correctIndex: step.correctIndex,
    explanation: resolveLessonText(
      step.explanationKey,
      locale,
      mode,
      explanationKey !== step.explanationKey ? explanationKey : undefined,
    ),
  };
}

function resolveFillBlankStep(
  step: LessonFillBlankCatalogStep,
  locale: Locale,
  mode: ThemeMode,
): ResolvedFillBlankStep {
  const nested = pickNestedContent(step.content, mode);

  const prefixKey = nested?.prefixKey
    ?? pickModeKey(step.prefixKey, mode, step.prefixKeyPlayful, step.prefixKeyFocus);
  const suffixKey = nested?.suffixKey
    ?? pickModeKey(step.suffixKey, mode, step.suffixKeyPlayful, step.suffixKeyFocus);
  const optionKeys = nested?.optionKeys
    ?? pickModeKeys(step.optionKeys, mode, step.optionKeysPlayful, step.optionKeysFocus);
  const explanationKey = nested?.explanationKey
    ?? pickModeKey(step.explanationKey, mode, step.explanationKeyPlayful, step.explanationKeyFocus);

  return {
    type: 'fill_blank',
    prefix: resolveLessonText(
      step.prefixKey,
      locale,
      mode,
      prefixKey !== step.prefixKey ? prefixKey : undefined,
    ),
    suffix: resolveLessonText(
      step.suffixKey,
      locale,
      mode,
      suffixKey !== step.suffixKey ? suffixKey : undefined,
    ),
    options: optionKeys.map((key, index) =>
      resolveLessonText(
        step.optionKeys[index] ?? key,
        locale,
        mode,
        key !== step.optionKeys[index] ? key : undefined,
      ),
    ),
    correctIndex: step.correctIndex,
    explanation: resolveLessonText(
      step.explanationKey,
      locale,
      mode,
      explanationKey !== step.explanationKey ? explanationKey : undefined,
    ),
  };
}

function resolveTrueFalseStep(
  step: LessonTrueFalseCatalogStep,
  locale: Locale,
  mode: ThemeMode,
): ResolvedTrueFalseStep {
  const nested = pickNestedContent(step.content, mode);

  const statementKey = nested?.statementKey
    ?? pickModeKey(step.statementKey, mode, step.statementKeyPlayful, step.statementKeyFocus);
  const explanationKey = nested?.explanationKey
    ?? pickModeKey(step.explanationKey, mode, step.explanationKeyPlayful, step.explanationKeyFocus);

  return {
    type: 'true_false',
    statement: resolveLessonText(
      step.statementKey,
      locale,
      mode,
      statementKey !== step.statementKey ? statementKey : undefined,
    ),
    correct: step.correct,
    explanation: resolveLessonText(
      step.explanationKey,
      locale,
      mode,
      explanationKey !== step.explanationKey ? explanationKey : undefined,
    ),
  };
}

function resolveReorderStep(
  step: LessonReorderCatalogStep,
  locale: Locale,
  mode: ThemeMode,
): ResolvedReorderStep {
  const nested = pickNestedContent(step.content, mode);

  const instructionKey = nested?.instructionKey
    ?? pickModeKey(step.instructionKey, mode, step.instructionKeyPlayful, step.instructionKeyFocus);
  const itemKeys = nested?.itemKeys
    ?? pickModeKeys(step.itemKeys, mode, step.itemKeysPlayful, step.itemKeysFocus);
  const explanationKey = nested?.explanationKey
    ?? pickModeKey(step.explanationKey, mode, step.explanationKeyPlayful, step.explanationKeyFocus);

  return {
    type: 'reorder',
    instruction: resolveLessonText(
      step.instructionKey,
      locale,
      mode,
      instructionKey !== step.instructionKey ? instructionKey : undefined,
    ),
    items: itemKeys.map((key, index) =>
      resolveLessonText(
        step.itemKeys[index] ?? key,
        locale,
        mode,
        key !== step.itemKeys[index] ? key : undefined,
      ),
    ),
    correctOrder: [...step.correctOrder],
    explanation: resolveLessonText(
      step.explanationKey,
      locale,
      mode,
      explanationKey !== step.explanationKey ? explanationKey : undefined,
    ),
    reorderHints: step.reorderHints ? resolveReorderHints(step.reorderHints, locale) : undefined,
  };
}

export function resolveMatchingStep(
  step: LessonMatchingCatalogStep,
  locale: Locale,
  mode: ThemeMode = 'focus',
): ResolvedMatchingStep {
  const nested = pickNestedContent(step.content, mode);
  const pairs = nested?.pairs ?? step.pairs;

  const instructionKey = nested?.instructionKey
    ?? pickModeKey(step.instructionKey, mode, step.instructionKeyPlayful, step.instructionKeyFocus);
  const explanationKey = nested?.explanationKey
    ?? pickModeKey(step.explanationKey, mode, step.explanationKeyPlayful, step.explanationKeyFocus);

  return {
    type: 'matching',
    instruction: resolveLessonText(
      step.instructionKey,
      locale,
      mode,
      instructionKey !== step.instructionKey ? instructionKey : undefined,
    ),
    pairs: pairs.map((pair, index) => ({
      term: resolveLessonText(
        step.pairs[index]?.termKey ?? pair.termKey,
        locale,
        mode,
        pair.termKey !== step.pairs[index]?.termKey ? pair.termKey : undefined,
      ),
      definition: resolveLessonText(
        step.pairs[index]?.definitionKey ?? pair.definitionKey,
        locale,
        mode,
        pair.definitionKey !== step.pairs[index]?.definitionKey ? pair.definitionKey : undefined,
      ),
    })),
    definitionOrder: pairs.map((_, index) => index),
    explanation: resolveLessonText(
      step.explanationKey,
      locale,
      mode,
      explanationKey !== step.explanationKey ? explanationKey : undefined,
    ),
  };
}

export function resolveErrorFindingStep(
  step: LessonErrorFindingCatalogStep,
  locale: Locale,
  mode: ThemeMode = 'focus',
): ResolvedErrorFindingStep {
  const nested = pickNestedContent(step.content, mode);
  const textSegments = nested?.textSegments ?? step.textSegments;

  const instructionKey = nested?.instructionKey
    ?? pickModeKey(step.instructionKey, mode, step.instructionKeyPlayful, step.instructionKeyFocus);
  const explanationKey = nested?.explanationKey
    ?? pickModeKey(step.explanationKey, mode, step.explanationKeyPlayful, step.explanationKeyFocus);

  return {
    type: 'error_finding',
    instruction: resolveLessonText(
      step.instructionKey,
      locale,
      mode,
      instructionKey !== step.instructionKey ? instructionKey : undefined,
    ),
    textSegments: textSegments.map((segment, index) => ({
      text: resolveLessonText(
        step.textSegments[index]?.segmentKey ?? segment.segmentKey,
        locale,
        mode,
        segment.segmentKey !== step.textSegments[index]?.segmentKey ? segment.segmentKey : undefined,
      ),
      isError: segment.isError,
    })),
    explanation: resolveLessonText(
      step.explanationKey,
      locale,
      mode,
      explanationKey !== step.explanationKey ? explanationKey : undefined,
    ),
  };
}

export function resolveCategorizeStep(
  step: LessonCategorizeCatalogStep,
  locale: Locale,
  mode: ThemeMode = 'focus',
): ResolvedCategorizeStep {
  const nested = pickNestedContent(step.content, mode);
  const categoryLabelKeys = nested?.categoryLabelKeys ?? step.categoryLabelKeys;
  const items = nested?.items ?? step.items;

  const instructionKey = nested?.instructionKey
    ?? pickModeKey(step.instructionKey, mode, step.instructionKeyPlayful, step.instructionKeyFocus);
  const explanationKey = nested?.explanationKey
    ?? pickModeKey(step.explanationKey, mode, step.explanationKeyPlayful, step.explanationKeyFocus);

  return {
    type: 'categorize',
    instruction: resolveLessonText(
      step.instructionKey,
      locale,
      mode,
      instructionKey !== step.instructionKey ? instructionKey : undefined,
    ),
    categories: categoryLabelKeys.map((key, index) =>
      resolveLessonText(
        step.categoryLabelKeys[index] ?? key,
        locale,
        mode,
        key !== step.categoryLabelKeys[index] ? key : undefined,
      ),
    ),
    items: items.map((item, index) => ({
      text: resolveLessonText(
        step.items[index]?.itemKey ?? item.itemKey,
        locale,
        mode,
        item.itemKey !== step.items[index]?.itemKey ? item.itemKey : undefined,
      ),
      correctCategoryIndex: item.correctCategoryIndex,
    })),
    explanation: resolveLessonText(
      step.explanationKey,
      locale,
      mode,
      explanationKey !== step.explanationKey ? explanationKey : undefined,
    ),
  };
}

/** Resolves a catalog step into mode- and locale-aware display strings. */
export function resolveStepCopy(
  step: LessonCatalogStep,
  locale: Locale,
  mode: ThemeMode,
): ResolvedLessonStep {
  switch (step.type) {
    case 'info':
      return resolveInfoStep(step, locale, mode);
    case 'choice':
      return resolveChoiceStep(step, locale, mode);
    case 'fill_blank':
      return resolveFillBlankStep(step, locale, mode);
    case 'true_false':
      return resolveTrueFalseStep(step, locale, mode);
    case 'reorder':
      return resolveReorderStep(step, locale, mode);
    case 'matching':
      return resolveMatchingStep(step, locale, mode);
    case 'error_finding':
      return resolveErrorFindingStep(step, locale, mode);
    case 'categorize':
      return resolveCategorizeStep(step, locale, mode);
  }
}

export function resolveCatalogTitle(
  catalog: { titleKey: string; titleKeyPlayful?: string; titleKeyFocus?: string },
  locale: Locale,
  mode: ThemeMode,
): string {
  const titleKey = pickModeKey(
    catalog.titleKey,
    mode,
    catalog.titleKeyPlayful,
    catalog.titleKeyFocus,
  );

  return resolveLessonText(
    catalog.titleKey,
    locale,
    mode,
    titleKey !== catalog.titleKey ? titleKey : undefined,
  );
}
