import { useRouter } from 'expo-router';

import { ProPaywallView } from '@/components/features/ProPaywallView';

export default function PaywallScreen() {
  const router = useRouter();

  return (
    <ProPaywallView
      onClose={() => {
        if (router.canGoBack()) {
          router.back();
        } else {
          router.replace('/(tabs)/profil');
        }
      }}
    />
  );
}
