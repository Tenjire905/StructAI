import { lessonDe } from './de';
import { lessonEnCm } from './en_cm';
import { lessonEnEs } from './en_es';
import { lessonEnIl } from './en_il';
import { lessonEnPm } from './en_pm';
import { lessonEnPb } from './en_pb';
import { lessonEnSl } from './en_sl';
import { lessonFrCm } from './fr_cm';
import { lessonFrEs } from './fr_es';
import { lessonFrIl } from './fr_il';
import { lessonFrPm } from './fr_pm';
import { lessonFrPb } from './fr_pb';
import { lessonFrSl } from './fr_sl';
import { lessonRuCm } from './ru_cm';
import { lessonRuEs } from './ru_es';
import { lessonRuIl } from './ru_il';
import { lessonRuPm } from './ru_pm';
import { lessonRuPb } from './ru_pb';
import { lessonRuSl } from './ru_sl';
import type { Locale } from '@/theme/locale';

const LOCALE_LESSON_MAP: Record<Locale, Record<string, string>> = {
  de: lessonDe,
  en: {
    ...lessonEnPb,
    ...lessonEnSl,
    ...lessonEnCm,
    ...lessonEnIl,
    ...lessonEnEs,
    ...lessonEnPm,
  },
  fr: {
    ...lessonFrPb,
    ...lessonFrSl,
    ...lessonFrCm,
    ...lessonFrIl,
    ...lessonFrEs,
    ...lessonFrPm,
  },
  ru: {
    ...lessonRuPb,
    ...lessonRuSl,
    ...lessonRuCm,
    ...lessonRuIl,
    ...lessonRuEs,
    ...lessonRuPm,
  },
};

/** True only when the key exists in that locale's own map (no cross-locale fallback). */
export function hasOwnLessonText(key: string, locale: Locale): boolean {
  return Object.prototype.hasOwnProperty.call(LOCALE_LESSON_MAP[locale], key);
}

/**
 * Lesson copy for one locale. Never returns another language's string —
 * missing keys stay as the key so mixed-language UI cannot happen.
 */
export function getLocalizedLessonText(key: string, locale: Locale): string {
  return LOCALE_LESSON_MAP[locale][key] ?? key;
}

export { lessonDe };
