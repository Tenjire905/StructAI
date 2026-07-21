import { getLocalizedLessonText, hasOwnLessonText } from '@/data/lessonContent/index';
import { DEFAULT_LOCALE, type Locale } from '@/theme/locale';

export function getLessonText(key: string, locale: Locale): string {
  return getLocalizedLessonText(key, locale);
}

export { hasOwnLessonText, getLocalizedLessonText };
export type { Locale } from '@/theme/locale';
