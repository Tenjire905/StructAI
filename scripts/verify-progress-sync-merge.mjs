/**
 * Verification harness for proposed progress merge strategy (E2).
 * Keep logic in sync with lib/progressMerge.ts.
 *
 * Union merge (max-union-per-field) is active on login when local + remote exist.
 */

const PROGRESS_MERGE_STRATEGY = 'max-union-per-field';

const DEFAULT_STREAK_DAYS = [false, false, false, false, false, false, false];

const PATH_CHAPTER_IDS = {
  'prompt-basics': Array.from({ length: 45 }, (_, index) => `pb-${index + 1}`),
  'structure-lab': ['sl-1', 'sl-2', 'sl-3', 'sl-4', 'sl-5', 'sl-6'],
};

const PATH_TOTAL_CHAPTERS = {
  'prompt-basics': 45,
  'structure-lab': 6,
};

function unionUnique(values) {
  return [...new Set(values)];
}

function isPathFullyCompleted(pathId, record) {
  const requiredLessonIds = PATH_CHAPTER_IDS[pathId] ?? [];

  if (requiredLessonIds.length === 0 || !record) {
    return false;
  }

  const completedSet = new Set(record.completedLessonIds);
  return requiredLessonIds.every((lessonId) => completedSet.has(lessonId));
}

function reconcileCompletedPathIds(pathProgress, existingCompletedPathIds = []) {
  const merged = new Set(existingCompletedPathIds);

  for (const pathId of Object.keys(pathProgress)) {
    if (isPathFullyCompleted(pathId, pathProgress[pathId])) {
      merged.add(pathId);
    }
  }

  return [...merged];
}

function mergePathCompletedAt(local, remote) {
  const keys = unionUnique([...Object.keys(local), ...Object.keys(remote)]);
  const merged = {};

  for (const pathId of keys) {
    const localValue = local[pathId];
    const remoteValue = remote[pathId];

    if (localValue && remoteValue) {
      merged[pathId] =
        new Date(localValue).getTime() <= new Date(remoteValue).getTime()
          ? localValue
          : remoteValue;
      continue;
    }

    merged[pathId] = localValue ?? remoteValue ?? '';
  }

  return merged;
}

function computePathProgressRatio(pathId, completedIds) {
  const totalChapters = PATH_TOTAL_CHAPTERS[pathId] ?? 0;

  if (totalChapters === 0) {
    return 0;
  }

  return Math.min(1, completedIds.length / totalChapters);
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
    progress: computePathProgressRatio(pathId, completedLessonIds),
  };
}

function mergeStreakDays(local, remote) {
  return Array.from({ length: 7 }, (_, index) => Boolean(local[index] || remote[index]));
}

function normalizePromptScoreHistory(raw) {
  if (!Array.isArray(raw)) {
    return [];
  }

  return raw
    .map((entry, index) => {
      if (typeof entry === 'number' && Number.isFinite(entry)) {
        return {
          score: entry,
          recordedAt: new Date(Date.now() - (raw.length - index) * 60_000).toISOString(),
        };
      }

      if (entry && typeof entry === 'object' && 'score' in entry) {
        const score = Number(entry.score);
        const recordedAt = entry.recordedAt;

        if (!Number.isFinite(score)) {
          return null;
        }

        return {
          score,
          recordedAt:
            typeof recordedAt === 'string' && recordedAt.length > 0
              ? recordedAt
              : new Date(Date.now() - (raw.length - index) * 60_000).toISOString(),
        };
      }

      return null;
    })
    .filter(Boolean);
}

function mergePromptScoreHistory(local, remote) {
  const seen = new Set();

  return [...normalizePromptScoreHistory(local), ...normalizePromptScoreHistory(remote)]
    .filter((entry) => {
      const key = `${entry.recordedAt}|${entry.score}`;
      if (seen.has(key)) {
        return false;
      }

      seen.add(key);
      return true;
    })
    .sort(
      (left, right) =>
        new Date(left.recordedAt).getTime() - new Date(right.recordedAt).getTime(),
    )
    .slice(-10);
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

  const completedPathIds = reconcileCompletedPathIds(
    pathProgress,
    unionUnique([...(local.completedPathIds ?? []), ...(remote.completedPathIds ?? [])]),
  );
  const pathCompletedAt = mergePathCompletedAt(
    local.pathCompletedAt ?? {},
    remote.pathCompletedAt ?? {},
  );

  return {
    orbCount: Math.max(local.orbCount, remote.orbCount),
    orbMax: Math.max(local.orbMax, remote.orbMax),
    completedLessons: Math.max(local.completedLessons, remote.completedLessons),
    currentStreak: Math.max(local.currentStreak, remote.currentStreak),
    streakDays: mergeStreakDays(local.streakDays, remote.streakDays),
    pathProgress,
    completedPathIds,
    pathCompletedAt,
    promptScoreHistory: mergePromptScoreHistory(
      local.promptScoreHistory,
      remote.promptScoreHistory,
    ),
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
    completedPathIds: [],
    pathCompletedAt: {},
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
    ...(Math.abs(unionCase.pathProgress['prompt-basics'].progress - 3 / 45) < 0.001
      ? []
      : ['progress should be recomputed from merged completed count']),
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

const pathCompletionMergeCase = mergeProgressSnapshots(
  snapshot({
    completedPathIds: ['iteration-loops'],
    pathCompletedAt: { 'iteration-loops': '2026-07-01T10:00:00.000Z' },
    pathProgress: {
      'prompt-basics': pathRecord({
        completedLessonIds: PATH_CHAPTER_IDS['prompt-basics'],
      }),
    },
  }),
  snapshot({
    completedPathIds: [],
    pathCompletedAt: { 'prompt-basics': '2026-07-02T08:00:00.000Z' },
    pathProgress: {
      'prompt-basics': pathRecord({
        completedLessonIds: PATH_CHAPTER_IDS['prompt-basics'].slice(0, 7),
      }),
    },
  }),
);

cases.push({
  label: 'merge reconciles completedPathIds and earliest pathCompletedAt',
  violations: [
    ...(pathCompletionMergeCase.completedPathIds.includes('prompt-basics')
      ? []
      : ['prompt-basics should be reconciled as complete']),
    ...(pathCompletionMergeCase.completedPathIds.includes('iteration-loops')
      ? []
      : ['existing completedPathIds should be preserved']),
    ...(pathCompletionMergeCase.pathCompletedAt['prompt-basics'] ===
    '2026-07-02T08:00:00.000Z'
      ? []
      : ['pathCompletedAt should keep earliest known timestamp']),
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

const promptScoreMergeCase = mergeProgressSnapshots(
  snapshot({
    promptScoreHistory: [
      { score: 72, recordedAt: '2026-07-01T10:00:00.000Z' },
      { score: 81, recordedAt: '2026-07-02T08:00:00.000Z' },
    ],
  }),
  snapshot({
    promptScoreHistory: [
      { score: 81, recordedAt: '2026-07-02T08:00:00.000Z' },
      { score: 90, recordedAt: '2026-07-03T12:00:00.000Z' },
    ],
  }),
);

cases.push({
  label: 'promptScoreHistory merge sorts chronologically and deduplicates',
  violations: [
    ...(promptScoreMergeCase.promptScoreHistory.length === 3
      ? []
      : ['expected 3 unique prompt score entries after merge']),
    ...(promptScoreMergeCase.promptScoreHistory[0].score === 72 ? [] : ['oldest score should be 72']),
    ...(promptScoreMergeCase.promptScoreHistory[2].score === 90 ? [] : ['newest score should be 90']),
    ...(promptScoreMergeCase.promptScoreHistory.every((entry) => entry.recordedAt)
      ? []
      : ['each prompt score entry should carry recordedAt']),
  ],
});

const totalViolations = cases.reduce((sum, entry) => sum + entry.violations.length, 0);

console.log(
  JSON.stringify(
    {
      strategy: PROGRESS_MERGE_STRATEGY,
      note: 'Union merge is active on login when both local and remote snapshots exist.',
      cases,
      pass: totalViolations === 0,
      totalViolations,
    },
    null,
    2,
  ),
);

process.exit(totalViolations === 0 ? 0 : 1);
