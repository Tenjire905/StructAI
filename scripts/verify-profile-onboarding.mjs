/**
 * Static checks for profile onboarding stability.
 */

import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = new URL('..', import.meta.url).pathname;

function read(relativePath) {
  return readFileSync(join(root, relativePath), 'utf8');
}

const violations = [];

const appStorage = read('lib/appStorage.ts');
const profileOnboarding = read('lib/profileOnboarding.ts');
const bootstrap = read('lib/bootstrap.ts');
const authNav = read('components/AuthNavigationController.tsx');
const lesson = read('app/lektion/[id].tsx');
const profil = read('app/onboarding/profil.tsx');

if (!appStorage.includes('PROFILE_ONBOARDING_REQUIRED_KEY')) {
  violations.push('appStorage must track explicit profile onboarding required flag');
}

if (!appStorage.includes('markProfileOnboardingRequired')) {
  violations.push('appStorage must expose markProfileOnboardingRequired');
}

if (
  !appStorage.includes('isProfileOnboardingRequired() && !isProfileOnboardingCompleted()') &&
  !appStorage.includes('return isProfileOnboardingRequired() && !isProfileOnboardingCompleted()')
) {
  violations.push('isProfileOnboardingPending must depend on required flag, not completedLessons');
}

if (appStorage.includes('completedLessons >= 1')) {
  violations.push('appStorage must not gate profile onboarding on completedLessons alone');
}

if (!profileOnboarding.includes('migrateLegacyProfileOnboarding')) {
  violations.push('profile onboarding migration helper is missing');
}

if (!bootstrap.includes('migrateLegacyProfileOnboarding')) {
  violations.push('bootstrap must run legacy profile onboarding migration');
}

if (!lesson.includes('markProfileOnboardingRequired')) {
  violations.push('first lesson completion must mark profile onboarding required');
}

if (
  !authNav.includes('isInActiveLessonRoute') &&
  !authNav.includes('isInLessonFlowRoute')
) {
  violations.push('AuthNavigationController must allow active lesson route during profile pending');
}

if (!authNav.includes('isProfileOnboardingRequired()')) {
  violations.push('AuthNavigationController must sync profile completion for returning users');
}

if (!profil.includes('currentMode')) {
  violations.push('profile screen must inherit mode from earlier onboarding step');
}

if (!profil.includes('userPickedModeRef')) {
  violations.push('profile screen must respect explicit mode picks over age recommendation');
}

console.log(
  JSON.stringify(
    {
      scope: 'profile-onboarding-stability',
      violations,
      pass: violations.length === 0,
    },
    null,
    2,
  ),
);

if (violations.length > 0) {
  process.exitCode = 1;
}
