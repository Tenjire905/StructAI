export const LOCALES = ['de', 'en', 'fr', 'ru'] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = 'de';

/** Native language names — stable across UI locale so users can find theirs. */
export const LOCALE_ENDONYMS = {
  de: 'Deutsch',
  en: 'English',
  fr: 'Français',
  ru: 'Русский',
} as const satisfies Record<Locale, string>;

export function isLocale(value: string): value is Locale {
  return LOCALES.includes(value as Locale);
}

/**
 * Maps a BCP-47 / OS language tag to one of our four app locales.
 * Unsupported languages fall back to {@link DEFAULT_LOCALE}.
 */
export function resolveLocaleFromDevice(languageTag?: string): Locale {
  const raw =
    languageTag ??
    (typeof Intl !== 'undefined'
      ? Intl.DateTimeFormat().resolvedOptions().locale
      : DEFAULT_LOCALE);

  const normalized = raw.trim().toLowerCase().replace(/_/g, '-');
  const primary = normalized.split('-')[0] ?? '';

  if (isLocale(primary)) {
    return primary;
  }

  return DEFAULT_LOCALE;
}

export const LOCALE_LABEL_KEYS = {
  de: 'profile.languageDe',
  en: 'profile.languageEn',
  fr: 'profile.languageFr',
  ru: 'profile.languageRu',
} as const satisfies Record<Locale, string>;
