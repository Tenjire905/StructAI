import type { Href } from 'expo-router';

import { suppressHomeCelebrations } from '@/lib/lessonCelebrationGate';
import { beginRouteTransition } from '@/lib/routeTransitionLock';
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

function safeReplace(router: RouterLike, href: Href): void {
  try {
    router.replace(href);
  } catch {
    // Expo Router can throw if a transition is already in flight; ignore.
  }
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
  beginRouteTransition('open-lesson');

  runAfterUISettles(() => {
    safeReplace(router, buildLessonHref(lessonId, options?.fromPath ?? false));
  }, 96);
}

/**
 * Navigates away from a lesson after completion or exit.
 */
export function leaveLesson(router: RouterLike, href: Href): void {
  suppressHomeCelebrations();
  beginRouteTransition('leave-lesson');

  runAfterUISettles(() => {
    safeReplace(router, href);
  }, 180);
}

/**
 * Returns to the path detail screen without duplicating it on the stack.
 * Uses dismissTo so an existing lernpfad screen is reused (e.g. after a new
 * journey lesson opened from path completion or path detail).
 */
export function returnToPath(router: RouterForPathReturn, pathId: string): void {
  suppressHomeCelebrations();
  beginRouteTransition('return-path');

  const href = `/lernpfad/${pathId}` as Href;

  runAfterUISettles(() => {
    try {
      if (router.dismissTo) {
        router.dismissTo(href);
        return;
      }

      if (router.navigate) {
        router.navigate(href);
        return;
      }

      router.replace(href);
    } catch {
      // Ignore in-flight transition errors.
    }
  }, 180);
}
