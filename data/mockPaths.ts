export type MockChapterStatus = 'completed' | 'current' | 'locked';

export type MockChapter = {
  id: string;
  title: string;
  status: MockChapterStatus;
};

export type MockPath = {
  id: string;
  title: string;
  totalChapters: number;
  currentChapter?: number;
  progress?: number;
  isNew?: boolean;
  chapters: MockChapter[];
};

export const MOCK_PATHS: MockPath[] = [
  {
    id: 'prompt-basics',
    title: 'Prompt-Grundlagen',
    totalChapters: 8,
    currentChapter: 3,
    progress: 0.42,
    chapters: [
      { id: 'pb-1', title: 'Was ist ein Prompt?', status: 'completed' },
      { id: 'pb-2', title: 'Klare Anweisungen', status: 'completed' },
      { id: 'pb-3', title: 'Zieldefinition', status: 'current' },
      { id: 'pb-4', title: 'Formatvorgaben', status: 'locked' },
      { id: 'pb-5', title: 'Beispiele nutzen', status: 'locked' },
      { id: 'pb-6', title: 'Negativ-Anweisungen', status: 'locked' },
      { id: 'pb-7', title: 'Prompt-Länge', status: 'locked' },
      { id: 'pb-8', title: 'Abschlussprojekt', status: 'locked' },
    ],
  },
  {
    id: 'structure-lab',
    title: 'Struktur & Constraints',
    totalChapters: 6,
    currentChapter: 1,
    progress: 0.12,
    chapters: [
      { id: 'sl-1', title: 'Warum Struktur zählt', status: 'current' },
      { id: 'sl-2', title: 'Abschnitte & Delimiter', status: 'locked' },
      { id: 'sl-3', title: 'Constraints definieren', status: 'locked' },
      { id: 'sl-4', title: 'Prioritäten setzen', status: 'locked' },
      { id: 'sl-5', title: 'Konflikte auflösen', status: 'locked' },
      { id: 'sl-6', title: 'Abschlussprojekt', status: 'locked' },
    ],
  },
  {
    id: 'context-mastery',
    title: 'Kontext & Rollen',
    totalChapters: 7,
    isNew: true,
    chapters: [
      { id: 'cm-1', title: 'Kontextfenster verstehen', status: 'locked' },
      { id: 'cm-2', title: 'Rollen zuweisen', status: 'locked' },
      { id: 'cm-3', title: 'Hintergrundwissen einbetten', status: 'locked' },
      { id: 'cm-4', title: 'Ton & Stil steuern', status: 'locked' },
      { id: 'cm-5', title: 'Persona-Techniken', status: 'locked' },
      { id: 'cm-6', title: 'Kontext-Overload vermeiden', status: 'locked' },
      { id: 'cm-7', title: 'Abschlussprojekt', status: 'locked' },
    ],
  },
  {
    id: 'iteration-loops',
    title: 'Iteratives Verfeinern',
    totalChapters: 5,
    chapters: [
      { id: 'il-1', title: 'Erste Antwort bewerten', status: 'locked' },
      { id: 'il-2', title: 'Gezielt nachsteuern', status: 'locked' },
      { id: 'il-3', title: 'Varianten vergleichen', status: 'locked' },
      { id: 'il-4', title: 'Feedback-Schleifen', status: 'locked' },
      { id: 'il-5', title: 'Abschlussprojekt', status: 'locked' },
    ],
  },
  {
    id: 'eval-scoring',
    title: 'Prompts bewerten',
    totalChapters: 6,
    chapters: [
      { id: 'es-1', title: 'Bewertungskriterien', status: 'locked' },
      { id: 'es-2', title: 'Score-Systeme', status: 'locked' },
      { id: 'es-3', title: 'Blindstellen erkennen', status: 'locked' },
      { id: 'es-4', title: 'Vergleichstests', status: 'locked' },
      { id: 'es-5', title: 'Automatisierte Checks', status: 'locked' },
      { id: 'es-6', title: 'Abschlussprojekt', status: 'locked' },
    ],
  },
];

export function getMockPath(id: string): MockPath | undefined {
  return MOCK_PATHS.find((path) => path.id === id);
}
