import type { ThemeMode } from './theme';

export type CopyEntry = {
  playful: string;
  focus: string;
};

export type CopyCatalog = Record<string, CopyEntry>;

export const copy: CopyCatalog = {};

export type CopyKey = keyof typeof copy;

export function resolveCopy(
  mode: ThemeMode,
  catalog: CopyCatalog = copy,
): Record<string, string> {
  return Object.fromEntries(
    Object.entries(catalog).map(([key, entry]) => [key, entry[mode]]),
  );
}

export function getCopyText(key: string, mode: ThemeMode, catalog: CopyCatalog = copy): string {
  const entry = catalog[key];

  if (!entry) {
    return '';
  }

  return entry[mode];
}
