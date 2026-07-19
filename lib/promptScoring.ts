import { DEFAULT_LOCALE, type Locale } from '@/theme/locale';

export type PromptScoreCategory = 'structure' | 'goal' | 'constraints';

export type PromptSignalId =
  | 'goal.action'
  | 'goal.outcome'
  | 'goal.purpose'
  | 'constraints.audience'
  | 'constraints.length'
  | 'constraints.format'
  | 'constraints.tone'
  | 'structure.sections'
  | 'structure.list'
  | 'structure.labels';

export type PromptSignalResult = {
  id: PromptSignalId;
  category: PromptScoreCategory;
  found: boolean;
  missingHint: string;
  improvedHint: string;
};

export type PromptScore = {
  total: number;
  structure: number;
  goal: number;
  constraints: number;
  weakestCategory: PromptScoreCategory;
  signals: PromptSignalResult[];
  /** 1 = no penalty, lower values dampen scores when keyword stuffing is detected */
  gamingPenalty: number;
};

export type PromptScoreComparison = {
  totalDelta: number;
  categoryDeltas: Record<PromptScoreCategory, number>;
  newlyFoundSignals: PromptSignalId[];
  improvementNotes: string[];
};

type PromptSignalDefinition = {
  id: PromptSignalId;
  category: PromptScoreCategory;
  pattern: RegExp;
  weight: number;
  missingHint: Record<Locale, string>;
  improvedHint: Record<Locale, string>;
};

const WORD_START = String.raw`(?<![\p{L}\p{N}_])`;
const WORD_END = String.raw`(?![\p{L}\p{N}_])`;

function wordPattern(source: string, flags = 'iu'): RegExp {
  return new RegExp(`${WORD_START}(?:${source})${WORD_END}`, flags);
}

const SIGNAL_DEFINITIONS: PromptSignalDefinition[] = [
  {
    id: 'goal.action',
    category: 'goal',
    pattern: wordPattern(
      'schreibe|erstelle|generiere|fasse|formuliere|write|create|generate|summarize|produce|crée|écris|génère|создай|напиши|сгенерируй',
    ),
    weight: 14,
    missingHint: {
      de: 'Keine klare Handlungsanweisung (z. B. „Schreibe …“, „Erstelle …“).',
      en: 'No clear action verb (e.g. “Write …”, “Create …”).',
      fr: 'Aucun verbe d action clair (ex. « Écris … », « Crée … »).',
      ru: 'Нет четкого глагола действия (например, «Напиши …», «Создай …»).',
    },
    improvedHint: {
      de: 'Handlungsanweisung ergänzt – das Ziel ist jetzt klarer formuliert.',
      en: 'Action verb added – the task is clearer now.',
      fr: 'Verbe d action ajoute – la tache est plus claire.',
      ru: 'Добавлен глагол действия – задача стала яснее.',
    },
  },
  {
    id: 'goal.outcome',
    category: 'goal',
    pattern: wordPattern(
      'ergebnis|ausgabe|output|deliverable|result|summary|sortie|livre|результат|вывод|формат',
    ),
    weight: 12,
    missingHint: {
      de: 'Kein gewünschtes Ergebnis genannt (Output, Zusammenfassung, Format).',
      en: 'No desired outcome stated (output, summary, deliverable).',
      fr: 'Aucun resultat attendu indique (sortie, resume, livrable).',
      ru: 'Не указан желаемый результат (вывод, формат, итог).',
    },
    improvedHint: {
      de: 'Ergebnis beschrieben – das Modell weiß, was am Ende stehen soll.',
      en: 'Outcome described – the model knows what to produce.',
      fr: 'Resultat decrit – le modele sait quoi produire.',
      ru: 'Описан результат – модель знает, что должно получиться.',
    },
  },
  {
    id: 'goal.purpose',
    category: 'goal',
    pattern: wordPattern('ziel|zweck|aufgabe|purpose|goal|objectif|цель|задача'),
    weight: 10,
    missingHint: {
      de: 'Kein übergeordnetes Ziel oder Zweck erkennbar.',
      en: 'No overarching goal or purpose detected.',
      fr: 'Aucun objectif ou but general detecte.',
      ru: 'Не видно общей цели или задачи.',
    },
    improvedHint: {
      de: 'Ziel/Zweck ergänzt – der Prompt hat jetzt eine Richtung.',
      en: 'Goal/purpose added – the prompt now has direction.',
      fr: 'Objectif ajoute – le prompt a une direction.',
      ru: 'Добавлена цель – у промпта появилось направление.',
    },
  },
  {
    id: 'constraints.audience',
    category: 'constraints',
    pattern: wordPattern('zielgruppe|leser|publikum|audience|reader|public|клиент|аудитория|читател'),
    weight: 14,
    missingHint: {
      de: 'Keine Zielgruppe genannt (z. B. Einsteiger, Fachpublikum).',
      en: 'No target audience mentioned (e.g. beginners, experts).',
      fr: 'Aucun public cible mentionne (ex. debutants, experts).',
      ru: 'Не указана целевая аудитория (например, новички, эксперты).',
    },
    improvedHint: {
      de: 'Zielgruppe genannt – Ton und Tiefe können besser angepasst werden.',
      en: 'Audience specified – tone and depth can be tuned better.',
      fr: 'Public cible ajoute – ton et profondeur mieux calibres.',
      ru: 'Указана аудитория – проще подобрать тон и глубину.',
    },
  },
  {
    id: 'constraints.length',
    category: 'constraints',
    pattern: wordPattern(
      'maximal|mindestens|max\\.|min\\.|wörter|words|zeichen|characters|sätze|sentences|mots|caract|слов|символ|максимум',
    ),
    weight: 14,
    missingHint: {
      de: 'Keine Längen- oder Umfangsvorgabe gefunden.',
      en: 'No length or size constraint found.',
      fr: 'Aucune contrainte de longueur ou de taille.',
      ru: 'Нет ограничения по длине или объему.',
    },
    improvedHint: {
      de: 'Länge/Umfang definiert – die Antwort wird fokussierter.',
      en: 'Length/size defined – answers will stay focused.',
      fr: 'Longueur definie – reponses plus concentrees.',
      ru: 'Задана длина – ответ будет более сфокусированным.',
    },
  },
  {
    id: 'constraints.format',
    category: 'constraints',
    pattern: wordPattern('stichpunkte|bullet|liste|list|absätze|paragraphs|tableau|puces|список|абзац|пункт(?:а|ов)?'),
    weight: 12,
    missingHint: {
      de: 'Kein Ausgabeformat genannt (Stichpunkte, Absätze, Tabelle …).',
      en: 'No output format specified (bullets, paragraphs, table …).',
      fr: 'Aucun format de sortie precise (puces, paragraphes …).',
      ru: 'Не указан формат вывода (список, абзацы, таблица …).',
    },
    improvedHint: {
      de: 'Format vorgegeben – die Struktur der Antwort ist klarer.',
      en: 'Format specified – response structure is clearer.',
      fr: 'Format precise – structure de reponse plus claire.',
      ru: 'Указан формат – структура ответа понятнее.',
    },
  },
  {
    id: 'constraints.tone',
    category: 'constraints',
    pattern: wordPattern('ton|stil|tone|style|formal|freundlich|sachlich|langue|язык|тон|стиль|дружелюбн'),
    weight: 8,
    missingHint: {
      de: 'Kein Ton- oder Stilhinweis (formal, knapp, freundlich …).',
      en: 'No tone/style guidance (formal, concise, friendly …).',
      fr: 'Aucune indication de ton ou de style.',
      ru: 'Нет указания тона или стиля.',
    },
    improvedHint: {
      de: 'Ton/Stil ergänzt – die Antwort passt besser zum Kontext.',
      en: 'Tone/style added – output fits the context better.',
      fr: 'Ton/style ajoute – reponse mieux adaptee.',
      ru: 'Добавлен тон/стиль – ответ лучше подходит контексту.',
    },
  },
  {
    id: 'structure.sections',
    category: 'structure',
    pattern: /(\n\s*\n|^.{0,40}:|\n##|\n-|\n\*)/m,
    weight: 12,
    missingHint: {
      de: 'Wenig Struktur – Abschnitte oder Zeilenumbrüche fehlen.',
      en: 'Little structure – missing sections or line breaks.',
      fr: 'Peu de structure – sections ou sauts de ligne manquants.',
      ru: 'Мало структуры – нет разделов или переносов строк.',
    },
    improvedHint: {
      de: 'Abschnitte ergänzt – der Prompt ist leichter zu lesen.',
      en: 'Sections added – the prompt is easier to parse.',
      fr: 'Sections ajoutees – prompt plus lisible.',
      ru: 'Добавлены разделы – промпт легче читать.',
    },
  },
  {
    id: 'structure.list',
    category: 'structure',
    pattern: /(•|\*\s|\d+\.\s|^-\s)/m,
    weight: 10,
    missingHint: {
      de: 'Keine Liste oder nummerierte Schritte erkannt.',
      en: 'No list or numbered steps detected.',
      fr: 'Aucune liste ou etapes numerotees detectees.',
      ru: 'Не найден список или нумерованные шаги.',
    },
    improvedHint: {
      de: 'Liste/Schritte ergänzt – Anforderungen sind klarer getrennt.',
      en: 'List/steps added – requirements are separated clearly.',
      fr: 'Liste/etapes ajoutees – exigences mieux separees.',
      ru: 'Добавлен список/шаги – требования разделены четче.',
    },
  },
  {
    id: 'structure.labels',
    category: 'structure',
    pattern: new RegExp(
      `${WORD_START}(?:kontext|aufgabe|format|rolle|context|task|role|contexte|tache|контекст|задача|роль)\\s*:`,
      'iu',
    ),
    weight: 12,
    missingHint: {
      de: 'Keine beschrifteten Blöcke (z. B. „Kontext:“ / „Aufgabe:“).',
      en: 'No labeled blocks (e.g. “Context:” / “Task:”).',
      fr: 'Pas de blocs etiquetes (ex. « Contexte: » / « Tache: »).',
      ru: 'Нет подписанных блоков (например, «Контекст:» / «Задача:»).',
    },
    improvedHint: {
      de: 'Beschriftete Blöcke ergänzt – Rollen im Prompt sind klarer.',
      en: 'Labeled blocks added – prompt roles are clearer.',
      fr: 'Blocs etiquetes ajoutes – roles plus clairs.',
      ru: 'Добавлены подписанные блоки – роли в промпте яснее.',
    },
  },
];

const VERB_PATTERN = wordPattern(
  'schreibe|erstelle|generiere|fasse|write|create|generate|summarize|crée|écris|создай|напиши|bin|ist|are|is|sont|est',
);

const MIN_SENTENCE_WORDS = 4;
const MIN_KEYWORD_WORD_GAP = 3;

type WordToken = {
  word: string;
  index: number;
};

export function clampScore(value: number): number {
  return Math.max(5, Math.min(100, Math.round(value)));
}

function localizeHint(map: Record<Locale, string>, locale: Locale): string {
  return map[locale] ?? map[DEFAULT_LOCALE];
}

function tokenizeWords(prompt: string): WordToken[] {
  const tokens: WordToken[] = [];
  const regex = /(?<![\p{L}\p{N}_])[\p{L}\p{N}'-]+(?![\p{L}\p{N}_])/gu;
  let match = regex.exec(prompt);

  while (match) {
    tokens.push({ word: match[0].toLowerCase(), index: tokens.length });
    match = regex.exec(prompt);
  }

  return tokens;
}

function extractSentenceWordCount(prompt: string, matchIndex: number): number {
  const before = prompt.slice(0, matchIndex);
  const after = prompt.slice(matchIndex);
  const sentenceStart = Math.max(
    before.lastIndexOf('.'),
    before.lastIndexOf('!'),
    before.lastIndexOf('?'),
    before.lastIndexOf('\n'),
  );
  const sentenceEndCandidates = [
    after.indexOf('.'),
    after.indexOf('!'),
    after.indexOf('?'),
    after.indexOf('\n'),
  ].filter((value) => value >= 0);
  const sentenceEnd =
    sentenceEndCandidates.length > 0 ? matchIndex + Math.min(...sentenceEndCandidates) : prompt.length;
  const sentence = prompt.slice(sentenceStart + 1, sentenceEnd);
  return tokenizeWords(sentence).length;
}

function hasPlausibleSentenceContext(prompt: string, matchIndex: number): boolean {
  const sentenceWords = extractSentenceWordCount(prompt, matchIndex);

  if (sentenceWords >= MIN_SENTENCE_WORDS) {
    return true;
  }

  const windowStart = Math.max(0, matchIndex - 80);
  const windowEnd = Math.min(prompt.length, matchIndex + 80);
  const window = prompt.slice(windowStart, windowEnd);

  return VERB_PATTERN.test(window) && sentenceWords >= 3;
}

function wordIndexAtChar(prompt: string, charIndex: number): number {
  return tokenizeWords(prompt.slice(0, charIndex)).length;
}

function findPatternMatches(prompt: string, pattern: RegExp): number[] {
  const indices: number[] = [];
  const flags = pattern.flags.includes('g') ? pattern.flags : `${pattern.flags}g`;
  const globalPattern = new RegExp(pattern.source, flags);
  let match = globalPattern.exec(prompt);

  while (match) {
    indices.push(match.index);
    match = globalPattern.exec(prompt);
  }

  return indices;
}

function filterByWordGap(wordIndices: number[]): number[] {
  if (wordIndices.length <= 1) {
    return wordIndices;
  }

  const sorted = [...wordIndices].sort((a, b) => a - b);
  const kept = [sorted[0]];

  for (let index = 1; index < sorted.length; index += 1) {
    const previous = kept[kept.length - 1];

    if (sorted[index] - previous >= MIN_KEYWORD_WORD_GAP) {
      kept.push(sorted[index]);
    }
  }

  return kept;
}

function detectKeywordStuffingPenalty(prompt: string, tokens: WordToken[], matchedWordIndices: number[]): number {
  if (tokens.length === 0 || matchedWordIndices.length === 0) {
    return 1;
  }

  const uniqueMatched = new Set(matchedWordIndices);
  const matchedRatio = uniqueMatched.size / tokens.length;

  if (matchedRatio > 0.45) {
    return 0.55;
  }

  const commaCount = (prompt.match(/,/g) ?? []).length;
  const sentenceBreaks = (prompt.match(/[.!?\n]/g) ?? []).length;

  if (commaCount >= 3 && sentenceBreaks === 0 && tokens.length <= commaCount + 6) {
    return 0.5;
  }

  return 1;
}

function scoreCategory(
  category: PromptScoreCategory,
  signals: PromptSignalResult[],
  words: number,
  gamingPenalty: number,
): number {
  const definitions = SIGNAL_DEFINITIONS.filter((entry) => entry.category === category);
  const base = Math.min(22, words * 1.4);
  const foundWeight = definitions.reduce((sum, definition) => {
    const signal = signals.find((entry) => entry.id === definition.id);

    return sum + (signal?.found ? definition.weight : 0);
  }, 0);
  const coverageRatio =
    definitions.filter((definition) => signals.find((entry) => entry.id === definition.id)?.found).length /
    definitions.length;

  const raw = base + foundWeight + coverageRatio * 10;

  return clampScore(raw * gamingPenalty);
}

export function scorePrompt(prompt: string, locale: Locale = DEFAULT_LOCALE): PromptScore {
  const trimmed = prompt.trim();
  const words = tokenizeWords(trimmed).length;
  const tokens = tokenizeWords(trimmed);
  const matchedWordIndices: number[] = [];

  const signals = SIGNAL_DEFINITIONS.map((definition) => {
    const matchIndices = findPatternMatches(trimmed, definition.pattern);
    const validMatches = matchIndices.filter((matchIndex) =>
      hasPlausibleSentenceContext(trimmed, matchIndex),
    );
    const found = validMatches.length > 0;

    if (found) {
      for (const matchIndex of validMatches) {
        matchedWordIndices.push(wordIndexAtChar(trimmed, matchIndex));
      }
    }

    return {
      id: definition.id,
      category: definition.category,
      found,
      missingHint: localizeHint(definition.missingHint, locale),
      improvedHint: localizeHint(definition.improvedHint, locale),
    };
  });

  const gamingPenalty = detectKeywordStuffingPenalty(
    trimmed,
    tokens,
    filterByWordGap(matchedWordIndices),
  );

  let adjustedSignals = signals;

  if (gamingPenalty < 1) {
    const keptFoundIds = new Set<PromptSignalId>();

    adjustedSignals = signals.map((signal) => {
      if (!signal.found) {
        return signal;
      }

      const categoryFoundCount = [...keptFoundIds].filter((id) =>
        SIGNAL_DEFINITIONS.find((entry) => entry.id === id)?.category === signal.category,
      ).length;

      if (categoryFoundCount >= 1) {
        return { ...signal, found: false };
      }

      keptFoundIds.add(signal.id);
      return signal;
    });
  }

  const structure = scoreCategory('structure', adjustedSignals, words, gamingPenalty);
  const goal = scoreCategory('goal', adjustedSignals, words, gamingPenalty);
  const constraints = scoreCategory('constraints', adjustedSignals, words, gamingPenalty);
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

  return {
    total,
    structure,
    goal,
    constraints,
    weakestCategory,
    signals: adjustedSignals,
    gamingPenalty,
  };
}

export function getMissingHints(score: PromptScore, limit = 4): string[] {
  const weakestMissing = score.signals
    .filter((signal) => !signal.found && signal.category === score.weakestCategory)
    .map((signal) => signal.missingHint);
  const otherMissing = score.signals
    .filter((signal) => !signal.found && signal.category !== score.weakestCategory)
    .map((signal) => signal.missingHint);

  return [...weakestMissing, ...otherMissing].slice(0, limit);
}

/** Pedagogy pillars for one clear improvement path (not score categories). */
export type PromptImprovementPillar = 'context' | 'role' | 'format' | 'constraints';

export type PromptImprovementPath = {
  primary: PromptImprovementPillar;
  secondary?: PromptImprovementPillar;
};

const PILLAR_PRIORITY: PromptImprovementPillar[] = [
  'role',
  'context',
  'constraints',
  'format',
];

const ROLE_PATTERN = new RegExp(
  `(?:^|\\n)\\s*(?:role|rolle|роль)\\s*:|${WORD_START}(?:you are|du bist|tu es|acting as|agiere als|выступай как)${WORD_END}`,
  'iu',
);

const CONTEXT_PATTERN = new RegExp(
  `(?:^|\\n)\\s*(?:context|kontext|contexte|контекст)\\s*:|${WORD_START}(?:background|hintergrund|given that|angenommen|suppose)${WORD_END}`,
  'iu',
);

const FORMAT_PATTERN = new RegExp(
  `(?:^|\\n)\\s*(?:format|формат)\\s*:|${WORD_START}(?:stichpunkte|bullet|liste|list|absätze|paragraphs|tableau|puces|список|абзац|json|markdown)${WORD_END}`,
  'iu',
);

const CONSTRAINTS_PATTERN = new RegExp(
  `(?:^|\\n)\\s*(?:constraints?|vorgaben|contraintes|ограничен)\\s*:|${WORD_START}(?:maximal|mindestens|max\\.|min\\.|wörter|words|zeichen|characters|zielgruppe|audience|ton|tone|style|stil|максимум|слов|аудитория|тон)${WORD_END}`,
  'iu',
);

export function detectPromptPillars(prompt: string): Record<PromptImprovementPillar, boolean> {
  const trimmed = prompt.trim();

  return {
    role: ROLE_PATTERN.test(trimmed),
    context: CONTEXT_PATTERN.test(trimmed),
    format: FORMAT_PATTERN.test(trimmed),
    constraints: CONSTRAINTS_PATTERN.test(trimmed),
  };
}

/**
 * One clear improvement path: primary missing pillar + optional secondary.
 * Returns null when all pedagogical pillars are present.
 */
export function getPrimaryImprovementPath(prompt: string): PromptImprovementPath | null {
  const pillars = detectPromptPillars(prompt);
  const missing = PILLAR_PRIORITY.filter((pillar) => !pillars[pillar]);

  if (missing.length === 0) {
    return null;
  }

  return {
    primary: missing[0],
    secondary: missing[1],
  };
}

/**
 * Remote BYOK scores often omit signals — attach local heuristic signals for coaching.
 */
export function attachLocalFeedbackSignals(
  score: PromptScore,
  prompt: string,
  locale: Locale = DEFAULT_LOCALE,
): PromptScore {
  if (score.signals.length > 0) {
    return score;
  }

  const local = scorePrompt(prompt, locale);

  return {
    ...score,
    signals: local.signals,
    gamingPenalty: local.gamingPenalty,
  };
}

export function comparePromptScores(
  before: PromptScore,
  after: PromptScore,
): PromptScoreComparison {
  const categoryDeltas: Record<PromptScoreCategory, number> = {
    structure: after.structure - before.structure,
    goal: after.goal - before.goal,
    constraints: after.constraints - before.constraints,
  };

  const newlyFoundSignals = after.signals
    .filter((signal) => {
      if (!signal.found) {
        return false;
      }

      const previous = before.signals.find((entry) => entry.id === signal.id);

      return !previous?.found;
    })
    .map((signal) => signal.id);

  const improvementNotes = after.signals
    .filter((signal) => newlyFoundSignals.includes(signal.id))
    .map((signal) => signal.improvedHint);

  if (improvementNotes.length === 0 && after.total > before.total) {
    improvementNotes.push(
      after.signals[0]?.improvedHint ??
        `Gesamtbewertung +${after.total - before.total} – mehr Kontext und Struktur erkannt.`,
    );
  }

  return {
    totalDelta: after.total - before.total,
    categoryDeltas,
    newlyFoundSignals,
    improvementNotes,
  };
}

/** Demo weak prompt for guest-mode Prompt Lab (locale-aware). */
export function buildDemoWeakPrompt(locale: Locale = DEFAULT_LOCALE): string {
  if (locale === 'en') {
    return 'Write something about AI.';
  }

  if (locale === 'fr') {
    return 'Ecris quelque chose sur l’IA.';
  }

  if (locale === 'ru') {
    return 'Напиши что-нибудь про ИИ.';
  }

  return 'Schreibe etwas über KI.';
}

/** @deprecated Prefer buildDemoWeakPrompt(locale) — kept for callers that need a stable DE string. */
export const DEMO_WEAK_PROMPT = buildDemoWeakPrompt('de');

export function buildDemoImprovedPrompt(locale: Locale = DEFAULT_LOCALE): string {
  if (locale === 'en') {
    return [
      'Role: You are a clear teaching assistant.',
      'Context: Beginner audience, no jargon.',
      'Task: Write a short intro to prompt engineering.',
      'Format: 3 bullet points, max 80 words, friendly tone.',
    ].join('\n');
  }

  if (locale === 'fr') {
    return [
      'Role : Tu es un assistant pedagogique clair.',
      'Contexte : public debutant, sans jargon.',
      'Tache : Ecris une courte intro au prompt engineering.',
      'Format : 3 puces, max 80 mots, ton amical.',
    ].join('\n');
  }

  if (locale === 'ru') {
    return [
      'Роль: Ты — понятный преподаватель-помощник.',
      'Контекст: аудитория новичков, без жаргона.',
      'Задача: Напиши короткое введение в prompt engineering.',
      'Формат: 3 пункта, максимум 80 слов, дружелюбный тон.',
    ].join('\n');
  }

  return [
    'Rolle: Du bist ein klarer Lern-Coach.',
    'Kontext: Zielgruppe Einsteiger, kein Fachjargon.',
    'Aufgabe: Schreibe eine kurze Einführung in Prompt Engineering.',
    'Format: 3 Stichpunkte, maximal 80 Wörter, freundlicher Ton.',
  ].join('\n');
}
