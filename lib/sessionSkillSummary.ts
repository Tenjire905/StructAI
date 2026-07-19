/**
 * Named skill gain for session closure (Week-1 retention).
 * Curated per early lessons — not glossary heuristics (those were removed as noisy).
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
