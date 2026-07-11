import type { MockLessonCatalog } from './mockLessons.types';

export const MOCK_LESSONS_CATALOG: MockLessonCatalog[] = [
  {
    id: 'pb-1',
    titleKey: 'pb-1.title',
    orbsReward: 15,
    steps: [
      {
        type: 'info',
        titleKey: 'pb-1.s0.title',
        bodyKey: 'pb-1.s0.body',
      },
      {
        type: 'choice',
        questionKey: 'pb-1.s1.question',
        optionKeys: ['pb-1.s1.opt0', 'pb-1.s1.opt1', 'pb-1.s1.opt2'],
        correctIndex: 1,
        explanationKey: 'pb-1.s1.explanation',
      },
      {
        type: 'choice',
        questionKey: 'pb-1.s2.question',
        optionKeys: ['pb-1.s2.opt0', 'pb-1.s2.opt1', 'pb-1.s2.opt2'],
        correctIndex: 1,
        explanationKey: 'pb-1.s2.explanation',
      },
    ],
  },
  {
    id: 'pb-2',
    titleKey: 'pb-2.title',
    orbsReward: 15,
    steps: [
      {
        type: 'info',
        titleKey: 'pb-2.s0.title',
        bodyKey: 'pb-2.s0.body',
      },
      {
        type: 'fill_blank',
        prefixKey: 'pb-2.s1.prefix',
        suffixKey: 'pb-2.s1.suffix',
        optionKeys: ['pb-2.s1.blank0', 'pb-2.s1.blank1', 'pb-2.s1.blank2'],
        correctIndex: 1,
        explanationKey: 'pb-2.s1.explanation',
      },
      {
        type: 'choice',
        questionKey: 'pb-2.s2.question',
        optionKeys: ['pb-2.s2.opt0', 'pb-2.s2.opt1', 'pb-2.s2.opt2'],
        correctIndex: 1,
        explanationKey: 'pb-2.s2.explanation',
      },
    ],
  },
  {
    id: 'pb-3',
    titleKey: 'pb-3.title',
    orbsReward: 20,
    steps: [
      {
        type: 'info',
        titleKey: 'pb-3.s0.title',
        bodyKey: 'pb-3.s0.body',
      },
      {
        type: 'choice',
        questionKey: 'pb-3.s1.question',
        optionKeys: ['pb-3.s1.opt0', 'pb-3.s1.opt1', 'pb-3.s1.opt2'],
        correctIndex: 1,
        explanationKey: 'pb-3.s1.explanation',
      },
      {
        type: 'choice',
        questionKey: 'pb-3.s2.question',
        optionKeys: ['pb-3.s2.opt0', 'pb-3.s2.opt1', 'pb-3.s2.opt2'],
        correctIndex: 1,
        explanationKey: 'pb-3.s2.explanation',
      },
    ],
  },
  {
    id: 'pb-4',
    titleKey: 'pb-4.title',
    orbsReward: 18,
    steps: [
      {
        type: 'info',
        titleKey: 'pb-4.s0.title',
        bodyKey: 'pb-4.s0.body',
      },
      {
        type: 'choice',
        questionKey: 'pb-4.s1.question',
        optionKeys: ['pb-4.s1.opt0', 'pb-4.s1.opt1', 'pb-4.s1.opt2'],
        correctIndex: 1,
        explanationKey: 'pb-4.s1.explanation',
      },
      {
        type: 'choice',
        questionKey: 'pb-4.s2.question',
        optionKeys: ['pb-4.s2.opt0', 'pb-4.s2.opt1', 'pb-4.s2.opt2'],
        correctIndex: 1,
        explanationKey: 'pb-4.s2.explanation',
      },
    ],
  },
  {
    id: 'pb-5',
    titleKey: 'pb-5.title',
    orbsReward: 18,
    steps: [
      {
        type: 'info',
        titleKey: 'pb-5.s0.title',
        bodyKey: 'pb-5.s0.body',
      },
      {
        type: 'choice',
        questionKey: 'pb-5.s1.question',
        optionKeys: ['pb-5.s1.opt0', 'pb-5.s1.opt1', 'pb-5.s1.opt2'],
        correctIndex: 1,
        explanationKey: 'pb-5.s1.explanation',
      },
      {
        type: 'choice',
        questionKey: 'pb-5.s2.question',
        optionKeys: ['pb-5.s2.opt0', 'pb-5.s2.opt1', 'pb-5.s2.opt2'],
        correctIndex: 1,
        explanationKey: 'pb-5.s2.explanation',
      },
    ],
  },
  {
    id: 'pb-6',
    titleKey: 'pb-6.title',
    orbsReward: 18,
    steps: [
      {
        type: 'info',
        titleKey: 'pb-6.s0.title',
        bodyKey: 'pb-6.s0.body',
      },
      {
        type: 'choice',
        questionKey: 'pb-6.s1.question',
        optionKeys: ['pb-6.s1.opt0', 'pb-6.s1.opt1', 'pb-6.s1.opt2'],
        correctIndex: 1,
        explanationKey: 'pb-6.s1.explanation',
      },
      {
        type: 'choice',
        questionKey: 'pb-6.s2.question',
        optionKeys: ['pb-6.s2.opt0', 'pb-6.s2.opt1', 'pb-6.s2.opt2'],
        correctIndex: 0,
        explanationKey: 'pb-6.s2.explanation',
      },
    ],
  },
  {
    id: 'pb-7',
    titleKey: 'pb-7.title',
    orbsReward: 18,
    steps: [
      {
        type: 'info',
        titleKey: 'pb-7.s0.title',
        bodyKey: 'pb-7.s0.body',
      },
      {
        type: 'choice',
        questionKey: 'pb-7.s1.question',
        optionKeys: ['pb-7.s1.opt0', 'pb-7.s1.opt1', 'pb-7.s1.opt2'],
        correctIndex: 1,
        explanationKey: 'pb-7.s1.explanation',
      },
      {
        type: 'choice',
        questionKey: 'pb-7.s2.question',
        optionKeys: ['pb-7.s2.opt0', 'pb-7.s2.opt1', 'pb-7.s2.opt2'],
        correctIndex: 1,
        explanationKey: 'pb-7.s2.explanation',
      },
    ],
  },
  {
    id: 'pb-8',
    titleKey: 'pb-8.title',
    orbsReward: 30,
    steps: [
      {
        type: 'info',
        titleKey: 'pb-8.s0.title',
        bodyKey: 'pb-8.s0.body',
      },
      {
        type: 'choice',
        questionKey: 'pb-8.s1.question',
        optionKeys: ['pb-8.s1.opt0', 'pb-8.s1.opt1', 'pb-8.s1.opt2'],
        correctIndex: 1,
        explanationKey: 'pb-8.s1.explanation',
      },
      {
        type: 'choice',
        questionKey: 'pb-8.s2.question',
        optionKeys: ['pb-8.s2.opt0', 'pb-8.s2.opt1', 'pb-8.s2.opt2'],
        correctIndex: 1,
        explanationKey: 'pb-8.s2.explanation',
      },
    ],
  },
  {
    id: 'pb-9',
    titleKey: 'pb-9.title',
    orbsReward: 15,
    steps: [
      {
        type: 'info',
        titleKey: 'pb-9.s0.title',
        bodyKey: 'pb-9.s0.body',
      },
      {
        type: 'true_false',
        statementKey: 'pb-9.s1.statement',
        correct: false,
        explanationKey: 'pb-9.s1.explanation',
      },
      {
        type: 'choice',
        questionKey: 'pb-9.s2.question',
        optionKeys: ['pb-9.s2.opt0', 'pb-9.s2.opt1'],
        correctIndex: 1,
        explanationKey: 'pb-9.s2.explanation',
      },
    ],
  },
  {
    id: 'pb-10',
    titleKey: 'pb-10.title',
    orbsReward: 15,
    steps: [
      {
        type: 'info',
        titleKey: 'pb-10.s0.title',
        bodyKey: 'pb-10.s0.body',
      },
      {
        type: 'fill_blank',
        prefixKey: 'pb-10.s1.prefix',
        suffixKey: 'pb-10.s1.suffix',
        optionKeys: ['pb-10.s1.blank0', 'pb-10.s1.blank1', 'pb-10.s1.blank2'],
        correctIndex: 0,
        explanationKey: 'pb-10.s1.explanation',
      },
      {
        type: 'choice',
        questionKey: 'pb-10.s2.question',
        optionKeys: ['pb-10.s2.opt0', 'pb-10.s2.opt1'],
        correctIndex: 1,
        explanationKey: 'pb-10.s2.explanation',
      },
    ],
  },
  {
    id: 'pb-11',
    titleKey: 'pb-11.title',
    orbsReward: 15,
    steps: [
      {
        type: 'info',
        titleKey: 'pb-11.s0.title',
        bodyKey: 'pb-11.s0.body',
      },
      {
        type: 'choice',
        questionKey: 'pb-11.s1.question',
        optionKeys: ['pb-11.s1.opt0', 'pb-11.s1.opt1'],
        correctIndex: 0,
        explanationKey: 'pb-11.s1.explanation',
      },
      {
        type: 'true_false',
        statementKey: 'pb-11.s2.statement',
        correct: false,
        explanationKey: 'pb-11.s2.explanation',
      },
    ],
  },
  {
    id: 'pb-12',
    titleKey: 'pb-12.title',
    orbsReward: 18,
    steps: [
      {
        type: 'info',
        titleKey: 'pb-12.s0.title',
        bodyKey: 'pb-12.s0.body',
      },
      {
        type: 'reorder',
        instructionKey: 'pb-12.s1.instruction',
        itemKeys: [
          'pb-12.s1.item0',
          'pb-12.s1.item1',
          'pb-12.s1.item2',
          'pb-12.s1.item3',
        ],
        correctOrder: [0, 1, 2, 3],
        explanationKey: 'pb-12.s1.explanation',
      },
      {
        type: 'choice',
        questionKey: 'pb-12.s2.question',
        optionKeys: ['pb-12.s2.opt0', 'pb-12.s2.opt1'],
        correctIndex: 1,
        explanationKey: 'pb-12.s2.explanation',
      },
    ],
  },
  {
    id: 'pb-13',
    titleKey: 'pb-13.title',
    orbsReward: 18,
    steps: [
      {
        type: 'info',
        titleKey: 'pb-13.s0.title',
        bodyKey: 'pb-13.s0.body',
      },
      {
        type: 'choice',
        questionKey: 'pb-13.s1.question',
        optionKeys: ['pb-13.s1.opt0', 'pb-13.s1.opt1', 'pb-13.s1.opt2'],
        correctIndex: 1,
        explanationKey: 'pb-13.s1.explanation',
      },
      {
        type: 'true_false',
        statementKey: 'pb-13.s2.statement',
        correct: true,
        explanationKey: 'pb-13.s2.explanation',
      },
    ],
  },
  {
    id: 'pb-14',
    titleKey: 'pb-14.title',
    orbsReward: 15,
    steps: [
      {
        type: 'info',
        titleKey: 'pb-14.s0.title',
        bodyKey: 'pb-14.s0.body',
      },
      {
        type: 'reorder',
        instructionKey: 'pb-14.s1.instruction',
        itemKeys: [
          'pb-14.s1.item0',
          'pb-14.s1.item1',
          'pb-14.s1.item2',
          'pb-14.s1.item3',
        ],
        correctOrder: [0, 1, 2, 3],
        explanationKey: 'pb-14.s1.explanation',
      },
      {
        type: 'true_false',
        statementKey: 'pb-14.s2.statement',
        correct: false,
        explanationKey: 'pb-14.s2.explanation',
      },
    ],
  },
  {
    id: 'pb-15',
    titleKey: 'pb-15.title',
    orbsReward: 12,
    steps: [
      {
        type: 'info',
        titleKey: 'pb-15.s0.title',
        bodyKey: 'pb-15.s0.body',
      },
      {
        type: 'true_false',
        statementKey: 'pb-15.s1.statement',
        correct: false,
        explanationKey: 'pb-15.s1.explanation',
      },
      {
        type: 'choice',
        questionKey: 'pb-15.s2.question',
        optionKeys: ['pb-15.s2.opt0', 'pb-15.s2.opt1'],
        correctIndex: 0,
        explanationKey: 'pb-15.s2.explanation',
      },
    ],
  },
  {
    id: 'pb-16',
    titleKey: 'pb-16.title',
    orbsReward: 16,
    steps: [
      {
        type: 'info',
        titleKey: 'pb-16.s0.title',
        bodyKey: 'pb-16.s0.body',
      },
      {
        type: 'choice',
        questionKey: 'pb-16.s1.question',
        optionKeys: ['pb-16.s1.opt0', 'pb-16.s1.opt1'],
        correctIndex: 1,
        explanationKey: 'pb-16.s1.explanation',
      },
      {
        type: 'true_false',
        statementKey: 'pb-16.s2.statement',
        correct: true,
        explanationKey: 'pb-16.s2.explanation',
      },
    ],
  },
  {
    id: 'pb-17',
    titleKey: 'pb-17.title',
    orbsReward: 16,
    steps: [
      {
        type: 'info',
        titleKey: 'pb-17.s0.title',
        bodyKey: 'pb-17.s0.body',
      },
      {
        type: 'choice',
        questionKey: 'pb-17.s1.question',
        optionKeys: ['pb-17.s1.opt0', 'pb-17.s1.opt1'],
        correctIndex: 0,
        explanationKey: 'pb-17.s1.explanation',
      },
      {
        type: 'fill_blank',
        prefixKey: 'pb-17.s2.prefix',
        suffixKey: 'pb-17.s2.suffix',
        optionKeys: ['pb-17.s2.blank0', 'pb-17.s2.blank1'],
        correctIndex: 0,
        explanationKey: 'pb-17.s2.explanation',
      },
    ],
  },
  {
    id: 'pb-18',
    titleKey: 'pb-18.title',
    orbsReward: 16,
    steps: [
      {
        type: 'info',
        titleKey: 'pb-18.s0.title',
        bodyKey: 'pb-18.s0.body',
      },
      {
        type: 'choice',
        questionKey: 'pb-18.s1.question',
        optionKeys: ['pb-18.s1.opt0', 'pb-18.s1.opt1'],
        correctIndex: 1,
        explanationKey: 'pb-18.s1.explanation',
      },
      {
        type: 'fill_blank',
        prefixKey: 'pb-18.s2.prefix',
        suffixKey: 'pb-18.s2.suffix',
        optionKeys: ['pb-18.s2.blank0', 'pb-18.s2.blank1'],
        correctIndex: 0,
        explanationKey: 'pb-18.s2.explanation',
      },
    ],
  },
  {
    id: 'pb-19',
    titleKey: 'pb-19.title',
    orbsReward: 16,
    steps: [
      {
        type: 'info',
        titleKey: 'pb-19.s0.title',
        bodyKey: 'pb-19.s0.body',
      },
      {
        type: 'choice',
        questionKey: 'pb-19.s1.question',
        optionKeys: ['pb-19.s1.opt0', 'pb-19.s1.opt1'],
        correctIndex: 1,
        explanationKey: 'pb-19.s1.explanation',
      },
      {
        type: 'true_false',
        statementKey: 'pb-19.s2.statement',
        correct: false,
        explanationKey: 'pb-19.s2.explanation',
      },
    ],
  },
  {
    id: 'pb-20',
    titleKey: 'pb-20.title',
    orbsReward: 16,
    steps: [
      {
        type: 'info',
        titleKey: 'pb-20.s0.title',
        bodyKey: 'pb-20.s0.body',
      },
      {
        type: 'choice',
        questionKey: 'pb-20.s1.question',
        optionKeys: ['pb-20.s1.opt0', 'pb-20.s1.opt1'],
        correctIndex: 0,
        explanationKey: 'pb-20.s1.explanation',
      },
      {
        type: 'true_false',
        statementKey: 'pb-20.s2.statement',
        correct: false,
        explanationKey: 'pb-20.s2.explanation',
      },
    ],
  },
  {
    id: 'pb-21',
    titleKey: 'pb-21.title',
    orbsReward: 16,
    steps: [
      {
        type: 'info',
        titleKey: 'pb-21.s0.title',
        bodyKey: 'pb-21.s0.body',
      },
      {
        type: 'choice',
        questionKey: 'pb-21.s1.question',
        optionKeys: ['pb-21.s1.opt0', 'pb-21.s1.opt1'],
        correctIndex: 1,
        explanationKey: 'pb-21.s1.explanation',
      },
      {
        type: 'true_false',
        statementKey: 'pb-21.s2.statement',
        correct: true,
        explanationKey: 'pb-21.s2.explanation',
      },
    ],
  },
  {
    id: 'pb-22',
    titleKey: 'pb-22.title',
    orbsReward: 14,
    steps: [
      {
        type: 'info',
        titleKey: 'pb-22.s0.title',
        bodyKey: 'pb-22.s0.body',
      },
      {
        type: 'true_false',
        statementKey: 'pb-22.s1.statement',
        correct: false,
        explanationKey: 'pb-22.s1.explanation',
      },
      {
        type: 'choice',
        questionKey: 'pb-22.s2.question',
        optionKeys: ['pb-22.s2.opt0', 'pb-22.s2.opt1'],
        correctIndex: 0,
        explanationKey: 'pb-22.s2.explanation',
      },
    ],
  },
  {
    id: 'pb-23',
    titleKey: 'pb-23.title',
    orbsReward: 20,
    steps: [
      {
        type: 'info',
        titleKey: 'pb-23.s0.title',
        bodyKey: 'pb-23.s0.body',
      },
      {
        type: 'reorder',
        instructionKey: 'pb-23.s1.instruction',
        itemKeys: [
          'pb-23.s1.item0',
          'pb-23.s1.item1',
          'pb-23.s1.item2',
          'pb-23.s1.item3',
        ],
        correctOrder: [0, 1, 2, 3],
        explanationKey: 'pb-23.s1.explanation',
      },
      {
        type: 'true_false',
        statementKey: 'pb-23.s2.statement',
        correct: false,
        explanationKey: 'pb-23.s2.explanation',
      },
    ],
  },
  {
    id: 'sl-1',
    titleKey: 'sl-1.title',
    orbsReward: 15,
    steps: [
      {
        type: 'info',
        titleKey: 'sl-1.s0.title',
        bodyKey: 'sl-1.s0.body',
      },
      {
        type: 'choice',
        questionKey: 'sl-1.s1.question',
        optionKeys: ['sl-1.s1.opt0', 'sl-1.s1.opt1', 'sl-1.s1.opt2'],
        correctIndex: 1,
        explanationKey: 'sl-1.s1.explanation',
      },
    ],
  },
  {
    id: 'sl-2',
    titleKey: 'sl-2.title',
    orbsReward: 18,
    steps: [
      {
        type: 'info',
        titleKey: 'sl-2.s0.title',
        bodyKey: 'sl-2.s0.body',
      },
      {
        type: 'choice',
        questionKey: 'sl-2.s1.question',
        optionKeys: ['sl-2.s1.opt0', 'sl-2.s1.opt1', 'sl-2.s1.opt2'],
        correctIndex: 1,
        explanationKey: 'sl-2.s1.explanation',
      },
      {
        type: 'choice',
        questionKey: 'sl-2.s2.question',
        optionKeys: ['sl-2.s2.opt0', 'sl-2.s2.opt1', 'sl-2.s2.opt2'],
        correctIndex: 1,
        explanationKey: 'sl-2.s2.explanation',
      },
    ],
  },
  {
    id: 'sl-3',
    titleKey: 'sl-3.title',
    orbsReward: 20,
    steps: [
      {
        type: 'info',
        titleKey: 'sl-3.s0.title',
        bodyKey: 'sl-3.s0.body',
      },
      {
        type: 'true_false',
        statementKey: 'sl-3.s1.statement',
        correct: true,
        explanationKey: 'sl-3.s1.explanation',
      },
      {
        type: 'choice',
        questionKey: 'sl-3.s2.question',
        optionKeys: ['sl-3.s2.opt0', 'sl-3.s2.opt1', 'sl-3.s2.opt2'],
        correctIndex: 1,
        explanationKey: 'sl-3.s2.explanation',
      },
    ],
  },
  {
    id: 'sl-4',
    titleKey: 'sl-4.title',
    orbsReward: 20,
    steps: [
      {
        type: 'info',
        titleKey: 'sl-4.s0.title',
        bodyKey: 'sl-4.s0.body',
      },
      {
        type: 'choice',
        questionKey: 'sl-4.s1.question',
        optionKeys: ['sl-4.s1.opt0', 'sl-4.s1.opt1', 'sl-4.s1.opt2'],
        correctIndex: 0,
        explanationKey: 'sl-4.s1.explanation',
      },
      {
        type: 'choice',
        questionKey: 'sl-4.s2.question',
        optionKeys: ['sl-4.s2.opt0', 'sl-4.s2.opt1', 'sl-4.s2.opt2'],
        correctIndex: 1,
        explanationKey: 'sl-4.s2.explanation',
      },
    ],
  },
  {
    id: 'sl-5',
    titleKey: 'sl-5.title',
    orbsReward: 22,
    steps: [
      {
        type: 'info',
        titleKey: 'sl-5.s0.title',
        bodyKey: 'sl-5.s0.body',
      },
      {
        type: 'choice',
        questionKey: 'sl-5.s1.question',
        optionKeys: ['sl-5.s1.opt0', 'sl-5.s1.opt1', 'sl-5.s1.opt2'],
        correctIndex: 1,
        explanationKey: 'sl-5.s1.explanation',
      },
      {
        type: 'choice',
        questionKey: 'sl-5.s2.question',
        optionKeys: ['sl-5.s2.opt0', 'sl-5.s2.opt1', 'sl-5.s2.opt2'],
        correctIndex: 0,
        explanationKey: 'sl-5.s2.explanation',
      },
    ],
  },
  {
    id: 'sl-6',
    titleKey: 'sl-6.title',
    orbsReward: 30,
    steps: [
      {
        type: 'info',
        titleKey: 'sl-6.s0.title',
        bodyKey: 'sl-6.s0.body',
      },
      {
        type: 'choice',
        questionKey: 'sl-6.s1.question',
        optionKeys: ['sl-6.s1.opt0', 'sl-6.s1.opt1', 'sl-6.s1.opt2'],
        correctIndex: 1,
        explanationKey: 'sl-6.s1.explanation',
      },
      {
        type: 'choice',
        questionKey: 'sl-6.s2.question',
        optionKeys: ['sl-6.s2.opt0', 'sl-6.s2.opt1', 'sl-6.s2.opt2'],
        correctIndex: 1,
        explanationKey: 'sl-6.s2.explanation',
      },
    ],
  },
  {
    id: 'cm-1',
    titleKey: 'cm-1.title',
    orbsReward: 18,
    steps: [
      {
        type: 'info',
        titleKey: 'cm-1.s0.title',
        bodyKey: 'cm-1.s0.body',
      },
      {
        type: 'choice',
        questionKey: 'cm-1.s1.question',
        optionKeys: ['cm-1.s1.opt0', 'cm-1.s1.opt1', 'cm-1.s1.opt2'],
        correctIndex: 1,
        explanationKey: 'cm-1.s1.explanation',
      },
      {
        type: 'choice',
        questionKey: 'cm-1.s2.question',
        optionKeys: ['cm-1.s2.opt0', 'cm-1.s2.opt1', 'cm-1.s2.opt2'],
        correctIndex: 1,
        explanationKey: 'cm-1.s2.explanation',
      },
    ],
  },
  {
    id: 'cm-2',
    titleKey: 'cm-2.title',
    orbsReward: 18,
    steps: [
      {
        type: 'info',
        titleKey: 'cm-2.s0.title',
        bodyKey: 'cm-2.s0.body',
      },
      {
        type: 'choice',
        questionKey: 'cm-2.s1.question',
        optionKeys: ['cm-2.s1.opt0', 'cm-2.s1.opt1', 'cm-2.s1.opt2'],
        correctIndex: 1,
        explanationKey: 'cm-2.s1.explanation',
      },
      {
        type: 'choice',
        questionKey: 'cm-2.s2.question',
        optionKeys: ['cm-2.s2.opt0', 'cm-2.s2.opt1', 'cm-2.s2.opt2'],
        correctIndex: 1,
        explanationKey: 'cm-2.s2.explanation',
      },
    ],
  },
  {
    id: 'cm-3',
    titleKey: 'cm-3.title',
    orbsReward: 20,
    steps: [
      {
        type: 'info',
        titleKey: 'cm-3.s0.title',
        bodyKey: 'cm-3.s0.body',
      },
      {
        type: 'choice',
        questionKey: 'cm-3.s1.question',
        optionKeys: ['cm-3.s1.opt0', 'cm-3.s1.opt1', 'cm-3.s1.opt2'],
        correctIndex: 1,
        explanationKey: 'cm-3.s1.explanation',
      },
      {
        type: 'choice',
        questionKey: 'cm-3.s2.question',
        optionKeys: ['cm-3.s2.opt0', 'cm-3.s2.opt1', 'cm-3.s2.opt2'],
        correctIndex: 1,
        explanationKey: 'cm-3.s2.explanation',
      },
    ],
  },
  {
    id: 'cm-4',
    titleKey: 'cm-4.title',
    orbsReward: 18,
    steps: [
      {
        type: 'info',
        titleKey: 'cm-4.s0.title',
        bodyKey: 'cm-4.s0.body',
      },
      {
        type: 'reorder',
        instructionKey: 'cm-4.s1.instruction',
        itemKeys: [
          'cm-4.s1.item0',
          'cm-4.s1.item1',
          'cm-4.s1.item2',
          'cm-4.s1.item3',
        ],
        correctOrder: [0, 1, 2, 3],
        explanationKey: 'cm-4.s1.explanation',
      },
      {
        type: 'choice',
        questionKey: 'cm-4.s2.question',
        optionKeys: ['cm-4.s2.opt0', 'cm-4.s2.opt1', 'cm-4.s2.opt2'],
        correctIndex: 1,
        explanationKey: 'cm-4.s2.explanation',
      },
    ],
  },
  {
    id: 'cm-5',
    titleKey: 'cm-5.title',
    orbsReward: 20,
    steps: [
      {
        type: 'info',
        titleKey: 'cm-5.s0.title',
        bodyKey: 'cm-5.s0.body',
      },
      {
        type: 'choice',
        questionKey: 'cm-5.s1.question',
        optionKeys: ['cm-5.s1.opt0', 'cm-5.s1.opt1', 'cm-5.s1.opt2'],
        correctIndex: 0,
        explanationKey: 'cm-5.s1.explanation',
      },
      {
        type: 'choice',
        questionKey: 'cm-5.s2.question',
        optionKeys: ['cm-5.s2.opt0', 'cm-5.s2.opt1', 'cm-5.s2.opt2'],
        correctIndex: 1,
        explanationKey: 'cm-5.s2.explanation',
      },
    ],
  },
  {
    id: 'cm-6',
    titleKey: 'cm-6.title',
    orbsReward: 20,
    steps: [
      {
        type: 'info',
        titleKey: 'cm-6.s0.title',
        bodyKey: 'cm-6.s0.body',
      },
      {
        type: 'choice',
        questionKey: 'cm-6.s1.question',
        optionKeys: ['cm-6.s1.opt0', 'cm-6.s1.opt1', 'cm-6.s1.opt2'],
        correctIndex: 1,
        explanationKey: 'cm-6.s1.explanation',
      },
      {
        type: 'choice',
        questionKey: 'cm-6.s2.question',
        optionKeys: ['cm-6.s2.opt0', 'cm-6.s2.opt1', 'cm-6.s2.opt2'],
        correctIndex: 1,
        explanationKey: 'cm-6.s2.explanation',
      },
    ],
  },
  {
    id: 'cm-7',
    titleKey: 'cm-7.title',
    orbsReward: 30,
    steps: [
      {
        type: 'info',
        titleKey: 'cm-7.s0.title',
        bodyKey: 'cm-7.s0.body',
      },
      {
        type: 'choice',
        questionKey: 'cm-7.s1.question',
        optionKeys: ['cm-7.s1.opt0', 'cm-7.s1.opt1', 'cm-7.s1.opt2'],
        correctIndex: 1,
        explanationKey: 'cm-7.s1.explanation',
      },
      {
        type: 'choice',
        questionKey: 'cm-7.s2.question',
        optionKeys: ['cm-7.s2.opt0', 'cm-7.s2.opt1', 'cm-7.s2.opt2'],
        correctIndex: 0,
        explanationKey: 'cm-7.s2.explanation',
      },
    ],
  },
  {
    id: 'il-1',
    titleKey: 'il-1.title',
    orbsReward: 18,
    steps: [
      {
        type: 'info',
        titleKey: 'il-1.s0.title',
        bodyKey: 'il-1.s0.body',
      },
      {
        type: 'choice',
        questionKey: 'il-1.s1.question',
        optionKeys: ['il-1.s1.opt0', 'il-1.s1.opt1', 'il-1.s1.opt2'],
        correctIndex: 1,
        explanationKey: 'il-1.s1.explanation',
      },
      {
        type: 'choice',
        questionKey: 'il-1.s2.question',
        optionKeys: ['il-1.s2.opt0', 'il-1.s2.opt1', 'il-1.s2.opt2'],
        correctIndex: 0,
        explanationKey: 'il-1.s2.explanation',
      },
    ],
  },
  {
    id: 'il-2',
    titleKey: 'il-2.title',
    orbsReward: 20,
    steps: [
      {
        type: 'info',
        titleKey: 'il-2.s0.title',
        bodyKey: 'il-2.s0.body',
      },
      {
        type: 'choice',
        questionKey: 'il-2.s1.question',
        optionKeys: ['il-2.s1.opt0', 'il-2.s1.opt1', 'il-2.s1.opt2'],
        correctIndex: 1,
        explanationKey: 'il-2.s1.explanation',
      },
      {
        type: 'choice',
        questionKey: 'il-2.s2.question',
        optionKeys: ['il-2.s2.opt0', 'il-2.s2.opt1', 'il-2.s2.opt2'],
        correctIndex: 0,
        explanationKey: 'il-2.s2.explanation',
      },
    ],
  },
  {
    id: 'il-3',
    titleKey: 'il-3.title',
    orbsReward: 20,
    steps: [
      {
        type: 'info',
        titleKey: 'il-3.s0.title',
        bodyKey: 'il-3.s0.body',
      },
      {
        type: 'choice',
        questionKey: 'il-3.s1.question',
        optionKeys: ['il-3.s1.opt0', 'il-3.s1.opt1', 'il-3.s1.opt2'],
        correctIndex: 1,
        explanationKey: 'il-3.s1.explanation',
      },
      {
        type: 'choice',
        questionKey: 'il-3.s2.question',
        optionKeys: ['il-3.s2.opt0', 'il-3.s2.opt1', 'il-3.s2.opt2'],
        correctIndex: 0,
        explanationKey: 'il-3.s2.explanation',
      },
    ],
  },
  {
    id: 'il-4',
    titleKey: 'il-4.title',
    orbsReward: 22,
    steps: [
      {
        type: 'info',
        titleKey: 'il-4.s0.title',
        bodyKey: 'il-4.s0.body',
      },
      {
        type: 'choice',
        questionKey: 'il-4.s1.question',
        optionKeys: ['il-4.s1.opt0', 'il-4.s1.opt1', 'il-4.s1.opt2'],
        correctIndex: 0,
        explanationKey: 'il-4.s1.explanation',
      },
      {
        type: 'choice',
        questionKey: 'il-4.s2.question',
        optionKeys: ['il-4.s2.opt0', 'il-4.s2.opt1', 'il-4.s2.opt2'],
        correctIndex: 1,
        explanationKey: 'il-4.s2.explanation',
      },
    ],
  },
  {
    id: 'il-5',
    titleKey: 'il-5.title',
    orbsReward: 30,
    steps: [
      {
        type: 'info',
        titleKey: 'il-5.s0.title',
        bodyKey: 'il-5.s0.body',
      },
      {
        type: 'choice',
        questionKey: 'il-5.s1.question',
        optionKeys: ['il-5.s1.opt0', 'il-5.s1.opt1', 'il-5.s1.opt2'],
        correctIndex: 1,
        explanationKey: 'il-5.s1.explanation',
      },
      {
        type: 'choice',
        questionKey: 'il-5.s2.question',
        optionKeys: ['il-5.s2.opt0', 'il-5.s2.opt1', 'il-5.s2.opt2'],
        correctIndex: 0,
        explanationKey: 'il-5.s2.explanation',
      },
    ],
  },
  {
    id: 'es-1',
    titleKey: 'es-1.title',
    orbsReward: 18,
    steps: [
      {
        type: 'info',
        titleKey: 'es-1.s0.title',
        bodyKey: 'es-1.s0.body',
      },
      {
        type: 'choice',
        questionKey: 'es-1.s1.question',
        optionKeys: ['es-1.s1.opt0', 'es-1.s1.opt1', 'es-1.s1.opt2'],
        correctIndex: 1,
        explanationKey: 'es-1.s1.explanation',
      },
      {
        type: 'choice',
        questionKey: 'es-1.s2.question',
        optionKeys: ['es-1.s2.opt0', 'es-1.s2.opt1', 'es-1.s2.opt2'],
        correctIndex: 0,
        explanationKey: 'es-1.s2.explanation',
      },
    ],
  },
  {
    id: 'es-2',
    titleKey: 'es-2.title',
    orbsReward: 20,
    steps: [
      {
        type: 'info',
        titleKey: 'es-2.s0.title',
        bodyKey: 'es-2.s0.body',
      },
      {
        type: 'choice',
        questionKey: 'es-2.s1.question',
        optionKeys: ['es-2.s1.opt0', 'es-2.s1.opt1', 'es-2.s1.opt2'],
        correctIndex: 1,
        explanationKey: 'es-2.s1.explanation',
      },
      {
        type: 'choice',
        questionKey: 'es-2.s2.question',
        optionKeys: ['es-2.s2.opt0', 'es-2.s2.opt1', 'es-2.s2.opt2'],
        correctIndex: 0,
        explanationKey: 'es-2.s2.explanation',
      },
    ],
  },
  {
    id: 'es-3',
    titleKey: 'es-3.title',
    orbsReward: 20,
    steps: [
      {
        type: 'info',
        titleKey: 'es-3.s0.title',
        bodyKey: 'es-3.s0.body',
      },
      {
        type: 'choice',
        questionKey: 'es-3.s1.question',
        optionKeys: ['es-3.s1.opt0', 'es-3.s1.opt1', 'es-3.s1.opt2'],
        correctIndex: 1,
        explanationKey: 'es-3.s1.explanation',
      },
      {
        type: 'choice',
        questionKey: 'es-3.s2.question',
        optionKeys: ['es-3.s2.opt0', 'es-3.s2.opt1', 'es-3.s2.opt2'],
        correctIndex: 0,
        explanationKey: 'es-3.s2.explanation',
      },
    ],
  },
  {
    id: 'es-4',
    titleKey: 'es-4.title',
    orbsReward: 22,
    steps: [
      {
        type: 'info',
        titleKey: 'es-4.s0.title',
        bodyKey: 'es-4.s0.body',
      },
      {
        type: 'choice',
        questionKey: 'es-4.s1.question',
        optionKeys: ['es-4.s1.opt0', 'es-4.s1.opt1', 'es-4.s1.opt2'],
        correctIndex: 0,
        explanationKey: 'es-4.s1.explanation',
      },
      {
        type: 'choice',
        questionKey: 'es-4.s2.question',
        optionKeys: ['es-4.s2.opt0', 'es-4.s2.opt1', 'es-4.s2.opt2'],
        correctIndex: 0,
        explanationKey: 'es-4.s2.explanation',
      },
    ],
  },
  {
    id: 'es-5',
    titleKey: 'es-5.title',
    orbsReward: 22,
    steps: [
      {
        type: 'info',
        titleKey: 'es-5.s0.title',
        bodyKey: 'es-5.s0.body',
      },
      {
        type: 'choice',
        questionKey: 'es-5.s1.question',
        optionKeys: ['es-5.s1.opt0', 'es-5.s1.opt1', 'es-5.s1.opt2'],
        correctIndex: 1,
        explanationKey: 'es-5.s1.explanation',
      },
      {
        type: 'choice',
        questionKey: 'es-5.s2.question',
        optionKeys: ['es-5.s2.opt0', 'es-5.s2.opt1', 'es-5.s2.opt2'],
        correctIndex: 0,
        explanationKey: 'es-5.s2.explanation',
      },
    ],
  },
  {
    id: 'es-6',
    titleKey: 'es-6.title',
    orbsReward: 30,
    steps: [
      {
        type: 'info',
        titleKey: 'es-6.s0.title',
        bodyKey: 'es-6.s0.body',
      },
      {
        type: 'choice',
        questionKey: 'es-6.s1.question',
        optionKeys: ['es-6.s1.opt0', 'es-6.s1.opt1', 'es-6.s1.opt2'],
        correctIndex: 1,
        explanationKey: 'es-6.s1.explanation',
      },
      {
        type: 'choice',
        questionKey: 'es-6.s2.question',
        optionKeys: ['es-6.s2.opt0', 'es-6.s2.opt1', 'es-6.s2.opt2'],
        correctIndex: 0,
        explanationKey: 'es-6.s2.explanation',
      },
    ],
  },
];

export function getMockLessonCatalog(id: string): MockLessonCatalog | undefined {
  return MOCK_LESSONS_CATALOG.find((lesson) => lesson.id === id);
}

export function getAllMockLessonCatalogIds(): string[] {
  return MOCK_LESSONS_CATALOG.map((lesson) => lesson.id);
}
