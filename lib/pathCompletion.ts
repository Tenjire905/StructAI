import { getPathTemplate } from '@/lib/pathLessonUtils';
import type { PathProgressRecord } from '@/store/progressStore';

export function getRequiredLessonIdsForPath(pathId: string): string[] {
  const template = getPathTemplate(pathId);

  if (!template) {
    return [];
  }

  return template.chapters.map((chapter) => chapter.id);
}

/**
 * Ein Pfad gilt als abgeschlossen, wenn jede Lektion des Templates in
 * completedLessonIds steht. failedLessonIds allein reichen nicht —
 * offene/nicht bestandene Lektionen verhindern den Abschluss.
 */
export function isPathFullyCompleted(
  pathId: string,
  record: PathProgressRecord | undefined,
): boolean {
  const requiredLessonIds = getRequiredLessonIdsForPath(pathId);

  if (requiredLessonIds.length === 0 || !record) {
    return false;
  }

  const completedSet = new Set(record.completedLessonIds);
  return requiredLessonIds.every((lessonId) => completedSet.has(lessonId));
}

export function detectNewlyCompletedPathId(
  pathId: string,
  record: PathProgressRecord,
  completedPathIds: string[],
): string | null {
  if (completedPathIds.includes(pathId)) {
    return null;
  }

  return isPathFullyCompleted(pathId, record) ? pathId : null;
}

export function reconcileCompletedPathIds(
  pathProgress: Record<string, PathProgressRecord>,
  existingCompletedPathIds: string[] = [],
): string[] {
  const merged = new Set(existingCompletedPathIds);

  for (const pathId of Object.keys(pathProgress)) {
    if (isPathFullyCompleted(pathId, pathProgress[pathId])) {
      merged.add(pathId);
    }
  }

  return [...merged];
}
