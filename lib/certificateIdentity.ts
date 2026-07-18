/**
 * Identity-forward certificate helpers (SUCCESS-PRIORITIES P2.1).
 * Path → concrete skill claim; stable credential code for share credibility.
 */

const PATH_SKILL_COPY_KEY: Record<string, string> = {
  'prompt-basics': 'certificate.skill.prompt_basics',
  'structure-lab': 'certificate.skill.structure_lab',
  'context-mastery': 'certificate.skill.context_mastery',
  'iteration-loops': 'certificate.skill.iteration_loops',
  'eval-scoring': 'certificate.skill.eval_scoring',
  'prompt-mastery': 'certificate.skill.prompt_mastery',
};

export function certificateSkillCopyKey(pathId: string): string {
  return PATH_SKILL_COPY_KEY[pathId] ?? 'certificate.skill.generic';
}

/**
 * Short human-readable credential id (not cryptographic security —
 * share credibility / “this looks real”).
 */
export function buildCertificateCredentialId(input: {
  pathId: string;
  recipientName: string;
  completedAt: string;
}): string {
  const raw = `${input.pathId}|${input.recipientName.trim().toLowerCase()}|${input.completedAt.slice(0, 10)}`;
  let hash = 2166136261;

  for (let index = 0; index < raw.length; index += 1) {
    hash ^= raw.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  const hex = (hash >>> 0).toString(16).toUpperCase().padStart(8, '0');
  return `SA-${hex.slice(0, 4)}-${hex.slice(4)}`;
}
