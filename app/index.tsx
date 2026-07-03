import { Redirect } from 'expo-router';

import { getPostAuthRoute } from '@/lib/authNavigation';
import { useAuth } from '@/providers/AuthProvider';

export default function AppEntryRedirect() {
  const { session, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  if (!session) {
    return <Redirect href="/auth" />;
  }

  return <Redirect href={getPostAuthRoute()} />;
}
