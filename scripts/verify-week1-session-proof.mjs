/**
 * Week-1 retention: session skill summary + first-session proof loop + Lab learned framing.
 */

import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = new URL('..', import.meta.url).pathname;
const violations = [];

const skill = readFileSync(join(root, 'lib/sessionSkillSummary.ts'), 'utf8');
const card = readFileSync(join(root, 'components/features/SessionSkillSummaryCard.tsx'), 'utf8');
const proof = readFileSync(join(root, 'components/features/FirstSessionProofView.tsx'), 'utf8');
const proofRoute = readFileSync(join(root, 'app/onboarding/proof.tsx'), 'utf8');
const lesson = readFileSync(join(root, 'app/lektion/[id].tsx'), 'utf8');
const lab = readFileSync(join(root, 'app/(tabs)/prompt-lab.tsx'), 'utf8');
const en = readFileSync(join(root, 'theme/copy/en.ts'), 'utf8');

if (!skill.includes('resolveSessionSkillSummary') || !skill.includes("'pb-1'")) {
  violations.push('sessionSkillSummary must curate pb-1 skill claim');
}
if (!card.includes('sessionSkill.eyebrow')) {
  violations.push('SessionSkillSummaryCard must show skill eyebrow');
}
if (!proof.includes('comparePromptScores') || !proof.includes('buildDemoWeakPrompt')) {
  violations.push('FirstSessionProofView must critique/rewrite/compare locally');
}
if (!proofRoute.includes('/onboarding/profil')) {
  violations.push('proof route must continue to profile onboarding');
}
if (!lesson.includes("'/onboarding/proof'") || !lesson.includes('SessionSkillSummaryCard')) {
  violations.push('Lesson completion must route first session to proof and show skill card');
}
if (!lab.includes('promptLab.learnedEyebrow')) {
  violations.push('Prompt Lab must frame score result as learned skill');
}
if (!en.includes("'firstSessionProof.skillProof'") || !en.includes("'sessionSkill.pb-1.proof'")) {
  violations.push('EN copy must define first-session proof and pb-1 skill');
}

assert.equal(violations.length, 0, violations.join('\n'));
console.log('verify-week1-session-proof: ok');
