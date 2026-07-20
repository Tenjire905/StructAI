import { useEffect, useState, type ComponentType } from 'react';
import { Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import type { OrbCompanionState } from '@/hooks/useOrbCompanionState';
import {
  isOrbAudioNativeAvailable,
  resolveOrbCoachClip,
  speakOrbCoachTtsFallback,
  stopOrbCoachVoice,
} from '@/lib/orbCoachVoice';
import { resolveOrbSpeechCopyKey } from '@/lib/orbLanguage';
import { useThemeMode } from '@/theme';

import { OrbCompanion } from './OrbCompanion';

type OrbPresenceProps = {
  state: OrbCompanionState;
  size?: number;
  showSpeech?: boolean;
  speechKey?: string | null;
  voiceKey?: string | null;
  speechSeed?: number;
  layout?: 'coach' | 'hero';
  interaction?: 'none' | 'enter' | 'watch' | 'react';
};

type VoicePlayerProps = {
  source: number;
  playId: string;
};

/**
 * Orb presence — motion-first. Parallel coach audio via expo-audio player
 * (mounted when ExpoAudio exists) or device TTS fallback.
 */
export function OrbPresence({
  state,
  size,
  showSpeech = true,
  speechKey,
  voiceKey = null,
  speechSeed = 0,
  layout = 'coach',
  interaction = 'none',
}: OrbPresenceProps) {
  const { tokens, t, mode, locale } = useThemeMode();
  const resolvedKey = showSpeech
    ? (speechKey ?? resolveOrbSpeechCopyKey(state, mode, speechSeed))
    : null;
  const line = resolvedKey ? t(resolvedKey).trim() : '';
  const hasLine = line.length > 0;

  const voiceSourceKey = voiceKey ?? resolvedKey;
  const voiceLine = voiceSourceKey ? t(voiceSourceKey).trim() : '';
  const forceVoice = voiceKey != null;

  const clip = resolveOrbCoachClip({
    speechKey: voiceSourceKey,
    locale,
    mode,
    soundEnabled: tokens.presentation.soundEnabled,
    force: forceVoice,
  });

  const [VoicePlayer, setVoicePlayer] = useState<ComponentType<VoicePlayerProps> | null>(
    null,
  );

  useEffect(() => {
    if (!isOrbAudioNativeAvailable()) {
      setVoicePlayer(null);
      return;
    }
    let cancelled = false;
    void import('./OrbCoachVoicePlayer')
      .then((mod) => {
        if (!cancelled) {
          setVoicePlayer(() => mod.OrbCoachVoicePlayer);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setVoicePlayer(null);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // TTS fallback only when we cannot mount the native clip player.
  useEffect(() => {
    if (!voiceSourceKey || voiceLine.length === 0) {
      return;
    }
    if (clip != null && VoicePlayer) {
      return;
    }
    if (clip != null && isOrbAudioNativeAvailable()) {
      // Player still loading — wait, don't TTS over it.
      return;
    }

    void speakOrbCoachTtsFallback(voiceSourceKey, {
      text: voiceLine,
      locale,
      mode,
      soundEnabled: tokens.presentation.soundEnabled,
      force: forceVoice,
    });

    return () => {
      stopOrbCoachVoice();
    };
  }, [
    VoicePlayer,
    clip,
    forceVoice,
    locale,
    mode,
    tokens.presentation.soundEnabled,
    voiceLine,
    voiceSourceKey,
  ]);

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
  const playId = voiceSourceKey
    ? `${voiceSourceKey}:${locale}:${mode}`
    : '';

  const voiceNode =
    clip != null && VoicePlayer && playId ? (
      <VoicePlayer playId={playId} source={clip} />
    ) : null;

  if (layout === 'hero') {
    return (
      <View style={{ alignItems: 'center', gap: tokens.spacing.space3, width: '100%' }}>
        {voiceNode}
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
      {voiceNode}
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
