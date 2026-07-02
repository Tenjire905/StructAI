export type LessonInfoStep = {
  type: 'info';
  title: string;
  body: string;
};

export type LessonChoiceStep = {
  type: 'choice';
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};

export type LessonStep = LessonInfoStep | LessonChoiceStep;

export type MockLesson = {
  id: string;
  title: string;
  orbsReward: number;
  steps: LessonStep[];
};

const MOCK_LESSONS: MockLesson[] = [
  {
    id: 'pb-3',
    title: 'Zieldefinition',
    orbsReward: 20,
    steps: [
      {
        type: 'info',
        title: 'Warum Ziele zählen',
        body: 'Ein Prompt ohne klares Ziel zwingt das Modell zum Raten. Je präziser du beschreibst, was am Ende herauskommen soll, desto näher liegt die erste Antwort an deinem Wunschergebnis. Formuliere das Ziel als erwartetes Ergebnis, nicht als vage Richtung.',
      },
      {
        type: 'choice',
        question: 'Welche Zieldefinition ist am präzisesten?',
        options: [
          'Schreib was über unser neues Produkt.',
          'Erstelle eine Produktbeschreibung mit 3 Absätzen: Nutzen, Funktionen, Call-to-Action – Zielgruppe sind Einkaufsleiter.',
          'Mach einen guten Text für die Website, gerne etwas länger.',
        ],
        correctIndex: 1,
        explanation: 'Die zweite Variante definiert Format (3 Absätze), Inhalt (Nutzen, Funktionen, CTA) und Zielgruppe – das Modell muss nichts raten.',
      },
      {
        type: 'choice',
        question: 'Was fehlt in diesem Prompt? "Fasse den Bericht zusammen."',
        options: [
          'Nichts – der Prompt ist vollständig.',
          'Ziellänge, Zielgruppe und Format der Zusammenfassung.',
          'Eine freundliche Begrüßung an das Modell.',
        ],
        correctIndex: 1,
        explanation: 'Ohne Ziellänge, Zielgruppe und Format entscheidet das Modell selbst – und trifft selten deine Erwartung.',
      },
    ],
  },
  {
    id: 'sl-1',
    title: 'Warum Struktur zählt',
    orbsReward: 15,
    steps: [
      {
        type: 'info',
        title: 'Struktur schlägt Länge',
        body: 'Ein langer, unstrukturierter Prompt ist schwerer zu befolgen als ein kurzer mit klaren Abschnitten. Trenne Kontext, Aufgabe und Vorgaben visuell – zum Beispiel mit Überschriften oder Delimitern.',
      },
      {
        type: 'choice',
        question: 'Welches Element verbessert die Struktur eines Prompts am stärksten?',
        options: [
          'Mehr Höflichkeitsfloskeln.',
          'Klar getrennte Abschnitte für Kontext, Aufgabe und Constraints.',
          'Alles in einem einzigen langen Satz formulieren.',
        ],
        correctIndex: 1,
        explanation: 'Getrennte Abschnitte helfen dem Modell, Anweisungen von Kontext zu unterscheiden und nichts zu übersehen.',
      },
    ],
  },
];

export function getMockLesson(id: string): MockLesson | undefined {
  return MOCK_LESSONS.find((lesson) => lesson.id === id);
}
