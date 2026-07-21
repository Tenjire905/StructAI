#!/usr/bin/env node
/**
 * Ensures glossary matches highlight each term id at most once (first hit wins).
 */

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function buildAliasPattern(alias) {
  const escaped = escapeRegExp(alias);
  return new RegExp(`(?<![\\p{L}\\p{N}_])${escaped}(?![\\p{L}\\p{N}_])`, 'giu');
}

function findGlossaryMatches(text, terms, mode) {
  const candidates = [];
  for (const term of terms) {
    const definition = term.definition[mode];
    for (const alias of term.aliases) {
      if (!alias.trim()) continue;
      const pattern = buildAliasPattern(alias);
      let match;
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
  candidates.sort((a, b) =>
    a.start !== b.start ? a.start - b.start : b.end - b.start - (a.end - a.start),
  );
  const selected = [];
  const seenIds = new Set();
  for (const candidate of candidates) {
    if (seenIds.has(candidate.id)) continue;
    const overlaps = selected.some((e) => candidate.start < e.end && candidate.end > e.start);
    if (!overlaps) {
      selected.push(candidate);
      seenIds.add(candidate.id);
    }
  }
  return selected.sort((a, b) => a.start - b.start);
}

const terms = [
  {
    id: 'prompt',
    aliases: ['Prompt', 'Prompts', 'Prompting'],
    definition: { playful: 'p', focus: 'f' },
  },
  {
    id: 'eingabe',
    aliases: ['Eingabe'],
    definition: { playful: 'p', focus: 'f' },
  },
  {
    id: 'sprachmodell',
    aliases: ['Sprachmodell'],
    definition: { playful: 'p', focus: 'f' },
  },
];

const sample =
  'Prompt = Anweisung. Ein Prompt ist die Eingabe, mit der du ein Sprachmodell steuerst. Gute Prompts reduzieren Nachfragen.';

const matches = findGlossaryMatches(sample, terms, 'focus');
const ids = matches.map((m) => m.id);
const labels = matches.map((m) => sample.slice(m.start, m.end));

const failures = [];
if (ids.filter((id) => id === 'prompt').length !== 1) {
  failures.push(
    `expected one prompt highlight, got ${ids.filter((id) => id === 'prompt').length}: ${labels.join('|')}`,
  );
}
if (!ids.includes('eingabe') || !ids.includes('sprachmodell')) {
  failures.push(`missing other first-hits: ${ids.join(',')}`);
}
if (labels[0] !== 'Prompt') {
  failures.push(`first prompt mark should be the earliest occurrence, got ${labels[0]}`);
}

console.log(JSON.stringify({ pass: failures.length === 0, failures, labels, ids }, null, 2));
process.exit(failures.length === 0 ? 0 : 1);
