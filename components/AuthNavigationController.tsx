import { useRouter, useSegments, type Href } from 'expo-router';
import { useEffect, useRef, useState } from 'react';

import { isOnboardingCompleted, setOnboardingCompleted } from '@/lib/appStorage';
import { isProgressSnapshotEmpty } from '@/lib/progressMerge';
import { fetchProgressSnapshotForUser } from '@/lib/progressSync';
import { useAuth } from '@/providers/AuthProvider';

const DEV_ROUTE_GROUP = '(dev)';

type ReturningUserCheck = {
  userId: string;
  status: 'checking' | 'new' | 'returning';
};

function isDevRoute(rootSegment: string | undefined): boolean {
  return rootSegment === DEV_ROUTE_GROUP;
}

function resolveAppEntryRoute(): Href {
  return isOnboardingCompleted() ? '/(tabs)' : '/onboarding';
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
  const lastTargetRef = useRef<Href | null>(null);
  const [returningUserCheck, setReturningUserCheck] = useState<ReturningUserCheck | null>(null);

  useEffect(() => {
    if (isLoading || !session || isOnboardingCompleted()) {
      setReturningUserCheck((current) => (current === null ? current : null));
      return;
    }

    let cancelled = false;
    const userId = session.user.id;

    setReturningUserCheck({ userId, status: 'checking' });

    void fetchProgressSnapshotForUser(userId)
      .then((snapshot) => {
        if (cancelled) {
          return;
        }

        const hasRemoteActivity = snapshot !== null && !isProgressSnapshotEmpty(snapshot);

        if (hasRemoteActivity) {
          setOnboardingCompleted();
        }

        setReturningUserCheck({
          userId,
          status: hasRemoteActivity ? 'returning' : 'new',
        });
      })
      .catch(() => {
        if (!cancelled) {
          setReturningUserCheck({ userId, status: 'new' });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [isLoading, session]);

  useEffect(() => {
    if (isLoading) {
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
        target = resolveAppEntryRoute();
      }
    } else if (!isOnboardingCompleted() && !inOnboarding) {
      target = '/onboarding';
    } else if (isOnboardingCompleted() && inOnboarding) {
      target = '/(tabs)';
    } else if (!rootSegment) {
      target = resolveAppEntryRoute();
    }

    if (!target || lastTargetRef.current === target) {
      return;
    }

    lastTargetRef.current = target;
    router.replace(target);
  }, [isLoading, returningUserCheck, router, segments, session]);

  useEffect(() => {
    if (!session) {
      lastTargetRef.current = null;
    }
  }, [session]);

  return null;
}
