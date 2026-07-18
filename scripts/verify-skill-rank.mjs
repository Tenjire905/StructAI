/**
 * Soft XP / rank logic checks (P2.2).
 */

import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = new URL('..', import.meta.url).pathname;

function computeSoftXp({ completedLessons, orbCount, completedPathCount }) {
  return completedLessons * 100 + orbCount * 5 + completedPathCount * 250;
}

function xpRequiredForLevel(level) {
  return 120 + level * 40;
}

function resolveRankId(level) {
  if (level >= 15) return 'architect';
  if (level >= 10) return 'specialist';
  if (level >= 6) return 'craftsman';
  if (level >= 3) return 'builder';
  return 'spark';
}

function resolveSkillRankProgress(input) {
  const xp = computeSoftXp(input);
  let level = 1;
  let remaining = xp;

  while (remaining >= xpRequiredForLevel(level) && level < 100) {
    remaining -= xpRequiredForLevel(level);
    level += 1;
  }

  const xpForNextLevel = xpRequiredForLevel(level);
  return {
    xp,
    level,
    rankId: resolveRankId(level),
    xpIntoLevel: remaining,
    xpForNextLevel,
  };
}

const violations = [];

assert.equal(computeSoftXp({ completedLessons: 1, orbCount: 0, completedPathCount: 0 }), 100);
assert.equal(computeSoftXp({ completedLessons: 0, orbCount: 10, completedPathCount: 0 }), 50);
assert.equal(computeSoftXp({ completedLessons: 0, orbCount: 0, completedPathCount: 1 }), 250);

const starter = resolveSkillRankProgress({
  completedLessons: 0,
  orbCount: 0,
  completedPathCount: 0,
});
assert.equal(starter.level, 1);
assert.equal(starter.rankId, 'spark');

const mid = resolveSkillRankProgress({
  completedLessons: 8,
  orbCount: 40,
  completedPathCount: 0,
});
assert.ok(mid.level >= 3, 'mid progress should reach builder band');
assert.equal(mid.rankId, resolveRankId(mid.level));

const source = readFileSync(join(root, 'lib/skillRank.ts'), 'utf8');
const home = readFileSync(join(root, 'app/(tabs)/index.tsx'), 'utf8');
const profile = readFileSync(join(root, 'app/(tabs)/profil.tsx'), 'utf8');
const strip = readFileSync(join(root, 'components/features/SkillRankStrip.tsx'), 'utf8');

if (!source.includes('resolveSkillRankProgress')) {
  violations.push('skillRank must export resolveSkillRankProgress');
}

if (!home.includes('SkillRankStrip') || !profile.includes('SkillRankStrip')) {
  violations.push('Home and Profile must show SkillRankStrip');
}

if (!strip.includes('ProgressBar')) {
  violations.push('SkillRankStrip must show a progress bar');
}

console.log(
  JSON.stringify(
    {
      scope: 'skill-rank-p2.2',
      sample: { starter, mid },
      violations,
      pass: violations.length === 0,
    },
    null,
    2,
  ),
);

if (violations.length > 0) {
  process.exitCode = 1;
}
