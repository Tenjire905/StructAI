/**
 * Release polish: day-2 comeback, honest paywall, Lab bridge (proof screen removed).
 */

import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = new URL('..', import.meta.url).pathname;
const violations = [];

const scoring = readFileSync(join(root, 'lib/promptScoring.ts'), 'utf8');
const profil = readFileSync(join(root, 'app/onboarding/profil.tsx'), 'utf8');
const notifications = readFileSync(join(root, 'lib/dailyGoalNotifications.ts'), 'utf8');
const paywall = readFileSync(join(root, 'components/features/ProPaywallView.tsx'), 'utf8');
const home = readFileSync(join(root, 'app/(tabs)/index.tsx'), 'utf8');
const skills = readFileSync(join(root, 'lib/sessionSkillSummary.ts'), 'utf8');
const lesson = readFileSync(join(root, 'app/lektion/[id].tsx'), 'utf8');
const en = readFileSync(join(root, 'theme/copy/en.ts'), 'utf8');

if (existsSync(join(root, 'components/features/FirstSessionProofView.tsx'))) {
  violations.push('FirstSessionProofView must stay removed');
}
if (!scoring.includes('buildDemoWeakPrompt')) {
  violations.push('promptScoring must expose locale-aware buildDemoWeakPrompt');
}
if (!lesson.includes("'/onboarding/profil'") || !lesson.includes('markProfileOnboardingRequired')) {
  violations.push('First lesson must hand off to profile onboarding');
}
if (!profil.includes("/onboarding/tagesziel") || !profil.includes('isDailyGoalSetupCompleted')) {
  violations.push('Profile onboarding must route to daily goal setup when missing');
}
if (!notifications.includes('notificationBodySkill') || !notifications.includes('resolveSessionSkillSummary')) {
  violations.push('Daily goal reminders must name the last practiced skill');
}
if (paywall.includes("pro.paywall.cta', { price")) {
  violations.push('Paywall CTA must not look like a priced store purchase');
}
if (!home.includes('home.labPracticeCta') || !home.includes('prompt-lab')) {
  violations.push('Home must bridge to Prompt Lab after first lesson');
}
if (!skills.includes("'pb-12'") || !skills.includes("'pb-7'")) {
  violations.push('Curated session skills must cover pb-7…pb-12');
}
if (!en.includes("'dailyGoal.notificationBodySkill'") || !en.includes("'sessionSkill.pb-12.proof'")) {
  violations.push('EN copy must define skill-named reminder and pb-12 skill');
}

assert.equal(violations.length, 0, violations.join('\n'));
console.log('verify-release-week1-polish: ok');
