/**
 * Named skill gain for session closure (Week-1 retention).
 * Curated per early prompt-basics lessons — not glossary heuristics (those were removed as noisy).
 * Aligned to actual lesson titles in data/lessonContent/*_pb.ts.
 */

export type SessionSkillSummary = {
  /** Copy key for the skill name, e.g. sessionSkill.pb-1.name */
  nameKey: string;
  /** Copy key for the one-line "you can do this now" proof */
  proofKey: string;
};

/** Explicit skill claims for the first path — the Week-1 proof surface. */
const CURATED_SKILL_BY_LESSON: Record<string, SessionSkillSummary> = {
  'pb-1': {
    nameKey: 'sessionSkill.pb-1.name',
    proofKey: 'sessionSkill.pb-1.proof',
  },
  'pb-2': {
    nameKey: 'sessionSkill.pb-2.name',
    proofKey: 'sessionSkill.pb-2.proof',
  },
  'pb-3': {
    nameKey: 'sessionSkill.pb-3.name',
    proofKey: 'sessionSkill.pb-3.proof',
  },
  'pb-4': {
    nameKey: 'sessionSkill.pb-4.name',
    proofKey: 'sessionSkill.pb-4.proof',
  },
  'pb-5': {
    nameKey: 'sessionSkill.pb-5.name',
    proofKey: 'sessionSkill.pb-5.proof',
  },
  'pb-6': {
    nameKey: 'sessionSkill.pb-6.name',
    proofKey: 'sessionSkill.pb-6.proof',
  },
  'pb-7': {
    nameKey: 'sessionSkill.pb-7.name',
    proofKey: 'sessionSkill.pb-7.proof',
  },
  'pb-8': {
    nameKey: 'sessionSkill.pb-8.name',
    proofKey: 'sessionSkill.pb-8.proof',
  },
  'pb-9': {
    nameKey: 'sessionSkill.pb-9.name',
    proofKey: 'sessionSkill.pb-9.proof',
  },
  'pb-10': {
    nameKey: 'sessionSkill.pb-10.name',
    proofKey: 'sessionSkill.pb-10.proof',
  },
  'pb-11': {
    nameKey: 'sessionSkill.pb-11.name',
    proofKey: 'sessionSkill.pb-11.proof',
  },
  'pb-12': {
    nameKey: 'sessionSkill.pb-12.name',
    proofKey: 'sessionSkill.pb-12.proof',
  },
};

export function resolveSessionSkillSummary(lessonId: string): SessionSkillSummary {
  return (
    CURATED_SKILL_BY_LESSON[lessonId] ?? {
      nameKey: 'sessionSkill.generic.name',
      proofKey: 'sessionSkill.generic.proof',
    }
  );
}

export function hasCuratedSessionSkill(lessonId: string): boolean {
  return lessonId in CURATED_SKILL_BY_LESSON;
}
