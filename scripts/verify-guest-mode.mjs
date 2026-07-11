/**
 * Static checks for K1 guest mode navigation.
 */

import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = new URL('..', import.meta.url).pathname;
const authNav = readFileSync(join(root, 'components/AuthNavigationController.tsx'), 'utf8');
const authProvider = readFileSync(join(root, 'providers/AuthProvider.tsx'), 'utf8');
const authScreen = readFileSync(
  join(root, 'components/features/auth/AuthScreenView.tsx'),
  'utf8',
);
const secureKeyStore = readFileSync(join(root, 'lib/secureKeyStore.ts'), 'utf8');

const violations = [];

if (/if \(!session\)[\s\S]*target = '\/auth'/.test(authNav)) {
  violations.push('AuthNavigationController must not force redirect to /auth when session is missing');
}

if (!authNav.includes("rootSegment === 'onboarding'")) {
  violations.push('AuthNavigationController must still route guests through onboarding');
}

if (/supabase|session|user|auth/i.test(secureKeyStore)) {
  violations.push('secureKeyStore must remain independent of auth (unexpected auth references)');
}

const conversionEventCall = "trackEvent('account_created_from_guest')";
const centralConversionCalls = authProvider.split(conversionEventCall).length - 1;
const authScreenConversionCalls = authScreen.split(conversionEventCall).length - 1;

if (centralConversionCalls !== 1 || authScreenConversionCalls !== 0) {
  violations.push(
    'account_created_from_guest must have exactly one central call in AuthProvider and none in AuthScreenView',
  );
}

if (
  !authProvider.includes("event === 'SIGNED_IN'") ||
  !authProvider.includes('activeSessionUserId.current === null') ||
  !authProvider.includes('!isProgressSnapshotEmpty(useProgressStore.getState().getSnapshot())')
) {
  violations.push(
    'central auth success handler must detect a no-session guest with local progress',
  );
}

if (
  !authProvider.includes('signInWithGoogleOAuth') ||
  !authProvider.includes('shouldTrackGuestConversion')
) {
  violations.push('Google OAuth success must flow through central guest-conversion tracking');
}

if (
  !authNav.includes('fetchProgressSnapshotForUser') ||
  !authNav.includes('hasRemoteActivity') ||
  !authNav.includes('setOnboardingCompleted()')
) {
  violations.push(
    'returning authenticated users must restore the local onboarding flag from remote activity',
  );
}

if (
  !authNav.includes("status: 'checking'") ||
  !authNav.includes('needsReturningUserCheck') ||
  !authNav.includes('hasResolvedReturningUserCheck')
) {
  violations.push(
    'navigation must wait for the returning-user server check before choosing onboarding',
  );
}

console.log(
  JSON.stringify(
    {
      scope: 'guest-mode K1 + auth follow-ups K3b',
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
