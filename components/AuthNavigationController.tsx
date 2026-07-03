import { useRouter, useSegments, type Href } from 'expo-router';
import { useEffect, useRef } from 'react';

import { isOnboardingCompleted } from '@/lib/appStorage';
import { useAuth } from '@/providers/AuthProvider';

const DEV_ROUTE_GROUP = '(dev)';

function isDevRoute(rootSegment: string | undefined): boolean {
  return rootSegment === DEV_ROUTE_GROUP;
}

function resolveAuthedRoute(): Href {
  return isOnboardingCompleted() ? '/(tabs)' : '/onboarding';
}

/**
 * Single navigation gate – avoids competing <Redirect> components
 * that cause "Maximum update depth exceeded" on login.
 */
export function AuthNavigationController() {
  const router = useRouter();
  const segments = useSegments();
  const { session, isLoading } = useAuth();
  const lastTargetRef = useRef<Href | null>(null);

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

    let target: Href | null = null;

    if (!session) {
      if (!inAuth) {
        target = '/auth';
      }
    } else if (inAuth) {
      target = resolveAuthedRoute();
    } else if (!isOnboardingCompleted() && !inOnboarding) {
      target = '/onboarding';
    } else if (isOnboardingCompleted() && inOnboarding) {
      target = '/(tabs)';
    } else if (!rootSegment) {
      target = resolveAuthedRoute();
    }

    if (!target || lastTargetRef.current === target) {
      return;
    }

    lastTargetRef.current = target;
    router.replace(target);
  }, [isLoading, router, segments, session]);

  useEffect(() => {
    if (!session) {
      lastTargetRef.current = null;
    }
  }, [session]);

  return null;
}
