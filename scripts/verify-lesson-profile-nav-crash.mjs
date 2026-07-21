/**
 * Guards against Expo Go restarts from rushed lesson/profile navigations.
 */

import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = new URL('..', import.meta.url).pathname;
const violations = [];

const settles = readFileSync(join(root, 'lib/runAfterUISettles.ts'), 'utf8');
const lessonNav = readFileSync(join(root, 'lib/lessonNavigation.ts'), 'utf8');
const lesson = readFileSync(join(root, 'app/lektion/[id].tsx'), 'utf8');
const profil = readFileSync(join(root, 'app/onboarding/profil.tsx'), 'utf8');
const dailyGoal = readFileSync(join(root, 'components/features/DailyGoalScreen.tsx'), 'utf8');

const settlesCode = settles.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');
if (settlesCode.includes('requestIdleCallback')) {
  violations.push('runAfterUISettles must not use requestIdleCallback on RN');
}
if (!settles.includes('requestAnimationFrame') || !settles.includes('setTimeout')) {
  violations.push('runAfterUISettles must use double-rAF + setTimeout');
}
if (!lessonNav.includes('safeReplace') && !lessonNav.includes('try {')) {
  violations.push('leaveLesson/openLesson must guard router.replace failures');
}
if (!lesson.includes("'handoff_profile'") || !lesson.includes('leaveLesson(router, \'/onboarding/profil\')')) {
  violations.push('First lesson must hand off via deferred handoff_profile outcome');
}
if (lesson.includes('markProfileOnboardingRequired().then')) {
  violations.push('First lesson must not navigate inside markProfile promise then()');
}
if (!profil.includes('Keyboard.dismiss') || !profil.includes('runAfterUISettles')) {
  violations.push('Profile submit must dismiss keyboard and defer navigation');
}
if (!profil.includes('navigationInFlightRef')) {
  violations.push('Profile submit must guard against double navigation');
}
if (!dailyGoal.includes('runAfterUISettles')) {
  violations.push('Daily goal save must defer navigation');
}

console.log(
  JSON.stringify(
    {
      scope: 'lesson-profile-nav-crash',
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
