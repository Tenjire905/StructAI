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
    id: 'pb-24',
    titleKey: 'pb-24.title',
    orbsReward: 15,
    steps: [
      {
        type: 'info',
        titleKey: 'pb-24.s0.title',
        bodyKey: 'pb-24.s0.body',
      },
      {
        type: 'choice',
        questionKey: 'pb-24.s1.question',
        optionKeys: ['pb-24.s1.opt0', 'pb-24.s1.opt1'],
        correctIndex: 1,
        explanationKey: 'pb-24.s1.explanation',
      },
      {
        type: 'true_false',
        statementKey: 'pb-24.s2.statement',
        correct: false,
        explanationKey: 'pb-24.s2.explanation',
      },
    ],
  },
  {
    id: 'pb-25',
    titleKey: 'pb-25.title',
    orbsReward: 15,
    steps: [
      {
        type: 'info',
        titleKey: 'pb-25.s0.title',
        bodyKey: 'pb-25.s0.body',
      },
      {
        type: 'fill_blank',
        prefixKey: 'pb-25.s1.prefix',
        suffixKey: 'pb-25.s1.suffix',
        optionKeys: ['pb-25.s1.blank0', 'pb-25.s1.blank1'],
        correctIndex: 0,
        explanationKey: 'pb-25.s1.explanation',
      },
      {
        type: 'true_false',
        statementKey: 'pb-25.s2.statement',
        correct: false,
        explanationKey: 'pb-25.s2.explanation',
      },
    ],
  },
  {
    id: 'pb-26',
    titleKey: 'pb-26.title',
    orbsReward: 14,
    steps: [
      {
        type: 'info',
        titleKey: 'pb-26.s0.title',
        bodyKey: 'pb-26.s0.body',
      },
      {
        type: 'choice',
        questionKey: 'pb-26.s1.question',
        optionKeys: ['pb-26.s1.opt0', 'pb-26.s1.opt1'],
        correctIndex: 1,
        explanationKey: 'pb-26.s1.explanation',
      },
      {
        type: 'true_false',
        statementKey: 'pb-26.s2.statement',
        correct: false,
        explanationKey: 'pb-26.s2.explanation',
      },
    ],
  },
  {
    id: 'pb-27',
    titleKey: 'pb-27.title',
    orbsReward: 16,
    steps: [
      {
        type: 'info',
        titleKey: 'pb-27.s0.title',
        bodyKey: 'pb-27.s0.body',
      },
      {
        type: 'true_false',
        statementKey: 'pb-27.s1.statement',
        correct: false,
        explanationKey: 'pb-27.s1.explanation',
      },
      {
        type: 'choice',
        questionKey: 'pb-27.s2.question',
        optionKeys: ['pb-27.s2.opt0', 'pb-27.s2.opt1'],
        correctIndex: 1,
        explanationKey: 'pb-27.s2.explanation',
      },
    ],
  },
  {
    id: 'pb-28',
    titleKey: 'pb-28.title',
    orbsReward: 15,
    steps: [
      {
        type: 'info',
        titleKey: 'pb-28.s0.title',
        bodyKey: 'pb-28.s0.body',
      },
      {
        type: 'fill_blank',
        prefixKey: 'pb-28.s1.prefix',
        suffixKey: 'pb-28.s1.suffix',
        optionKeys: ['pb-28.s1.blank0', 'pb-28.s1.blank1'],
        correctIndex: 0,
        explanationKey: 'pb-28.s1.explanation',
      },
      {
        type: 'true_false',
        statementKey: 'pb-28.s2.statement',
        correct: false,
        explanationKey: 'pb-28.s2.explanation',
      },
    ],
  },
  {
    id: 'pb-29',
    titleKey: 'pb-29.title',
    orbsReward: 14,
    steps: [
      {
        type: 'info',
        titleKey: 'pb-29.s0.title',
        bodyKey: 'pb-29.s0.body',
      },
      {
        type: 'choice',
        questionKey: 'pb-29.s1.question',
        optionKeys: ['pb-29.s1.opt0', 'pb-29.s1.opt1'],
        correctIndex: 0,
        explanationKey: 'pb-29.s1.explanation',
      },
      {
        type: 'true_false',
        statementKey: 'pb-29.s2.statement',
        correct: false,
        explanationKey: 'pb-29.s2.explanation',
      },
    ],
  },
  {
    id: 'pb-30',
    titleKey: 'pb-30.title',
    orbsReward: 16,
    steps: [
      {
        type: 'info',
        titleKey: 'pb-30.s0.title',
        bodyKey: 'pb-30.s0.body',
      },
      {
        type: 'choice',
        questionKey: 'pb-30.s1.question',
        optionKeys: ['pb-30.s1.opt0', 'pb-30.s1.opt1'],
        correctIndex: 1,
        explanationKey: 'pb-30.s1.explanation',
      },
      {
        type: 'true_false',
        statementKey: 'pb-30.s2.statement',
        correct: false,
        explanationKey: 'pb-30.s2.explanation',
      },
    ],
  },
  {
    id: 'pb-31',
    titleKey: 'pb-31.title',
    orbsReward: 15,
    steps: [
      {
        type: 'info',
        titleKey: 'pb-31.s0.title',
        bodyKey: 'pb-31.s0.body',
      },
      {
        type: 'choice',
        questionKey: 'pb-31.s1.question',
        optionKeys: ['pb-31.s1.opt0', 'pb-31.s1.opt1'],
        correctIndex: 1,
        explanationKey: 'pb-31.s1.explanation',
      },
      {
        type: 'true_false',
        statementKey: 'pb-31.s2.statement',
        correct: false,
        explanationKey: 'pb-31.s2.explanation',
      },
    ],
  },
  {
    id: 'pb-32',
    titleKey: 'pb-32.title',
    orbsReward: 18,
    steps: [
      {
        type: 'info',
        titleKey: 'pb-32.s0.title',
        bodyKey: 'pb-32.s0.body',
      },
      {
        type: 'choice',
        questionKey: 'pb-32.s1.question',
        optionKeys: ['pb-32.s1.opt0', 'pb-32.s1.opt1'],
        correctIndex: 0,
        explanationKey: 'pb-32.s1.explanation',
      },
      {
        type: 'true_false',
        statementKey: 'pb-32.s2.statement',
        correct: false,
        explanationKey: 'pb-32.s2.explanation',
      },
    ],
  },
  {
    id: 'pb-33',
    titleKey: 'pb-33.title',
    orbsReward: 20,
    steps: [
      {
        type: 'info',
        titleKey: 'pb-33.s0.title',
        bodyKey: 'pb-33.s0.body',
      },
      {
        type: 'choice',
        questionKey: 'pb-33.s1.question',
        optionKeys: ['pb-33.s1.opt0', 'pb-33.s1.opt1'],
        correctIndex: 1,
        explanationKey: 'pb-33.s1.explanation',
      },
      {
        type: 'reorder',
        instructionKey: 'pb-33.s2.instruction',
        itemKeys: [
          'pb-33.s2.item0',
          'pb-33.s2.item1',
          'pb-33.s2.item2',
          'pb-33.s2.item3',
        ],
        correctOrder: [0, 1, 2, 3],
        explanationKey: 'pb-33.s2.explanation',
      },
    ],
  },
  {
    id: 'pb-34',
    titleKey: 'pb-34.title',
    orbsReward: 15,
    steps: [
      {
        type: 'info',
        titleKey: 'pb-34.s0.title',
        bodyKey: 'pb-34.s0.body',
      },
      {
        type: 'true_false',
        statementKey: 'pb-34.s1.statement',
        correct: true,
        explanationKey: 'pb-34.s1.explanation',
      },
    ],
  },
  {
    id: 'pb-35',
    titleKey: 'pb-35.title',
    orbsReward: 15,
    steps: [
      {
        type: 'info',
        titleKey: 'pb-35.s0.title',
        bodyKey: 'pb-35.s0.body',
      },
      {
        type: 'choice',
        questionKey: 'pb-35.s1.question',
        optionKeys: ['pb-35.s1.opt0', 'pb-35.s1.opt1'],
        correctIndex: 1,
        explanationKey: 'pb-35.s1.explanation',
      },
    ],
  },
  {
    id: 'pb-36',
    titleKey: 'pb-36.title',
    orbsReward: 16,
    steps: [
      {
        type: 'info',
        titleKey: 'pb-36.s0.title',
        bodyKey: 'pb-36.s0.body',
      },
      {
        type: 'fill_blank',
        prefixKey: 'pb-36.s1.prefix',
        suffixKey: 'pb-36.s1.suffix',
        optionKeys: ['pb-36.s1.blank0', 'pb-36.s1.blank1'],
        correctIndex: 0,
        explanationKey: 'pb-36.s1.explanation',
      },
    ],
  },
  {
    id: 'pb-37',
    titleKey: 'pb-37.title',
    orbsReward: 15,
    steps: [
      {
        type: 'info',
        titleKey: 'pb-37.s0.title',
        bodyKey: 'pb-37.s0.body',
      },
      {
        type: 'true_false',
        statementKey: 'pb-37.s1.statement',
        correct: false,
        explanationKey: 'pb-37.s1.explanation',
      },
    ],
  },
  {
    id: 'pb-38',
    titleKey: 'pb-38.title',
    orbsReward: 16,
    steps: [
      {
        type: 'info',
        titleKey: 'pb-38.s0.title',
        bodyKey: 'pb-38.s0.body',
      },
      {
        type: 'choice',
        questionKey: 'pb-38.s1.question',
        optionKeys: ['pb-38.s1.opt0', 'pb-38.s1.opt1'],
        correctIndex: 0,
        explanationKey: 'pb-38.s1.explanation',
      },
    ],
  },
  {
    id: 'pb-39',
    titleKey: 'pb-39.title',
    orbsReward: 17,
    steps: [
      {
        type: 'info',
        titleKey: 'pb-39.s0.title',
        bodyKey: 'pb-39.s0.body',
      },
      {
        type: 'choice',
        questionKey: 'pb-39.s1.question',
        optionKeys: ['pb-39.s1.opt0', 'pb-39.s1.opt1'],
        correctIndex: 1,
        explanationKey: 'pb-39.s1.explanation',
      },
    ],
  },
  {
    id: 'pb-40',
    titleKey: 'pb-40.title',
    orbsReward: 16,
    steps: [
      {
        type: 'info',
        titleKey: 'pb-40.s0.title',
        bodyKey: 'pb-40.s0.body',
      },
      {
        type: 'fill_blank',
        prefixKey: 'pb-40.s1.prefix',
        suffixKey: 'pb-40.s1.suffix',
        optionKeys: ['pb-40.s1.blank0', 'pb-40.s1.blank1'],
        correctIndex: 0,
        explanationKey: 'pb-40.s1.explanation',
      },
    ],
  },
  {
    id: 'pb-41',
    titleKey: 'pb-41.title',
    orbsReward: 17,
    steps: [
      {
        type: 'info',
        titleKey: 'pb-41.s0.title',
        bodyKey: 'pb-41.s0.body',
      },
      {
        type: 'true_false',
        statementKey: 'pb-41.s1.statement',
        correct: false,
        explanationKey: 'pb-41.s1.explanation',
      },
    ],
  },
  {
    id: 'pb-42',
    titleKey: 'pb-42.title',
    orbsReward: 16,
    steps: [
      {
        type: 'info',
        titleKey: 'pb-42.s0.title',
        bodyKey: 'pb-42.s0.body',
      },
      {
        type: 'choice',
        questionKey: 'pb-42.s1.question',
        optionKeys: ['pb-42.s1.opt0', 'pb-42.s1.opt1'],
        correctIndex: 1,
        explanationKey: 'pb-42.s1.explanation',
      },
    ],
  },
  {
    id: 'pb-43',
    titleKey: 'pb-43.title',
    orbsReward: 16,
    steps: [
      {
        type: 'info',
        titleKey: 'pb-43.s0.title',
        bodyKey: 'pb-43.s0.body',
      },
      {
        type: 'true_false',
        statementKey: 'pb-43.s1.statement',
        correct: false,
        explanationKey: 'pb-43.s1.explanation',
      },
    ],
  },
  {
    id: 'pb-44',
    titleKey: 'pb-44.title',
    orbsReward: 20,
    steps: [
      {
        type: 'choice',
        questionKey: 'pb-44.s0.question',
        optionKeys: ['pb-44.s0.opt0', 'pb-44.s0.opt1'],
        correctIndex: 0,
        explanationKey: 'pb-44.s0.explanation',
      },
      {
        type: 'reorder',
        instructionKey: 'pb-44.s1.instruction',
        itemKeys: [
          'pb-44.s1.item0',
          'pb-44.s1.item1',
          'pb-44.s1.item2',
          'pb-44.s1.item3',
        ],
        correctOrder: [0, 1, 2, 3],
        explanationKey: 'pb-44.s1.explanation',
      },
    ],
  },
  {
    id: 'pb-45',
    titleKey: 'pb-45.title',
    orbsReward: 30,
    steps: [
      {
        type: 'info',
        titleKey: 'pb-45.s0.title',
        bodyKey: 'pb-45.s0.body',
      },
      {
        type: 'choice',
        questionKey: 'pb-45.s1.question',
        optionKeys: ['pb-45.s1.opt0', 'pb-45.s1.opt1'],
        correctIndex: 1,
        explanationKey: 'pb-45.s1.explanation',
      },
      {
        type: 'fill_blank',
        prefixKey: 'pb-45.s2.prefix',
        suffixKey: 'pb-45.s2.suffix',
        optionKeys: ['pb-45.s2.blank0', 'pb-45.s2.blank1'],
        correctIndex: 0,
        explanationKey: 'pb-45.s2.explanation',
      },
      {
        type: 'true_false',
        statementKey: 'pb-45.s3.statement',
        correct: false,
        explanationKey: 'pb-45.s3.explanation',
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
    id: 'sl-7',
    titleKey: 'sl-7.title',
    orbsReward: 16,
    steps: [
      {
        type: 'info',
        titleKey: 'sl-7.s0.title',
        bodyKey: 'sl-7.s0.body',
      },
      {
        type: 'choice',
        questionKey: 'sl-7.s1.question',
        optionKeys: ['sl-7.s1.opt0', 'sl-7.s1.opt1'],
        correctIndex: 0,
        explanationKey: 'sl-7.s1.explanation',
      },
      {
        type: 'true_false',
        statementKey: 'sl-7.s2.statement',
        correct: false,
        explanationKey: 'sl-7.s2.explanation',
      },
    ],
  },
  {
    id: 'sl-8',
    titleKey: 'sl-8.title',
    orbsReward: 18,
    steps: [
      {
        type: 'info',
        titleKey: 'sl-8.s0.title',
        bodyKey: 'sl-8.s0.body',
      },
      {
        type: 'choice',
        questionKey: 'sl-8.s1.question',
        optionKeys: ['sl-8.s1.opt0', 'sl-8.s1.opt1'],
        correctIndex: 0,
        explanationKey: 'sl-8.s1.explanation',
      },
      {
        type: 'reorder',
        instructionKey: 'sl-8.s2.instruction',
        itemKeys: [
          'sl-8.s2.item0',
          'sl-8.s2.item1',
          'sl-8.s2.item2',
          'sl-8.s2.item3',
        ],
        correctOrder: [0, 1, 2, 3],
        explanationKey: 'sl-8.s2.explanation',
      },
    ],
  },
  {
    id: 'sl-9',
    titleKey: 'sl-9.title',
    orbsReward: 17,
    steps: [
      {
        type: 'info',
        titleKey: 'sl-9.s0.title',
        bodyKey: 'sl-9.s0.body',
      },
      {
        type: 'choice',
        questionKey: 'sl-9.s1.question',
        optionKeys: ['sl-9.s1.opt0', 'sl-9.s1.opt1'],
        correctIndex: 1,
        explanationKey: 'sl-9.s1.explanation',
      },
      {
        type: 'true_false',
        statementKey: 'sl-9.s2.statement',
        correct: false,
        explanationKey: 'sl-9.s2.explanation',
      },
    ],
  },
  {
    id: 'sl-10',
    titleKey: 'sl-10.title',
    orbsReward: 18,
    steps: [
      {
        type: 'info',
        titleKey: 'sl-10.s0.title',
        bodyKey: 'sl-10.s0.body',
      },
      {
        type: 'choice',
        questionKey: 'sl-10.s1.question',
        optionKeys: ['sl-10.s1.opt0', 'sl-10.s1.opt1'],
        correctIndex: 1,
        explanationKey: 'sl-10.s1.explanation',
      },
      {
        type: 'true_false',
        statementKey: 'sl-10.s2.statement',
        correct: false,
        explanationKey: 'sl-10.s2.explanation',
      },
    ],
  },
  {
    id: 'sl-11',
    titleKey: 'sl-11.title',
    orbsReward: 20,
    steps: [
      {
        type: 'info',
        titleKey: 'sl-11.s0.title',
        bodyKey: 'sl-11.s0.body',
      },
      {
        type: 'choice',
        questionKey: 'sl-11.s1.question',
        optionKeys: ['sl-11.s1.opt0', 'sl-11.s1.opt1'],
        correctIndex: 0,
        explanationKey: 'sl-11.s1.explanation',
      },
      {
        type: 'categorize',
        instructionKey: 'sl-11.s2.instruction',
        categoryLabelKeys: ['sl-11.s2.cat0', 'sl-11.s2.cat1'],
        items: [
          { itemKey: 'sl-11.s2.item0', correctCategoryIndex: 0 },
          { itemKey: 'sl-11.s2.item1', correctCategoryIndex: 0 },
          { itemKey: 'sl-11.s2.item2', correctCategoryIndex: 1 },
          { itemKey: 'sl-11.s2.item3', correctCategoryIndex: 1 },
        ],
        explanationKey: 'sl-11.s2.explanation',
      },
    ],
  },
  {
    id: 'sl-12',
    titleKey: 'sl-12.title',
    orbsReward: 17,
    steps: [
      {
        type: 'info',
        titleKey: 'sl-12.s0.title',
        bodyKey: 'sl-12.s0.body',
      },
      {
        type: 'choice',
        questionKey: 'sl-12.s1.question',
        optionKeys: ['sl-12.s1.opt0', 'sl-12.s1.opt1'],
        correctIndex: 0,
        explanationKey: 'sl-12.s1.explanation',
      },
      {
        type: 'true_false',
        statementKey: 'sl-12.s2.statement',
        correct: false,
        explanationKey: 'sl-12.s2.explanation',
      },
    ],
  },
  {
    id: 'sl-13',
    titleKey: 'sl-13.title',
    orbsReward: 17,
    steps: [
      {
        type: 'info',
        titleKey: 'sl-13.s0.title',
        bodyKey: 'sl-13.s0.body',
      },
      {
        type: 'choice',
        questionKey: 'sl-13.s1.question',
        optionKeys: ['sl-13.s1.opt0', 'sl-13.s1.opt1'],
        correctIndex: 0,
        explanationKey: 'sl-13.s1.explanation',
      },
      {
        type: 'reorder',
        instructionKey: 'sl-13.s2.instruction',
        itemKeys: [
          'sl-13.s2.item0',
          'sl-13.s2.item1',
          'sl-13.s2.item2',
          'sl-13.s2.item3',
        ],
        correctOrder: [0, 1, 2, 3],
        explanationKey: 'sl-13.s2.explanation',
      },
    ],
  },
  {
    id: 'sl-14',
    titleKey: 'sl-14.title',
    orbsReward: 16,
    steps: [
      {
        type: 'info',
        titleKey: 'sl-14.s0.title',
        bodyKey: 'sl-14.s0.body',
      },
      {
        type: 'true_false',
        statementKey: 'sl-14.s1.statement',
        correct: false,
        explanationKey: 'sl-14.s1.explanation',
      },
      {
        type: 'choice',
        questionKey: 'sl-14.s2.question',
        optionKeys: ['sl-14.s2.opt0', 'sl-14.s2.opt1'],
        correctIndex: 1,
        explanationKey: 'sl-14.s2.explanation',
      },
    ],
  },
  {
    id: 'sl-15',
    titleKey: 'sl-15.title',
    orbsReward: 16,
    steps: [
      {
        type: 'info',
        titleKey: 'sl-15.s0.title',
        bodyKey: 'sl-15.s0.body',
      },
      {
        type: 'fill_blank',
        prefixKey: 'sl-15.s1.prefix',
        suffixKey: 'sl-15.s1.suffix',
        optionKeys: ['sl-15.s1.blank0', 'sl-15.s1.blank1'],
        correctIndex: 0,
        explanationKey: 'sl-15.s1.explanation',
      },
    ],
  },
  {
    id: 'sl-16',
    titleKey: 'sl-16.title',
    orbsReward: 18,
    steps: [
      {
        type: 'info',
        titleKey: 'sl-16.s0.title',
        bodyKey: 'sl-16.s0.body',
      },
      {
        type: 'error_finding',
        instructionKey: 'sl-16.s1.instruction',
        textSegments: [
          { segmentKey: 'sl-16.s1.seg0', isError: false },
          { segmentKey: 'sl-16.s1.seg1', isError: false },
          { segmentKey: 'sl-16.s1.seg2', isError: true },
          { segmentKey: 'sl-16.s1.seg3', isError: false },
        ],
        explanationKey: 'sl-16.s1.explanation',
      },
    ],
  },
  {
    id: 'sl-17',
    titleKey: 'sl-17.title',
    orbsReward: 18,
    steps: [
      {
        type: 'info',
        titleKey: 'sl-17.s0.title',
        bodyKey: 'sl-17.s0.body',
      },
      {
        type: 'choice',
        questionKey: 'sl-17.s1.question',
        optionKeys: ['sl-17.s1.opt0', 'sl-17.s1.opt1'],
        correctIndex: 1,
        explanationKey: 'sl-17.s1.explanation',
      },
      {
        type: 'true_false',
        statementKey: 'sl-17.s2.statement',
        correct: false,
        explanationKey: 'sl-17.s2.explanation',
      },
    ],
  },
  {
    id: 'sl-18',
    titleKey: 'sl-18.title',
    orbsReward: 17,
    steps: [
      {
        type: 'info',
        titleKey: 'sl-18.s0.title',
        bodyKey: 'sl-18.s0.body',
      },
      {
        type: 'choice',
        questionKey: 'sl-18.s1.question',
        optionKeys: ['sl-18.s1.opt0', 'sl-18.s1.opt1'],
        correctIndex: 1,
        explanationKey: 'sl-18.s1.explanation',
      },
    ],
  },
  {
    id: 'sl-19',
    titleKey: 'sl-19.title',
    orbsReward: 18,
    steps: [
      {
        type: 'info',
        titleKey: 'sl-19.s0.title',
        bodyKey: 'sl-19.s0.body',
      },
      {
        type: 'matching',
        instructionKey: 'sl-19.s1.instruction',
        pairs: [
          { termKey: 'sl-19.s1.term0', definitionKey: 'sl-19.s1.def0' },
          { termKey: 'sl-19.s1.term1', definitionKey: 'sl-19.s1.def1' },
          { termKey: 'sl-19.s1.term2', definitionKey: 'sl-19.s1.def2' },
        ],
        explanationKey: 'sl-19.s1.explanation',
      },
    ],
  },
  {
    id: 'sl-20',
    titleKey: 'sl-20.title',
    orbsReward: 17,
    steps: [
      {
        type: 'info',
        titleKey: 'sl-20.s0.title',
        bodyKey: 'sl-20.s0.body',
      },
      {
        type: 'choice',
        questionKey: 'sl-20.s1.question',
        optionKeys: ['sl-20.s1.opt0', 'sl-20.s1.opt1'],
        correctIndex: 1,
        explanationKey: 'sl-20.s1.explanation',
      },
      {
        type: 'true_false',
        statementKey: 'sl-20.s2.statement',
        correct: false,
        explanationKey: 'sl-20.s2.explanation',
      },
    ],
  },
  {
    id: 'sl-21',
    titleKey: 'sl-21.title',
    orbsReward: 20,
    steps: [
      {
        type: 'info',
        titleKey: 'sl-21.s0.title',
        bodyKey: 'sl-21.s0.body',
      },
      {
        type: 'choice',
        questionKey: 'sl-21.s1.question',
        optionKeys: ['sl-21.s1.opt0', 'sl-21.s1.opt1'],
        correctIndex: 0,
        explanationKey: 'sl-21.s1.explanation',
      },
      {
        type: 'reorder',
        instructionKey: 'sl-21.s2.instruction',
        itemKeys: [
          'sl-21.s2.item0',
          'sl-21.s2.item1',
          'sl-21.s2.item2',
          'sl-21.s2.item3',
        ],
        correctOrder: [0, 1, 2, 3],
        explanationKey: 'sl-21.s2.explanation',
      },
    ],
  },
  {
    id: 'sl-22',
    titleKey: 'sl-22.title',
    orbsReward: 17,
    steps: [
      {
        type: 'info',
        titleKey: 'sl-22.s0.title',
        bodyKey: 'sl-22.s0.body',
      },
      {
        type: 'choice',
        questionKey: 'sl-22.s1.question',
        optionKeys: ['sl-22.s1.opt0', 'sl-22.s1.opt1'],
        correctIndex: 1,
        explanationKey: 'sl-22.s1.explanation',
      },
      {
        type: 'true_false',
        statementKey: 'sl-22.s2.statement',
        correct: false,
        explanationKey: 'sl-22.s2.explanation',
      },
    ],
  },
  {
    id: 'sl-23',
    titleKey: 'sl-23.title',
    orbsReward: 17,
    steps: [
      {
        type: 'info',
        titleKey: 'sl-23.s0.title',
        bodyKey: 'sl-23.s0.body',
      },
      {
        type: 'categorize',
        instructionKey: 'sl-23.s1.instruction',
        categoryLabelKeys: ['sl-23.s1.cat0', 'sl-23.s1.cat1'],
        items: [
          { itemKey: 'sl-23.s1.item0', correctCategoryIndex: 0 },
          { itemKey: 'sl-23.s1.item1', correctCategoryIndex: 1 },
        ],
        explanationKey: 'sl-23.s1.explanation',
      },
    ],
  },
  {
    id: 'sl-24',
    titleKey: 'sl-24.title',
    orbsReward: 18,
    steps: [
      {
        type: 'info',
        titleKey: 'sl-24.s0.title',
        bodyKey: 'sl-24.s0.body',
      },
      {
        type: 'true_false',
        statementKey: 'sl-24.s1.statement',
        correct: true,
        explanationKey: 'sl-24.s1.explanation',
      },
      {
        type: 'choice',
        questionKey: 'sl-24.s2.question',
        optionKeys: ['sl-24.s2.opt0', 'sl-24.s2.opt1'],
        correctIndex: 1,
        explanationKey: 'sl-24.s2.explanation',
      },
    ],
  },
  {
    id: 'sl-25',
    titleKey: 'sl-25.title',
    orbsReward: 19,
    steps: [
      {
        type: 'info',
        titleKey: 'sl-25.s0.title',
        bodyKey: 'sl-25.s0.body',
      },
      {
        type: 'choice',
        questionKey: 'sl-25.s1.question',
        optionKeys: ['sl-25.s1.opt0', 'sl-25.s1.opt1'],
        correctIndex: 0,
        explanationKey: 'sl-25.s1.explanation',
      },
      {
        type: 'true_false',
        statementKey: 'sl-25.s2.statement',
        correct: false,
        explanationKey: 'sl-25.s2.explanation',
      },
    ],
  },
  {
    id: 'sl-26',
    titleKey: 'sl-26.title',
    orbsReward: 16,
    steps: [
      {
        type: 'info',
        titleKey: 'sl-26.s0.title',
        bodyKey: 'sl-26.s0.body',
      },
      {
        type: 'choice',
        questionKey: 'sl-26.s1.question',
        optionKeys: ['sl-26.s1.opt0', 'sl-26.s1.opt1'],
        correctIndex: 0,
        explanationKey: 'sl-26.s1.explanation',
      },
    ],
  },
  {
    id: 'sl-27',
    titleKey: 'sl-27.title',
    orbsReward: 18,
    steps: [
      {
        type: 'info',
        titleKey: 'sl-27.s0.title',
        bodyKey: 'sl-27.s0.body',
      },
      {
        type: 'choice',
        questionKey: 'sl-27.s1.question',
        optionKeys: ['sl-27.s1.opt0', 'sl-27.s1.opt1'],
        correctIndex: 0,
        explanationKey: 'sl-27.s1.explanation',
      },
      {
        type: 'true_false',
        statementKey: 'sl-27.s2.statement',
        correct: false,
        explanationKey: 'sl-27.s2.explanation',
      },
    ],
  },
  {
    id: 'sl-28',
    titleKey: 'sl-28.title',
    orbsReward: 19,
    steps: [
      {
        type: 'info',
        titleKey: 'sl-28.s0.title',
        bodyKey: 'sl-28.s0.body',
      },
      {
        type: 'choice',
        questionKey: 'sl-28.s1.question',
        optionKeys: ['sl-28.s1.opt0', 'sl-28.s1.opt1'],
        correctIndex: 1,
        explanationKey: 'sl-28.s1.explanation',
      },
      {
        type: 'true_false',
        statementKey: 'sl-28.s2.statement',
        correct: false,
        explanationKey: 'sl-28.s2.explanation',
      },
    ],
  },
  {
    id: 'sl-29',
    titleKey: 'sl-29.title',
    orbsReward: 18,
    steps: [
      {
        type: 'info',
        titleKey: 'sl-29.s0.title',
        bodyKey: 'sl-29.s0.body',
      },
      {
        type: 'choice',
        questionKey: 'sl-29.s1.question',
        optionKeys: ['sl-29.s1.opt0', 'sl-29.s1.opt1'],
        correctIndex: 1,
        explanationKey: 'sl-29.s1.explanation',
      },
      {
        type: 'true_false',
        statementKey: 'sl-29.s2.statement',
        correct: false,
        explanationKey: 'sl-29.s2.explanation',
      },
    ],
  },
  {
    id: 'sl-30',
    titleKey: 'sl-30.title',
    orbsReward: 19,
    steps: [
      {
        type: 'info',
        titleKey: 'sl-30.s0.title',
        bodyKey: 'sl-30.s0.body',
      },
      {
        type: 'reorder',
        instructionKey: 'sl-30.s1.instruction',
        itemKeys: [
          'sl-30.s1.item0',
          'sl-30.s1.item1',
          'sl-30.s1.item2',
        ],
        correctOrder: [0, 1, 2],
        explanationKey: 'sl-30.s1.explanation',
      },
    ],
  },
  {
    id: 'sl-31',
    titleKey: 'sl-31.title',
    orbsReward: 20,
    steps: [
      {
        type: 'choice',
        questionKey: 'sl-31.s0.question',
        optionKeys: ['sl-31.s0.opt0', 'sl-31.s0.opt1'],
        correctIndex: 0,
        explanationKey: 'sl-31.s0.explanation',
      },
      {
        type: 'categorize',
        instructionKey: 'sl-31.s1.instruction',
        categoryLabelKeys: ['sl-31.s1.cat0', 'sl-31.s1.cat1'],
        items: [
          { itemKey: 'sl-31.s1.item0', correctCategoryIndex: 0 },
          { itemKey: 'sl-31.s1.item1', correctCategoryIndex: 1 },
          { itemKey: 'sl-31.s1.item2', correctCategoryIndex: 1 },
          { itemKey: 'sl-31.s1.item3', correctCategoryIndex: 0 },
        ],
        explanationKey: 'sl-31.s1.explanation',
      },
    ],
  },
  {
    id: 'sl-32',
    titleKey: 'sl-32.title',
    orbsReward: 18,
    steps: [
      {
        type: 'info',
        titleKey: 'sl-32.s0.title',
        bodyKey: 'sl-32.s0.body',
      },
      {
        type: 'choice',
        questionKey: 'sl-32.s1.question',
        optionKeys: ['sl-32.s1.opt0', 'sl-32.s1.opt1'],
        correctIndex: 0,
        explanationKey: 'sl-32.s1.explanation',
      },
      {
        type: 'true_false',
        statementKey: 'sl-32.s2.statement',
        correct: false,
        explanationKey: 'sl-32.s2.explanation',
      },
    ],
  },
  {
    id: 'sl-33',
    titleKey: 'sl-33.title',
    orbsReward: 17,
    steps: [
      {
        type: 'info',
        titleKey: 'sl-33.s0.title',
        bodyKey: 'sl-33.s0.body',
      },
      {
        type: 'choice',
        questionKey: 'sl-33.s1.question',
        optionKeys: ['sl-33.s1.opt0', 'sl-33.s1.opt1'],
        correctIndex: 0,
        explanationKey: 'sl-33.s1.explanation',
      },
      {
        type: 'true_false',
        statementKey: 'sl-33.s2.statement',
        correct: true,
        explanationKey: 'sl-33.s2.explanation',
      },
    ],
  },
  {
    id: 'sl-34',
    titleKey: 'sl-34.title',
    orbsReward: 18,
    steps: [
      {
        type: 'info',
        titleKey: 'sl-34.s0.title',
        bodyKey: 'sl-34.s0.body',
      },
      {
        type: 'choice',
        questionKey: 'sl-34.s1.question',
        optionKeys: ['sl-34.s1.opt0', 'sl-34.s1.opt1'],
        correctIndex: 0,
        explanationKey: 'sl-34.s1.explanation',
      },
      {
        type: 'true_false',
        statementKey: 'sl-34.s2.statement',
        correct: false,
        explanationKey: 'sl-34.s2.explanation',
      },
    ],
  },
  {
    id: 'sl-35',
    titleKey: 'sl-35.title',
    orbsReward: 30,
    steps: [
      {
        type: 'info',
        titleKey: 'sl-35.s0.title',
        bodyKey: 'sl-35.s0.body',
      },
      {
        type: 'choice',
        questionKey: 'sl-35.s1.question',
        optionKeys: ['sl-35.s1.opt0', 'sl-35.s1.opt1'],
        correctIndex: 0,
        explanationKey: 'sl-35.s1.explanation',
      },
      {
        type: 'reorder',
        instructionKey: 'sl-35.s2.instruction',
        itemKeys: [
          'sl-35.s2.item0',
          'sl-35.s2.item1',
          'sl-35.s2.item2',
          'sl-35.s2.item3',
        ],
        correctOrder: [0, 1, 2, 3],
        explanationKey: 'sl-35.s2.explanation',
      },
      {
        type: 'true_false',
        statementKey: 'sl-35.s3.statement',
        correct: false,
        explanationKey: 'sl-35.s3.explanation',
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
    id: 'il-6',
    titleKey: 'il-6.title',
    orbsReward: 16,
    steps: [
      {
        type: 'info',
        titleKey: 'il-6.s0.title',
        bodyKey: 'il-6.s0.body',
      },
      {
        type: 'choice',
        questionKey: 'il-6.s1.question',
        optionKeys: ['il-6.s1.opt0', 'il-6.s1.opt1', 'il-6.s1.opt2'],
        correctIndex: 0,
        explanationKey: 'il-6.s1.explanation',
      },
      {
        type: 'true_false',
        statementKey: 'il-6.s2.statement',
        correct: true,
        explanationKey: 'il-6.s2.explanation',
      },
    ],
  },
  {
    id: 'il-7',
    titleKey: 'il-7.title',
    orbsReward: 17,
    steps: [
      {
        type: 'info',
        titleKey: 'il-7.s0.title',
        bodyKey: 'il-7.s0.body',
      },
      {
        type: 'choice',
        questionKey: 'il-7.s1.question',
        optionKeys: ['il-7.s1.opt0', 'il-7.s1.opt1', 'il-7.s1.opt2'],
        correctIndex: 0,
        explanationKey: 'il-7.s1.explanation',
      },
      {
        type: 'fill_blank',
        prefixKey: 'il-7.s2.prefix',
        suffixKey: 'il-7.s2.suffix',
        optionKeys: ['il-7.s2.opt0', 'il-7.s2.opt1', 'il-7.s2.opt2'],
        correctIndex: 0,
        explanationKey: 'il-7.s2.explanation',
      },
    ],
  },
  {
    id: 'il-8',
    titleKey: 'il-8.title',
    orbsReward: 18,
    steps: [
      {
        type: 'info',
        titleKey: 'il-8.s0.title',
        bodyKey: 'il-8.s0.body',
      },
      {
        type: 'choice',
        questionKey: 'il-8.s1.question',
        optionKeys: ['il-8.s1.opt0', 'il-8.s1.opt1', 'il-8.s1.opt2'],
        correctIndex: 2,
        explanationKey: 'il-8.s1.explanation',
      },
      {
        type: 'reorder',
        instructionKey: 'il-8.s2.instruction',
        itemKeys: [
          'il-8.s2.item0',
          'il-8.s2.item1',
          'il-8.s2.item2',
          'il-8.s2.item3',
        ],
        correctOrder: [0, 1, 2, 3],
        explanationKey: 'il-8.s2.explanation',
      },
    ],
  },
  {
    id: 'il-9',
    titleKey: 'il-9.title',
    orbsReward: 17,
    steps: [
      {
        type: 'info',
        titleKey: 'il-9.s0.title',
        bodyKey: 'il-9.s0.body',
      },
      {
        type: 'error_finding',
        instructionKey: 'il-9.s1.instruction',
        textSegments: [
          { segmentKey: 'il-9.s1.seg0', isError: false },
          { segmentKey: 'il-9.s1.seg1', isError: true },
          { segmentKey: 'il-9.s1.seg2', isError: false },
        ],
        explanationKey: 'il-9.s1.explanation',
      },
    ],
  },
  {
    id: 'il-10',
    titleKey: 'il-10.title',
    orbsReward: 19,
    steps: [
      {
        type: 'info',
        titleKey: 'il-10.s0.title',
        bodyKey: 'il-10.s0.body',
      },
      {
        type: 'categorize',
        instructionKey: 'il-10.s1.instruction',
        categoryLabelKeys: ['il-10.s1.cat0', 'il-10.s1.cat1'],
        items: [
          { itemKey: 'il-10.s1.item0', correctCategoryIndex: 0 },
          { itemKey: 'il-10.s1.item1', correctCategoryIndex: 1 },
          { itemKey: 'il-10.s1.item2', correctCategoryIndex: 0 },
          { itemKey: 'il-10.s1.item3', correctCategoryIndex: 1 },
        ],
        explanationKey: 'il-10.s1.explanation',
      },
    ],
  },
  {
    id: 'il-11',
    titleKey: 'il-11.title',
    orbsReward: 17,
    steps: [
      {
        type: 'info',
        titleKey: 'il-11.s0.title',
        bodyKey: 'il-11.s0.body',
      },
      {
        type: 'matching',
        instructionKey: 'il-11.s1.instruction',
        pairs: [
          { termKey: 'il-11.s1.term0', definitionKey: 'il-11.s1.def0' },
          { termKey: 'il-11.s1.term1', definitionKey: 'il-11.s1.def1' },
          { termKey: 'il-11.s1.term2', definitionKey: 'il-11.s1.def2' },
        ],
        explanationKey: 'il-11.s1.explanation',
      },
    ],
  },
  {
    id: 'il-12',
    titleKey: 'il-12.title',
    orbsReward: 17,
    steps: [
      {
        type: 'info',
        titleKey: 'il-12.s0.title',
        bodyKey: 'il-12.s0.body',
      },
      {
        type: 'choice',
        questionKey: 'il-12.s1.question',
        optionKeys: ['il-12.s1.opt0', 'il-12.s1.opt1', 'il-12.s1.opt2'],
        correctIndex: 0,
        explanationKey: 'il-12.s1.explanation',
      },
      {
        type: 'true_false',
        statementKey: 'il-12.s2.statement',
        correct: true,
        explanationKey: 'il-12.s2.explanation',
      },
    ],
  },
  {
    id: 'il-13',
    titleKey: 'il-13.title',
    orbsReward: 18,
    steps: [
      {
        type: 'info',
        titleKey: 'il-13.s0.title',
        bodyKey: 'il-13.s0.body',
      },
      {
        type: 'reorder',
        instructionKey: 'il-13.s1.instruction',
        itemKeys: [
          'il-13.s1.item0',
          'il-13.s1.item1',
          'il-13.s1.item2',
          'il-13.s1.item3',
        ],
        correctOrder: [0, 1, 2, 3],
        explanationKey: 'il-13.s1.explanation',
      },
    ],
  },
  {
    id: 'il-14',
    titleKey: 'il-14.title',
    orbsReward: 18,
    steps: [
      {
        type: 'info',
        titleKey: 'il-14.s0.title',
        bodyKey: 'il-14.s0.body',
      },
      {
        type: 'error_finding',
        instructionKey: 'il-14.s1.instruction',
        textSegments: [
          { segmentKey: 'il-14.s1.seg0', isError: false },
          { segmentKey: 'il-14.s1.seg1', isError: true },
          { segmentKey: 'il-14.s1.seg2', isError: false },
        ],
        explanationKey: 'il-14.s1.explanation',
      },
    ],
  },
  {
    id: 'il-15',
    titleKey: 'il-15.title',
    orbsReward: 20,
    steps: [
      {
        type: 'info',
        titleKey: 'il-15.s0.title',
        bodyKey: 'il-15.s0.body',
      },
      {
        type: 'categorize',
        instructionKey: 'il-15.s1.instruction',
        categoryLabelKeys: ['il-15.s1.cat0', 'il-15.s1.cat1'],
        items: [
          { itemKey: 'il-15.s1.item0', correctCategoryIndex: 0 },
          { itemKey: 'il-15.s1.item1', correctCategoryIndex: 1 },
          { itemKey: 'il-15.s1.item2', correctCategoryIndex: 0 },
          { itemKey: 'il-15.s1.item3', correctCategoryIndex: 1 },
        ],
        explanationKey: 'il-15.s1.explanation',
      },
    ],
  },
  {
    id: 'il-16',
    titleKey: 'il-16.title',
    orbsReward: 17,
    steps: [
      {
        type: 'info',
        titleKey: 'il-16.s0.title',
        bodyKey: 'il-16.s0.body',
      },
      {
        type: 'choice',
        questionKey: 'il-16.s1.question',
        optionKeys: ['il-16.s1.opt0', 'il-16.s1.opt1', 'il-16.s1.opt2'],
        correctIndex: 1,
        explanationKey: 'il-16.s1.explanation',
      },
      {
        type: 'true_false',
        statementKey: 'il-16.s2.statement',
        correct: true,
        explanationKey: 'il-16.s2.explanation',
      },
    ],
  },
  {
    id: 'il-17',
    titleKey: 'il-17.title',
    orbsReward: 16,
    steps: [
      {
        type: 'info',
        titleKey: 'il-17.s0.title',
        bodyKey: 'il-17.s0.body',
      },
      {
        type: 'fill_blank',
        prefixKey: 'il-17.s1.prefix',
        suffixKey: 'il-17.s1.suffix',
        optionKeys: ['il-17.s1.opt0', 'il-17.s1.opt1', 'il-17.s1.opt2'],
        correctIndex: 0,
        explanationKey: 'il-17.s1.explanation',
      },
    ],
  },
  {
    id: 'il-18',
    titleKey: 'il-18.title',
    orbsReward: 18,
    steps: [
      {
        type: 'info',
        titleKey: 'il-18.s0.title',
        bodyKey: 'il-18.s0.body',
      },
      {
        type: 'reorder',
        instructionKey: 'il-18.s1.instruction',
        itemKeys: [
          'il-18.s1.item0',
          'il-18.s1.item1',
          'il-18.s1.item2',
          'il-18.s1.item3',
        ],
        correctOrder: [0, 1, 2, 3],
        explanationKey: 'il-18.s1.explanation',
      },
    ],
  },
  {
    id: 'il-19',
    titleKey: 'il-19.title',
    orbsReward: 17,
    steps: [
      {
        type: 'info',
        titleKey: 'il-19.s0.title',
        bodyKey: 'il-19.s0.body',
      },
      {
        type: 'error_finding',
        instructionKey: 'il-19.s1.instruction',
        textSegments: [
          { segmentKey: 'il-19.s1.seg0', isError: false },
          { segmentKey: 'il-19.s1.seg1', isError: true },
          { segmentKey: 'il-19.s1.seg2', isError: false },
        ],
        explanationKey: 'il-19.s1.explanation',
      },
    ],
  },
  {
    id: 'il-20',
    titleKey: 'il-20.title',
    orbsReward: 19,
    steps: [
      {
        type: 'info',
        titleKey: 'il-20.s0.title',
        bodyKey: 'il-20.s0.body',
      },
      {
        type: 'categorize',
        instructionKey: 'il-20.s1.instruction',
        categoryLabelKeys: ['il-20.s1.cat0', 'il-20.s1.cat1'],
        items: [
          { itemKey: 'il-20.s1.item0', correctCategoryIndex: 0 },
          { itemKey: 'il-20.s1.item1', correctCategoryIndex: 1 },
          { itemKey: 'il-20.s1.item2', correctCategoryIndex: 0 },
          { itemKey: 'il-20.s1.item3', correctCategoryIndex: 1 },
        ],
        explanationKey: 'il-20.s1.explanation',
      },
    ],
  },
  {
    id: 'il-21',
    titleKey: 'il-21.title',
    orbsReward: 17,
    steps: [
      {
        type: 'info',
        titleKey: 'il-21.s0.title',
        bodyKey: 'il-21.s0.body',
      },
      {
        type: 'choice',
        questionKey: 'il-21.s1.question',
        optionKeys: ['il-21.s1.opt0', 'il-21.s1.opt1', 'il-21.s1.opt2'],
        correctIndex: 0,
        explanationKey: 'il-21.s1.explanation',
      },
      {
        type: 'true_false',
        statementKey: 'il-21.s2.statement',
        correct: true,
        explanationKey: 'il-21.s2.explanation',
      },
    ],
  },
  {
    id: 'il-22',
    titleKey: 'il-22.title',
    orbsReward: 18,
    steps: [
      {
        type: 'info',
        titleKey: 'il-22.s0.title',
        bodyKey: 'il-22.s0.body',
      },
      {
        type: 'categorize',
        instructionKey: 'il-22.s1.instruction',
        categoryLabelKeys: ['il-22.s1.cat0', 'il-22.s1.cat1'],
        items: [
          { itemKey: 'il-22.s1.item0', correctCategoryIndex: 0 },
          { itemKey: 'il-22.s1.item1', correctCategoryIndex: 1 },
          { itemKey: 'il-22.s1.item2', correctCategoryIndex: 0 },
          { itemKey: 'il-22.s1.item3', correctCategoryIndex: 1 },
        ],
        explanationKey: 'il-22.s1.explanation',
      },
    ],
  },
  {
    id: 'il-23',
    titleKey: 'il-23.title',
    orbsReward: 17,
    steps: [
      {
        type: 'info',
        titleKey: 'il-23.s0.title',
        bodyKey: 'il-23.s0.body',
      },
      {
        type: 'matching',
        instructionKey: 'il-23.s1.instruction',
        pairs: [
          { termKey: 'il-23.s1.term0', definitionKey: 'il-23.s1.def0' },
          { termKey: 'il-23.s1.term1', definitionKey: 'il-23.s1.def1' },
          { termKey: 'il-23.s1.term2', definitionKey: 'il-23.s1.def2' },
        ],
        explanationKey: 'il-23.s1.explanation',
      },
    ],
  },
  {
    id: 'il-24',
    titleKey: 'il-24.title',
    orbsReward: 16,
    steps: [
      {
        type: 'info',
        titleKey: 'il-24.s0.title',
        bodyKey: 'il-24.s0.body',
      },
      {
        type: 'fill_blank',
        prefixKey: 'il-24.s1.prefix',
        suffixKey: 'il-24.s1.suffix',
        optionKeys: ['il-24.s1.opt0', 'il-24.s1.opt1', 'il-24.s1.opt2'],
        correctIndex: 0,
        explanationKey: 'il-24.s1.explanation',
      },
    ],
  },
  {
    id: 'il-25',
    titleKey: 'il-25.title',
    orbsReward: 20,
    steps: [
      {
        type: 'info',
        titleKey: 'il-25.s0.title',
        bodyKey: 'il-25.s0.body',
      },
      {
        type: 'reorder',
        instructionKey: 'il-25.s1.instruction',
        itemKeys: [
          'il-25.s1.item0',
          'il-25.s1.item1',
          'il-25.s1.item2',
          'il-25.s1.item3',
          'il-25.s1.item4',
        ],
        correctOrder: [0, 1, 2, 3, 4],
        explanationKey: 'il-25.s1.explanation',
      },
    ],
  },
  {
    id: 'il-26',
    titleKey: 'il-26.title',
    orbsReward: 17,
    steps: [
      {
        type: 'info',
        titleKey: 'il-26.s0.title',
        bodyKey: 'il-26.s0.body',
      },
      {
        type: 'choice',
        questionKey: 'il-26.s1.question',
        optionKeys: ['il-26.s1.opt0', 'il-26.s1.opt1', 'il-26.s1.opt2'],
        correctIndex: 0,
        explanationKey: 'il-26.s1.explanation',
      },
      {
        type: 'true_false',
        statementKey: 'il-26.s2.statement',
        correct: true,
        explanationKey: 'il-26.s2.explanation',
      },
    ],
  },
  {
    id: 'il-27',
    titleKey: 'il-27.title',
    orbsReward: 16,
    steps: [
      {
        type: 'info',
        titleKey: 'il-27.s0.title',
        bodyKey: 'il-27.s0.body',
      },
      {
        type: 'fill_blank',
        prefixKey: 'il-27.s1.prefix',
        suffixKey: 'il-27.s1.suffix',
        optionKeys: ['il-27.s1.opt0', 'il-27.s1.opt1', 'il-27.s1.opt2'],
        correctIndex: 0,
        explanationKey: 'il-27.s1.explanation',
      },
    ],
  },
  {
    id: 'il-28',
    titleKey: 'il-28.title',
    orbsReward: 17,
    steps: [
      {
        type: 'info',
        titleKey: 'il-28.s0.title',
        bodyKey: 'il-28.s0.body',
      },
      {
        type: 'categorize',
        instructionKey: 'il-28.s1.instruction',
        categoryLabelKeys: ['il-28.s1.cat0', 'il-28.s1.cat1'],
        items: [
          { itemKey: 'il-28.s1.item0', correctCategoryIndex: 0 },
          { itemKey: 'il-28.s1.item1', correctCategoryIndex: 1 },
          { itemKey: 'il-28.s1.item2', correctCategoryIndex: 0 },
          { itemKey: 'il-28.s1.item3', correctCategoryIndex: 1 },
        ],
        explanationKey: 'il-28.s1.explanation',
      },
    ],
  },
  {
    id: 'il-29',
    titleKey: 'il-29.title',
    orbsReward: 18,
    steps: [
      {
        type: 'info',
        titleKey: 'il-29.s0.title',
        bodyKey: 'il-29.s0.body',
      },
      {
        type: 'error_finding',
        instructionKey: 'il-29.s1.instruction',
        textSegments: [
          { segmentKey: 'il-29.s1.seg0', isError: false },
          { segmentKey: 'il-29.s1.seg1', isError: true },
          { segmentKey: 'il-29.s1.seg2', isError: false },
        ],
        explanationKey: 'il-29.s1.explanation',
      },
    ],
  },
  {
    id: 'il-30',
    titleKey: 'il-30.title',
    orbsReward: 17,
    steps: [
      {
        type: 'info',
        titleKey: 'il-30.s0.title',
        bodyKey: 'il-30.s0.body',
      },
      {
        type: 'matching',
        instructionKey: 'il-30.s1.instruction',
        pairs: [
          { termKey: 'il-30.s1.term0', definitionKey: 'il-30.s1.def0' },
          { termKey: 'il-30.s1.term1', definitionKey: 'il-30.s1.def1' },
          { termKey: 'il-30.s1.term2', definitionKey: 'il-30.s1.def2' },
        ],
        explanationKey: 'il-30.s1.explanation',
      },
    ],
  },
  {
    id: 'il-31',
    titleKey: 'il-31.title',
    orbsReward: 18,
    steps: [
      {
        type: 'info',
        titleKey: 'il-31.s0.title',
        bodyKey: 'il-31.s0.body',
      },
      {
        type: 'reorder',
        instructionKey: 'il-31.s1.instruction',
        itemKeys: [
          'il-31.s1.item0',
          'il-31.s1.item1',
          'il-31.s1.item2',
          'il-31.s1.item3',
        ],
        correctOrder: [0, 1, 2, 3],
        explanationKey: 'il-31.s1.explanation',
      },
    ],
  },
  {
    id: 'il-32',
    titleKey: 'il-32.title',
    orbsReward: 17,
    steps: [
      {
        type: 'info',
        titleKey: 'il-32.s0.title',
        bodyKey: 'il-32.s0.body',
      },
      {
        type: 'choice',
        questionKey: 'il-32.s1.question',
        optionKeys: ['il-32.s1.opt0', 'il-32.s1.opt1', 'il-32.s1.opt2'],
        correctIndex: 1,
        explanationKey: 'il-32.s1.explanation',
      },
      {
        type: 'true_false',
        statementKey: 'il-32.s2.statement',
        correct: true,
        explanationKey: 'il-32.s2.explanation',
      },
    ],
  },
  {
    id: 'il-33',
    titleKey: 'il-33.title',
    orbsReward: 16,
    steps: [
      {
        type: 'info',
        titleKey: 'il-33.s0.title',
        bodyKey: 'il-33.s0.body',
      },
      {
        type: 'true_false',
        statementKey: 'il-33.s1.statement',
        correct: true,
        explanationKey: 'il-33.s1.explanation',
      },
    ],
  },
  {
    id: 'il-34',
    titleKey: 'il-34.title',
    orbsReward: 19,
    steps: [
      {
        type: 'info',
        titleKey: 'il-34.s0.title',
        bodyKey: 'il-34.s0.body',
      },
      {
        type: 'categorize',
        instructionKey: 'il-34.s1.instruction',
        categoryLabelKeys: ['il-34.s1.cat0', 'il-34.s1.cat1'],
        items: [
          { itemKey: 'il-34.s1.item0', correctCategoryIndex: 0 },
          { itemKey: 'il-34.s1.item1', correctCategoryIndex: 0 },
          { itemKey: 'il-34.s1.item2', correctCategoryIndex: 1 },
          { itemKey: 'il-34.s1.item3', correctCategoryIndex: 1 },
        ],
        explanationKey: 'il-34.s1.explanation',
      },
    ],
  },
  {
    id: 'il-35',
    titleKey: 'il-35.title',
    orbsReward: 25,
    steps: [
      {
        type: 'info',
        titleKey: 'il-35.s0.title',
        bodyKey: 'il-35.s0.body',
      },
      {
        type: 'choice',
        questionKey: 'il-35.s1.question',
        optionKeys: ['il-35.s1.opt0', 'il-35.s1.opt1', 'il-35.s1.opt2'],
        correctIndex: 1,
        explanationKey: 'il-35.s1.explanation',
      },
      {
        type: 'reorder',
        instructionKey: 'il-35.s2.instruction',
        itemKeys: [
          'il-35.s2.item0',
          'il-35.s2.item1',
          'il-35.s2.item2',
          'il-35.s2.item3',
        ],
        correctOrder: [0, 1, 2, 3],
        explanationKey: 'il-35.s2.explanation',
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
