/**
 * Soft XP / ranks derived from existing progress (SUCCESS-PRIORITIES P2.2).
 * No separate XP store — same facts as orbs/lessons, different readable layer.
 */

export type SkillRankId =
  | 'spark'
  | 'builder'
  | 'craftsman'
  | 'specialist'
  | 'architect';

export type SkillRankProgress = {
  xp: number;
  level: number;
  rankId: SkillRankId;
  rankCopyKey: string;
  xpIntoLevel: number;
  xpForNextLevel: number;
  /** 0–1 progress within the current level. */
  progress: number;
};

const XP_PER_LESSON = 100;
const XP_PER_ORB = 5;
const XP_PER_COMPLETED_PATH = 250;

/** XP required to advance from `level` → `level + 1` (level is 1-based). */
export function xpRequiredForLevel(level: number): number {
  const safeLevel = Math.max(1, Math.floor(level));
  return 120 + safeLevel * 40;
}

export function computeSoftXp(input: {
  completedLessons: number;
  orbCount: number;
  completedPathCount: number;
}): number {
  return (
    Math.max(0, input.completedLessons) * XP_PER_LESSON +
    Math.max(0, input.orbCount) * XP_PER_ORB +
    Math.max(0, input.completedPathCount) * XP_PER_COMPLETED_PATH
  );
}

export function resolveRankId(level: number): SkillRankId {
  if (level >= 15) {
    return 'architect';
  }

  if (level >= 10) {
    return 'specialist';
  }

  if (level >= 6) {
    return 'craftsman';
  }

  if (level >= 3) {
    return 'builder';
  }

  return 'spark';
}

export function resolveSkillRankProgress(input: {
  completedLessons: number;
  orbCount: number;
  completedPathCount: number;
}): SkillRankProgress {
  const xp = computeSoftXp(input);
  let level = 1;
  let remaining = xp;

  while (remaining >= xpRequiredForLevel(level)) {
    remaining -= xpRequiredForLevel(level);
    level += 1;

    if (level > 99) {
      break;
    }
  }

  const xpForNextLevel = xpRequiredForLevel(level);
  const xpIntoLevel = Math.min(remaining, xpForNextLevel);
  const rankId = resolveRankId(level);

  return {
    xp,
    level,
    rankId,
    rankCopyKey: `skillRank.rank.${rankId}`,
    xpIntoLevel,
    xpForNextLevel,
    progress: xpForNextLevel > 0 ? xpIntoLevel / xpForNextLevel : 1,
  };
}

/** XP awarded for a single lesson completion (for end-of-lesson copy). */
export function lessonCompletionXpGain(orbsEarned: number): number {
  return XP_PER_LESSON + Math.max(0, orbsEarned) * XP_PER_ORB;
}
