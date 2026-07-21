/**
 * Orb presence + Prompt Lab dictation contract.
 */

import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = new URL('..', import.meta.url).pathname;
const violations = [];

const orb = readFileSync(join(root, 'components/features/OrbSvgCompanion.tsx'), 'utf8');
const facade = readFileSync(join(root, 'components/features/OrbCompanion.tsx'), 'utf8');
const intro = readFileSync(join(root, 'app/onboarding/index.tsx'), 'utf8');
const meet = readFileSync(join(root, 'app/onboarding/meet.tsx'), 'utf8');
const completion = readFileSync(join(root, 'app/lektion/[id].tsx'), 'utf8');
const retry = readFileSync(
  join(root, 'components/features/lesson-steps/RetryPromptView.tsx'),
  'utf8',
);
const dictation = readFileSync(join(root, 'hooks/usePromptDictation.ts'), 'utf8');
const input = readFileSync(join(root, 'components/features/PromptLabTextInput.tsx'), 'utf8');
const appJson = readFileSync(join(root, 'app.json'), 'utf8');
const en = readFileSync(join(root, 'theme/copy/en.ts'), 'utf8');
const pkg = readFileSync(join(root, 'package.json'), 'utf8');

if (!facade.includes('OrbSvgCompanion')) {
  violations.push('OrbCompanion must render OrbSvgCompanion');
}
if (!orb.includes('spin') || !orb.includes('auraPulse') || !orb.includes('accent.primary')) {
  violations.push('OrbSvgCompanion must use brand glow + spin + aura pulse');
}
if (orb.includes('OrbMouth') || /mood === 'smile'|mood === 'grin'/.test(orb)) {
  violations.push('Orb must not use cartoon smile mouths');
}
if (!intro.includes('showBrand') || !intro.includes('OnboardingFeatureVisual')) {
  violations.push('Intro onboarding must be Liftoff marketing carousel with brand + visuals');
}
if (!meet.includes('OrbPresence') || !meet.includes('showSpeech')) {
  violations.push('Meet onboarding must lead with OrbPresence speech bubble');
}
if (!completion.includes("'celebrating'") || !completion.includes('orb.speech.lessonComplete')) {
  violations.push('Lesson completion must force celebrating/happy orb mimik');
}
if (!completion.includes('layout="hero"') || completion.includes('borderRadius: tokens.radius.pill')) {
  // Completion previously wrapped OrbPresence in a pill card → phantom tile beside orb.
  violations.push('Lesson completion OrbPresence must be hero-centered without pill tile wrapper');
}
if (orb.includes('accent.structure')) {
  violations.push('OrbSvgCompanion must not use accent-structure (scoring-only; causes green flecks)');
}
if (!retry.includes("'worry'") || !retry.includes('orb.speech.lessonRetry')) {
  violations.push('Retry prompt must show worry orb mimik with speech');
}
if (!dictation.includes('requireOptionalNativeModule') || !dictation.includes('isRunningInExpoGo')) {
  violations.push('usePromptDictation must probe native module / Expo Go before importing speech package');
}
if (!dictation.includes('expo-speech-recognition') || !dictation.includes('requestPermissionsAsync')) {
  violations.push('usePromptDictation must use expo-speech-recognition with permissions');
}
if (!input.includes('dictation') || !input.includes('Mic')) {
  violations.push('PromptLabTextInput must expose mic dictation control');
}
if (!appJson.includes('expo-speech-recognition')) {
  violations.push('app.json must register expo-speech-recognition plugin');
}
if (!pkg.includes('expo-speech-recognition')) {
  violations.push('package.json must depend on expo-speech-recognition');
}
if (!en.includes("'promptLab.dictationListening'") || !en.includes("'orb.speech.onboarding.welcome'")) {
  violations.push('EN copy must define dictation + onboarding orb lines');
}

assert.equal(violations.length, 0, violations.join('\n'));
console.log('verify-orb-presence-dictation: ok');
