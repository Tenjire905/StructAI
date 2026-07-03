import { lessonDe } from './de';
import { lessonEnCm } from './en_cm';
import { lessonEnEs } from './en_es';
import { lessonEnIl } from './en_il';
import { lessonEnPb } from './en_pb';
import { lessonEnSl } from './en_sl';
import { lessonFrCm } from './fr_cm';
import { lessonFrEs } from './fr_es';
import { lessonFrIl } from './fr_il';
import { lessonFrPb } from './fr_pb';
import { lessonFrSl } from './fr_sl';
import { lessonRuCm } from './ru_cm';
import { lessonRuEs } from './ru_es';
import { lessonRuIl } from './ru_il';
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
  },
  fr: {
    ...lessonFrPb,
    ...lessonFrSl,
    ...lessonFrCm,
    ...lessonFrIl,
    ...lessonFrEs,
  },
  ru: {
    ...lessonRuPb,
    ...lessonRuSl,
    ...lessonRuCm,
    ...lessonRuIl,
    ...lessonRuEs,
  },
};

export function getLocalizedLessonText(key: string, locale: Locale): string {
  const localized = LOCALE_LESSON_MAP[locale][key];

  if (localized) {
    return localized;
  }

  return LOCALE_LESSON_MAP.de[key] ?? key;
}

export { lessonDe };
