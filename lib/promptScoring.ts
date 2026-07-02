export type PromptScoreCategory = 'structure' | 'goal' | 'constraints';

export type PromptScore = {
  total: number;
  structure: number;
  goal: number;
  constraints: number;
  weakestCategory: PromptScoreCategory;
};

const GOAL_PATTERNS =
  /\b(ziel|ergebnis|erstelle|schreibe|generiere|fasse|liefere|ausgabe|output|format)\b/i;
const CONSTRAINT_PATTERNS =
  /\b(maximal|mindestens|genau|nur|ohne|zielgruppe|absätze?|wörter|zeichen|stichpunkte?|ton|stil|sprache)\b/i;
const STRUCTURE_PATTERNS = /(\n|:|;|##|--|\d\.|•|\*)/;

export function clampScore(value: number): number {
  return Math.max(5, Math.min(100, Math.round(value)));
}

/**
 * Deterministische lokale Bewertung (Demo-Modus).
 * Wird später durch die BYOK-Anbindung ersetzt – gleiche Signatur,
 * damit der Screen unverändert bleibt.
 */
export function scorePrompt(prompt: string): PromptScore {
  const trimmed = prompt.trim();
  const words = trimmed.split(/\s+/).filter(Boolean).length;

  const lengthBase = Math.min(40, words * 2);

  const structureHits = (trimmed.match(new RegExp(STRUCTURE_PATTERNS, 'g')) ?? [])
    .length;
  const structure = clampScore(lengthBase + structureHits * 12);

  const goalHits = (trimmed.match(new RegExp(GOAL_PATTERNS, 'gi')) ?? []).length;
  const goal = clampScore(lengthBase + goalHits * 15);

  const constraintHits = (trimmed.match(new RegExp(CONSTRAINT_PATTERNS, 'gi')) ?? [])
    .length;
  const constraints = clampScore(lengthBase * 0.8 + constraintHits * 15);

  const total = clampScore(structure * 0.35 + goal * 0.35 + constraints * 0.3);

  const categories: Record<PromptScoreCategory, number> = {
    structure,
    goal,
    constraints,
  };
  const weakestCategory = (
    Object.keys(categories) as PromptScoreCategory[]
  ).reduce((weakest, category) =>
    categories[category] < categories[weakest] ? category : weakest,
  );

  return { total, structure, goal, constraints, weakestCategory };
}
