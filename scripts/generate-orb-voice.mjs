#!/usr/bin/env node
/**
 * Generate Orb coach voiceover MP3s with free Microsoft Edge TTS (no API key).
 *
 * Usage:
 *   pip3 install --user edge-tts
 *   node scripts/generate-orb-voice.mjs
 *
 * Dev cost: $0. Runtime cost: $0 (clips bundled). Swap voices later for release polish.
 */

import { spawnSync } from 'node:child_process';
import { mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const root = new URL('..', import.meta.url).pathname;
const outDir = join(root, 'assets/orb-voice/de');
mkdirSync(outDir, { recursive: true });

const CLIPS = [
  ['onboarding.welcome.playful', 'Hey! Ich bin dein Orb — lass uns Prompting leicht machen.', 'playful'],
  ['onboarding.mode.playful', 'Wähl den Vibe, der zu dir passt — ich passe mich an.', 'playful'],
  ['onboarding.loop.playful', 'Kurzer Loop: lernen, üben, besser werden. Bereit?', 'playful'],
  ['onboarding.dailyGoal.playful', 'Setz ein kleines Tagesziel — ich erinner dich morgen.', 'playful'],
  ['onboarding.welcome.focus', 'Ich bin dein Orb-Coach. Wir üben klare Prompts.', 'focus'],
  ['onboarding.mode.focus', 'Focus oder Playful — gleiche Skills, andere Dichte.', 'focus'],
  ['onboarding.loop.focus', 'Drei Schritte: lernen, üben, verbessern. Start wenn bereit.', 'focus'],
  ['onboarding.dailyGoal.focus', 'Wähl ein tägliches Orb-Ziel, damit der Streak ehrlich bleibt.', 'focus'],
  ['readingStart.a.playful', 'Okay, lies das in Ruhe — ich bleib hier.', 'playful'],
  ['correct.a.playful', 'Sauber! Genau so baut man Struktur.', 'playful'],
  ['wrong.a.playful', 'Knapp daneben — schau nochmal auf die Struktur.', 'playful'],
];

const VOICES = {
  playful: 'de-DE-SeraphinaMultilingualNeural',
  focus: 'de-DE-ConradNeural',
};

const edge = existsSync(`${process.env.HOME}/.local/bin/edge-tts`)
  ? `${process.env.HOME}/.local/bin/edge-tts`
  : 'edge-tts';

let failed = 0;
for (const [name, text, mood] of CLIPS) {
  const voice = VOICES[mood];
  const file = join(outDir, `${name}.mp3`);
  const result = spawnSync(
    edge,
    ['--voice', voice, '--text', text, '--write-media', file],
    { encoding: 'utf8' },
  );
  if (result.status !== 0) {
    failed += 1;
    console.error('fail', name, result.stderr || result.error);
  } else {
    console.log('ok', name);
  }
}

writeFileSync(
  join(outDir, 'README.md'),
  `# Orb voice (de)\n\nGenerated with free Edge TTS via \`scripts/generate-orb-voice.mjs\`.\nNo runtime API. Replace with studio VO for release if desired.\n`,
);

if (failed > 0) {
  console.error(`generate-orb-voice: ${failed} failed`);
  process.exitCode = 1;
} else {
  console.log('generate-orb-voice: ok');
}
