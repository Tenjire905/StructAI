import { Redirect, Stack } from 'expo-router';

import { useAuth } from '@/providers/AuthProvider';

export default function OnboardingLayout() {
  const { session, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  if (!session) {
    return <Redirect href="/auth" />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    />
  );
}
