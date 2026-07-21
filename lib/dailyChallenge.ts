import { isPathFullyCompleted } from '@/lib/pathCompletion';
import {
  DEFAULT_START_PATH_ID,
  getFirstLessonIdForPath,
} from '@/lib/pathLessonUtils';
import { getContinueLessonId, getMergedPath, pathTitleKey } from '@/lib/pathProgress';
import type { PathProgressRecord } from '@/lib/progressTypes';

export type DailyChallengeFraming = 'fresh' | 'continue' | 'proofReuse';

export type DailyChallenge = {
  pathId: string;
  lessonId: string;
  pathTitleKey: string;
  /** True when the user has no in-progress path yet. */
  isFreshStart: boolean;
  /** Copy framing — Week-1 proofReuse ties Home CTA to the first-session skill. */
  framing: DailyChallengeFraming;
};

export type ResolveDailyChallengeOptions = {
  /** After first-session proof, Home frames the challenge as skill reuse. */
  proofCompleted?: boolean;
};

/**
 * One clear job for today: continue the furthest open path, or start Prompt Basics.
 * When proof is completed, framing becomes proofReuse (same lesson target, skill-tied copy).
 */
export function resolveDailyChallenge(
  pathProgress: Record<string, PathProgressRecord>,
  options: ResolveDailyChallengeOptions = {},
): DailyChallenge | null {
  const proofReuse = options.proofCompleted === true;

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
      framing: proofReuse ? 'proofReuse' : 'continue',
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
    framing: proofReuse ? 'proofReuse' : 'fresh',
  };
}
