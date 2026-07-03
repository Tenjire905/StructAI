export type LessonInfoCatalogStep = {
  type: 'info';
  titleKey: string;
  bodyKey: string;
};

export type LessonChoiceCatalogStep = {
  type: 'choice';
  questionKey: string;
  optionKeys: [string, string, string];
  correctIndex: number;
  explanationKey: string;
};

export type LessonFillBlankCatalogStep = {
  type: 'fill_blank';
  prefixKey: string;
  suffixKey: string;
  optionKeys: [string, string, string];
  correctIndex: number;
  explanationKey: string;
};

export type LessonTrueFalseCatalogStep = {
  type: 'true_false';
  statementKey: string;
  correct: boolean;
  explanationKey: string;
};

export type LessonReorderCatalogStep = {
  type: 'reorder';
  instructionKey: string;
  itemKeys: string[];
  correctOrder: number[];
  explanationKey: string;
};

export type LessonCatalogStep =
  | LessonInfoCatalogStep
  | LessonChoiceCatalogStep
  | LessonFillBlankCatalogStep
  | LessonTrueFalseCatalogStep
  | LessonReorderCatalogStep;

export type MockLessonCatalog = {
  id: string;
  titleKey: string;
  orbsReward: number;
  steps: LessonCatalogStep[];
};
