/**
 * Orb coach: abstract energy + Liftoff-style bubble coaching (no voiceover).
 */

import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = new URL('..', import.meta.url).pathname;
const violations = [];

const pkg = readFileSync(join(root, 'package.json'), 'utf8');
const orb = readFileSync(join(root, 'components/features/OrbSvgCompanion.tsx'), 'utf8');
const facade = readFileSync(join(root, 'components/features/OrbCompanion.tsx'), 'utf8');
const presence = readFileSync(join(root, 'components/features/OrbPresence.tsx'), 'utf8');
const intro = readFileSync(join(root, 'app/onboarding/index.tsx'), 'utf8');
const meet = readFileSync(join(root, 'app/onboarding/meet.tsx'), 'utf8');
const modus = readFileSync(join(root, 'app/onboarding/modus.tsx'), 'utf8');
const loop = readFileSync(join(root, 'app/onboarding/loop.tsx'), 'utf8');
const chrome = readFileSync(
  join(root, 'components/features/onboarding/OnboardingChrome.tsx'),
  'utf8',
);
const sfx = readFileSync(join(root, 'lib/sfx.ts'), 'utf8');
const featureVisual = readFileSync(
  join(root, 'components/features/onboarding/OnboardingFeatureVisual.tsx'),
  'utf8',
);
const proof = readFileSync(join(root, 'components/features/FirstSessionProofView.tsx'), 'utf8');
const languageDoc = readFileSync(join(root, 'ORB_LANGUAGE.md'), 'utf8');
const de = readFileSync(join(root, 'theme/copy/de.ts'), 'utf8');

if (pkg.includes('@rive-app/react-native')) {
  violations.push('package.json must not depend on Rive');
}
if (!orb.includes('energyForState') || orb.includes('showFace') || orb.includes('browLeft')) {
  violations.push('OrbSvgCompanion must stay abstract');
}
if (!facade.includes('OrbSvgCompanion')) {
  violations.push('OrbCompanion must render OrbSvgCompanion');
}
if (presence.includes('voiceKey') || presence.includes('OrbCoachVoicePlayer') || presence.includes('expo-audio')) {
  violations.push('OrbPresence must not wire voiceover / voiceKey');
}
if (!presence.includes('speechKey') || !presence.includes("layout === 'hero'")) {
  violations.push('OrbPresence must support hero + speechKey bubbles');
}
if (!intro.includes('OnboardingChrome') || !intro.includes('OnboardingFeatureVisual') || !intro.includes('showBrand')) {
  violations.push('Intro must be Liftoff marketing carousel with brand + feature visuals');
}
if (!intro.includes('FlatList') || !intro.includes('pagingEnabled')) {
  violations.push('Intro carousel must be swipeable (FlatList paging)');
}
if (!chrome.includes('StructAI')) {
  violations.push('OnboardingChrome must render StructAI brand mark');
}
if (!featureVisual.includes('StatusBarMock') || !featureVisual.includes('9:41')) {
  violations.push('Feature visuals must use iPhone-style phone mock frames');
}
if (!featureVisual.includes('DynamicIsland') || !featureVisual.includes('HardwareButton')) {
  violations.push('Phone mocks must include Dynamic Island + hardware buttons');
}
if (!featureVisual.includes('overflow: \'hidden\'') && !featureVisual.includes('overflow: "hidden"')) {
  violations.push('Phone mocks must crop with overflow hidden (Liftoff crop)');
}
if (!intro.includes('numberOfLines={2}') || !intro.includes('OnboardingPageDots')) {
  violations.push('Intro caption + dots must sit in a reserved non-overlapping band');
}
if (!meet.includes('showSpeech') || !meet.includes('orb.speech.onboarding.welcome')) {
  violations.push('Meet must be Orb-led with welcome speech bubble');
}
if (intro.includes('voiceKey') || meet.includes('voiceKey') || modus.includes('voiceKey') || loop.includes('voiceKey')) {
  violations.push('Onboarding must not use voiceKey');
}
if (!modus.includes('modePlayful') || !modus.includes('modeFocus')) {
  violations.push('Mode screen must react with modePlayful/modeFocus speech');
}
if (!loop.includes('orb.speech.onboarding.loop') || !loop.includes('showSpeech')) {
  violations.push('Loop must show Orb coach bubble');
}
if (!chrome.includes('OnboardingSegmentProgress') || !chrome.includes('skipLabel')) {
  violations.push('OnboardingChrome must provide segment progress + skip');
}
if (!sfx.includes('playSfx') || !sfx.includes('ExpoAudio') || !sfx.includes('isRunningInExpoGo')) {
  violations.push('lib/sfx.ts must probe ExpoAudio and stay Expo-Go safe');
}
if (!proof.includes('proofWeak') || !proof.includes('proofCritique') || !proof.includes('showSpeech')) {
  violations.push('Proof must coach each step with Orb bubbles');
}
if (!de.includes('orb.speech.onboarding.modePlayful') || !de.includes('orb.speech.onboarding.meetReady')) {
  violations.push('de copy must include expanded onboarding coach lines');
}
if (!languageDoc.includes('Kein Voiceover') && !languageDoc.toLowerCase().includes('kein voiceover')) {
  violations.push('ORB_LANGUAGE.md must drop voiceover for v1');
}
if (!languageDoc.toLowerCase().includes('liftoff')) {
  violations.push('ORB_LANGUAGE.md must document Liftoff-style onboarding');
}

assert.equal(violations.length, 0, violations.join('\n'));
console.log('verify-orb-coach: ok');
