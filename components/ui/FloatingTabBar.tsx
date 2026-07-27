import { useEffect, useState } from 'react';
import { LayoutChangeEvent, Text, View } from 'react-native';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PressableScale } from '@/components/ui/PressableScale';
import { getShadow, useThemeMode } from '@/theme';

type TabRoute = {
  key: string;
  name: string;
  params?: object;
};

type FloatingTabBarProps = {
  state: {
    index: number;
    routes: TabRoute[];
  };
  descriptors: Record<
    string,
    {
      options: {
        title?: string;
        tabBarLabel?: string | ((props: { focused: boolean; color: string }) => React.ReactNode);
        tabBarAccessibilityLabel?: string;
        tabBarIcon?: (props: {
          focused: boolean;
          color: string;
          size: number;
        }) => React.ReactNode;
      };
    }
  >;
  navigation: {
    emit: (event: {
      type: string;
      target: string;
      canPreventDefault: boolean;
    }) => { defaultPrevented: boolean };
    navigate: (name: string, params?: object) => void;
  };
};

type TabChipProps = {
  focused: boolean;
  label: string;
  accessibilityLabel?: string;
  activeColor: string;
  inactiveColor: string;
  icon?: (props: { focused: boolean; color: string; size: number }) => React.ReactNode;
  iconSize: number;
  onPress: () => void;
  minHeight: number;
  paddingHorizontal: number;
  paddingVertical: number;
  gap: number;
  fontFamily: string;
  fontSize: number;
  duration: number;
};

function TabChip({
  focused,
  label,
  accessibilityLabel,
  activeColor,
  inactiveColor,
  icon,
  iconSize,
  onPress,
  minHeight,
  paddingHorizontal,
  paddingVertical,
  gap,
  fontFamily,
  fontSize,
  duration,
}: TabChipProps) {
  const progress = useSharedValue(focused ? 1 : 0);

  useEffect(() => {
    progress.value = withTiming(focused ? 1 : 0, { duration });
  }, [duration, focused, progress]);

  const labelStyle = useAnimatedStyle(() => ({
    color: interpolateColor(progress.value, [0, 1], [inactiveColor, activeColor]),
  }));

  // Icon color follows focus; Lucide needs a concrete color string each render.
  const iconColor = focused ? activeColor : inactiveColor;

  return (
    <PressableScale
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityRole="button"
      accessibilityState={{ selected: focused }}
      onPress={onPress}
      style={{
        alignItems: 'center',
        borderRadius: 999,
        flex: 1,
        gap,
        justifyContent: 'center',
        minHeight,
        paddingHorizontal,
        paddingVertical,
        zIndex: 1,
      }}>
      {icon ? icon({ focused, color: iconColor, size: iconSize }) : null}
      <Animated.Text
        numberOfLines={1}
        style={[
          labelStyle,
          {
            fontFamily,
            fontSize,
          },
        ]}>
        {label}
      </Animated.Text>
    </PressableScale>
  );
}

/**
 * Solid floating pill tab bar — liquid-glass silhouette without transparency.
 * Active oval chip slides smoothly between tabs (Reanimated timing).
 */
export function FloatingTabBar({ state, descriptors, navigation }: FloatingTabBarProps) {
  const { tokens } = useThemeMode();
  const insets = useSafeAreaInsets();
  const [trackWidth, setTrackWidth] = useState(0);

  const pad = tokens.spacing.space1;
  const gap = tokens.spacing.space1;
  const routeCount = state.routes.length;
  const slideMs = tokens.motion.duration.medium;

  const indicatorX = useSharedValue(pad);
  const indicatorW = useSharedValue(0);

  useEffect(() => {
    if (trackWidth <= 0 || routeCount === 0) {
      return;
    }

    const inner = trackWidth - pad * 2 - gap * Math.max(0, routeCount - 1);
    const chipWidth = inner / routeCount;
    const x = pad + state.index * (chipWidth + gap);

    indicatorX.value = withTiming(x, { duration: slideMs });
    indicatorW.value = withTiming(chipWidth, { duration: slideMs });
  }, [gap, indicatorW, indicatorX, pad, routeCount, slideMs, state.index, trackWidth]);

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: indicatorX.value }],
    width: indicatorW.value,
  }));

  const handleTrackLayout = (event: LayoutChangeEvent) => {
    setTrackWidth(event.nativeEvent.layout.width);
  };

  return (
    <View
      pointerEvents="box-none"
      style={{
        backgroundColor: 'transparent',
        paddingBottom: Math.max(insets.bottom, tokens.spacing.space2),
        paddingHorizontal: tokens.spacing.screenPadding,
        paddingTop: tokens.spacing.space2,
      }}>
      <View
        style={[
          getShadow(2, tokens.appearance),
          {
            backgroundColor: tokens.colors.surface.card,
            borderColor: tokens.colors.border.subtle,
            borderRadius: tokens.radius.pill,
            borderWidth: 1,
          },
        ]}>
        <View
          onLayout={handleTrackLayout}
          style={{
            alignItems: 'center',
            borderRadius: tokens.radius.pill,
            flexDirection: 'row',
            gap,
            minHeight: tokens.spacing.space7 + tokens.spacing.space2,
            overflow: 'hidden',
            paddingHorizontal: pad,
            paddingVertical: pad,
          }}>
        {trackWidth > 0 ? (
          <Animated.View
            pointerEvents="none"
            style={[
              indicatorStyle,
              {
                backgroundColor: tokens.colors.accent.primarySoft,
                borderRadius: tokens.radius.pill,
                bottom: pad,
                position: 'absolute',
                top: pad,
              },
            ]}
          />
        ) : null}

        {state.routes.map((route, index) => {
          const focused = state.index === index;
          const { options } = descriptors[route.key];

          const label =
            typeof options.tabBarLabel === 'string'
              ? options.tabBarLabel
              : typeof options.title === 'string'
                ? options.title
                : route.name;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!focused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          return (
            <TabChip
              accessibilityLabel={options.tabBarAccessibilityLabel}
              activeColor={tokens.colors.accent.primary}
              duration={slideMs}
              focused={focused}
              fontFamily={tokens.typography.fontFamily.bodyMedium}
              fontSize={tokens.typography.fontSize.bodySm}
              gap={tokens.spacing.space1}
              icon={options.tabBarIcon}
              iconSize={tokens.icons.sizes.md}
              inactiveColor={tokens.colors.text.tertiary}
              key={route.key}
              label={label}
              minHeight={tokens.spacing.space7}
              onPress={onPress}
              paddingHorizontal={tokens.spacing.space1}
              paddingVertical={tokens.spacing.space2}
            />
          );
        })}
        </View>
      </View>
    </View>
  );
}
