/**
 * After first lesson: go straight to profile onboarding — no skill-proof loop.
 */

import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = new URL('..', import.meta.url).pathname;
const violations = [];

const lesson = readFileSync(join(root, 'app/lektion/[id].tsx'), 'utf8');
const authNav = readFileSync(join(root, 'components/AuthNavigationController.tsx'), 'utf8');
const featuresIndex = readFileSync(join(root, 'components/features/index.ts'), 'utf8');

if (existsSync(join(root, 'app/onboarding/proof.tsx'))) {
  violations.push('app/onboarding/proof.tsx must be deleted');
}
if (existsSync(join(root, 'components/features/FirstSessionProofView.tsx'))) {
  violations.push('FirstSessionProofView.tsx must be deleted');
}
if (lesson.includes("'/onboarding/proof'") || lesson.includes('/onboarding/proof')) {
  violations.push('Lesson completion must not route to /onboarding/proof');
}
if (!lesson.includes("'/onboarding/profil'") || !lesson.includes('markProfileOnboardingRequired')) {
  violations.push('First lesson must hand off to profile onboarding');
}
if (authNav.includes('onProofRoute') || authNav.includes('isOnFirstSessionProofRoute')) {
  violations.push('AuthNavigationController must not special-case proof route');
}
if (featuresIndex.includes('FirstSessionProofView')) {
  violations.push('features index must not export FirstSessionProofView');
}

assert.equal(violations.length, 0, violations.join('\n'));
console.log('verify-no-first-session-proof: ok');
