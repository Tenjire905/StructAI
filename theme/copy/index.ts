import type { Locale } from '../locale';

import { copyDe } from './de';
import { copyEn } from './en';
import { copyFr } from './fr';
import { copyRu } from './ru';
import type { CopyCatalog } from './types';

export const copyByLocale: Record<Locale, CopyCatalog> = {
  de: copyDe,
  en: copyEn,
  fr: copyFr,
  ru: copyRu,
};

export function getCatalogForLocale(locale: Locale): CopyCatalog {
  return copyByLocale[locale] ?? copyByLocale.de;
}
