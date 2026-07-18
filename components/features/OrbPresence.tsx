import { useEffect } from 'react';
import { Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
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
};

/**
 * Orb + optional Playful speech chip. Focus never shows speech.
 */
export function OrbPresence({
  state,
  size,
  showSpeech = true,
}: OrbPresenceProps) {
  const { tokens, t, mode } = useThemeMode();
  const speechKey = showSpeech ? resolveOrbSpeechCopyKey(state, mode) : null;
  const speechOpacity = useSharedValue(0);

  useEffect(() => {
    speechOpacity.value = withTiming(speechKey ? 1 : 0, {
      duration: tokens.motion.duration.fast,
    });
  }, [speechKey, speechOpacity, tokens.motion.duration.fast]);

  const speechStyle = useAnimatedStyle(() => ({
    opacity: speechOpacity.value,
  }));

  const orbSize = size ?? tokens.spacing.space8 * 0.75;

  return (
    <View
      accessibilityRole="text"
      style={{
        alignItems: 'center',
        flexDirection: 'row',
        gap: tokens.spacing.space3,
      }}>
      <OrbCompanion size={orbSize} state={state} />
      {speechKey ? (
        <Animated.View
          style={[
            speechStyle,
            {
              backgroundColor: tokens.colors.surface.card,
              borderColor: tokens.colors.border.subtle,
              borderRadius: tokens.radius.md,
              borderWidth: 1,
              flexShrink: 1,
              paddingHorizontal: tokens.spacing.space3,
              paddingVertical: tokens.spacing.space2,
            },
          ]}>
          <Text
            style={{
              color: tokens.colors.text.secondary,
              fontFamily: tokens.typography.fontFamily.body,
              fontSize: tokens.typography.fontSize.bodyMd,
              lineHeight: tokens.typography.fontSize.bodyMd * 1.35,
            }}>
            {t(speechKey)}
          </Text>
        </Animated.View>
      ) : null}
    </View>
  );
}
