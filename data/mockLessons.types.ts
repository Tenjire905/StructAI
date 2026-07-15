export type ModeContentVariant<T> = {
  playful?: Partial<T>;
  focus?: Partial<T>;
};

export type LessonInfoCatalogStep = {
  type: 'info';
  titleKey: string;
  bodyKey: string;
  titleKeyPlayful?: string;
  titleKeyFocus?: string;
  bodyKeyPlayful?: string;
  bodyKeyFocus?: string;
  content?: ModeContentVariant<{
    titleKey: string;
    bodyKey: string;
  }>;
};

export type LessonChoiceCatalogStep = {
  type: 'choice';
  questionKey: string;
  optionKeys: [string, string, ...string[]];
  correctIndex: number;
  explanationKey: string;
  questionKeyPlayful?: string;
  questionKeyFocus?: string;
  optionKeysPlayful?: [string, string, ...string[]];
  optionKeysFocus?: [string, string, ...string[]];
  explanationKeyPlayful?: string;
  explanationKeyFocus?: string;
  content?: ModeContentVariant<{
    questionKey: string;
    optionKeys: [string, string, ...string[]];
    explanationKey: string;
  }>;
};

export type LessonFillBlankCatalogStep = {
  type: 'fill_blank';
  prefixKey: string;
  suffixKey: string;
  optionKeys: [string, string, ...string[]];
  correctIndex: number;
  explanationKey: string;
  prefixKeyPlayful?: string;
  prefixKeyFocus?: string;
  suffixKeyPlayful?: string;
  suffixKeyFocus?: string;
  optionKeysPlayful?: [string, string, ...string[]];
  optionKeysFocus?: [string, string, ...string[]];
  explanationKeyPlayful?: string;
  explanationKeyFocus?: string;
  content?: ModeContentVariant<{
    prefixKey: string;
    suffixKey: string;
    optionKeys: [string, string, ...string[]];
    explanationKey: string;
  }>;
};

export type LessonTrueFalseCatalogStep = {
  type: 'true_false';
  statementKey: string;
  correct: boolean;
  explanationKey: string;
  statementKeyPlayful?: string;
  statementKeyFocus?: string;
  explanationKeyPlayful?: string;
  explanationKeyFocus?: string;
  content?: ModeContentVariant<{
    statementKey: string;
    explanationKey: string;
  }>;
};

export type LessonReorderHints = {
  swappedPairs?: { swappedPair: [number, number]; hintKey: string }[];
  tooEarly?: { itemIndex: number; hintKey: string }[];
  tooLate?: { itemIndex: number; hintKey: string }[];
  /** Overrides explanationKey as fallback when no rule matches. */
  fallbackExplanationKey?: string;
};

export type LessonReorderCatalogStep = {
  type: 'reorder';
  instructionKey: string;
  itemKeys: string[];
  correctOrder: number[];
  explanationKey: string;
  reorderHints?: LessonReorderHints;
  instructionKeyPlayful?: string;
  instructionKeyFocus?: string;
  itemKeysPlayful?: string[];
  itemKeysFocus?: string[];
  explanationKeyPlayful?: string;
  explanationKeyFocus?: string;
  reorderHintKeyPlayful?: string;
  reorderHintKeyFocus?: string;
  content?: ModeContentVariant<{
    instructionKey: string;
    itemKeys: string[];
    explanationKey: string;
    reorderHintKey?: string;
  }>;
};

export type LessonMatchingCatalogStep = {
  type: 'matching';
  instructionKey: string;
  pairs: { termKey: string; definitionKey: string }[];
  explanationKey: string;
  instructionKeyPlayful?: string;
  instructionKeyFocus?: string;
  explanationKeyPlayful?: string;
  explanationKeyFocus?: string;
  content?: ModeContentVariant<{
    instructionKey: string;
    pairs: { termKey: string; definitionKey: string }[];
    explanationKey: string;
  }>;
};

export type LessonErrorFindingCatalogStep = {
  type: 'error_finding';
  instructionKey: string;
  textSegments: { segmentKey: string; isError: boolean }[];
  explanationKey: string;
  instructionKeyPlayful?: string;
  instructionKeyFocus?: string;
  explanationKeyPlayful?: string;
  explanationKeyFocus?: string;
  content?: ModeContentVariant<{
    instructionKey: string;
    textSegments: { segmentKey: string; isError: boolean }[];
    explanationKey: string;
  }>;
};

export type LessonCategorizeCatalogStep = {
  type: 'categorize';
  instructionKey: string;
  categoryLabelKeys: string[];
  items: { itemKey: string; correctCategoryIndex: number }[];
  explanationKey: string;
  instructionKeyPlayful?: string;
  instructionKeyFocus?: string;
  explanationKeyPlayful?: string;
  explanationKeyFocus?: string;
  content?: ModeContentVariant<{
    instructionKey: string;
    categoryLabelKeys: string[];
    items: { itemKey: string; correctCategoryIndex: number }[];
    explanationKey: string;
  }>;
};

export type LessonCatalogStep =
  | LessonInfoCatalogStep
  | LessonChoiceCatalogStep
  | LessonFillBlankCatalogStep
  | LessonTrueFalseCatalogStep
  | LessonReorderCatalogStep
  | LessonMatchingCatalogStep
  | LessonErrorFindingCatalogStep
  | LessonCategorizeCatalogStep;

export type MockLessonCatalog = {
  id: string;
  titleKey: string;
  titleKeyPlayful?: string;
  titleKeyFocus?: string;
  orbsReward: number;
  steps: LessonCatalogStep[];
};
