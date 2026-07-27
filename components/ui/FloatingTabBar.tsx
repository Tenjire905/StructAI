import { useEffect, useState } from 'react';
import { LayoutChangeEvent, Pressable, View } from 'react-native';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { getShadow, useThemeMode } from '@/theme';

/** Extra scroll clearance so content can pass under the absolute floating bar. */
export const FLOATING_TAB_BAR_CLEARANCE = 112;

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
  spring: { damping: number; stiffness: number };
};

const PRESS_SCALE = 0.94;
const ICON_FOCUS_SCALE = 1.08;

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
  spring,
}: TabChipProps) {
  const focusProgress = useSharedValue(focused ? 1 : 0);
  const pressScale = useSharedValue(1);
  const iconScale = useSharedValue(focused ? ICON_FOCUS_SCALE : 1);

  useEffect(() => {
    focusProgress.value = withSpring(focused ? 1 : 0, spring);
    iconScale.value = withSpring(focused ? ICON_FOCUS_SCALE : 1, spring);
  }, [focusProgress, focused, iconScale, spring]);

  const labelStyle = useAnimatedStyle(() => ({
    color: interpolateColor(focusProgress.value, [0, 1], [inactiveColor, activeColor]),
  }));

  const pressStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pressScale.value }],
  }));

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: iconScale.value }],
  }));

  const iconColor = focused ? activeColor : inactiveColor;

  return (
    <Pressable
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityRole="button"
      accessibilityState={{ selected: focused }}
      onPress={onPress}
      onPressIn={() => {
        pressScale.value = withSpring(PRESS_SCALE, spring);
      }}
      onPressOut={() => {
        pressScale.value = withSpring(1, spring);
      }}
      style={{
        alignItems: 'center',
        borderRadius: 999,
        flex: 1,
        justifyContent: 'center',
        minHeight,
        paddingHorizontal,
        paddingVertical,
        zIndex: 1,
      }}>
      <Animated.View
        style={[
          pressStyle,
          {
            alignItems: 'center',
            gap,
            justifyContent: 'center',
          },
        ]}>
        <Animated.View style={iconStyle}>
          {icon ? icon({ focused, color: iconColor, size: iconSize }) : null}
        </Animated.View>
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
      </Animated.View>
    </Pressable>
  );
}

/**
 * Premium floating card tab bar:
 * absolute over content (no flat under-block), spring physics, press scale,
 * soft morphing active pill, microinteractions on icon/label.
 */
export function FloatingTabBar({ state, descriptors, navigation }: FloatingTabBarProps) {
  const { tokens } = useThemeMode();
  const insets = useSafeAreaInsets();
  const [trackWidth, setTrackWidth] = useState(0);

  const pad = tokens.spacing.space1;
  const gap = tokens.spacing.space1;
  const routeCount = state.routes.length;
  const spring = tokens.motion.spring.default;

  const indicatorX = useSharedValue(pad);
  const indicatorW = useSharedValue(0);
  const indicatorMorph = useSharedValue(1);

  useEffect(() => {
    if (trackWidth <= 0 || routeCount === 0) {
      return;
    }

    const inner = trackWidth - pad * 2 - gap * Math.max(0, routeCount - 1);
    const chipWidth = inner / routeCount;
    const x = pad + state.index * (chipWidth + gap);

    indicatorX.value = withSpring(x, spring);
    indicatorW.value = withSpring(chipWidth, spring);
    // Soft morph: slight squash then settle when switching tabs.
    indicatorMorph.value = withSequence(
      withSpring(0.9, { damping: 18, stiffness: 220 }),
      withSpring(1, spring),
    );
  }, [
    gap,
    indicatorMorph,
    indicatorW,
    indicatorX,
    pad,
    routeCount,
    spring,
    state.index,
    trackWidth,
  ]);

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: indicatorX.value },
      { scaleY: indicatorMorph.value },
      { scaleX: 2 - indicatorMorph.value },
    ],
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
        bottom: 0,
        left: 0,
        paddingBottom: Math.max(insets.bottom, tokens.spacing.space2),
        paddingHorizontal: tokens.spacing.screenPadding,
        paddingTop: tokens.spacing.space2,
        position: 'absolute',
        right: 0,
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
                spring={spring}
              />
            );
          })}
        </View>
      </View>
    </View>
  );
}
