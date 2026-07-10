/**
 * Static checks for K1 guest mode navigation.
 */

import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = new URL('..', import.meta.url).pathname;
const authNav = readFileSync(join(root, 'components/AuthNavigationController.tsx'), 'utf8');
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

console.log(
  JSON.stringify(
    {
      scope: 'guest-mode K1',
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
