import { useCallback, useState } from 'react';
import { Pressable, SafeAreaView, StyleSheet, Text } from 'react-native';
import Animated, {
  FadeIn,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { PaywallScreen } from 'src/features/Paywall/ui/PaywallScreen';
import type { PaywallPlan } from 'src/features/Paywall/ui/PaywallScreen';
import { useGamificationStore } from 'src/features/Gamification/model/store';
import { theme } from 'src/shared/theme';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type ErrorState = {
  message: string;
  context: 'purchase' | 'navigation';
};

export default function Paywall() {
  const isPremium = useGamificationStore((state) => state.isPremium);
  const setPremium = useGamificationStore((state) => state.setPremium);
  const router = useRouter();
  const [errorState, setErrorState] = useState<ErrorState | null>(null);

  const dismissError = useCallback(() => {
    setErrorState(null);
  }, []);

  const bannerScale = useSharedValue(1);

  const bannerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withSpring(bannerScale.value, { damping: 15, stiffness: 300 }) }],
  }));

  const handleBannerPressIn = () => {
    bannerScale.value = 0.97;
  };

  const handleBannerPressOut = () => {
    bannerScale.value = 1;
  };

  const onClose = useCallback(() => {
    try {
      router.back();
    } catch (error: unknown) {
      console.error('[Paywall] onClose navigation failed', error);
      setErrorState({
        message: 'Modal konnte nicht geschlossen werden. Bitte tippe außerhalb.',
        context: 'navigation',
      });
    }
  }, [router]);

  const onPurchase = useCallback(
    (_plan: PaywallPlan) => {
      try {
        setPremium(true);
        router.back();
      } catch (error: unknown) {
        console.error('[Paywall] onPurchase failed', error);
        setErrorState({
          message: 'Premium-Aktivierung fehlgeschlagen. Bitte versuche es erneut.',
          context: 'purchase',
        });
      }
    },
    [setPremium, router],
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {errorState !== null ? (
        <Animated.View
          entering={FadeIn.duration(200)}
          exiting={FadeOut.duration(200)}
          style={styles.bannerWrapper}
        >
          <AnimatedPressable
            onPress={dismissError}
            onPressIn={handleBannerPressIn}
            onPressOut={handleBannerPressOut}
            style={[styles.errorBanner, bannerAnimatedStyle]}
          >
            <Text style={styles.errorText}>{errorState.message}</Text>
            <Text style={styles.errorDismiss}>✕</Text>
          </AnimatedPressable>
        </Animated.View>
      ) : null}
      <PaywallScreen
        isPremium={isPremium}
        onClose={onClose}
        onPurchase={onPurchase}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
  bannerWrapper: {
    marginHorizontal: 16,
    marginTop: 12,
  },
  errorBanner: {
    alignItems: 'center',
    backgroundColor: theme.colors.feedback.danger,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  errorText: {
    color: theme.colors.text.primary,
    flex: 1,
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
  },
  errorDismiss: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.bold,
    marginLeft: 12,
  },
});
