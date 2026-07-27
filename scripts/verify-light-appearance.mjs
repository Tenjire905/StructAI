/**
 * Light appearance — Warm Cream palette, status bar, brand accents, mono stats.
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
const statBlock = read('components/features/StatBlock.tsx');
const appStorage = read('lib/appStorage.ts');
const tokensDoc = read('DESIGN_TOKENS.md');
const appJson = read('app.json');

if (!theme.includes("export type ThemeAppearance = 'dark' | 'light'")) {
  violations.push('theme.ts must export ThemeAppearance');
}
if (!theme.includes('export const lightColors')) {
  violations.push('theme.ts must define lightColors');
}

const lightBlock = theme.slice(theme.indexOf('export const lightColors'));
if (!lightBlock.includes("base: '#F5F1EA'")) {
  violations.push('light base must be warm cream #F5F1EA');
}
if (!lightBlock.includes("elevated: '#FFFFFF'")) {
  violations.push('light elevated chrome must be #FFFFFF');
}
if (!lightBlock.includes("card: '#FBF9F5'")) {
  violations.push('light card must be #FBF9F5');
}
if (!lightBlock.includes("inset: '#EDE4EE'")) {
  violations.push('light inset must be purple-tint #EDE4EE');
}
if (!lightBlock.includes("primary: '#6B4E87'")) {
  violations.push('light accent.primary must be #6B4E87');
}
if (!lightBlock.includes("primarySoft: '#EDE4EE'")) {
  violations.push('light primarySoft must be solid purple-tint #EDE4EE');
}
if (!lightBlock.includes("structure: '#4E8B8A'")) {
  violations.push('light structure must be cyan #4E8B8A');
}
if (!lightBlock.includes("subtle: '#E5DFD3'") || !lightBlock.includes("strong: '#8B6BA8'")) {
  violations.push('light borders must be #E5DFD3 / #8B6BA8');
}
if (!lightBlock.includes("primary: '#2E2A26'") || !lightBlock.includes("secondary: '#6B655C'")) {
  violations.push('light text must use warm ink tokens');
}
if (!lightBlock.includes("glass: 'rgba(251,249,245,0.82)'")) {
  violations.push('light glass must be cream frost');
}
if (!theme.includes('shadowOpacity: isLight ? 0.12')) {
  violations.push('getShadow light L1 must use opacity 0.12 (rgba purple shadow)');
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
if (!tabsLayout.includes('FloatingTabBar') || !tabsLayout.includes('tabBar={(props)')) {
  violations.push('Tabs must use FloatingTabBar (solid floating pill)');
}

const floatingTabBar = read('components/ui/FloatingTabBar.tsx');
if (!floatingTabBar.includes('radius.pill') || !floatingTabBar.includes('screenPadding')) {
  violations.push('FloatingTabBar must float inset with pill radius');
}
if (!floatingTabBar.includes('primarySoft') || !floatingTabBar.includes('surface.card')) {
  violations.push('FloatingTabBar must use solid card + oval primarySoft active chips');
}
if (floatingTabBar.includes('BlurView') || floatingTabBar.includes('surface.glass')) {
  violations.push('FloatingTabBar must stay solid (no transparent glass)');
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

if (!skillRank.includes('<Badge') || !skillRank.includes('color="primary"')) {
  violations.push('SkillRankStrip must use Badge + primary ProgressBar');
}
if (skillRank.includes('accent.primary') && skillRank.includes('borderColor: isLight')) {
  violations.push('SkillRankStrip must not use special accent border in light (unify with cards)');
}
if (!skillRank.includes('borderColor: tokens.colors.border.subtle')) {
  violations.push('SkillRankStrip border must match Card border.subtle');
}
if (!dailyChallenge.includes('structureSoft')) {
  violations.push('Daily challenge card must use structureSoft tint in light');
}

if (!statBlock.includes('fontFamily.mono') || !statBlock.includes("appearance === 'light'")) {
  violations.push('StatBlock must use mono only in light (dark keeps display)');
}
if (!statBlock.includes('fontFamily.display')) {
  violations.push('StatBlock must keep Clash display for dark numbers');
}

const pressable = read('components/ui/PressableScale.tsx');
const pathCard = read('components/features/PathCard.tsx');
const button = read('components/ui/Button.tsx');
if (!pressable.includes('PRESS_SCALE_SUBTLE') || !pressable.includes('0.985') || !pressable.includes('withTiming')) {
  violations.push('PressableScale must use subtle 0.985 withTiming (no spring bounce)');
}
if (pressable.includes('withSpring(0.97') || pathCard.includes('withSpring(0.97') || button.includes('withSpring(0.97')) {
  violations.push('tile/button press must not use spring 0.97');
}
if (!pathCard.includes('PRESS_SCALE_SUBTLE') || !button.includes('PRESS_SCALE_SUBTLE')) {
  violations.push('PathCard and Button must share PRESS_SCALE_SUBTLE');
}

if (!appStorage.includes('isExpoGo') || !appStorage.includes('createAsyncStorageBackedStorage')) {
  violations.push('appStorage must AsyncStorage-fallback in Expo Go (no Nitro crash)');
}
if (appStorage.includes("import { createMMKV")) {
  violations.push('appStorage must not eagerly import createMMKV (NitroModules crash)');
}

if (!tokensDoc.includes('Warm Cream') || !tokensDoc.includes('#F5F1EA')) {
  violations.push('DESIGN_TOKENS.md must document Warm Cream light stack');
}
if (!tokensDoc.includes('shadowColor #6B4E87') || !tokensDoc.includes('0.12')) {
  violations.push('DESIGN_TOKENS.md must document warm purple light elevation');
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
