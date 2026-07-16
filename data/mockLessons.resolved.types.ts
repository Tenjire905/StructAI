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

import type { ResolvedReorderHintRules } from '@/lib/reorderHints';

export type ResolvedReorderStep = {
  type: 'reorder';
  instruction: string;
  items: string[];
  correctOrder: number[];
  explanation: string;
  reorderHints?: ResolvedReorderHintRules;
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

export type LessonDepthBadge = 'playful' | 'focus';

export type ResolvedLesson = {
  id: string;
  title: string;
  orbsReward: number;
  steps: ResolvedLessonStep[];
  /** Set when catalog defines `playfulSteps` — signals structural depth difference. */
  depthBadge?: LessonDepthBadge;
};
