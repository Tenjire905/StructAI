/**
 * Defers work until after the current UI frame/animations settle.
 * Replaces deprecated InteractionManager.runAfterInteractions.
 */
export function runAfterUISettles(callback: () => void): void {
  const scheduleIdle = (
    globalThis as {
      requestIdleCallback?: (
        cb: () => void,
        options?: { timeout: number },
      ) => number;
    }
  ).requestIdleCallback;

  if (typeof scheduleIdle === 'function') {
    scheduleIdle(() => {
      callback();
    });
    return;
  }

  requestAnimationFrame(() => {
    setTimeout(callback, 0);
  });
}
