/**
 * Abstract Orb presence: energy choreography + motion-first onboarding.
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

if (!choreo.includes('IDLE_ENERGY_BEATS') || !choreo.includes('bodyOpacityForState')) {
  violations.push('orbChoreography must define idle energy beats + opacity');
}
if (orb.includes('OrbMouth') || orb.includes("'smile'") || orb.includes("'grin'") || orb.includes('showFace')) {
  violations.push('OrbSvgCompanion must stay abstract (no face/smile)');
}
if (!orb.includes('accent.primary') || !orb.includes('spin') || !orb.includes('auraPulse')) {
  violations.push('OrbSvgCompanion must use brand glow + spin + aura pulse');
}
if (!orb.includes('energyForState')) {
  violations.push('OrbSvgCompanion must drive motion from energy profiles');
}
if (!facade.includes('OrbSvgCompanion') || facade.includes('OrbRiveCompanion')) {
  violations.push('OrbCompanion must keep SVG coach only (no Rive facade)');
}
if (!presence.includes("layout === 'hero'") || !presence.includes('interaction')) {
  violations.push('OrbPresence must support hero layout + interaction beats');
}
if (!presence.includes('voiceKey')) {
  violations.push('OrbPresence must support voiceKey for parallel coach audio');
}
if (!welcome.includes('showSpeech={false}') || !welcome.includes('layout="hero"')) {
  violations.push('Welcome must be motion-first hero orb without speech pile-on');
}
if (!modus.includes('showSpeech={false}') || !loop.includes('showSpeech={false}')) {
  violations.push('Mode + loop onboarding must not stack orb speech bubbles');
}

assert.equal(violations.length, 0, violations.join('\n'));
console.log('verify-orb-rich-presence: ok');
