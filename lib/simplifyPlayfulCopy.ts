import type { Locale } from '@/theme/locale';

const DE_REPLACEMENTS: [RegExp, string][] = [
  [/\bSprachmodell\b/gi, 'KI'],
  [/\bModell\b/gi, 'KI'],
  [/\bPrompting\b/gi, 'Prompt-Schreiben'],
  [/\bPrompts\b/g, 'Prompts'],
  [/\bHalluzinationen\b/gi, 'erfundene Fakten'],
  [/\bDistraktoren\b/gi, 'falsche Antworten'],
  [/\bKontextfenster\b/gi, 'Gedächtnis der KI'],
  [/\bToken-Volumen\b/gi, 'Textmenge'],
  [/\bKalibriert\b/gi, 'Richtet'],
  [/\bKalibrier\w*\b/gi, 'Richte'],
  [/\bReproduzierbar\w*\b/gi, 'vorhersehbar'],
  [/\bDomäne\b/gi, 'Thema'],
  [/\bConstraints\b/gi, 'Grenzen'],
  [/\bOutput\b/gi, 'Ausgabe'],
  [/\bInput\b/gi, 'Eingabe'],
  [/\bFew-shot\b/gi, 'Beispiel-Trick'],
  [/\bJSON\b/g, 'JSON'],
  [/\bdu\b/g, 'du'],
  [/\bDu\b/g, 'Du'],
  [/\bIhr\b/g, 'Ihr'],
  [/\bSie\b/g, 'Sie'],
];

const EN_REPLACEMENTS: [RegExp, string][] = [
  [/\blanguage model\b/gi, 'AI'],
  [/\bthe model\b/gi, 'the AI'],
  [/\bModel\b/g, 'AI'],
  [/\bcontext window\b/gi, 'AI memory'],
  [/\bhallucinations\b/gi, 'made-up facts'],
  [/\bdistractors\b/gi, 'wrong answers'],
  [/\bcalibrat\w*\b/gi, 'tune'],
  [/\breproduc\w*\b/gi, 'predictable'],
];

const FR_REPLACEMENTS: [RegExp, string][] = [
  [/\bmodèle\b/gi, 'IA'],
  [/\bmodèle de langage\b/gi, 'IA'],
  [/\bfenêtre de contexte\b/gi, 'mémoire de l\'IA'],
  [/\bhallucinations\b/gi, 'faits inventés'],
];

const RU_REPLACEMENTS: [RegExp, string][] = [
  [/\bязыков\w* модел\w*\b/giu, 'ИИ'],
  [/\bмодел\w*\b/giu, 'ИИ'],
  [/\bконтекстн\w* окн\w*\b/giu, 'память ИИ'],
  [/\bгаллюцинац\w*\b/giu, 'выдуманные факты'],
];

const REPLACEMENTS: Record<Locale, [RegExp, string][]> = {
  de: DE_REPLACEMENTS,
  en: EN_REPLACEMENTS,
  fr: FR_REPLACEMENTS,
  ru: RU_REPLACEMENTS,
};

function splitSentences(text: string): string[] {
  return text
    .split(/(?<=[.!?…])\s+/)
    .map((part) => part.trim())
    .filter(Boolean);
}

function shortenClause(text: string, maxLength: number): string {
  const trimmed = text.trim();
  if (trimmed.length <= maxLength) {
    return trimmed;
  }

  const commaSplit = trimmed.split(/[,;–—]/)[0]?.trim() ?? trimmed;
  if (commaSplit.length <= maxLength && commaSplit.length >= trimmed.length * 0.45) {
    return commaSplit.endsWith('.') ? commaSplit : `${commaSplit}.`;
  }

  return `${trimmed.slice(0, maxLength - 1).trim()}…`;
}

function applyReplacements(text: string, locale: Locale): string {
  return REPLACEMENTS[locale].reduce(
    (result, [pattern, replacement]) => result.replace(pattern, replacement),
    text,
  );
}

function simplifyQuestion(text: string, locale: Locale): string {
  const replaced = applyReplacements(text, locale);

  if (locale === 'de') {
    return shortenClause(
      replaced
        .replace(/^Welche(?:r|s|n)?\s+/i, 'Was ')
        .replace(/^Wofür brauchst du\s+/i, 'Wofür nutzt du nicht ')
        .replace(/ am (?:nützlichsten|besten|effektivsten|sinnvollsten|genauesten)\?$/i, '?')
        .replace(/ am ehesten\?$/i, '?'),
      110,
    );
  }

  return shortenClause(replaced, 110);
}

function simplifyBody(text: string, locale: Locale): string {
  const replaced = applyReplacements(text, locale);
  const sentences = splitSentences(replaced);
  const picked = sentences.slice(0, 2).join(' ');

  return shortenClause(picked, locale === 'de' ? 220 : 240);
}

function simplifyTitle(text: string, locale: Locale): string {
  const replaced = applyReplacements(text, locale);
  const withoutSubtitle = replaced.split(/[–—:]/)[0]?.trim() ?? replaced;

  return shortenClause(withoutSubtitle, 72);
}

function simplifyOption(text: string, locale: Locale): string {
  return shortenClause(applyReplacements(text, locale), 88);
}

function simplifyExplanation(text: string, locale: Locale): string {
  const replaced = applyReplacements(text, locale);
  const firstSentence = splitSentences(replaced)[0] ?? replaced;

  return shortenClause(firstSentence, 140);
}

function simplifyInstruction(text: string, locale: Locale): string {
  const replaced = applyReplacements(text, locale);

  if (locale === 'de') {
    return shortenClause(
      replaced
        .replace(/^Bringe die Schritte für\s+/i, 'Ordne: ')
        .replace(/ in die sinnvolle Reihenfolge\.?$/i, '.')
        .replace(/^Ordne\s+/i, 'Ordne: '),
      120,
    );
  }

  return shortenClause(replaced, 120);
}

function simplifyStatement(text: string, locale: Locale): string {
  return shortenClause(applyReplacements(text, locale), 130);
}

function withPreservedEdges(original: string, next: string): string {
  const lead = original.match(/^\s*/u)?.[0] ?? '';
  const trail = original.match(/\s*$/u)?.[0] ?? '';
  return `${lead}${next.trim()}${trail}`;
}

function keyKind(
  key: string,
):
  | 'title'
  | 'body'
  | 'question'
  | 'option'
  | 'explanation'
  | 'instruction'
  | 'statement'
  | 'fill_edge'
  | 'other' {
  if (key.endsWith('.title') || key.match(/\.s\d+\.title$/)) {
    return 'title';
  }
  if (key.endsWith('.body') || key.match(/\.s\d+\.body$/)) {
    return 'body';
  }
  if (key.includes('.question')) {
    return 'question';
  }
  if (key.includes('.opt') || key.includes('.blank') || key.includes('.item')) {
    return 'option';
  }
  if (key.includes('.explanation')) {
    return 'explanation';
  }
  if (key.includes('.instruction')) {
    return 'instruction';
  }
  if (key.includes('.statement')) {
    return 'statement';
  }
  // Keep leading/trailing spaces — fill-blank joins depend on them.
  if (key.includes('.prefix') || key.includes('.suffix')) {
    return 'fill_edge';
  }
  if (key.includes('.term') || key.includes('.definition') || key.includes('.segment')) {
    return 'option';
  }

  return 'other';
}

/** Returns simplified Playful copy when no authored `.playful` key exists. */
export function simplifyForPlayful(baseText: string, locale: Locale, baseKey: string): string {
  if (!baseText.trim() || baseText === baseKey) {
    return baseText;
  }

  const kind = keyKind(baseKey);

  switch (kind) {
    case 'title':
      return simplifyTitle(baseText, locale);
    case 'body':
      return simplifyBody(baseText, locale);
    case 'question':
      return simplifyQuestion(baseText, locale);
    case 'option':
      return simplifyOption(baseText, locale);
    case 'explanation':
      return simplifyExplanation(baseText, locale);
    case 'instruction':
      return simplifyInstruction(baseText, locale);
    case 'statement':
      return simplifyStatement(baseText, locale);
    case 'fill_edge':
      return withPreservedEdges(
        baseText,
        shortenClause(applyReplacements(baseText, locale), 160),
      );
    default:
      return shortenClause(applyReplacements(baseText, locale), 160);
  }
}

export function hasDistinctPlayfulCopy(baseText: string, locale: Locale, baseKey: string): boolean {
  return simplifyForPlayful(baseText, locale, baseKey) !== baseText;
}
