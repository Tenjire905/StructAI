/**
 * Light appearance — tokens, persistence, onboarding chip, profile switch.
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
const certificate = read('components/features/CertificateView.tsx');
const tokensDoc = read('DESIGN_TOKENS.md');

if (!theme.includes("export type ThemeAppearance = 'dark' | 'light'")) {
  violations.push('theme.ts must export ThemeAppearance');
}
if (!theme.includes('export const lightColors')) {
  violations.push('theme.ts must define lightColors');
}
if (!theme.includes("base: '#F5F2FA'")) {
  violations.push('light base must be cool lavender #F5F2FA');
}
if (!theme.includes("primary: '#7C3AED'")) {
  violations.push('light accent.primary must be deeper violet #7C3AED');
}
if (theme.includes('#F4F1EA')) {
  violations.push('must not introduce cream #F4F1EA');
}
if (!theme.includes('resolveThemeTokens')) {
  violations.push('resolveThemeTokens required');
}
if (!theme.includes('appearance === \'light\'')) {
  violations.push('gradients/shadows must branch on light appearance');
}

if (!context.includes('structai.theme-appearance')) {
  violations.push('appearance must persist under structai.theme-appearance');
}
if (!context.includes('setAppearance') || !context.includes('toggleAppearance')) {
  violations.push('ThemeModeContext must expose setAppearance + toggleAppearance');
}
if (!context.includes('parent.appearance')) {
  violations.push('ThemeModeScope must inherit appearance');
}

if (!appearanceBtn.includes('toggleAppearance')) {
  violations.push('OnboardingAppearanceButton must toggle appearance');
}
if (!appearanceBtn.includes('Sun') || !appearanceBtn.includes('Moon')) {
  violations.push('appearance chip must use Sun/Moon icons');
}
if (!chrome.includes('OnboardingAppearanceButton')) {
  violations.push('OnboardingChrome must mount appearance button');
}
if (!chrome.includes('left: 0')) {
  violations.push('appearance control must sit on the left');
}

if (!profile.includes("setAppearance('light')") || !profile.includes("setAppearance('dark')")) {
  violations.push('Profile must offer dark/light appearance options');
}
if (!profile.includes("t('profile.appearanceSection')")) {
  violations.push('Profile must show appearance section copy');
}

if (!layout.includes('StatusBar') || !layout.includes("appearance === 'light'")) {
  violations.push('Root layout must drive StatusBar from appearance');
}
if (!layout.includes('tokens.colors.background.base')) {
  violations.push('Stack contentStyle must use tokens background');
}

if (!card.includes("tint={tokens.appearance === 'light' ? 'light' : 'dark'}")) {
  violations.push('Card glass BlurView tint must follow appearance');
}

if (!certificate.includes('resolveThemeTokens(mode, appearance)')) {
  violations.push('CertificateView must resolve tokens for mode + appearance');
}

if (!tokensDoc.includes('Light Appearance')) {
  violations.push('DESIGN_TOKENS.md must document Light Appearance');
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
