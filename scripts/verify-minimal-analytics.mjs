/**
 * K3 verification: exactly five explicit, self-hosted activation events.
 */

import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = new URL('..', import.meta.url).pathname;

function read(relativePath) {
  return readFileSync(join(root, relativePath), 'utf8');
}

const expectedEvents = [
  'onboarding_completed',
  'guest_demo_prompt_viewed',
  'byok_key_added_success',
  'first_lesson_completed',
  'account_created_from_guest',
];

const callSites = {
  onboarding_completed: 'app/onboarding/modus.tsx',
  guest_demo_prompt_viewed: 'app/(tabs)/prompt-lab.tsx',
  byok_key_added_success: 'components/features/profile/ByokKeysManager.tsx',
  first_lesson_completed: 'app/lektion/[id].tsx',
  account_created_from_guest: 'providers/AuthProvider.tsx',
};

const analytics = read('lib/analytics.ts');
const migration = read('supabase/migrations/20260710231000_app_events.sql');
const violations = [];

const eventListMatch = analytics.match(
  /ANALYTICS_EVENT_NAMES\s*=\s*\[([\s\S]*?)\]\s*as const/,
);
const declaredEvents = eventListMatch
  ? [...eventListMatch[1].matchAll(/'([^']+)'/g)].map((match) => match[1])
  : [];

if (JSON.stringify(declaredEvents) !== JSON.stringify(expectedEvents)) {
  violations.push(
    `analytics event allowlist differs: ${JSON.stringify(declaredEvents)}`,
  );
}

for (const eventName of expectedEvents) {
  if (!migration.includes(`'${eventName}'`)) {
    violations.push(`migration does not constrain event_name to ${eventName}`);
  }
}

if (!migration.includes('alter table public.app_events enable row level security')) {
  violations.push('app_events must enable RLS');
}

if (!migration.includes('grant insert on table public.app_events to anon, authenticated')) {
  violations.push('app_events must grant inserts to anon and authenticated roles');
}

if (!migration.includes('to anon') || !migration.includes('with check (user_id is null)')) {
  violations.push('guest insert policy must require a null user_id');
}

if (
  !migration.includes('to authenticated') ||
  !migration.includes('with check (auth.uid() = user_id)')
) {
  violations.push('authenticated insert policy must require auth.uid() = user_id');
}

if (/for\s+(select|update|delete)/i.test(migration)) {
  violations.push('app_events must not define client select, update, or delete policies');
}

if (/grant\s+(select|update|delete)\s+on\s+table\s+public\.app_events/i.test(migration)) {
  violations.push('app_events must not grant client read, update, or delete access');
}

if (!analytics.includes("supabase.from('app_events').insert")) {
  violations.push('trackEvent must insert directly into the self-hosted app_events table');
}

if (!analytics.includes('void insertEvent(eventName, sessionId).catch(() => undefined)')) {
  violations.push('trackEvent must be fire-and-forget and isolate failures from UI behavior');
}

if (/retry|setTimeout|setInterval/i.test(analytics)) {
  violations.push('analytics client must not add retry or background tracking behavior');
}

let explicitCallCount = 0;

for (const [eventName, relativePath] of Object.entries(callSites)) {
  const source = read(relativePath);
  const eventCall = `trackEvent('${eventName}')`;
  const occurrences = source.split(eventCall).length - 1;
  explicitCallCount += occurrences;

  if (occurrences !== 1) {
    violations.push(`${eventName} must have exactly one explicit call in ${relativePath}`);
  }
}

if (explicitCallCount !== expectedEvents.length) {
  violations.push(`expected exactly 5 explicit tracking calls, found ${explicitCallCount}`);
}

const byokManager = read(callSites.byok_key_added_success);
const validateIndex = byokManager.indexOf('await validateApiKey(trimmedKey)');
const saveIndex = byokManager.indexOf('await upsertApiKey({ provider, key: trimmedKey })');
const byokTrackIndex = byokManager.indexOf("trackEvent('byok_key_added_success')");
const catchIndex = byokManager.indexOf('} catch (error)', byokTrackIndex);

if (
  validateIndex < 0 ||
  saveIndex < validateIndex ||
  byokTrackIndex < saveIndex ||
  catchIndex < byokTrackIndex
) {
  violations.push('BYOK success event must follow validation and local save in the verified path');
}

const lesson = read(callSites.first_lesson_completed);

if (
  !lesson.includes('useProgressStore.getState().completedLessons === 0') ||
  !lesson.includes('useProgressStore.getState().completedLessons === 1')
) {
  violations.push('first lesson event must guard both pre- and post-completion counts');
}

const profile = read('app/(tabs)/profil.tsx');

if (
  !profile.includes("t('profile.privacySection')") ||
  !profile.includes("t('profile.analyticsDisclosure')")
) {
  violations.push('profile must disclose minimal event collection');
}

for (const locale of ['de', 'en', 'fr', 'ru']) {
  const catalog = read(`theme/copy/${locale}.ts`);

  if (
    !catalog.includes("'profile.privacySection'") ||
    !catalog.includes("'profile.analyticsDisclosure'")
  ) {
    violations.push(`${locale} copy is missing the analytics privacy disclosure`);
  }
}

const dependencies = JSON.parse(read('package.json')).dependencies ?? {};

for (const sdk of ['mixpanel', 'amplitude', 'segment']) {
  if (Object.keys(dependencies).some((name) => name.toLowerCase().includes(sdk))) {
    violations.push(`third-party analytics SDK detected: ${sdk}`);
  }
}

console.log(
  JSON.stringify(
    {
      declaredEvents,
      explicitCallCount,
      violations,
      pass: violations.length === 0,
    },
    null,
    2,
  ),
);

process.exit(violations.length === 0 ? 0 : 1);
