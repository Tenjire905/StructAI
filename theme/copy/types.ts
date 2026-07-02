import type { ThemeMode } from '../theme';

export type CopyEntry = {
  playful: string;
  focus: string;
};

export type CopyCatalog = Record<string, CopyEntry>;

export type CopyKey = string;

export function getCopyText(
  key: string,
  mode: ThemeMode,
  catalog: CopyCatalog,
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
  catalog: CopyCatalog,
  vars?: Record<string, string | number>,
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
  catalog: CopyCatalog,
): Record<string, string> {
  return Object.fromEntries(
    Object.entries(catalog).map(([key, entry]) => [key, entry[mode]]),
  );
}

const WEEKDAY_COPY_KEYS = [
  'streakTracker.weekdayMon',
  'streakTracker.weekdayTue',
  'streakTracker.weekdayWed',
  'streakTracker.weekdayThu',
  'streakTracker.weekdayFri',
  'streakTracker.weekdaySat',
  'streakTracker.weekdaySun',
] as const;

export const streakWeekdayCopyKeys = WEEKDAY_COPY_KEYS;
