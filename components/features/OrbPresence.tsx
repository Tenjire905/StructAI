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
  /** When false, only the orb is shown (e.g. compact header slots). */
  showSpeech?: boolean;
  /**
   * Explicit lesson/coach line. When set, wins over state-derived speech.
   * Both Playful and Focus speak when a line is provided (character voice).
   */
  speechKey?: string | null;
  /** Rotates state-fallback lines when speechKey is omitted. */
  speechSeed?: number;
};

/**
 * Orb + speech bubble — Duolingo/Mimo-style companion coach.
 * The bubble is the Orb's voice; Focus uses calmer copy, Playful warmer.
 */
export function OrbPresence({
  state,
  size,
  showSpeech = true,
  speechKey,
  speechSeed = 0,
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

  return (
    <View
      style={{
        alignItems: 'flex-start',
        flexDirection: 'row',
        gap: tokens.spacing.space3,
        width: '100%',
      }}>
      <View style={{ paddingTop: tokens.spacing.space1 }}>
        <OrbCompanion size={orbSize} state={state} />
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
