import type { ThemeMode } from './theme';

export type CopyEntry = {
  playful: string;
  focus: string;
};

export type CopyCatalog = Record<string, CopyEntry>;

export const copy: CopyCatalog = {
  'orbCounter.label': {
    playful: 'Energie-Orbs',
    focus: 'Orbs',
  },
  'pathCard.chapters': {
    playful: 'Kapitel {{current}} von {{total}}',
    focus: 'Kap. {{current}}/{{total}}',
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
