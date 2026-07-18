import type { Href } from 'expo-router';

import { suppressHomeCelebrations } from '@/lib/lessonCelebrationGate';
import { runAfterUISettles } from '@/lib/runAfterUISettles';

/** Query flag: lesson was opened from a path detail screen (stack has lernpfad below). */
export const LESSON_FROM_PATH_PARAM = 'from=path';

type RouterLike = {
  replace: (href: Href) => void;
};

type RouterForPathReturn = RouterLike & {
  dismissTo?: (href: Href) => void;
  navigate?: (href: Href) => void;
};

export function buildLessonHref(lessonId: string, fromPath = false): Href {
  if (fromPath) {
    return `/lektion/${lessonId}?from=path` as Href;
  }

  return `/lektion/${lessonId}` as Href;
}

export function isLessonOpenedFromPath(fromParam: string | string[] | undefined): boolean {
  if (Array.isArray(fromParam)) {
    return fromParam.includes('path');
  }

  return fromParam === 'path';
}

/**
 * Opens a lesson with deferred navigation so route transitions do not race
 * UI animations (onboarding loop, path cards, continue-next, etc.).
 */
export function openLesson(
  router: RouterLike,
  lessonId: string,
  options?: { fromPath?: boolean },
): void {
  suppressHomeCelebrations();

  runAfterUISettles(() => {
    router.replace(buildLessonHref(lessonId, options?.fromPath ?? false));
  });
}

/**
 * Navigates away from a lesson after completion or exit.
 */
export function leaveLesson(router: RouterLike, href: Href): void {
  suppressHomeCelebrations();

  runAfterUISettles(() => {
    router.replace(href);
  });
}

/**
 * Returns to the path detail screen without duplicating it on the stack.
 * Uses dismissTo so an existing lernpfad screen is reused (e.g. after a new
 * journey lesson opened from path completion or path detail).
 */
export function returnToPath(router: RouterForPathReturn, pathId: string): void {
  suppressHomeCelebrations();

  const href = `/lernpfad/${pathId}` as Href;

  runAfterUISettles(() => {
    if (router.dismissTo) {
      router.dismissTo(href);
      return;
    }

    if (router.navigate) {
      router.navigate(href);
      return;
    }

    router.replace(href);
  });
}
