/**
 * Cross-screen lock so AuthNavigationController does not fire a competing
 * router.replace while lesson handoff / profile / daily-goal submit is in flight.
 * Expo Go restarts when two replaces overlap mid-Reanimated unmount.
 */

let lockReason: string | null = null;
let lockUntilMs = 0;

export function beginRouteTransition(reason: string, holdMs = 1600): void {
  lockReason = reason;
  lockUntilMs = Date.now() + holdMs;
}

export function endRouteTransition(reason?: string): void {
  if (reason && lockReason !== reason) {
    return;
  }

  lockReason = null;
  lockUntilMs = 0;
}

export function isRouteTransitionLocked(): boolean {
  if (!lockReason) {
    return false;
  }

  if (Date.now() > lockUntilMs) {
    lockReason = null;
    lockUntilMs = 0;
    return false;
  }

  return true;
}
