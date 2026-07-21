/**
 * Defers work until after the current UI frame/animations settle.
 * Replaces deprecated InteractionManager.runAfterInteractions.
 *
 * Always uses double-rAF + short timeout. Idle scheduling on React Native
 * can fire mid-unmount or never within a gesture, which has caused Expo Go
 * restarts after lesson/profile navigations.
 */
export function runAfterUISettles(callback: () => void, delayMs = 48): void {
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      setTimeout(() => {
        callback();
      }, delayMs);
    });
  });
}
