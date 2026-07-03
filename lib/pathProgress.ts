import { getPathTemplate } from '@/lib/pathLessonUtils';
import { MOCK_PATHS, type MockChapter, type MockPath } from '@/data/mockPaths';
import type { PathProgressRecord } from '@/store/progressStore';

export type PathProgressSegment = {
  start: number;
  width: number;
};

export type PathProgressBarModel = {
  completedRatio: number;
  failedSegments: PathProgressSegment[];
};

export function pathTitleKey(pathId: string): string {
  return `paths.title.${pathId.replace(/-/g, '_')}`;
}

export function computePathProgressBarModel(
  pathId: string,
  record?: PathProgressRecord,
): PathProgressBarModel {
  const template = getPathTemplate(pathId);

  if (!template || template.totalChapters === 0) {
    return { completedRatio: 0, failedSegments: [] };
  }

  const slotWidth = 1 / template.totalChapters;
  const failedIds = new Set(record?.failedLessonIds ?? []);
  const completedCount = record?.completedLessonIds.length ?? 0;

  const failedSegments = template.chapters
    .map((chapter, index) => ({ chapter, index }))
    .filter(({ chapter }) => failedIds.has(chapter.id))
    .map(({ index }) => ({
      start: index * slotWidth,
      width: slotWidth,
    }));

  return {
    completedRatio: Math.min(1, completedCount / template.totalChapters),
    failedSegments,
  };
}

export function mergePathWithProgress(
  template: MockPath,
  record?: PathProgressRecord,
): MockPath {
  if (!record) {
    return {
      ...template,
      currentChapter: undefined,
      progress: undefined,
      chapters: template.chapters.map((chapter, index) => ({
        ...chapter,
        status: index === 0 ? 'current' : 'locked',
      })),
    };
  }

  const completedSet = new Set(record.completedLessonIds);
  const failedSet = new Set(record.failedLessonIds ?? []);
  const currentId = record.currentLessonId;

  const chapters: MockChapter[] = template.chapters.map((chapter) => {
    if (completedSet.has(chapter.id)) {
      return { ...chapter, status: 'completed' };
    }

    if (failedSet.has(chapter.id)) {
      return { ...chapter, status: 'failed' };
    }

    if (chapter.id === currentId) {
      return { ...chapter, status: 'current' };
    }

    return { ...chapter, status: 'locked' };
  });

  const hasCurrent = chapters.some((chapter) => chapter.status === 'current');
  const hasFailed = chapters.some((chapter) => chapter.status === 'failed');
  if (!hasCurrent && !hasFailed) {
    const firstOpen = chapters.find((chapter) => chapter.status === 'locked');
    if (firstOpen) {
      const index = chapters.findIndex((chapter) => chapter.id === firstOpen.id);
      chapters[index] = { ...firstOpen, status: 'current' };
    }
  }

  const completedCount = record.completedLessonIds.length;
  const currentChapter = Math.min(template.totalChapters, completedCount + 1);
  const progressBar = computePathProgressBarModel(template.id, record);

  return {
    ...template,
    currentChapter,
    progress: progressBar.completedRatio,
    chapters,
  };
}

export function getContinueLessonId(path: MockPath): string {
  const failedChapter = path.chapters.find((chapter) => chapter.status === 'failed');
  const currentChapter = path.chapters.find((chapter) => chapter.status === 'current');

  return (failedChapter ?? currentChapter ?? path.chapters[0]).id;
}

export function getMergedPath(pathId: string, pathProgress: Record<string, PathProgressRecord>): MockPath | undefined {
  const template = MOCK_PATHS.find((path) => path.id === pathId);

  if (!template) {
    return undefined;
  }

  return mergePathWithProgress(template, pathProgress[pathId]);
}

export function getMergedPaths(pathProgress: Record<string, PathProgressRecord>): MockPath[] {
  return MOCK_PATHS.map((template) => mergePathWithProgress(template, pathProgress[template.id]));
}

export function getPathProgressBarModel(
  pathId: string,
  pathProgress: Record<string, PathProgressRecord>,
): PathProgressBarModel {
  return computePathProgressBarModel(pathId, pathProgress[pathId]);
}
