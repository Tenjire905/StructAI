/**
 * Onboarding phone mock must fill the carousel slot (height-first), not stub-crop.
 */

import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = new URL('..', import.meta.url).pathname;
const violations = [];

const index = readFileSync(join(root, 'app/onboarding/index.tsx'), 'utf8');
const visual = readFileSync(
  join(root, 'components/features/onboarding/OnboardingFeatureVisual.tsx'),
  'utf8',
);
const theme = readFileSync(join(root, 'theme/ThemeModeContext.tsx'), 'utf8');

if (index.includes('useWindowDimensions') || index.includes('isCompactHeight')) {
  violations.push('onboarding must not flip layout from windowHeight/compact');
}
if (!index.includes('isReady')) {
  violations.push('onboarding must wait for theme isReady');
}
if (!visual.includes('lockedKeyRef') || !visual.includes('onLayout')) {
  violations.push('phone size must lock from slot onLayout');
}
if (!visual.includes('Height-first') && !visual.includes('height-first') && !visual.includes('slotH')) {
  violations.push('phone crop must size height-first from carousel slot');
}
if (visual.includes('9 / 13.2')) {
  violations.push('crop must not use aggressive 9/13.2 stub ratio');
}
if (!visual.includes('9 / 16.8') && !visual.includes('CROP_ASPECT')) {
  violations.push('crop must use a taller window (~86% of phone)');
}
if (visual.includes("justifyContent: 'center'") && visual.includes('OnboardingFeatureVisual')) {
  // only fail if the outer slot still centers (creates empty void under stub phones)
  const outer = visual.slice(0, visual.indexOf('Soft brand glow'));
  if (outer.includes("justifyContent: 'center'")) {
    violations.push('phone slot must top-align to avoid empty void under crop');
  }
}
if (!theme.includes('isReady')) {
  violations.push('ThemeModeProvider must expose isReady');
}

console.log(
  JSON.stringify({
    scope: 'onboarding-mockup-fill',
    violations,
    pass: violations.length === 0,
  }, null, 2),
);

if (violations.length > 0) {
  process.exitCode = 1;
}
