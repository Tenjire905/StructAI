import type { Href } from 'expo-router';

import { suppressHomeCelebrations } from '@/lib/lessonCelebrationGate';
import { runAfterUISettles } from '@/lib/runAfterUISettles';

type RouterLike = {
  replace: (href: Href) => void;
};

/**
 * Opens a lesson with deferred navigation so route transitions do not race
 * UI animations (onboarding loop, path cards, continue-next, etc.).
 */
export function openLesson(router: RouterLike, lessonId: string): void {
  suppressHomeCelebrations();

  runAfterUISettles(() => {
    router.replace(`/lektion/${lessonId}` as Href);
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
