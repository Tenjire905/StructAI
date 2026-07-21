/**
 * Week-1 retention leftovers without the removed first-session proof loop:
 * session skill summary card + Lab learned framing still ship.
 */

import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = new URL('..', import.meta.url).pathname;
const violations = [];

const summary = readFileSync(join(root, 'lib/sessionSkillSummary.ts'), 'utf8');
const card = readFileSync(join(root, 'components/features/SessionSkillSummaryCard.tsx'), 'utf8');
const lesson = readFileSync(join(root, 'app/lektion/[id].tsx'), 'utf8');
const lab = readFileSync(join(root, 'app/(tabs)/prompt-lab.tsx'), 'utf8');
const en = readFileSync(join(root, 'theme/copy/en.ts'), 'utf8');

if (!summary.includes('resolveSessionSkillSummary') || !summary.includes("'pb-1'")) {
  violations.push('sessionSkillSummary must resolve curated early-path skills');
}
if (!card.includes('summary.proofKey') || !card.includes('sessionSkill')) {
  violations.push('SessionSkillSummaryCard must show skill eyebrow');
}
if (lesson.includes("'/onboarding/proof'")) {
  violations.push('Lesson must not route to removed proof screen');
}
if (!lesson.includes('SessionSkillSummaryCard')) {
  violations.push('Lesson completion should still show skill summary card');
}
if (!lab.includes('promptLab.learned') && !en.includes("'promptLab.learnedEyebrow'")) {
  violations.push('Lab learned framing copy must remain');
}
if (!en.includes("'sessionSkill.pb-1.proof'")) {
  violations.push('EN copy must define pb-1 skill proof line for the summary card');
}

assert.equal(violations.length, 0, violations.join('\n'));
console.log('verify-week1-session-proof: ok');
