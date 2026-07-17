import type { GlossaryTerm } from '@/lib/glossary';
import type { Locale } from '@/theme/locale';

import { GLOSSARY_DE } from './de';
import { GLOSSARY_EN } from './en';
import { GLOSSARY_FR } from './fr';
import { GLOSSARY_RU } from './ru';

const BY_LOCALE: Record<Locale, GlossaryTerm[]> = {
  de: GLOSSARY_DE,
  en: GLOSSARY_EN,
  fr: GLOSSARY_FR,
  ru: GLOSSARY_RU,
};

export function getGlossaryTerms(locale: Locale): GlossaryTerm[] {
  return BY_LOCALE[locale] ?? GLOSSARY_DE;
}
