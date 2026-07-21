import type { ThemeMode } from '@/theme/theme';
import type { Locale } from '@/theme/locale';

export type GlossaryTermDefinition = {
  playful: string;
  focus: string;
};

export type GlossaryTerm = {
  id: string;
  /** Match forms including playful simplifications. Longest aliases win. */
  aliases: string[];
  definition: GlossaryTermDefinition;
};

export type GlossaryMatch = {
  id: string;
  alias: string;
  start: number;
  end: number;
  definition: string;
};

export type GlossarySegment =
  | { type: 'text'; value: string }
  | { type: 'term'; value: string; match: GlossaryMatch };

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** Word-ish boundary: allow match at string edges and around punctuation/spaces. */
function buildAliasPattern(alias: string): RegExp {
  const escaped = escapeRegExp(alias);
  return new RegExp(`(?<![\\p{L}\\p{N}_])${escaped}(?![\\p{L}\\p{N}_])`, 'giu');
}

export function findGlossaryMatches(
  text: string,
  terms: GlossaryTerm[],
  mode: ThemeMode,
): GlossaryMatch[] {
  if (!text || terms.length === 0) {
    return [];
  }

  const candidates: GlossaryMatch[] = [];

  for (const term of terms) {
    const definition = term.definition[mode];

    for (const alias of term.aliases) {
      if (!alias.trim()) {
        continue;
      }

      const pattern = buildAliasPattern(alias);
      let match: RegExpExecArray | null;

      while ((match = pattern.exec(text)) !== null) {
        candidates.push({
          id: term.id,
          alias: match[0],
          start: match.index,
          end: match.index + match[0].length,
          definition,
        });
      }
    }
  }

  candidates.sort((left, right) => {
    if (left.start !== right.start) {
      return left.start - right.start;
    }

    return right.end - right.start - (left.end - left.start);
  });

  // First hit per term id only — never light the same concept twice in one block.
  const selected: GlossaryMatch[] = [];
  const seenTermIds = new Set<string>();

  for (const candidate of candidates) {
    if (seenTermIds.has(candidate.id)) {
      continue;
    }

    const overlaps = selected.some(
      (existing) => candidate.start < existing.end && candidate.end > existing.start,
    );

    if (!overlaps) {
      selected.push(candidate);
      seenTermIds.add(candidate.id);
    }
  }

  return selected.sort((left, right) => left.start - right.start);
}

export function splitTextWithGlossary(
  text: string,
  terms: GlossaryTerm[],
  mode: ThemeMode,
  claimedTermIds?: Set<string>,
): GlossarySegment[] {
  const matches = findGlossaryMatches(text, terms, mode).filter((match) => {
    if (!claimedTermIds) {
      return true;
    }

    if (claimedTermIds.has(match.id)) {
      return false;
    }

    claimedTermIds.add(match.id);
    return true;
  });

  if (matches.length === 0) {
    return [{ type: 'text', value: text }];
  }

  const segments: GlossarySegment[] = [];
  let cursor = 0;

  for (const match of matches) {
    if (match.start > cursor) {
      segments.push({ type: 'text', value: text.slice(cursor, match.start) });
    }

    segments.push({
      type: 'term',
      value: text.slice(match.start, match.end),
      match,
    });
    cursor = match.end;
  }

  if (cursor < text.length) {
    segments.push({ type: 'text', value: text.slice(cursor) });
  }

  return segments;
}

/** Split several prose blocks with one shared “first mark wins” claim set. */
export function splitTextsWithGlossary(
  texts: string[],
  terms: GlossaryTerm[],
  mode: ThemeMode,
): GlossarySegment[][] {
  const claimedTermIds = new Set<string>();
  return texts.map((text) => splitTextWithGlossary(text, terms, mode, claimedTermIds));
}

export function getGlossaryDefinition(
  terms: GlossaryTerm[],
  termId: string,
  mode: ThemeMode,
): string | undefined {
  return terms.find((term) => term.id === termId)?.definition[mode];
}

export type { Locale };
