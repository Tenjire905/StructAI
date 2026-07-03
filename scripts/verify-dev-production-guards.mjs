/**
 * Verification harness for E3: dev-only reset and preview routes must not affect production.
 */

import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const root = new URL('..', import.meta.url).pathname;

function read(relativePath) {
  return readFileSync(join(root, relativePath), 'utf8');
}

const cases = [];

function addCase(label, violations) {
  cases.push({ label, violations });
}

const devSession = read('lib/devSession.ts');
addCase('devSession gates fresh reset on __DEV__ and no auth session', [
  ...(!devSession.includes('shouldRunDevFreshSession')
    ? ['missing shouldRunDevFreshSession()']
    : []),
  ...(!/return __DEV__ && DEV_FRESH_SESSION_ON_LAUNCH && !hasAuthenticatedSession/.test(
    devSession,
  )
    ? ['shouldRunDevFreshSession must require __DEV__, flag, and !hasAuthenticatedSession']
    : []),
]);

const bootstrap = read('lib/bootstrap.ts');
addCase('bootstrap resolves auth session before dev reset', [
  ...(!bootstrap.includes('resolveHasAuthenticatedSession')
    ? ['missing resolveHasAuthenticatedSession()']
    : []),
  ...(!bootstrap.includes('initializeDevSession(hasAuthenticatedSession)')
    ? ['initializeDevSession must receive hasAuthenticatedSession']
    : []),
  ...(/import ['"]@\/lib\/bootstrap['"]/.test(read('app/_layout.tsx'))
    ? ['root layout must not side-effect import bootstrap']
    : []),
]);

const rootLayout = read('app/_layout.tsx');
addCase('root layout registers (dev) routes only in __DEV__', [
  ...(!/__DEV__\s*\?\s*<Stack\.Screen name="\(dev\)"/.test(rootLayout)
    ? ['missing conditional Stack.Screen for (dev) group']
    : []),
]);

const devLayoutPath = 'app/(dev)/_layout.tsx';
const devLayoutExists = existsSync(join(root, devLayoutPath));
addCase('(dev) layout redirects when not __DEV__', [
  ...(devLayoutExists ? [] : [`missing ${devLayoutPath}`]),
  ...(devLayoutExists && !read(devLayoutPath).includes('if (!__DEV__)')
    ? ['(dev)/_layout.tsx must guard with !__DEV__']
    : []),
]);

const appEntries = readdirSync(join(root, 'app'));
const strayDevRoutes = appEntries.filter(
  (name) => name.startsWith('dev-') && name.endsWith('.tsx'),
);
addCase('dev preview screens live under app/(dev)/ only', [
  ...(strayDevRoutes.length === 0
    ? []
    : [`stray dev routes at app root: ${strayDevRoutes.join(', ')}`]),
]);

const expectedDevScreens = [
  'dev-preview.tsx',
  'dev-retry-preview.tsx',
  'dev-d1b-progress-preview.tsx',
  'dev-d2-chapter-states-preview.tsx',
  'dev-auth-preview.tsx',
];

const devDir = join(root, 'app/(dev)');
const devScreens = existsSync(devDir) ? readdirSync(devDir) : [];
const missingDevScreens = expectedDevScreens.filter((name) => !devScreens.includes(name));
addCase('all dev preview screens present in (dev) group', [
  ...(missingDevScreens.length === 0
    ? []
    : [`missing in app/(dev)/: ${missingDevScreens.join(', ')}`]),
]);

const authNav = read('components/AuthNavigationController.tsx');
addCase('auth navigation skips (dev) route group', [
  ...(!authNav.includes("'(dev)'") ? ["AuthNavigationController must recognize '(dev)' group"] : []),
]);

const totalViolations = cases.reduce((sum, entry) => sum + entry.violations.length, 0);

console.log(
  JSON.stringify(
    {
      note:
        'Production builds set __DEV__=false; root layout omits (dev) stack and dev layout redirects.',
      productionCheck:
        'No eas.json in repo — verified via __DEV__ guards and static route layout checks.',
      cases,
      pass: totalViolations === 0,
      totalViolations,
    },
    null,
    2,
  ),
);

process.exit(totalViolations === 0 ? 0 : 1);
