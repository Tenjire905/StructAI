/**
 * Guards against Expo Go restarts from rushed lesson/profile navigations.
 */

import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = new URL('..', import.meta.url).pathname;
const violations = [];

const settles = readFileSync(join(root, 'lib/runAfterUISettles.ts'), 'utf8');
const lessonNav = readFileSync(join(root, 'lib/lessonNavigation.ts'), 'utf8');
const lock = readFileSync(join(root, 'lib/routeTransitionLock.ts'), 'utf8');
const lesson = readFileSync(join(root, 'app/lektion/[id].tsx'), 'utf8');
const profil = readFileSync(join(root, 'app/onboarding/profil.tsx'), 'utf8');
const dailyGoal = readFileSync(join(root, 'components/features/DailyGoalScreen.tsx'), 'utf8');
const authNav = readFileSync(join(root, 'components/AuthNavigationController.tsx'), 'utf8');
const orb = readFileSync(join(root, 'components/features/OrbSvgCompanion.tsx'), 'utf8');
const onboarding = readFileSync(join(root, 'app/onboarding/index.tsx'), 'utf8');
const visual = readFileSync(
  join(root, 'components/features/onboarding/OnboardingFeatureVisual.tsx'),
  'utf8',
);

const settlesCode = settles.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');
if (settlesCode.includes('requestIdleCallback')) {
  violations.push('runAfterUISettles must not use requestIdleCallback on RN');
}
if (!settles.includes('requestAnimationFrame') || !settles.includes('setTimeout')) {
  violations.push('runAfterUISettles must use double-rAF + setTimeout');
}
if (!lock.includes('beginRouteTransition') || !lock.includes('isRouteTransitionLocked')) {
  violations.push('routeTransitionLock must expose begin/is helpers');
}
if (!lessonNav.includes('beginRouteTransition') || !lessonNav.includes('safeReplace')) {
  violations.push('leaveLesson/openLesson must lock + guard router.replace');
}
if (!lesson.includes("'handoff_profile'") || !lesson.includes("leaveLesson(router, '/onboarding/profil')")) {
  violations.push('First lesson must hand off via deferred handoff_profile outcome');
}
if (lesson.includes('markProfileOnboardingRequired().then')) {
  violations.push('First lesson must not navigate inside markProfile promise then()');
}
if (!profil.includes('Keyboard.dismiss') || !profil.includes('runAfterUISettles')) {
  violations.push('Profile submit must dismiss keyboard and defer navigation');
}
if (!profil.includes('beginRouteTransition') || !profil.includes('navigationInFlightRef')) {
  violations.push('Profile submit must lock route transition and guard double nav');
}
if (profil.includes('setMode(selectedMode);\n      Keyboard.dismiss')) {
  violations.push('Profile must not setMode before Keyboard.dismiss / replace');
}
if (!dailyGoal.includes('runAfterUISettles') || !dailyGoal.includes('beginRouteTransition')) {
  violations.push('Daily goal save must lock + defer navigation');
}
if (!dailyGoal.includes('!isSaving') || !dailyGoal.includes('OrbPresence')) {
  violations.push('Daily goal must unmount Orb before navigating away');
}
if (!authNav.includes('isRouteTransitionLocked')) {
  violations.push('AuthNavigationController must respect route transition lock');
}
if (!orb.includes('stopAllOrbMotion')) {
  violations.push('OrbSvgCompanion must cancel all shared animations on unmount');
}
if (onboarding.includes('height: captionLineHeight * 2')) {
  violations.push('Onboarding caption must not use fixed 2-line height clip');
}
if (!onboarding.includes('numberOfLines={3}')) {
  violations.push('Onboarding caption must allow 3 lines');
}
if (!visual.includes("maxHeight: '100%'") || !visual.includes('compact')) {
  violations.push('Onboarding phone crop must cap height and support compact mode');
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
