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

export type LessonCatalogStep = LessonInfoCatalogStep | LessonChoiceCatalogStep;

export type MockLessonCatalog = {
  id: string;
  titleKey: string;
  orbsReward: number;
  steps: LessonCatalogStep[];
};
