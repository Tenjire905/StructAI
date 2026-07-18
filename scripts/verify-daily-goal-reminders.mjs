/**
 * P2.3 slice — richer daily goal reminders cancel when goal is met.
 */

import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = new URL('..', import.meta.url).pathname;
const violations = [];

function isBelowDailyGoal(orbsEarnedToday, dailyOrbGoal) {
  return dailyOrbGoal > 0 && orbsEarnedToday < dailyOrbGoal;
}

function shouldScheduleDailyGoalReminder({ enabled, dailyOrbGoal, orbsEarnedToday }) {
  return enabled && isBelowDailyGoal(orbsEarnedToday, dailyOrbGoal);
}

assert.equal(
  shouldScheduleDailyGoalReminder({ enabled: true, dailyOrbGoal: 50, orbsEarnedToday: 10 }),
  true,
);
assert.equal(
  shouldScheduleDailyGoalReminder({ enabled: true, dailyOrbGoal: 50, orbsEarnedToday: 50 }),
  false,
);
assert.equal(
  shouldScheduleDailyGoalReminder({ enabled: false, dailyOrbGoal: 50, orbsEarnedToday: 10 }),
  false,
);
assert.equal(
  shouldScheduleDailyGoalReminder({ enabled: true, dailyOrbGoal: 0, orbsEarnedToday: 0 }),
  false,
);

const source = readFileSync(join(root, 'lib/dailyGoalNotifications.ts'), 'utf8');
const store = readFileSync(join(root, 'store/progressStore.ts'), 'utf8');
const en = readFileSync(join(root, 'theme/copy/en.ts'), 'utf8');

if (!source.includes('shouldScheduleDailyGoalReminder')) {
  violations.push('dailyGoalNotifications must export shouldScheduleDailyGoalReminder');
}
if (!source.includes('remaining')) {
  violations.push('notification copy must include remaining orbs');
}
if (!store.includes('orbsEarnedToday: snapshot.orbsEarnedToday')) {
  violations.push('completeLesson must resync reminder with progress');
}
if (!en.includes('{{remaining}}')) {
  violations.push('EN notificationBody must use {{remaining}}');
}

assert.equal(violations.length, 0, violations.join('\n'));
console.log('verify-daily-goal-reminders: ok');
