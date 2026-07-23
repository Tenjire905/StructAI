/**
 * Light appearance — premium hierarchy, persistence, onboarding + profile controls.
 */

import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = new URL('..', import.meta.url).pathname;
const violations = [];

function read(rel) {
  return readFileSync(join(root, rel), 'utf8');
}

const theme = read('theme/theme.ts');
const context = read('theme/ThemeModeContext.tsx');
const chrome = read('components/features/onboarding/OnboardingChrome.tsx');
const appearanceBtn = read(
  'components/features/onboarding/OnboardingAppearanceButton.tsx',
);
const profile = read('app/(tabs)/profil.tsx');
const layout = read('app/_layout.tsx');
const card = read('components/ui/Card.tsx');
const badge = read('components/ui/Badge.tsx');
const segmented = read('components/ui/SegmentedControl.tsx');
const certificate = read('components/features/CertificateView.tsx');
const tokensDoc = read('DESIGN_TOKENS.md');

if (!theme.includes("export type ThemeAppearance = 'dark' | 'light'")) {
  violations.push('theme.ts must export ThemeAppearance');
}
if (!theme.includes('export const lightColors')) {
  violations.push('theme.ts must define lightColors');
}
if (!theme.includes("base: '#F3F0F8'")) {
  violations.push('light base must be recessed #F3F0F8');
}
if (!theme.includes("elevated: '#FAF8FC'")) {
  violations.push('light elevated chrome must be #FAF8FC (not pure white)');
}
if (!theme.includes("inset: '#F0ECF6'")) {
  violations.push('light must define surface.inset');
}
if (!theme.includes("primary: '#6D28D9'")) {
  violations.push('light accent.primary must be deep violet #6D28D9');
}
if (!theme.includes('primarySoft:')) {
  violations.push('accent soft fills required for light badges');
}
if (!theme.includes("glass: 'rgba(255,255,255,0.78)'")) {
  violations.push('light glass must be white frost, not violet mud');
}
if (theme.includes('#F4F1EA')) {
  violations.push('must not introduce cream #F4F1EA');
}
if (theme.includes("elevated: '#FFFFFF'") && theme.includes('lightColors')) {
  // elevated white collapses hierarchy — only fail if lightColors still has it
  const lightBlock = theme.slice(theme.indexOf('export const lightColors'));
  if (lightBlock.includes("elevated: '#FFFFFF'")) {
    violations.push('light elevated must not equal pure white card');
  }
}

if (!context.includes('structai.theme-appearance')) {
  violations.push('appearance must persist under structai.theme-appearance');
}
if (!context.includes('setAppearance') || !context.includes('toggleAppearance')) {
  violations.push('ThemeModeContext must expose setAppearance + toggleAppearance');
}

if (!appearanceBtn.includes('toggleAppearance')) {
  violations.push('OnboardingAppearanceButton must toggle appearance');
}
if (!chrome.includes('OnboardingAppearanceButton') || !chrome.includes('left: 0')) {
  violations.push('OnboardingChrome must mount left appearance button');
}

if (!profile.includes('setAppearance') || !profile.includes('SegmentedControl')) {
  violations.push('Profile must use SegmentedControl for appearance');
}
if (!profile.includes("t('profile.appearanceSection')")) {
  violations.push('Profile must show appearance section copy');
}
if (!segmented.includes('surface.inset')) {
  violations.push('SegmentedControl must use inset track');
}

if (!layout.includes('StatusBar') || !layout.includes("appearance === 'light'")) {
  violations.push('Root layout must drive StatusBar from appearance');
}

if (!card.includes("tint={isLight ? 'light' : 'dark'}") && !card.includes("tint={tokens.appearance === 'light' ? 'light' : 'dark'}")) {
  violations.push('Card glass BlurView tint must follow appearance');
}
if (!card.includes('borderWidth: isLight ? 1 : 0') && !card.includes('borderWidth: isLight ? 1')) {
  violations.push('Card must use hairline border in light');
}

if (!badge.includes('primarySoft') || !badge.includes("isLight ? 'soft' : 'solid'")) {
  violations.push('Badge must default to soft emphasis in light');
}

if (!certificate.includes('resolveThemeTokens(mode, appearance)')) {
  violations.push('CertificateView must resolve tokens for mode + appearance');
}

if (!tokensDoc.includes('surface-inset') || !tokensDoc.includes('#F3F0F8')) {
  violations.push('DESIGN_TOKENS.md must document premium light stack');
}

for (const locale of ['de', 'en', 'fr', 'ru']) {
  const copy = read(`theme/copy/${locale}.ts`);
  for (const key of [
    'profile.appearanceSection',
    'profile.appearanceDark',
    'profile.appearanceLight',
    'profile.appearanceDescription',
    'onboarding.appearanceToggleA11y',
  ]) {
    if (!copy.includes(`'${key}'`)) {
      violations.push(`${locale}: missing copy key ${key}`);
    }
  }
}

assert.equal(violations.length, 0, violations.join('\n'));
console.log('verify-light-appearance: ok');
