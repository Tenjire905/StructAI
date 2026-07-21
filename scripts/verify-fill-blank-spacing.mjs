/**
 * Fill-blank spacing for Focus + Playful (join gaps + Playful edge preserve).
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
const playful = readFileSync(join(root, 'lib/simplifyPlayfulCopy.ts'), 'utf8');

if (!fillJoin.includes('fillBlankJoinGap') || !fillJoin.includes('withFillBlankJoinSpaces')) {
  violations.push('fillBlankJoin must expose join helpers');
}
if (!fillView.includes('withFillBlankJoinSpaces')) {
  violations.push('FillBlankStepView must join prefix/blank/suffix with spacing helper');
}
if (fillView.includes('mode ===') && fillView.includes('withFillBlankJoinSpaces')) {
  // Join must not be gated on Focus-only.
  const joinBlock = fillView.slice(
    fillView.indexOf('withFillBlankJoinSpaces'),
    fillView.indexOf('withFillBlankJoinSpaces') + 200,
  );
  if (joinBlock.includes("mode === 'focus'") || joinBlock.includes('mode === "focus"')) {
    violations.push('Fill-blank join must apply in both theme modes, not Focus-only');
  }
}
if (!playful.includes("'fill_edge'") || !playful.includes('withPreservedEdges')) {
  violations.push('Playful simplify must preserve prefix/suffix edge whitespace');
}

function fillBlankJoinGap(left, right) {
  if (!left || !right) return '';
  if (/\s$/u.test(left) || /^\s/u.test(right)) return '';
  if (/^[.,;:!?…)%\]}»”'’]/u.test(right)) return '';
  if (/[([{„«"“'‘]$/u.test(left)) return '';
  return ' ';
}

function withFillBlankJoinSpaces(prefix, blank, suffix) {
  const lead = fillBlankJoinGap(prefix, blank);
  const trail = fillBlankJoinGap(blank, suffix);
  return {
    prefix: lead ? `${prefix}${lead}` : prefix,
    blank,
    suffix: trail ? `${trail}${suffix}` : suffix,
  };
}

const cases = [
  ['in', 'mehrere getrennte Prompts aufzuteilen', ' '],
  ['aufzuteilen', '– so bekommt', ' '],
  ['aufzuteilen', '- so bekommt', ' '],
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

const glued = withFillBlankJoinSpaces(
  'die Aufgabe in',
  'mehrere getrennte Prompts aufzuteilen',
  '- so bekommt jede Teilaufgabe',
);
if (!glued.prefix.endsWith(' ') || !glued.suffix.startsWith(' ')) {
  violations.push('joined playful-like sentence must insert spaces around the blank');
}
if (`${glued.prefix}${glued.blank}${glued.suffix}`.includes('inmehrere')) {
  violations.push('joined sentence must not glue "in" to "mehrere"');
}
if (`${glued.prefix}${glued.blank}${glued.suffix}`.includes('aufzuteilen-')) {
  violations.push('joined sentence must not glue answer to leading dash');
}

assert.equal(violations.length, 0, violations.join('\n'));
console.log(
  JSON.stringify({
    scope: 'fill-blank-spacing-both-modes',
    pass: true,
  }),
);
