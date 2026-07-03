import { MOCK_PATHS, type MockPath } from '@/data/mockPaths';

const LESSON_PREFIX_TO_PATH: Record<string, string> = {
  pb: 'prompt-basics',
  sl: 'structure-lab',
  cm: 'context-mastery',
  il: 'iteration-loops',
  es: 'eval-scoring',
};

export function getPathIdForLesson(lessonId: string): string | undefined {
  const prefix = lessonId.split('-')[0];

  return LESSON_PREFIX_TO_PATH[prefix];
}

export function getPathTemplate(pathId: string): MockPath | undefined {
  return MOCK_PATHS.find((path) => path.id === pathId);
}

export function getFirstLessonIdForPath(pathId: string): string | undefined {
  return getPathTemplate(pathId)?.chapters[0]?.id;
}

export function getLessonIndexInPath(pathId: string, lessonId: string): number {
  const path = getPathTemplate(pathId);

  if (!path) {
    return -1;
  }

  return path.chapters.findIndex((chapter) => chapter.id === lessonId);
}

export function getNextLessonId(pathId: string, lessonId: string): string | undefined {
  const path = getPathTemplate(pathId);

  if (!path) {
    return undefined;
  }

  const index = getLessonIndexInPath(pathId, lessonId);

  if (index < 0 || index >= path.chapters.length - 1) {
    return undefined;
  }

  return path.chapters[index + 1]?.id;
}
