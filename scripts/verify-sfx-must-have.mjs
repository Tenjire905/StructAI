/**
 * SFX must-have wiring (Perplexity UX policy): start/tap/success only, never fail.
 */

import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = new URL('..', import.meta.url).pathname;
const violations = [];

const sfx = readFileSync(join(root, 'lib/sfx.ts'), 'utf8');
const lesson = readFileSync(join(root, 'app/lektion/[id].tsx'), 'utf8');
const home = readFileSync(join(root, 'app/(tabs)/index.tsx'), 'utf8');
const lab = readFileSync(join(root, 'app/(tabs)/prompt-lab.tsx'), 'utf8');
const byok = readFileSync(join(root, 'components/features/profile/ByokKeysManager.tsx'), 'utf8');
const onboarding = readFileSync(join(root, 'app/onboarding/index.tsx'), 'utf8');

if (!sfx.includes("SfxId = 'start' | 'tap' | 'success'")) {
  violations.push('sfx must keep only start/tap/success (no wrong clip)');
}
if (/\bSfxId\b[^\n]*wrong|\bSfxId\b[^\n]*fail|'wrong'\s*:|'fail'\s*:/.test(sfx)) {
  violations.push('sfx policy forbids a fail/wrong clip id');
}
if (!lesson.includes("playSfx('success'") || !lesson.includes("playSfx('tap'")) {
  violations.push('lesson must play success on correct + tap on continue');
}
if (!lesson.includes('No fail SFX') && !lesson.includes('// No fail SFX')) {
  violations.push('lesson must document silent wrong answers');
}
if (lesson.includes("playSfx('wrong'") || lesson.includes("playSfx('fail'")) {
  violations.push('lesson must never play fail SFX');
}
if (!home.includes("playSfx('start'") || !home.includes('dailyChallenge')) {
  violations.push('home Daily Challenge must play start');
}
if (!lab.includes("playSfx('success'") || !lab.includes("playSfx('tap'")) {
  violations.push('Prompt Lab must tap on score CTA and success on result');
}
if (!byok.includes("playSfx('success'")) {
  violations.push('BYOK validation success must play success');
}
if (!onboarding.includes("playSfx('start'")) {
  violations.push('onboarding entry must keep start SFX');
}

assert.equal(violations.length, 0, violations.join('\n'));
console.log('verify-sfx-must-have: ok');
