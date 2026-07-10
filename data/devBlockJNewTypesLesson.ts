import type { ResolvedLesson } from '@/data/mockLessons.resolve';

/**
 * Dev-only smoke lesson for Block J new step types only.
 * NOT part of mockLessons.catalog.ts — loaded via getMockLesson('dev-j-new-types') when __DEV__.
 *
 * Sequence: matching → error_finding → categorize
 */
export function getDevBlockJNewTypesLesson(): ResolvedLesson {
  return {
    id: 'dev-j-new-types',
    title: 'Dev: Block J New Types',
    orbsReward: 0,
    steps: [
      {
        type: 'matching',
        instruction: 'DEV J-Neu Matching: Begriffe zuordnen.',
        pairs: [
          { term: 'Prompt', definition: 'Modell-Eingabe' },
          { term: 'Token', definition: 'Texteinheit' },
        ],
        definitionOrder: [0, 1],
        explanation: 'DEV J-Neu Matching Erklärung.',
      },
      {
        type: 'error_finding',
        instruction: 'DEV J-Neu Error-Finding: Finde das problematische Wort.',
        textSegments: [
          { text: 'Schreibe ', isError: false },
          { text: 'irgendwie ', isError: true },
          { text: 'einen Prompt.', isError: false },
        ],
        explanation: 'DEV J-Neu Error-Finding Erklärung.',
      },
      {
        type: 'categorize',
        instruction: 'DEV J-Neu Categorize: Items sortieren.',
        categories: ['Ziel', 'Format'],
        items: [
          { text: 'Zielgruppe nennen', correctCategoryIndex: 0 },
          { text: 'Bulletpoints nutzen', correctCategoryIndex: 1 },
        ],
        explanation: 'DEV J-Neu Categorize Erklärung.',
      },
    ],
  };
}
