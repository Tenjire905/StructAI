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
const voicePlayer = readFileSync(
  join(root, 'components/features/OrbCoachVoicePlayer.tsx'),
  'utf8',
);
const expressions = readFileSync(join(root, 'lib/orbExpressions.ts'), 'utf8');
const voice = readFileSync(join(root, 'lib/orbCoachVoice.ts'), 'utf8');
const choreo = readFileSync(join(root, 'lib/orbChoreography.ts'), 'utf8');
const languageDoc = readFileSync(join(root, 'ORB_LANGUAGE.md'), 'utf8');
const welcome = readFileSync(join(root, 'app/onboarding/index.tsx'), 'utf8');

if (pkg.includes('@rive-app/react-native')) {
  violations.push('package.json must not depend on Rive');
}
if (!pkg.includes('expo-audio')) {
  violations.push('package.json must include expo-audio for local voiceover');
}
if (pkg.includes('"expo-av"')) {
  violations.push('use expo-audio (Expo Go), not expo-av');
}
if (!expressions.includes('energyForState') || !expressions.includes('counterSpinMs')) {
  violations.push('orbExpressions must define dual-spin energy');
}
if (!orb.includes('energyForState') || orb.includes('browLeft') || orb.includes('showFace')) {
  violations.push('OrbSvgCompanion must stay abstract (no face)');
}
if (!facade.includes('OrbSvgCompanion')) {
  violations.push('OrbCompanion must render OrbSvgCompanion');
}
if (!presence.includes('voiceKey') || !presence.includes('OrbCoachVoicePlayer')) {
  violations.push('OrbPresence must mount OrbCoachVoicePlayer for clips');
}
if (!presence.includes('unlockAndPlay') || !presence.includes('orb.voice.tapHint')) {
  violations.push('OrbPresence must support tap-to-play coach voice');
}
if (!presence.includes('resolveOrbCoachClip')) {
  violations.push('OrbPresence must resolve coach clips');
}
if (!voicePlayer.includes('useAudioPlayer') || !voicePlayer.includes('setAudioModeAsync')) {
  violations.push('OrbCoachVoicePlayer must use useAudioPlayer + audio mode');
}
if (!voice.includes('ExpoAudio') || !voice.includes('resolveOrbCoachClip')) {
  violations.push('orbCoachVoice must probe ExpoAudio and resolve clips');
}
if (voice.includes("from 'expo-audio'") || voice.includes('from "expo-audio"')) {
  violations.push('orbCoachVoice must not top-level-import expo-audio');
}
if (!existsSync(join(root, 'assets/orb-voice/de/onboarding.welcome.playful.mp3'))) {
  violations.push('bundled DE onboarding welcome clip missing');
}
if (!orb.includes('counterSpin') || !orb.includes('waveDash')) {
  violations.push('OrbSvgCompanion must use dual-spin wave layers');
}
if (!choreo.includes('IDLE_ENERGY_BEATS')) {
  violations.push('orbChoreography must define abstract energy beats');
}
if (!welcome.includes('showSpeech={false}') || !welcome.includes('voiceKey=')) {
  violations.push('Welcome must stay bubble-quiet but allow parallel coach voice');
}
if (!languageDoc.toLowerCase().includes('abstrakt') && !languageDoc.toLowerCase().includes('abstract')) {
  violations.push('ORB_LANGUAGE.md must document abstract orb');
}

assert.equal(violations.length, 0, violations.join('\n'));
console.log('verify-orb-coach: ok');
