/**
 * Verification harness for proposed progress merge strategy (E2).
 * Keep logic in sync with lib/progressMerge.ts.
 *
 * Production login currently pulls remote data only for empty local caches.
 * This script validates the proposed multi-device merge for future adoption.
 */

const PROGRESS_MERGE_STRATEGY = 'max-union-per-field';

const DEFAULT_STREAK_DAYS = [false, false, false, false, false, false, false];

function unionUnique(values) {
  return [...new Set(values)];
}

function isProgressSnapshotEmpty(snapshot) {
  return (
    snapshot.completedLessons === 0 &&
    snapshot.orbCount === 0 &&
    snapshot.promptScoreHistory.length === 0 &&
    Object.keys(snapshot.pathProgress).length === 0
  );
}

function mergePathRecord(pathId, local, remote) {
  if (!local && remote) {
    return { ...remote, failedLessonIds: remote.failedLessonIds ?? [] };
  }

  if (local && !remote) {
    return { ...local, failedLessonIds: local.failedLessonIds ?? [] };
  }

  if (!local || !remote) {
    return {
      completedLessonIds: [],
      failedLessonIds: [],
      currentLessonId: '',
      lastTouchedLessonId: '',
      progress: 0,
    };
  }

  const completedLessonIds = unionUnique([
    ...local.completedLessonIds,
    ...remote.completedLessonIds,
  ]);
  const failedLessonIds = unionUnique([
    ...local.failedLessonIds,
    ...remote.failedLessonIds,
  ]).filter((lessonId) => !completedLessonIds.includes(lessonId));

  const preferLocalCurrent =
    local.completedLessonIds.length >= remote.completedLessonIds.length;

  return {
    completedLessonIds,
    failedLessonIds,
    currentLessonId: preferLocalCurrent
      ? local.currentLessonId
      : remote.currentLessonId,
    lastTouchedLessonId: preferLocalCurrent
      ? local.lastTouchedLessonId
      : remote.lastTouchedLessonId,
    progress: Math.max(local.progress, remote.progress),
  };
}

function mergeStreakDays(local, remote) {
  return Array.from({ length: 7 }, (_, index) => Boolean(local[index] || remote[index]));
}

function mergeProgressSnapshots(local, remote) {
  const pathIds = unionUnique([
    ...Object.keys(local.pathProgress),
    ...Object.keys(remote.pathProgress),
  ]);

  const pathProgress = Object.fromEntries(
    pathIds.map((pathId) => [
      pathId,
      mergePathRecord(pathId, local.pathProgress[pathId], remote.pathProgress[pathId]),
    ]),
  );

  return {
    orbCount: Math.max(local.orbCount, remote.orbCount),
    orbMax: Math.max(local.orbMax, remote.orbMax),
    completedLessons: Math.max(local.completedLessons, remote.completedLessons),
    currentStreak: Math.max(local.currentStreak, remote.currentStreak),
    streakDays: mergeStreakDays(local.streakDays, remote.streakDays),
    pathProgress,
    promptScoreHistory: [...local.promptScoreHistory, ...remote.promptScoreHistory].slice(-10),
  };
}

function snapshot(overrides = {}) {
  return {
    orbCount: 0,
    orbMax: 200,
    completedLessons: 0,
    currentStreak: 0,
    streakDays: [...DEFAULT_STREAK_DAYS],
    pathProgress: {},
    promptScoreHistory: [],
    ...overrides,
  };
}

function pathRecord(overrides = {}) {
  return {
    completedLessonIds: [],
    failedLessonIds: [],
    currentLessonId: 'lesson-a',
    lastTouchedLessonId: 'lesson-a',
    progress: 0,
    ...overrides,
  };
}

function assertContainsAll(actual, expected, label) {
  const missing = expected.filter((value) => !actual.includes(value));
  return missing.length === 0 ? [] : [`${label}: missing ${missing.join(',')}`];
}

const cases = [];

const unionCase = mergeProgressSnapshots(
  snapshot({
    orbCount: 12,
    completedLessons: 1,
    pathProgress: {
      'prompt-basics': pathRecord({
        completedLessonIds: ['pb-1'],
        failedLessonIds: ['pb-2'],
        progress: 0.12,
      }),
    },
  }),
  snapshot({
    orbCount: 30,
    completedLessons: 2,
    pathProgress: {
      'prompt-basics': pathRecord({
        completedLessonIds: ['pb-2', 'pb-3'],
        failedLessonIds: ['pb-1'],
        progress: 0.25,
      }),
    },
  }),
);

cases.push({
  label: 'union merge keeps all completed lessons and max orbs',
  violations: [
    ...assertContainsAll(
      unionCase.pathProgress['prompt-basics'].completedLessonIds,
      ['pb-1', 'pb-2', 'pb-3'],
      'completedLessonIds',
    ),
    ...(unionCase.pathProgress['prompt-basics'].failedLessonIds.length === 0
      ? []
      : ['failedLessonIds should drop completed failures']),
    ...(unionCase.orbCount === 30 ? [] : ['orbCount should be max(12,30)=30']),
    ...(unionCase.completedLessons === 2 ? [] : ['completedLessons should be max(1,2)=2']),
  ],
});

const emptyLocalCase = mergeProgressSnapshots(
  snapshot(),
  snapshot({
    orbCount: 44,
    completedLessons: 3,
    pathProgress: {
      'prompt-basics': pathRecord({
        completedLessonIds: ['pb-1', 'pb-2'],
        progress: 0.25,
      }),
    },
  }),
);

cases.push({
  label: 'empty local merged with remote keeps remote progress',
  violations: [
    ...(emptyLocalCase.orbCount === 44 ? [] : ['orbCount should equal remote']),
    ...(emptyLocalCase.pathProgress['prompt-basics'].completedLessonIds.length === 2
      ? []
      : ['remote path progress should survive']),
  ],
});

const localOnlyCase = mergeProgressSnapshots(
  snapshot({
    orbCount: 18,
    pathProgress: {
      'structure-lab': pathRecord({
        completedLessonIds: ['sl-1'],
        progress: 0.1,
      }),
    },
  }),
  snapshot(),
);

cases.push({
  label: 'empty remote merged with local keeps local progress',
  violations: [
    ...(localOnlyCase.orbCount === 18 ? [] : ['orbCount should equal local']),
    ...(localOnlyCase.pathProgress['structure-lab'].completedLessonIds[0] === 'sl-1'
      ? []
      : ['local path progress should survive']),
  ],
});

const streakCase = mergeProgressSnapshots(
  snapshot({
    currentStreak: 2,
    streakDays: [true, true, false, false, false, false, false],
  }),
  snapshot({
    currentStreak: 4,
    streakDays: [false, true, true, true, false, false, false],
  }),
);

cases.push({
  label: 'streak merge uses max count and day-wise OR',
  violations: [
    ...(streakCase.currentStreak === 4 ? [] : ['currentStreak should be max(2,4)=4']),
    ...(streakCase.streakDays[0] && streakCase.streakDays[2] && streakCase.streakDays[3]
      ? []
      : ['streakDays should OR active days from both snapshots']),
  ],
});

const emptyDetection = isProgressSnapshotEmpty(snapshot());
const nonEmptyDetection = isProgressSnapshotEmpty(snapshot({ orbCount: 1 }));

cases.push({
  label: 'empty snapshot detection',
  violations: [
    ...(emptyDetection ? [] : ['default snapshot should be empty']),
    ...(nonEmptyDetection ? ['orb snapshot should not be empty'] : []),
  ],
});

const totalViolations = cases.reduce((sum, entry) => sum + entry.violations.length, 0);

console.log(
  JSON.stringify(
    {
      strategy: PROGRESS_MERGE_STRATEGY,
      note: 'Proposed for multi-device conflict resolution; login currently uses empty-local pull only.',
      cases,
      pass: totalViolations === 0,
      totalViolations,
    },
    null,
    2,
  ),
);
