import type { ResolvedLesson } from '@/data/mockLessons.resolve';

/**
 * Dev-only smoke lesson covering all eight step types in one session.
 * Loaded via getMockLesson('dev-j-mixed') when __DEV__ is true.
 */
export function getDevBlockJMixedLesson(): ResolvedLesson {
  return {
    id: 'dev-j-mixed',
    title: 'Dev: Block J Mixed Dispatch',
    orbsReward: 0,
    steps: [
      {
        type: 'info',
        title: 'DEV Info Step',
        body: 'Kurzer Info-Schritt vor den neuen Block-J-Typen.',
      },
      {
        type: 'choice',
        question: 'DEV Choice: Welche Option ist korrekt?',
        options: ['Korrekt', 'Falsch A', 'Falsch B'],
        correctIndex: 0,
        explanation: 'DEV Choice Erklärung.',
      },
      {
        type: 'fill_blank',
        prefix: 'DEV Lücke: Ein ',
        suffix: ' ist eine Eingabe an ein Modell.',
        options: ['Prompt', 'Token', 'Seed'],
        correctIndex: 0,
        explanation: 'DEV Fill-Blank Erklärung.',
      },
      {
        type: 'true_false',
        statement: 'DEV Wahr/Falsch: Prompts können Aufgaben formulieren.',
        correct: true,
        explanation: 'DEV True/False Erklärung.',
      },
      {
        type: 'reorder',
        instruction: 'DEV Reorder: Schritte in sinnvoller Reihenfolge.',
        items: ['Ziel nennen', 'Format festlegen', 'Beispiel geben'],
        correctOrder: [0, 1, 2],
        explanation: 'DEV Reorder Erklärung.',
      },
      {
        type: 'matching',
        instruction: 'DEV Matching: Begriffe zuordnen.',
        pairs: [
          { term: 'Prompt', definition: 'Modell-Eingabe' },
          { term: 'Token', definition: 'Texteinheit' },
        ],
        definitionOrder: [0, 1],
        explanation: 'DEV Matching Erklärung.',
      },
      {
        type: 'error_finding',
        instruction: 'DEV Error-Finding: Finde das problematische Wort.',
        textSegments: [
          { text: 'Schreibe ', isError: false },
          { text: 'irgendwie ', isError: true },
          { text: 'einen Prompt.', isError: false },
        ],
        explanation: 'DEV Error-Finding Erklärung.',
      },
      {
        type: 'categorize',
        instruction: 'DEV Categorize: Items sortieren.',
        categories: ['Ziel', 'Format'],
        items: [
          { text: 'Zielgruppe nennen', correctCategoryIndex: 0 },
          { text: 'Bulletpoints nutzen', correctCategoryIndex: 1 },
        ],
        explanation: 'DEV Categorize Erklärung.',
      },
    ],
  };
}
