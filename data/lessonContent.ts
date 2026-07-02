import { lessonContentCatalog } from '@/data/lessonContentCatalog';
import { DEFAULT_LOCALE, type Locale } from '@/theme/locale';

export function getLessonText(key: string, locale: Locale): string {
  const entry = lessonContentCatalog[key];

  if (!entry) {
    return key;
  }

  return entry[locale] ?? entry[DEFAULT_LOCALE] ?? key;
}

export { lessonContentCatalog, type LessonContentCatalog } from '@/data/lessonContentCatalog';
