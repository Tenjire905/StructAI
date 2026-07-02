import { DEFAULT_LOCALE, type Locale } from '@/theme/locale';

export type PromptScoreCategory = 'structure' | 'goal' | 'constraints';

export type PromptScore = {
  total: number;
  structure: number;
  goal: number;
  constraints: number;
  weakestCategory: PromptScoreCategory;
};

type LocalePatterns = {
  goal: RegExp;
  constraints: RegExp;
  structure: RegExp;
};

const PATTERNS_BY_LOCALE: Record<Locale, LocalePatterns> = {
  de: {
    goal: /\b(ziel|ergebnis|erstelle|schreibe|generiere|fasse|liefere|ausgabe|output|format)\b/i,
    constraints:
      /\b(maximal|mindestens|genau|nur|ohne|zielgruppe|absätze?|wörter|zeichen|stichpunkte?|ton|stil|sprache)\b/i,
    structure: /(\n|:|;|##|--|\d\.|•|\*)/,
  },
  en: {
    goal: /\b(goal|result|create|write|generate|summarize|deliver|output|format|produce)\b/i,
    constraints:
      /\b(maximum|minimum|exactly|only|without|audience|paragraphs?|words|characters|bullet points?|tone|style|language)\b/i,
    structure: /(\n|:|;|##|--|\d\.|•|\*)/,
  },
  fr: {
    goal: /\b(objectif|resultat|résultat|crée|créer|écris|écrire|génère|generer|résume|resumer|livre|sortie|format)\b/i,
    constraints:
      /\b(maximum|minimum|exactement|seulement|sans|public|paragraphes?|mots|caractères|caracteres|puces?|ton|style|langue)\b/i,
    structure: /(\n|:|;|##|--|\d\.|•|\*)/,
  },
  ru: {
    goal: /\b(цель|результат|создай|создать|напиши|написать|сгенерируй|сгенерировать|суммируй|суммировать|вывод|формат)\b/i,
    constraints:
      /\b(максимум|минимум|ровно|только|без|аудитория|абзац|абзацев|слова|символ|пункт|тон|стиль|язык)\b/i,
    structure: /(\n|:|;|##|--|\d\.|•|\*)/,
  },
};

export function clampScore(value: number): number {
  return Math.max(5, Math.min(100, Math.round(value)));
}

/**
 * Deterministische lokale Bewertung (Demo-Modus).
 * Wird später durch die BYOK-Anbindung ersetzt – gleiche Signatur,
 * damit der Screen unverändert bleibt.
 */
export function scorePrompt(prompt: string, locale: Locale = DEFAULT_LOCALE): PromptScore {
  const trimmed = prompt.trim();
  const words = trimmed.split(/\s+/).filter(Boolean).length;
  const patterns = PATTERNS_BY_LOCALE[locale] ?? PATTERNS_BY_LOCALE[DEFAULT_LOCALE];

  const lengthBase = Math.min(40, words * 2);

  const structureHits = (trimmed.match(new RegExp(patterns.structure, 'g')) ?? []).length;
  const structure = clampScore(lengthBase + structureHits * 12);

  const goalHits = (trimmed.match(new RegExp(patterns.goal, 'gi')) ?? []).length;
  const goal = clampScore(lengthBase + goalHits * 15);

  const constraintHits = (trimmed.match(new RegExp(patterns.constraints, 'gi')) ?? []).length;
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
