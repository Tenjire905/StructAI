/**
 * Week-1 retention deepen: user-owned proof, one Lab next-pattern, Daily Challenge proofReuse.
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
const storage = readFileSync(join(root, 'lib/appStorage.ts'), 'utf8');
const daily = readFileSync(join(root, 'lib/dailyChallenge.ts'), 'utf8');
const homeCard = readFileSync(join(root, 'components/features/HomeDailyChallengeCard.tsx'), 'utf8');
const home = readFileSync(join(root, 'app/(tabs)/index.tsx'), 'utf8');
const en = readFileSync(join(root, 'theme/copy/en.ts'), 'utf8');
const de = readFileSync(join(root, 'theme/copy/de.ts'), 'utf8');
const fr = readFileSync(join(root, 'theme/copy/fr.ts'), 'utf8');
const ru = readFileSync(join(root, 'theme/copy/ru.ts'), 'utf8');

if (!skill.includes('resolveSessionSkillSummary') || !skill.includes("'pb-1'")) {
  violations.push('sessionSkillSummary must curate pb-1 skill claim');
}
if (!card.includes('sessionSkill.eyebrow')) {
  violations.push('SessionSkillSummaryCard must show skill eyebrow');
}
if (!proof.includes('comparePromptScores') || !proof.includes('buildDemoWeakPrompt')) {
  violations.push('FirstSessionProofView must critique/rewrite/compare locally');
}
if (!proof.includes('PromptLabTextInput') || !proof.includes('setWeakDraft') || !proof.includes('setRewriteDraft')) {
  violations.push('FirstSessionProofView must use editable user-owned drafts');
}
if (!proof.includes('setFirstSessionProofCompleted') || !proof.includes('applyCoachSuggestion')) {
  violations.push('Proof must persist completion and offer coach suggestion');
}
if (!proofRoute.includes('/onboarding/profil')) {
  violations.push('proof route must continue to profile onboarding');
}
if (!lesson.includes("'/onboarding/proof'") || !lesson.includes('SessionSkillSummaryCard')) {
  violations.push('Lesson completion must route first session to proof and show skill card');
}
if (!lab.includes('promptLab.learnedEyebrow') || !lab.includes('promptLab.nextPatternTitle')) {
  violations.push('Prompt Lab ScoreResult must show one next-pattern payoff');
}
if (lab.includes('promptLab.improvementPathSecondary') || lab.includes('comparison.improvementNotes.map')) {
  violations.push('Prompt Lab must not stack secondary tip + comparison note list');
}
if (!storage.includes('isFirstSessionProofCompleted') || !storage.includes('clearFirstSessionProofCompleted')) {
  violations.push('appStorage must persist and clear first-session proof');
}
if (!storage.includes('clearFirstSessionProofCompleted()')) {
  violations.push('clearAllOnboardingAndProfilePrefs must clear proof state');
}
if (!daily.includes("framing: proofReuse ? 'proofReuse'") || !daily.includes('proofCompleted')) {
  violations.push('dailyChallenge must support proofReuse framing when proof completed');
}
if (!homeCard.includes('bodyProofReuse') || !home.includes('isFirstSessionProofCompleted')) {
  violations.push('Home Daily Challenge must wire proofReuse framing');
}
if (!en.includes("'firstSessionProof.skillProof'") || !en.includes("'sessionSkill.pb-1.proof'")) {
  violations.push('EN copy must define first-session proof and pb-1 skill');
}
for (const [locale, source] of [
  ['en', en],
  ['de', de],
  ['fr', fr],
  ['ru', ru],
]) {
  for (const key of [
    "'firstSessionProof.weakPlaceholder'",
    "'firstSessionProof.applySuggestion'",
    "'firstSessionProof.honestNoGain'",
    "'home.dailyChallenge.bodyProofReuse'",
    "'promptLab.nextPatternTitle'",
    "'promptLab.nextPattern.example.role'",
  ]) {
    if (!source.includes(key)) {
      violations.push(`${locale} copy missing ${key}`);
    }
  }
}

assert.equal(violations.length, 0, violations.join('\n'));
console.log('verify-week1-session-proof: ok');
