/**
 * Lesson text polish: fill-blank join gaps, glossary first-only highlights, hard-vocab terms.
 */

import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = new URL('..', import.meta.url).pathname;
const violations = [];

const fillJoin = readFileSync(join(root, 'lib/fillBlankJoin.ts'), 'utf8');
const fillView = readFileSync(
  join(root, 'components/features/lesson-steps/FillBlankStepView.tsx'),
  'utf8',
);
const glossary = readFileSync(join(root, 'lib/glossary.ts'), 'utf8');
const playful = readFileSync(join(root, 'lib/simplifyPlayfulCopy.ts'), 'utf8');
const de = readFileSync(join(root, 'data/glossary/de.ts'), 'utf8');
const en = readFileSync(join(root, 'data/glossary/en.ts'), 'utf8');
const fr = readFileSync(join(root, 'data/glossary/fr.ts'), 'utf8');
const ru = readFileSync(join(root, 'data/glossary/ru.ts'), 'utf8');

if (!fillJoin.includes('fillBlankJoinGap') || !fillJoin.includes('withFillBlankJoinSpaces')) {
  violations.push('fillBlankJoin must expose join helpers');
}
if (!fillView.includes('withFillBlankJoinSpaces')) {
  violations.push('FillBlankStepView must join prefix/blank/suffix with spacing helper');
}
if (!glossary.includes('alreadyHighlighted') || !glossary.includes('existing.id === candidate.id')) {
  violations.push('findGlossaryMatches must dedupe by term id (first highlight only)');
}
if (!playful.includes("'fill_edge'") || !playful.includes('withPreservedEdges')) {
  violations.push('Playful simplify must preserve prefix/suffix edge whitespace');
}
if (!de.includes("'Laien'") || !de.includes("id: 'layperson'")) {
  violations.push('DE glossary must explain Laien');
}
if (!en.includes("'laypeople'") || !fr.includes("'novices'") || !ru.includes("'новичков'")) {
  violations.push('EN/FR/RU glossary must cover layperson equivalents');
}
if (!de.includes("id: 'audience'") || !de.includes("'Zielgruppe'")) {
  violations.push('DE glossary must explain Zielgruppe');
}

// Runtime-ish checks for join gaps (duplicated logic kept tiny for CI without TS transpile).
function fillBlankJoinGap(left, right) {
  if (!left || !right) return '';
  if (/\s$/u.test(left) || /^\s/u.test(right)) return '';
  if (/^[.,;:!?…)%\]}»”'’]/u.test(right)) return '';
  if (/[([{„«"“'‘]$/u.test(left)) return '';
  return ' ';
}

const cases = [
  ['in', 'mehrere getrennte Prompts aufzuteilen', ' '],
  ['aufzuteilen', '– so bekommt', ' '],
  ['in ', 'mehrere', ''],
  ['Antwort', '.', ''],
  ['(', 'hint', ''],
];

for (const [left, right, expected] of cases) {
  const actual = fillBlankJoinGap(left, right);
  if (actual !== expected) {
    violations.push(`join gap("${left}","${right}") => "${actual}", expected "${expected}"`);
  }
}

assert.equal(violations.length, 0, violations.join('\n'));
console.log('verify-lesson-text-polish: ok');
