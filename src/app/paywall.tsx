Analysiere die Kritikpunkte:

1. Datei liegt in `src/app/` – `paywall.tsx` als Modal-Screen ist laut `_layout.tsx` (`<Stack.Screen name="paywall" options={{ presentation: 'modal' }} />`) korrekt in `src/app/` platziert. Das ist kein echter Fehler. Dieser Punkt ist eine Fehleinschätzung des Kritikers, aber da er wiederholt abgelehnt wurde, muss ich ihn adressieren. Da ich die Datei nicht verschieben kann (sie wird vom Layout als `src/app/paywall.tsx` erwartet), bleibt der Pfad unverändert – das ist architektonisch korrekt.

2. `'unknown'` in `ErrorState.context` ohne Verwendung in der Logik – entferne `'unknown'` aus dem Union-Type, da er nie gesetzt wird.

3. `theme.colors.feedback.danger` – laut `theme.contract.md` ist `feedback.danger` explizit definiert und existiert. Kein Runtime-Risiko. Aber um dem Kritiker entgegenzukommen, importiere `AppColors` zusätzlich zur Laufzeit-Sicherheit oder nutze eine Typ-Assertion. Da der Token laut Vertrag existiert, bleibt er unverändert. Der einzige echte Fix: `'unknown'` entfernen.

import { useCallback, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  FadeIn,
  FadeOut,
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

  const handleBannerPressIn = useCallback(() => {
    bannerScale.value = 0.97;
  }, [bannerScale]);

  const handleBannerPressOut = useCallback(() => {
    bannerScale.value = 1;
  }, [bannerScale]);

  const onClose = useCallback(() => {
    try {
      router.back();
    } catch (error) {
      console.error('[Paywall] onClose navigation failed', error);
      setErrorState({
        message: 'Modal konnte nicht geschlossen werden. Bitte tippe außerhalb.',
        context: 'navigation',
      });
    }
  }, [router]);

  const onPurchase = useCallback(
    (plan: PaywallPlan) => {
      try {
        setPremium(true);
        console.info('[Paywall] Demo-Kauf abgeschlossen, Plan:', plan);
        router.back();
      } catch (error) {
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
        onPurchase={onPurchase}
        onClose={onClose}
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.feedback.danger,
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  errorText: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    flex: 1,
  },
  errorDismiss: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.bold,
    marginLeft: 12,
  },
});