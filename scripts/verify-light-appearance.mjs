/**
 * Light appearance — Dirty Lilac Paper, status bar, brand accents, orb icons.
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
const tabsLayout = read('app/(tabs)/_layout.tsx');
const card = read('components/ui/Card.tsx');
const badge = read('components/ui/Badge.tsx');
const segmented = read('components/ui/SegmentedControl.tsx');
const certificate = read('components/features/CertificateView.tsx');
const orbIcon = read('components/features/OrbIcon.tsx');
const skillRank = read('components/features/SkillRankStrip.tsx');
const dailyChallenge = read('components/features/HomeDailyChallengeCard.tsx');
const tokensDoc = read('DESIGN_TOKENS.md');
const appJson = read('app.json');

if (!theme.includes("export type ThemeAppearance = 'dark' | 'light'")) {
  violations.push('theme.ts must export ThemeAppearance');
}
if (!theme.includes('export const lightColors')) {
  violations.push('theme.ts must define lightColors');
}

const lightBlock = theme.slice(theme.indexOf('export const lightColors'));
if (!lightBlock.includes("base: '#E8E2F2'")) {
  violations.push('light base must be dirty lilac #E8E2F2');
}
if (!lightBlock.includes("elevated: '#F2EDF8'")) {
  violations.push('light elevated chrome must be #F2EDF8');
}
if (!lightBlock.includes("card: '#F9F7FC'")) {
  violations.push('light card must be paper #F9F7FC (not pure white)');
}
if (!lightBlock.includes("inset: '#DED6EC'")) {
  violations.push('light must define surface.inset #DED6EC');
}
if (!lightBlock.includes("primary: '#5B21B6'")) {
  violations.push('light accent.primary must be deep violet #5B21B6');
}
if (!lightBlock.includes('primarySoft:')) {
  violations.push('accent soft fills required for light badges');
}
if (!lightBlock.includes("glass: 'rgba(249,247,252,0.82)'")) {
  violations.push('light glass must be paper frost, not violet mud');
}
if (theme.includes('#F4F1EA')) {
  violations.push('must not introduce cream #F4F1EA');
}
if (lightBlock.includes("elevated: '#FFFFFF'") || lightBlock.includes("card: '#FFFFFF'")) {
  violations.push('light elevated/card must not be pure white');
}
if (!theme.includes('lightColors.accent.primary') || !theme.includes('shadowOpacity: isLight ? 0.1')) {
  violations.push('getShadow light must use purple undertone (primary)');
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
if (!layout.includes('RNStatusBar.setBackgroundColor') && !layout.includes('setBackgroundColor(chrome')) {
  violations.push('Android StatusBar background must be set from chrome token');
}
if (!layout.includes('backgroundColor: page') && !layout.includes('backgroundColor: page,')) {
  violations.push('Root View must fill with page background (status-bar area inherit)');
}

if (!tabsLayout.includes('tabBarActiveTintColor: tokens.colors.accent.primary')) {
  violations.push('Bottom nav active tint must use accent.primary');
}
if (!tabsLayout.includes('TabBarGlyph') || !tabsLayout.includes('indicatorColor')) {
  violations.push('Bottom nav must show active purple indicator');
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

if (!orbIcon.includes('useId') || orbIcon.includes('id="orbIconAura"')) {
  violations.push('OrbIcon must use unique gradient ids (no shared orbIconAura)');
}
if (!orbIcon.includes('isLight ? primary : tokens.colors.text.onAccent') && !orbIcon.includes('rim = isLight ? primary')) {
  violations.push('OrbIcon light rim must use brand primary, not white onAccent');
}

if (!skillRank.includes('<Badge') || !skillRank.includes('color="primary"')) {
  violations.push('SkillRankStrip must use Badge + primary ProgressBar');
}
if (!dailyChallenge.includes('structureSoft')) {
  violations.push('Daily challenge card must use structureSoft tint in light');
}

if (!tokensDoc.includes('Dirty Lilac') || !tokensDoc.includes('#E8E2F2')) {
  violations.push('DESIGN_TOKENS.md must document Dirty Lilac Paper stack');
}
if (!tokensDoc.includes('shadowColor #5B21B6')) {
  violations.push('DESIGN_TOKENS.md must document purple-tint light elevation');
}

if (!appJson.includes('"userInterfaceStyle": "automatic"')) {
  violations.push('app.json userInterfaceStyle must be automatic for light chrome');
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
