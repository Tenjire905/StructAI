import { Redirect, useRouter } from 'expo-router';

import { AuthScreenView } from '@/components/features/auth/AuthScreenView';
import { getPostAuthRoute } from '@/lib/authNavigation';
import { useAuth } from '@/providers/AuthProvider';

export default function AuthScreen() {
  const router = useRouter();
  const { session, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  if (session) {
    return <Redirect href={getPostAuthRoute()} />;
  }

  return (
    <AuthScreenView
      onAuthenticated={() => {
        router.replace(getPostAuthRoute());
      }}
    />
  );
}
