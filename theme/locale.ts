export const LOCALES = ['de', 'en', 'fr', 'ru'] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = 'de';

export function isLocale(value: string): value is Locale {
  return LOCALES.includes(value as Locale);
}

export const LOCALE_LABEL_KEYS = {
  de: 'profile.languageDe',
  en: 'profile.languageEn',
  fr: 'profile.languageFr',
  ru: 'profile.languageRu',
} as const satisfies Record<Locale, string>;
