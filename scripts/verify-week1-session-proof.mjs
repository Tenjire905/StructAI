/**
 * Week-1 retention surfaces that remain after removing first-session proof:
 * session skill summary + Prompt Lab one next-pattern payoff.
 */

import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = new URL('..', import.meta.url).pathname;
const violations = [];

const skill = readFileSync(join(root, 'lib/sessionSkillSummary.ts'), 'utf8');
const card = readFileSync(join(root, 'components/features/SessionSkillSummaryCard.tsx'), 'utf8');
const lesson = readFileSync(join(root, 'app/lektion/[id].tsx'), 'utf8');
const lab = readFileSync(join(root, 'app/(tabs)/prompt-lab.tsx'), 'utf8');
const en = readFileSync(join(root, 'theme/copy/en.ts'), 'utf8');

if (existsSync(join(root, 'components/features/FirstSessionProofView.tsx'))) {
  violations.push('FirstSessionProofView must be removed');
}
if (existsSync(join(root, 'app/onboarding/proof.tsx'))) {
  violations.push('onboarding/proof route must be removed');
}
if (lesson.includes("'/onboarding/proof'") || lesson.includes('/onboarding/proof')) {
  violations.push('Lesson completion must not route to /onboarding/proof');
}
if (!lesson.includes("'/onboarding/profil'") || !lesson.includes('markProfileOnboardingRequired')) {
  violations.push('First lesson must continue to profile onboarding');
}
if (!lesson.includes('SessionSkillSummaryCard')) {
  violations.push('Lesson completion must show SessionSkillSummaryCard');
}
if (!skill.includes('resolveSessionSkillSummary') || !skill.includes("'pb-1'")) {
  violations.push('sessionSkillSummary must curate pb-1 skill claim');
}
if (!card.includes('sessionSkill.eyebrow')) {
  violations.push('SessionSkillSummaryCard must show skill eyebrow');
}
if (!lab.includes('promptLab.learnedEyebrow') || !lab.includes('promptLab.nextPatternTitle')) {
  violations.push('Prompt Lab ScoreResult must show one next-pattern payoff');
}
if (lab.includes('promptLab.improvementPathSecondary') || lab.includes('comparison.improvementNotes.map')) {
  violations.push('Prompt Lab must not stack secondary tip + comparison note list');
}
if (en.includes("'firstSessionProof.") || en.includes("'home.dailyChallenge.bodyProofReuse'")) {
  violations.push('EN copy must not define removed proof / proofReuse keys');
}
if (!en.includes("'sessionSkill.pb-1.proof'")) {
  violations.push('EN copy must keep end-of-lesson pb-1 skill proof');
}

assert.equal(violations.length, 0, violations.join('\n'));
console.log('verify-week1-session-proof: ok');
