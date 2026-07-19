import { useRouter, useSegments, type Href } from 'expo-router';
import { useEffect, useRef, useState } from 'react';

import {
  hydrateAppStorage,
  isOnboardingCompleted,
  isProfileOnboardingPending,
  isProfileOnboardingRequired,
  setOnboardingCompleted,
  setProfileOnboardingCompleted,
} from '@/lib/appStorage';
import { resolveHomeRoute } from '@/lib/homeNavigation';
import { runAfterUISettles } from '@/lib/runAfterUISettles';
import { isProgressSnapshotEmpty } from '@/lib/progressMerge';
import { fetchProgressSnapshotForUser } from '@/lib/progressSync';
import { useAuth } from '@/providers/AuthProvider';
import { useProgressStore } from '@/store/progressStore';

const DEV_ROUTE_GROUP = '(dev)';
const PROFILE_ONBOARDING_ROUTE = '/onboarding/profil';

type ReturningUserCheck = {
  userId: string;
  status: 'checking' | 'new' | 'returning';
};

function isDevRoute(rootSegment: string | undefined): boolean {
  return rootSegment === DEV_ROUTE_GROUP;
}

function isOnProfileOnboardingRoute(segments: readonly string[]): boolean {
  return segments[0] === 'onboarding' && segments[1] === 'profil';
}

function isOnDailyGoalSetupRoute(segments: readonly string[]): boolean {
  return segments[0] === 'onboarding' && segments[1] === 'tagesziel';
}

function isOnFirstSessionProofRoute(segments: readonly string[]): boolean {
  return segments[0] === 'onboarding' && segments[1] === 'proof';
}

function isInLessonFlowRoute(segments: readonly string[]): boolean {
  const root = segments[0];
  return root === 'lektion' || root === 'lernpfad';
}

function isOnTargetRoute(segments: readonly string[], target: Href): boolean {
  if (target === '/(tabs)') {
    return segments[0] === '(tabs)';
  }

  if (typeof target === 'string') {
    const parts = target.split('/').filter(Boolean);

    if (parts[0] === 'onboarding') {
      return segments[0] === 'onboarding' && segments[1] === parts[1];
    }
  }

  return false;
}

function resolveAppEntryRoute(completedLessons: number): Href {
  if (isProfileOnboardingPending()) {
    return PROFILE_ONBOARDING_ROUTE;
  }

  if (!isOnboardingCompleted()) {
    return '/onboarding';
  }

  return resolveHomeRoute(completedLessons);
}

function completeProfileOnboardingFromRemote(): void {
  void setProfileOnboardingCompleted();
}

/**
 * Navigation gate for onboarding and post-login routing.
 * Guest mode: no session required — onboarding and tabs stay reachable.
 * /auth remains a freely reachable screen for optional sign-in.
 */
export function AuthNavigationController() {
  const router = useRouter();
  const segments = useSegments();
  const { session, isLoading } = useAuth();
  const completedLessons = useProgressStore((state) => state.completedLessons);
  const lastTargetRef = useRef<Href | null>(null);
  const isMountedRef = useRef(false);
  const [returningUserCheck, setReturningUserCheck] = useState<ReturningUserCheck | null>(null);

  const profilePending = isProfileOnboardingPending();
  const onProfileRoute = isOnProfileOnboardingRoute(segments);
  const onDailyGoalRoute = isOnDailyGoalSetupRoute(segments);
  const onProofRoute = isOnFirstSessionProofRoute(segments);

  useEffect(() => {
    isMountedRef.current = true;

    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (isLoading || !session || isOnboardingCompleted()) {
      if (isMountedRef.current) {
        setReturningUserCheck((current) => (current === null ? current : null));
      }
      return;
    }

    let cancelled = false;
    const userId = session.user.id;

    if (isMountedRef.current) {
      setReturningUserCheck({ userId, status: 'checking' });
    }

    void fetchProgressSnapshotForUser(userId)
      .then((snapshot) => {
        if (cancelled || !isMountedRef.current) {
          return;
        }

        const hasRemoteActivity = snapshot !== null && !isProgressSnapshotEmpty(snapshot);

        if (hasRemoteActivity) {
          void setOnboardingCompleted();

          if ((snapshot?.completedLessons ?? 0) >= 1) {
            completeProfileOnboardingFromRemote();
          }
        }

        setReturningUserCheck({
          userId,
          status: hasRemoteActivity ? 'returning' : 'new',
        });
      })
      .catch(() => {
        if (!cancelled && isMountedRef.current) {
          setReturningUserCheck({ userId, status: 'new' });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [isLoading, session]);

  useEffect(() => {
    if (isLoading || !session || !isProfileOnboardingRequired()) {
      return;
    }

    let cancelled = false;

    void fetchProgressSnapshotForUser(session.user.id)
      .then((snapshot) => {
        if (cancelled || !isMountedRef.current) {
          return;
        }

        const hasRemoteActivity = snapshot !== null && !isProgressSnapshotEmpty(snapshot);

        if (hasRemoteActivity && (snapshot?.completedLessons ?? 0) >= 1) {
          completeProfileOnboardingFromRemote();
        }
      })
      .catch(() => undefined);

    return () => {
      cancelled = true;
    };
  }, [isLoading, session]);

  useEffect(() => {
    if (isLoading) {
      return;
    }

    let cancelled = false;
    let navigationTimer: ReturnType<typeof setTimeout> | undefined;

    void hydrateAppStorage().then(() => {
      if (cancelled || !isMountedRef.current) {
        return;
      }

      const rootSegment = segments[0];
      const inAuth = rootSegment === 'auth';
      const inOnboarding = rootSegment === 'onboarding';

      if (isDevRoute(rootSegment)) {
        return;
      }

      const needsReturningUserCheck = session !== null && !isOnboardingCompleted();
      const hasResolvedReturningUserCheck =
        returningUserCheck !== null &&
        returningUserCheck.userId === session?.user.id &&
        returningUserCheck.status !== 'checking';

      if (needsReturningUserCheck && !hasResolvedReturningUserCheck) {
        return;
      }

      let target: Href | null = null;

      if (inAuth) {
        if (session) {
          target = resolveAppEntryRoute(completedLessons);
        }
      } else if (profilePending) {
        // Allow finishing the active lesson/path transition before forcing the profile screen.
        // Also allow the Week-1 proof loop that runs before profile onboarding.
        if (!onProfileRoute && !onProofRoute && !isInLessonFlowRoute(segments)) {
          target = PROFILE_ONBOARDING_ROUTE;
        }
      } else if (!isOnboardingCompleted() && !inOnboarding) {
        target = '/onboarding';
      } else if (
        isOnboardingCompleted() &&
        inOnboarding &&
        !onProfileRoute &&
        !onDailyGoalRoute &&
        !onProofRoute
      ) {
        target = resolveHomeRoute(completedLessons);
      } else if (!rootSegment) {
        target = resolveAppEntryRoute(completedLessons);
      }

      if (!target || lastTargetRef.current === target || isOnTargetRoute(segments, target)) {
        return;
      }

      lastTargetRef.current = target;

      navigationTimer = setTimeout(() => {
        if (!isMountedRef.current) {
          return;
        }

        runAfterUISettles(() => {
          if (!isMountedRef.current) {
            return;
          }

          router.replace(target);
        });
      }, 0);
    });

    return () => {
      cancelled = true;

      if (navigationTimer) {
        clearTimeout(navigationTimer);
      }
    };
  }, [
    completedLessons,
    isLoading,
    onDailyGoalRoute,
    onProfileRoute,
    onProofRoute,
    profilePending,
    returningUserCheck,
    router,
    segments,
    session,
  ]);

  useEffect(() => {
    if (!session) {
      lastTargetRef.current = null;
    }
  }, [session]);

  useEffect(() => {
    if (lastTargetRef.current && isOnTargetRoute(segments, lastTargetRef.current)) {
      lastTargetRef.current = null;
    }
  }, [segments]);

  return null;
}
