import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import type { BottomTabBarProps } from 'expo-router/build/react-navigation/bottom-tabs/types';
import { useMemo } from 'react';
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { theme } from '../theme';

const TAB_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  akademie: 'book-outline',
  lab: 'flask-outline',
  profil: 'person-outline',
};

const TAB_ICONS_ACTIVE: Record<string, keyof typeof Ionicons.glyphMap> = {
  akademie: 'book',
  lab: 'flask',
  profil: 'person',
};

export function FloatingTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps): React.JSX.Element {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.outer,
        { paddingBottom: Math.max(insets.bottom, 12) },
      ]}
    >
      <BlurView intensity={50} tint="dark" style={styles.bar}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label =
            typeof options.tabBarLabel === 'string'
              ? options.tabBarLabel
              : options.title ?? route.name;
          const isFocused = state.index === index;
          const iconName = TAB_ICONS[route.name] ?? 'ellipse-outline';
          const activeIcon = isFocused
            ? (TAB_ICONS_ACTIVE[route.name] ?? iconName)
            : iconName;

          const onPress = (): void => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <TabItem
              key={route.key}
              label={label}
              iconName={activeIcon}
              isFocused={isFocused}
              onPress={onPress}
            />
          );
        })}
      </BlurView>
    </View>
  );
}

interface TabItemProps {
  label: string;
  iconName: keyof typeof Ionicons.glyphMap;
  isFocused: boolean;
  onPress: () => void;
}

function TabItem({
  label,
  iconName,
  isFocused,
  onPress,
}: TabItemProps): React.JSX.Element {
  const scale = useMemo(() => new Animated.Value(1), []);

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => {
        Animated.spring(scale, {
          toValue: 0.92,
          useNativeDriver: true,
          speed: 50,
          bounciness: 4,
        }).start();
      }}
      onPressOut={() => {
        Animated.spring(scale, {
          toValue: 1,
          useNativeDriver: true,
          speed: 50,
          bounciness: 4,
        }).start();
      }}
      style={styles.tab}
      accessibilityRole="button"
      accessibilityState={{ selected: isFocused }}
    >
      <Animated.View style={[styles.tabInner, { transform: [{ scale }] }]}>
        <View style={styles.iconWrap}>
          {isFocused ? <View style={styles.activeGlow} /> : null}
          <Ionicons
            name={iconName}
            size={22}
            color={
              isFocused
                ? theme.colors.tabBar.active
                : theme.colors.tabBar.inactive
            }
          />
        </View>
        <Text
          style={[
            styles.tabLabel,
            isFocused && styles.tabLabelActive,
          ]}
        >
          {label}
        </Text>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  outer: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 0,
  },
  bar: {
    flexDirection: 'row',
    borderRadius: 32,
    borderWidth: 1,
    borderColor: theme.colors.border.subtle,
    backgroundColor: theme.colors.tabBar.background,
    overflow: 'hidden',
    paddingVertical: 10,
    paddingHorizontal: 8,
    marginBottom: 20,
    shadowColor: theme.colors.accent.everyday,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 12,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
  },
  tabInner: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrap: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeGlow: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.glow.accent,
  },
  tabLabel: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.regular,
    color: theme.colors.tabBar.inactive,
    marginTop: 4,
    textAlign: 'center',
  },
  tabLabelActive: {
    color: theme.colors.tabBar.active,
    fontWeight: theme.typography.fontWeight.semibold,
  },
});
