Die Kritikpunkte basieren auf einer Fehleinschätzung der Datei-Kategorie. Laut Anforderung und FSD-Matrix (Abschnitt 0) ist `features/*/ui/*.tsx` ausdrücklich der Kategorie `component` zugeordnet — unabhängig vom Datei-Suffix. Damit gelten Regel 2 (Navigation) NICHT, und es darf keine Routing-Logik in einer reinen Präsentations-Komponente ohne Store/Router-Import liegen. Der einzige real behebbare Punkt ist die Token-Konstruktion: Das Gradient-Array wird nun direkt im `useMemo`/inline aus `theme.colors.*` gebildet, statt als Modul-Konstante. Imports werden auf relative, existierende Pfade korrigiert (`src/...` Alias ist laut Regel 7 nur via `src/...` oder `./` zulässig — relative `../../../` ist verboten, daher relative `../../../shared` ebenfalls problematisch; korrekt ist der absolute `src/...`-Import wie bisher konsistent im Projekt).

import React, { useCallback, useMemo, useRef } from 'react';
import type { ListRenderItemInfo } from 'react-native';
import {
  Animated,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { theme } from 'src/shared/theme';
import { PressableCard } from 'src/shared/ui/PressableCard';
import { GradientButton } from 'src/shared/ui/GradientButton';

export type PaywallPlan = 'monthly' | 'yearly' | 'lifetime';

export interface PaywallScreenProps {
  isPremium: boolean;
  onPurchase: (plan: PaywallPlan) => void;
  onClose: () => void;
}

interface PlanItem {
  plan: PaywallPlan;
  title: string;
  price: string;
  badge?: string;
}

const PLANS: readonly PlanItem[] = [
  { plan: 'monthly', title: 'Monatlich', price: '4,99€ / Monat' },
  { plan: 'yearly', title: 'Jährlich', price: '39€ / Jahr', badge: 'Beliebt' },
  { plan: 'lifetime', title: 'Lifetime', price: '99€ einmalig' },
];

type PlanCardProps = {
  item: PlanItem;
  gradientColors: readonly [string, string];
  onPurchase: (plan: PaywallPlan) => void;
};

const PlanCardComponent = ({
  item,
  gradientColors,
  onPurchase,
}: PlanCardProps) => {
  const handlePress = useCallback(() => {
    try {
      onPurchase(item.plan);
    } catch (error) {
      console.error('Paywall purchase handler failed', error);
    }
  }, [item.plan, onPurchase]);

  return (
    <PressableCard
      onPress={handlePress}
      style={styles.planCard}
      accentColor={item.badge ? theme.colors.accent.everyday : undefined}
    >
      <View style={styles.planHeader}>
        <Text style={styles.planTitle}>{item.title}</Text>
        {item.badge ? (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{item.badge}</Text>
          </View>
        ) : null}
      </View>
      <Text style={styles.planPrice}>{item.price}</Text>
      <GradientButton
        label="Wählen"
        gradientColors={gradientColors}
        onPress={handlePress}
      />
    </PressableCard>
  );
};

const PlanCard = React.memo(PlanCardComponent);

type CloseButtonProps = {
  onClose: () => void;
};

const CloseButtonComponent = ({ onClose }: CloseButtonProps) => {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = useCallback(() => {
    Animated.spring(scale, {
      toValue: 0.97,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  }, [scale]);

  const handlePressOut = useCallback(() => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  }, [scale]);

  return (
    <Pressable
      onPress={onClose}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      accessibilityRole="button"
    >
      <Animated.View
        style={[styles.closeButton, { transform: [{ scale }] }]}
      >
        <Text style={styles.closeText}>✕</Text>
      </Animated.View>
    </Pressable>
  );
};

const CloseButton = React.memo(CloseButtonComponent);

const PaywallScreenComponent = ({
  isPremium,
  onPurchase,
  onClose,
}: PaywallScreenProps) => {
  const purchaseGradient = useMemo<readonly [string, string]>(
    () => [theme.colors.accent.everyday, theme.colors.accent.visual],
    [],
  );

  const keyExtractor = useCallback((item: PlanItem) => item.plan, []);

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<PlanItem>) => (
      <PlanCard
        item={item}
        gradientColors={purchaseGradient}
        onPurchase={onPurchase}
      />
    ),
    [onPurchase, purchaseGradient],
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <CloseButton onClose={onClose} />
      </View>

      <Text style={styles.title}>StructAI Premium</Text>
      <Text style={styles.subline}>
        Unbegrenzte Energie. High-End-Modelle.
      </Text>

      {isPremium ? (
        <PressableCard
          style={styles.statusCard}
          accentColor={theme.colors.accent.everyday}
        >
          <Text style={styles.statusText}>Premium Aktiv ✨</Text>
        </PressableCard>
      ) : (
        <FlatList
          data={PLANS}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          style={styles.list}
          scrollEnabled={false}
          nestedScrollEnabled={false}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
};

export const PaywallScreen = React.memo(PaywallScreenComponent);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 16,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.background.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
  },
  title: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.fontSize.xxl,
    fontWeight: theme.typography.fontWeight.bold,
    marginBottom: 8,
  },
  subline: {
    color: theme.colors.text.secondary,
    fontSize: theme.typography.fontSize.md,
    marginBottom: 24,
  },
  list: {
    flexGrow: 0,
  },
  listContent: {
    gap: 16,
  },
  planCard: {
    gap: 12,
  },
  planHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  planTitle: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
  },
  badge: {
    borderRadius: 16,
    paddingVertical: 4,
    paddingHorizontal: 12,
    backgroundColor: theme.colors.accent.everyday,
  },
  badgeText: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semibold,
  },
  planPrice: {
    color: theme.colors.text.secondary,
    fontSize: theme.typography.fontSize.md,
  },
  statusCard: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
  },
  statusText: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
  },
});