/**
 * Orb coach quality: abstract energy orb + local voice (no face, no Rive).
 */

import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = new URL('..', import.meta.url).pathname;
const violations = [];

const pkg = readFileSync(join(root, 'package.json'), 'utf8');
const orb = readFileSync(join(root, 'components/features/OrbSvgCompanion.tsx'), 'utf8');
const facade = readFileSync(join(root, 'components/features/OrbCompanion.tsx'), 'utf8');
const presence = readFileSync(join(root, 'components/features/OrbPresence.tsx'), 'utf8');
const expressions = readFileSync(join(root, 'lib/orbExpressions.ts'), 'utf8');
const voice = readFileSync(join(root, 'lib/orbCoachVoice.ts'), 'utf8');
const choreo = readFileSync(join(root, 'lib/orbChoreography.ts'), 'utf8');
const languageDoc = readFileSync(join(root, 'ORB_LANGUAGE.md'), 'utf8');
const welcome = readFileSync(join(root, 'app/onboarding/index.tsx'), 'utf8');

if (pkg.includes('@rive-app/react-native')) {
  violations.push('package.json must not depend on Rive');
}
if (!pkg.includes('expo-speech')) {
  violations.push('package.json must include expo-speech for local coach voice');
}
if (existsSync(join(root, 'components/features/OrbRiveCompanion.tsx'))) {
  violations.push('OrbRiveCompanion must be removed');
}
if (!expressions.includes('energyForState') || !expressions.includes('spinMs')) {
  violations.push('orbExpressions must define per-state energy (spin/aura/rim)');
}
if (!orb.includes('energyForState') || !orb.includes('corona') || orb.includes('browLeft')) {
  violations.push('OrbSvgCompanion must be abstract energy orb (no brows/face)');
}
if (orb.includes('OrbMouth') || orb.includes("'smile'") || orb.includes("'grin'") || orb.includes('showFace')) {
  violations.push('OrbSvgCompanion must not use face / smile / showFace');
}
if (!facade.includes('OrbSvgCompanion') || facade.includes('OrbRiveCompanion')) {
  violations.push('OrbCompanion must render SVG coach only');
}
if (!presence.includes('voiceKey') || !presence.includes('speakOrbCoachLine')) {
  violations.push('OrbPresence must support sparse coach voice');
}
if (!voice.includes('expo-speech') || !voice.includes('soundEnabled')) {
  violations.push('orbCoachVoice must gate TTS on theme soundEnabled');
}
if (!choreo.includes('IDLE_ENERGY_BEATS') || !choreo.includes('bodyOpacityForState')) {
  violations.push('orbChoreography must define abstract energy beats');
}
if (!welcome.includes('showSpeech={false}') || !welcome.includes('voiceKey=')) {
  violations.push('Welcome must stay bubble-quiet but allow parallel coach voice');
}
if (languageDoc.toLowerCase().includes('cartoon') && languageDoc.includes('Gesicht') && languageDoc.includes('Brauen')) {
  violations.push('ORB_LANGUAGE.md must describe abstract orb, not facial mimik');
}

assert.equal(violations.length, 0, violations.join('\n'));
console.log('verify-orb-coach: ok');
