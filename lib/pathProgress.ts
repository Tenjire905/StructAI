import { MOCK_PATHS, type MockChapter, type MockPath } from '@/data/mockPaths';
import type { PathProgressRecord } from '@/store/progressStore';

export function pathTitleKey(pathId: string): string {
  return `paths.title.${pathId.replace(/-/g, '_')}`;
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
  const currentId = record.currentLessonId;

  const chapters: MockChapter[] = template.chapters.map((chapter) => {
    if (completedSet.has(chapter.id)) {
      return { ...chapter, status: 'completed' };
    }

    if (chapter.id === currentId) {
      return { ...chapter, status: 'current' };
    }

    return { ...chapter, status: 'locked' };
  });

  const hasCurrent = chapters.some((chapter) => chapter.status === 'current');
  if (!hasCurrent) {
    const firstOpen = chapters.find((chapter) => chapter.status === 'locked');
    if (firstOpen) {
      const index = chapters.findIndex((chapter) => chapter.id === firstOpen.id);
      chapters[index] = { ...firstOpen, status: 'current' };
    }
  }

  const completedCount = record.completedLessonIds.length;
  const currentChapter = Math.min(template.totalChapters, completedCount + 1);

  return {
    ...template,
    currentChapter,
    progress: record.progress,
    chapters,
  };
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
