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
const welcome = readFileSync(join(root, 'app/onboarding/index.tsx'), 'utf8');
const modus = readFileSync(join(root, 'app/onboarding/modus.tsx'), 'utf8');
const loop = readFileSync(join(root, 'app/onboarding/loop.tsx'), 'utf8');
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
if (!welcome.includes('showSpeech') || !welcome.includes('orb.speech.onboarding.welcome')) {
  violations.push('Welcome must be Orb-led with welcome speech bubble');
}
if (welcome.includes('voiceKey') || modus.includes('voiceKey') || loop.includes('voiceKey')) {
  violations.push('Onboarding must not use voiceKey');
}
if (!modus.includes('modePlayful') || !modus.includes('modeFocus')) {
  violations.push('Mode screen must react with modePlayful/modeFocus speech');
}
if (!loop.includes('orb.speech.onboarding.loop') || !loop.includes('showSpeech')) {
  violations.push('Loop must show Orb coach bubble');
}
if (!proof.includes('proofWeak') || !proof.includes('proofCritique') || !proof.includes('showSpeech')) {
  violations.push('Proof must coach each step with Orb bubbles');
}
if (!de.includes('orb.speech.onboarding.modePlayful') || !de.includes('orb.speech.onboarding.proofWeak')) {
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
