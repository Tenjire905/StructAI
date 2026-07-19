import { useRouter } from 'expo-router';

import { FirstSessionProofView } from '@/components/features/FirstSessionProofView';
import { markProfileOnboardingRequired } from '@/lib/appStorage';

/**
 * Post-first-lesson Week-1 proof loop, then profile onboarding.
 */
export default function OnboardingProofScreen() {
  const router = useRouter();

  return (
    <FirstSessionProofView
      onContinue={() => {
        void markProfileOnboardingRequired().then(() => {
          router.replace('/onboarding/profil');
        });
      }}
    />
  );
}
