import { MOCK_PATHS } from '@/data/mockPaths';
import { isPathFullyCompleted } from '@/lib/pathCompletion';
import type { PathProgressRecord } from '@/store/progressStore';

/** Same order as MOCK_PATHS */
export const PATH_UNLOCK_ORDER: readonly string[] = MOCK_PATHS.map((path) => path.id);

export function getPrerequisitePathId(pathId: string): string | undefined {
  const index = PATH_UNLOCK_ORDER.indexOf(pathId);

  if (index <= 0) {
    return undefined;
  }

  return PATH_UNLOCK_ORDER[index - 1];
}

export function isPathUnlocked(
  pathId: string,
  pathProgress: Record<string, PathProgressRecord>,
): boolean {
  const prerequisiteId = getPrerequisitePathId(pathId);

  if (!prerequisiteId) {
    return true;
  }

  return isPathFullyCompleted(prerequisiteId, pathProgress[prerequisiteId]);
}

export function getPathUnlockBlockReason(
  pathId: string,
  pathProgress: Record<string, PathProgressRecord>,
): { prerequisitePathId: string } | null {
  if (isPathUnlocked(pathId, pathProgress)) {
    return null;
  }

  const prerequisitePathId = getPrerequisitePathId(pathId);

  if (!prerequisitePathId) {
    return null;
  }

  return { prerequisitePathId };
}
