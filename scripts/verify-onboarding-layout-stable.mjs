/**
 * Onboarding welcome layout must stay stable across refreshes:
 * no windowHeight compact flips, locked phone sizing, theme ready gate.
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

if (index.includes('useWindowDimensions')) {
  violations.push('onboarding index must not size layout from useWindowDimensions');
}
if (index.includes('isCompactHeight') || index.includes('compact={')) {
  violations.push('onboarding must not toggle compact mockup/caption on height');
}
if (!index.includes('isReady')) {
  violations.push('onboarding must wait for theme isReady before showing mode copy');
}
if (!index.includes('lockedPageWidthRef')) {
  violations.push('onboarding page width must lock after first measure');
}
if (/\bcompact\b/.test(visual) && visual.includes('compact?:')) {
  violations.push('OnboardingFeatureVisual must not expose compact sizing prop');
}
if (visual.includes('compact={') || visual.includes('compact =')) {
  violations.push('OnboardingFeatureVisual must not use compact sizing');
}
if (!visual.includes('lockedSizeRef') || !visual.includes('onLayout')) {
  violations.push('OnboardingFeatureVisual must lock phone size from slot onLayout');
}
if (visual.includes("maxHeight: '100%'") && visual.includes("width: '82%'")) {
  violations.push('phone crop must not use flaky percent width + maxHeight:100% combo');
}
if (!theme.includes('isReady') || !theme.includes('setIsReady(true)')) {
  violations.push('ThemeModeProvider must expose isReady after hydrate');
}

console.log(
  JSON.stringify(
    {
      scope: 'onboarding-layout-stable',
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
