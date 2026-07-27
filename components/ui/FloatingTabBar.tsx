import { Text, View } from 'react-native';
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

/**
 * Solid floating pill tab bar — liquid-glass silhouette without transparency.
 * Floats inset from screen edges; active tab is an oval chip inside.
 */
export function FloatingTabBar({ state, descriptors, navigation }: FloatingTabBarProps) {
  const { tokens } = useThemeMode();
  const insets = useSafeAreaInsets();

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
            alignItems: 'center',
            backgroundColor: tokens.colors.surface.card,
            borderColor: tokens.colors.border.subtle,
            borderRadius: tokens.radius.pill,
            borderWidth: 1,
            flexDirection: 'row',
            gap: tokens.spacing.space1,
            minHeight: tokens.spacing.space7 + tokens.spacing.space2,
            paddingHorizontal: tokens.spacing.space1,
            paddingVertical: tokens.spacing.space1,
          },
        ]}>
        {state.routes.map((route, index) => {
          const focused = state.index === index;
          const { options } = descriptors[route.key];
          const color = focused
            ? tokens.colors.accent.primary
            : tokens.colors.text.tertiary;

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
            <PressableScale
              accessibilityLabel={options.tabBarAccessibilityLabel ?? label}
              accessibilityRole="button"
              accessibilityState={{ selected: focused }}
              key={route.key}
              onPress={onPress}
              style={{
                alignItems: 'center',
                backgroundColor: focused
                  ? tokens.colors.accent.primarySoft
                  : 'transparent',
                borderRadius: tokens.radius.pill,
                flex: 1,
                gap: tokens.spacing.space1,
                justifyContent: 'center',
                minHeight: tokens.spacing.space7,
                paddingHorizontal: tokens.spacing.space1,
                paddingVertical: tokens.spacing.space2,
              }}>
              {options.tabBarIcon
                ? options.tabBarIcon({
                    focused,
                    color,
                    size: tokens.icons.sizes.md,
                  })
                : null}
              <Text
                numberOfLines={1}
                style={{
                  color,
                  fontFamily: tokens.typography.fontFamily.bodyMedium,
                  fontSize: tokens.typography.fontSize.bodySm,
                }}>
                {label}
              </Text>
            </PressableScale>
          );
        })}
      </View>
    </View>
  );
}
