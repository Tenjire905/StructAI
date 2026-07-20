/**
 * Orb coach quality: expression system + SVG presence + local voice (no Rive debt).
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

if (pkg.includes('@rive-app/react-native') || pkg.includes('react-native-nitro-modules')) {
  violations.push('package.json must not depend on Rive / nitro-modules (coach uses SVG + TTS)');
}
if (!pkg.includes('expo-speech')) {
  violations.push('package.json must include expo-speech for local coach voice');
}
if (existsSync(join(root, 'components/features/OrbRiveCompanion.tsx'))) {
  violations.push('OrbRiveCompanion must be removed');
}
if (existsSync(join(root, 'lib/orbRiveContract.ts'))) {
  violations.push('orbRiveContract must be removed');
}
if (!expressions.includes('expressionForState') || !expressions.includes('browLeftDeg')) {
  violations.push('orbExpressions must define per-state brow/eye/cheek palette');
}
if (!orb.includes('expressionForState') || !orb.includes('browLeft') || !orb.includes('cueProps')) {
  violations.push('OrbSvgCompanion must drive brows + structure cue from expressions');
}
if (orb.includes('OrbMouth') || orb.includes("'smile'") || orb.includes("'grin'")) {
  violations.push('OrbSvgCompanion must not use cartoon smile/grin mouths');
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
if (!choreo.includes('IDLE_CURIOSITY_BEATS')) {
  violations.push('orbChoreography idle beats required');
}
if (!welcome.includes('showSpeech={false}') || !welcome.includes('voiceKey=')) {
  violations.push('Welcome must stay bubble-quiet but allow parallel coach voice');
}
if (languageDoc.includes('@rive-app/react-native') && languageDoc.includes('Zielbild')) {
  violations.push('ORB_LANGUAGE.md must not keep Rive as Zielbild');
}

assert.equal(violations.length, 0, violations.join('\n'));
console.log('verify-orb-coach: ok');
