import { getPathTemplate } from '@/lib/pathLessonUtils';
import type { PathProgressRecord } from '@/store/progressStore';

export type PathCompletionStats = {
  completed: number;
  total: number;
  missing: number;
  skipped: number;
};

export function isPathFinalCapstone(pathId: string, lessonId: string): boolean {
  const path = getPathTemplate(pathId);

  if (!path || path.chapters.length === 0) {
    return false;
  }

  return path.chapters[path.chapters.length - 1]?.id === lessonId;
}

/** Mid-path „Abschlussprojekt“ (not the path finale). */
export function isPathMidCapstone(pathId: string, lessonId: string): boolean {
  if (isPathFinalCapstone(pathId, lessonId)) {
    return false;
  }

  const path = getPathTemplate(pathId);
  const chapter = path?.chapters.find((entry) => entry.id === lessonId);

  return chapter?.title === 'Abschlussprojekt';
}

export function getPathCompletionStats(
  pathId: string,
  record?: PathProgressRecord,
): PathCompletionStats {
  const path = getPathTemplate(pathId);

  if (!path) {
    return { completed: 0, total: 0, missing: 0, skipped: 0 };
  }

  const completedSet = new Set(record?.completedLessonIds ?? []);
  const completed = path.chapters.filter((chapter) => completedSet.has(chapter.id)).length;
  const skipped = (record?.failedLessonIds ?? []).filter(
    (lessonId) => !completedSet.has(lessonId),
  ).length;
  const total = path.totalChapters;

  return {
    completed,
    total,
    missing: Math.max(0, total - completed),
    skipped,
  };
}
