import { isPathFullyCompleted } from '@/lib/pathCompletion';
import {
  DEFAULT_START_PATH_ID,
  getFirstLessonIdForPath,
} from '@/lib/pathLessonUtils';
import { getContinueLessonId, getMergedPath, pathTitleKey } from '@/lib/pathProgress';
import type { PathProgressRecord } from '@/lib/progressTypes';

export type DailyChallenge = {
  pathId: string;
  lessonId: string;
  pathTitleKey: string;
  /** True when the user has no in-progress path yet. */
  isFreshStart: boolean;
};

/**
 * One clear job for today: continue the furthest open path, or start Prompt Basics.
 */
export function resolveDailyChallenge(
  pathProgress: Record<string, PathProgressRecord>,
): DailyChallenge | null {
  const candidates = Object.entries(pathProgress)
    .map(([pathId, record]) => {
      if (isPathFullyCompleted(pathId, record)) {
        return null;
      }

      const merged = getMergedPath(pathId, pathProgress);

      if (!merged || merged.chapters.length === 0) {
        return null;
      }

      return {
        pathId,
        lessonId: getContinueLessonId(merged),
        completedCount: record.completedLessonIds.length,
      };
    })
    .filter((entry): entry is NonNullable<typeof entry> => entry !== null)
    .sort((left, right) => right.completedCount - left.completedCount);

  if (candidates.length > 0) {
    const primary = candidates[0];

    return {
      pathId: primary.pathId,
      lessonId: primary.lessonId,
      pathTitleKey: pathTitleKey(primary.pathId),
      isFreshStart: false,
    };
  }

  const lessonId = getFirstLessonIdForPath(DEFAULT_START_PATH_ID);

  if (!lessonId) {
    return null;
  }

  return {
    pathId: DEFAULT_START_PATH_ID,
    lessonId,
    pathTitleKey: pathTitleKey(DEFAULT_START_PATH_ID),
    isFreshStart: true,
  };
}
