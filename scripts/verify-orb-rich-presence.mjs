/**
 * Rich Orb presence: choreography + motion-first onboarding (no cheap smile).
 */

import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = new URL('..', import.meta.url).pathname;
const violations = [];

const orb = readFileSync(join(root, 'components/features/OrbSvgCompanion.tsx'), 'utf8');
const facade = readFileSync(join(root, 'components/features/OrbCompanion.tsx'), 'utf8');
const choreo = readFileSync(join(root, 'lib/orbChoreography.ts'), 'utf8');
const presence = readFileSync(join(root, 'components/features/OrbPresence.tsx'), 'utf8');
const welcome = readFileSync(join(root, 'app/onboarding/index.tsx'), 'utf8');
const modus = readFileSync(join(root, 'app/onboarding/modus.tsx'), 'utf8');
const loop = readFileSync(join(root, 'app/onboarding/loop.tsx'), 'utf8');

if (!choreo.includes('IDLE_CURIOSITY_BEATS') || !choreo.includes('defaultGazeForState')) {
  violations.push('orbChoreography must define idle curiosity beats + state gaze');
}
if (orb.includes('OrbMouth') || orb.includes("'smile'") || orb.includes("'grin'")) {
  violations.push('OrbSvgCompanion must not use cartoon smile/grin mouths');
}
if (!orb.includes('accent.structure') || !orb.includes('gazeX') || !orb.includes('ringPulse')) {
  violations.push('OrbSvgCompanion must use structure iris + gaze transforms + energy ring');
}
if (!facade.includes('OrbSvgCompanion') || !facade.includes('isRunningInExpoGo')) {
  violations.push('OrbCompanion facade must keep SVG fallback and Expo Go safety');
}
if (!presence.includes("layout === 'hero'") || !presence.includes('interaction')) {
  violations.push('OrbPresence must support hero layout + interaction beats');
}
if (!welcome.includes('showSpeech={false}') || !welcome.includes('layout="hero"')) {
  violations.push('Welcome must be motion-first hero orb without speech pile-on');
}
if (!modus.includes('showSpeech={false}') || !loop.includes('showSpeech={false}')) {
  violations.push('Mode + loop onboarding must not stack orb speech bubbles');
}

assert.equal(violations.length, 0, violations.join('\n'));
console.log('verify-orb-rich-presence: ok');
