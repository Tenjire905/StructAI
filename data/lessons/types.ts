import type { Locale } from '@/theme/locale';

export type LText = Record<Locale, string>;

export type LessonInfoStep = {
  type: 'info';
  title: LText;
  body: LText;
};

export type LessonChoiceStep = {
  type: 'choice';
  question: LText;
  options: LText[];
  correctIndex: number;
  explanation: LText;
  shuffleOptions?: boolean;
};

export type LessonFillBlankStep = {
  type: 'fill_blank';
  prefix: LText;
  suffix: LText;
  options: LText[];
  correctIndex: number;
  explanation: LText;
};

export type LessonTrueFalseStep = {
  type: 'true_false';
  statement: LText;
  correct: boolean;
  explanation: LText;
};

export type LessonReorderStep = {
  type: 'reorder';
  instruction: LText;
  items: LText[];
  correctOrder: number[];
  explanation: LText;
};

export type LessonStepDefinition =
  | LessonInfoStep
  | LessonChoiceStep
  | LessonFillBlankStep
  | LessonTrueFalseStep
  | LessonReorderStep;

export type ResolvedLessonStep =
  | { type: 'info'; title: string; body: string }
  | {
      type: 'choice';
      question: string;
      options: string[];
      correctIndex: number;
      explanation: string;
      shuffleOptions?: boolean;
    }
  | {
      type: 'fill_blank';
      prefix: string;
      suffix: string;
      options: string[];
      correctIndex: number;
      explanation: string;
    }
  | { type: 'true_false'; statement: string; correct: boolean; explanation: string }
  | {
      type: 'reorder';
      instruction: string;
      items: string[];
      correctOrder: number[];
      explanation: string;
    };

export type LessonDefinition = {
  id: string;
  title: LText;
  orbsReward: number;
  steps: LessonStepDefinition[];
};

export type ResolvedLesson = {
  id: string;
  title: string;
  orbsReward: number;
  steps: ResolvedLessonStep[];
};

export function resolveLText(text: LText, locale: Locale): string {
  return text[locale] ?? text.de;
}

export function resolveLesson(definition: LessonDefinition, locale: Locale): ResolvedLesson {
  return {
    id: definition.id,
    title: resolveLText(definition.title, locale),
    orbsReward: definition.orbsReward,
    steps: definition.steps.map((step) => resolveLessonStep(step, locale)),
  };
}

function resolveLessonStep(step: LessonStepDefinition, locale: Locale): ResolvedLessonStep {
  switch (step.type) {
    case 'info':
      return {
        type: 'info',
        title: resolveLText(step.title, locale),
        body: resolveLText(step.body, locale),
      };
    case 'choice':
      return {
        type: 'choice',
        question: resolveLText(step.question, locale),
        options: step.options.map((option) => resolveLText(option, locale)),
        correctIndex: step.correctIndex,
        explanation: resolveLText(step.explanation, locale),
        shuffleOptions: step.shuffleOptions,
      };
    case 'fill_blank':
      return {
        type: 'fill_blank',
        prefix: resolveLText(step.prefix, locale),
        suffix: resolveLText(step.suffix, locale),
        options: step.options.map((option) => resolveLText(option, locale)),
        correctIndex: step.correctIndex,
        explanation: resolveLText(step.explanation, locale),
      };
    case 'true_false':
      return {
        type: 'true_false',
        statement: resolveLText(step.statement, locale),
        correct: step.correct,
        explanation: resolveLText(step.explanation, locale),
      };
    case 'reorder':
      return {
        type: 'reorder',
        instruction: resolveLText(step.instruction, locale),
        items: step.items.map((item) => resolveLText(item, locale)),
        correctOrder: step.correctOrder,
        explanation: resolveLText(step.explanation, locale),
      };
  }
}

export function lt(de: string, en: string, fr: string, ru: string): LText {
  return { de, en, fr, ru };
}
