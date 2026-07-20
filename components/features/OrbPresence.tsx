import { useEffect } from 'react';
import { Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import type { OrbCompanionState } from '@/hooks/useOrbCompanionState';
import { resolveOrbSpeechCopyKey } from '@/lib/orbLanguage';
import { useThemeMode } from '@/theme';

import { OrbCompanion } from './OrbCompanion';

type OrbPresenceProps = {
  state: OrbCompanionState;
  size?: number;
  /** When false, only the orb is shown (motion carries the beat). */
  showSpeech?: boolean;
  /**
   * Explicit lesson/coach line. When set, wins over state-derived speech.
   * Prefer sparse speech — especially in onboarding.
   */
  speechKey?: string | null;
  /** Rotates state-fallback lines when speechKey is omitted. */
  speechSeed?: number;
  /** hero = centered presence (onboarding); coach = orb + optional bubble */
  layout?: 'coach' | 'hero';
  interaction?: 'none' | 'enter' | 'watch' | 'react';
};

/**
 * Orb presence — motion-first. Speech is optional and should stay sparse
 * so the companion doesn't drown the screen in copy.
 */
export function OrbPresence({
  state,
  size,
  showSpeech = true,
  speechKey,
  speechSeed = 0,
  layout = 'coach',
  interaction = 'none',
}: OrbPresenceProps) {
  const { tokens, t, mode } = useThemeMode();
  const resolvedKey = showSpeech
    ? (speechKey ?? resolveOrbSpeechCopyKey(state, mode, speechSeed))
    : null;
  const line = resolvedKey ? t(resolvedKey).trim() : '';
  const hasLine = line.length > 0;

  const speechOpacity = useSharedValue(hasLine ? 1 : 0);
  const speechScale = useSharedValue(hasLine ? 1 : 0.96);

  useEffect(() => {
    speechOpacity.value = withTiming(hasLine ? 1 : 0, {
      duration: tokens.motion.duration.fast,
    });
    speechScale.value = hasLine
      ? withSpring(1, tokens.motion.spring.default)
      : withTiming(0.96, { duration: tokens.motion.duration.fast });
  }, [
    hasLine,
    speechOpacity,
    speechScale,
    tokens.motion.duration.fast,
    tokens.motion.spring.default,
  ]);

  const speechStyle = useAnimatedStyle(() => ({
    opacity: speechOpacity.value,
    transform: [{ scale: speechScale.value }],
  }));

  const orbSize = size ?? tokens.spacing.space8 * 0.85;
  const isPlayful = tokens.presentation.orbStyle === 'illustrated';

  if (layout === 'hero') {
    return (
      <View style={{ alignItems: 'center', gap: tokens.spacing.space3, width: '100%' }}>
        <OrbCompanion interaction={interaction} size={orbSize} state={state} />
        {hasLine ? (
          <Animated.View
            accessibilityRole="text"
            style={[
              speechStyle,
              {
                maxWidth: tokens.spacing.space8 * 4,
                paddingHorizontal: tokens.spacing.space2,
              },
            ]}>
            <Text
              style={{
                color: tokens.colors.text.secondary,
                fontFamily: tokens.typography.fontFamily.body,
                fontSize: tokens.typography.fontSize.bodyMd,
                lineHeight: tokens.typography.fontSize.bodyMd * 1.4,
                textAlign: 'center',
              }}>
              {line}
            </Text>
          </Animated.View>
        ) : null}
      </View>
    );
  }

  return (
    <View
      style={{
        alignItems: 'flex-start',
        flexDirection: 'row',
        gap: tokens.spacing.space3,
        width: '100%',
      }}>
      <View style={{ paddingTop: tokens.spacing.space1 }}>
        <OrbCompanion interaction={interaction} size={orbSize} state={state} />
      </View>

      {hasLine ? (
        <Animated.View
          accessibilityRole="text"
          style={[
            speechStyle,
            {
              backgroundColor: tokens.colors.surface.card,
              borderColor: isPlayful
                ? tokens.colors.border.strong
                : tokens.colors.border.subtle,
              borderRadius: tokens.radius.lg,
              borderWidth: 1,
              flex: 1,
              paddingHorizontal: tokens.spacing.space4,
              paddingVertical: tokens.spacing.space3,
            },
          ]}>
          <Text
            style={{
              color: tokens.colors.text.primary,
              fontFamily: isPlayful
                ? tokens.typography.fontFamily.bodyMedium
                : tokens.typography.fontFamily.body,
              fontSize: tokens.typography.fontSize.bodyLg,
              lineHeight: tokens.typography.fontSize.bodyLg * 1.4,
            }}>
            {line}
          </Text>
        </Animated.View>
      ) : null}
    </View>
  );
}
