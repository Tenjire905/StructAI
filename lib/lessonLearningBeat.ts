import { getGlossaryTerms } from '@/data/glossary';
import { findGlossaryMatches } from '@/lib/glossary';
import type { Locale } from '@/theme/locale';
import type { ThemeMode } from '@/theme/theme';

export type LessonLearningBeat = {
  term: string;
  definition: string;
};

/**
 * Derives a short “pattern to remember” from feedback copy via glossary matches.
 * Prefers the longest / first non-overlapping match in the explanation or hint.
 */
export function resolveLessonLearningBeat(
  text: string,
  locale: Locale,
  mode: ThemeMode,
): LessonLearningBeat | null {
  const trimmed = text.trim();

  if (!trimmed) {
    return null;
  }

  const matches = findGlossaryMatches(trimmed, getGlossaryTerms(locale), mode);

  if (matches.length === 0) {
    return null;
  }

  const primary = matches[0];

  return {
    term: primary.alias,
    definition: primary.definition,
  };
}
