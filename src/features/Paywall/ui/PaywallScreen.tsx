import React, { useCallback, useMemo } from 'react';
import {
  Animated,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { theme } from 'src/shared/theme';
import { GradientButton } from 'src/shared/ui/GradientButton';
import { PressableCard } from 'src/shared/ui/PressableCard';

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
    } catch (error: unknown) {
      console.error('Paywall purchase handler failed', error);
    }
  }, [item.plan, onPurchase]);

  return (
    <PressableCard
      accentColor={item.badge ? theme.colors.accent.everyday : undefined}
      onPress={handlePress}
      style={styles.planCard}
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
        gradientColors={gradientColors}
        label="Wählen"
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
  const scale = useMemo(() => new Animated.Value(1), []);

  const handlePressIn = useCallback(() => {
    Animated.spring(scale, {
      bounciness: 4,
      speed: 50,
      toValue: 0.97,
      useNativeDriver: true,
    }).start();
  }, [scale]);

  const handlePressOut = useCallback(() => {
    Animated.spring(scale, {
      bounciness: 4,
      speed: 50,
      toValue: 1,
      useNativeDriver: true,
    }).start();
  }, [scale]);

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onClose}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View style={[styles.closeButton, { transform: [{ scale }] }]}>
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

  const keyExtractor = useCallback((item: PlanItem): string => item.plan, []);

  const renderItem = useCallback(
    ({ item }: { item: PlanItem }) => (
      <PlanCard
        gradientColors={purchaseGradient}
        item={item}
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
          accentColor={theme.colors.accent.everyday}
          style={styles.statusCard}
        >
          <Text style={styles.statusText}>Premium Aktiv ✨</Text>
        </PressableCard>
      ) : (
        <FlatList
          contentContainerStyle={styles.listContent}
          data={PLANS}
          keyExtractor={keyExtractor}
          nestedScrollEnabled={false}
          renderItem={renderItem}
          scrollEnabled={false}
          style={styles.list}
        />
      )}
    </View>
  );
};

export const PaywallScreen = React.memo(PaywallScreenComponent);

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background.primary,
    flex: 1,
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 16,
  },
  closeButton: {
    alignItems: 'center',
    backgroundColor: theme.colors.background.card,
    borderRadius: 20,
    height: 40,
    justifyContent: 'center',
    width: 40,
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
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  planTitle: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
  },
  badge: {
    backgroundColor: theme.colors.accent.everyday,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 4,
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
