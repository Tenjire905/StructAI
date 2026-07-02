import type { ThemeMode } from './theme';

export type CopyEntry = {
  playful: string;
  focus: string;
};

export type CopyCatalog = Record<string, CopyEntry>;

export const copy: CopyCatalog = {
  'home.greeting': {
    playful: 'Willkommen zurück, {{name}}!',
    focus: 'Guten Tag, {{name}}.',
  },
  'home.continueLearning': {
    playful: 'Weiterlernen',
    focus: 'Aktuelle Lernpfade',
  },
  'orbCounter.label': {
    playful: 'Energie-Orbs',
    focus: 'Orbs',
  },
  'pathCard.chapters': {
    playful: 'Kapitel {{current}} von {{total}}',
    focus: 'Kap. {{current}}/{{total}}',
  },
  'pathCard.chaptersTotal': {
    playful: '{{total}} Kapitel warten auf dich',
    focus: '{{total}} Kapitel',
  },
  'paths.badgeNew': {
    playful: 'Neu',
    focus: 'Neu',
  },
  'paths.sectionActive': {
    playful: 'Deine aktiven Pfade',
    focus: 'In Bearbeitung',
  },
  'paths.sectionAvailable': {
    playful: 'Entdecke mehr',
    focus: 'Verfügbare Lernpfade',
  },
  'paths.emptyActive': {
    playful: 'Bereit für dein erstes Abenteuer? Wähl deinen Lernpfad und leg los!',
    focus: 'Wähle einen Lernpfad, um zu beginnen.',
  },
  'pathDetail.progressTitle': {
    playful: 'Dein Fortschritt',
    focus: 'Fortschritt',
  },
  'pathDetail.chapterListTitle': {
    playful: 'Deine Kapitel',
    focus: 'Kapitel',
  },
  'pathDetail.continueCta': {
    playful: 'Weiter geht’s!',
    focus: 'Fortsetzen',
  },
  'pathDetail.startCta': {
    playful: 'Jetzt starten!',
    focus: 'Starten',
  },
  'pathDetail.notFound': {
    playful: 'Diesen Pfad kennen wir noch nicht.',
    focus: 'Lernpfad nicht gefunden.',
  },
  'lesson.stepLabel': {
    playful: 'Schritt {{current}} von {{total}}',
    focus: '{{current}}/{{total}}',
  },
  'lesson.check': {
    playful: 'Antwort prüfen!',
    focus: 'Prüfen',
  },
  'lesson.next': {
    playful: 'Weiter geht’s!',
    focus: 'Weiter',
  },
  'lesson.correctFeedback': {
    playful: 'Stark! Deine Antwort sitzt.',
    focus: 'Korrekt.',
  },
  'lesson.wrongFeedback': {
    playful: 'Fast! Schau dir die Erklärung an.',
    focus: 'Nicht korrekt. Siehe Erklärung.',
  },
  'lesson.completeTitle': {
    playful: 'Lektion geschafft!',
    focus: 'Lektion abgeschlossen.',
  },
  'lesson.orbsEarned': {
    playful: '+{{count}} Orbs für dich!',
    focus: '+{{count}} Orbs',
  },
  'lesson.backToPath': {
    playful: 'Zurück zum Pfad',
    focus: 'Zurück zum Pfad',
  },
  'lesson.notFound': {
    playful: 'Diese Lektion gibt es noch nicht.',
    focus: 'Lektion nicht gefunden.',
  },
  'statBlock.completedLessons': {
    playful: 'Abgeschlossene Lektionen',
    focus: 'Lektionen abgeschlossen',
  },
  'statBlock.currentStreak': {
    playful: 'Aktuelle Serie',
    focus: 'Serie (Tage)',
  },
  'streakTracker.title': {
    playful: 'Deine Woche',
    focus: 'Wochenfortschritt',
  },
  'streakTracker.weekdayMon': {
    playful: 'Mo',
    focus: 'Mo',
  },
  'streakTracker.weekdayTue': {
    playful: 'Di',
    focus: 'Di',
  },
  'streakTracker.weekdayWed': {
    playful: 'Mi',
    focus: 'Mi',
  },
  'streakTracker.weekdayThu': {
    playful: 'Do',
    focus: 'Do',
  },
  'streakTracker.weekdayFri': {
    playful: 'Fr',
    focus: 'Fr',
  },
  'streakTracker.weekdaySat': {
    playful: 'Sa',
    focus: 'Sa',
  },
  'streakTracker.weekdaySun': {
    playful: 'So',
    focus: 'So',
  },
};

export type CopyKey = keyof typeof copy;

const WEEKDAY_COPY_KEYS = [
  'streakTracker.weekdayMon',
  'streakTracker.weekdayTue',
  'streakTracker.weekdayWed',
  'streakTracker.weekdayThu',
  'streakTracker.weekdayFri',
  'streakTracker.weekdaySat',
  'streakTracker.weekdaySun',
] as const satisfies readonly CopyKey[];

export const streakWeekdayCopyKeys = WEEKDAY_COPY_KEYS;

export function getCopyText(
  key: string,
  mode: ThemeMode,
  catalog: CopyCatalog = copy,
): string {
  const entry = catalog[key];

  if (!entry) {
    return '';
  }

  return entry[mode];
}

export function formatCopyText(
  key: string,
  mode: ThemeMode,
  vars?: Record<string, string | number>,
  catalog: CopyCatalog = copy,
): string {
  let text = getCopyText(key, mode, catalog);

  if (vars) {
    Object.entries(vars).forEach(([name, value]) => {
      text = text.replaceAll(`{{${name}}}`, String(value));
    });
  }

  return text;
}

export function resolveCopy(
  mode: ThemeMode,
  catalog: CopyCatalog = copy,
): Record<string, string> {
  return Object.fromEntries(
    Object.entries(catalog).map(([key, entry]) => [key, entry[mode]]),
  );
}
