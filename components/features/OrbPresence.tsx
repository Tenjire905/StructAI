import { useEffect, useState, type ComponentType } from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import type { OrbCompanionState } from '@/hooks/useOrbCompanionState';
import {
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
  replayNonce?: number;
};

/**
 * Orb presence — motion-first. Coach audio via expo-audio when available.
 * Tap the Orb to (re)play the current voice line (mobile autoplay-safe).
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
  const [audioUnavailable, setAudioUnavailable] = useState(false);
  const [replayNonce, setReplayNonce] = useState(0);
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void import('./OrbCoachVoicePlayer')
      .then((mod) => {
        if (!cancelled) {
          setVoicePlayer(() => mod.OrbCoachVoicePlayer);
          setAudioUnavailable(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setVoicePlayer(null);
          setAudioUnavailable(true);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Unlock + first play after user gesture (required on some Android/Expo Go paths).
  const unlockAndPlay = () => {
    setUnlocked(true);
    setReplayNonce((n) => n + 1);
  };

  // TTS only when clip player cannot load at all.
  useEffect(() => {
    if (!voiceSourceKey || voiceLine.length === 0) {
      return;
    }
    if (!audioUnavailable) {
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
    audioUnavailable,
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
  const playId = voiceSourceKey ? `${voiceSourceKey}:${locale}:${mode}` : '';

  const showPlayer = clip != null && VoicePlayer && playId && unlocked;
  const voiceNode = showPlayer ? (
    <VoicePlayer playId={playId} replayNonce={replayNonce} source={clip} />
  ) : null;

  const orbPressable = (
    <Pressable
      accessibilityHint={t('orb.voice.tapHint')}
      accessibilityLabel={t('orb.voice.tapA11y')}
      accessibilityRole="button"
      hitSlop={tokens.spacing.space3}
      onPress={unlockAndPlay}>
      <OrbCompanion interaction={interaction} size={orbSize} state={state} />
    </Pressable>
  );

  const hint =
    clip != null ? (
      <Text
        style={{
          color: tokens.colors.text.tertiary,
          fontFamily: tokens.typography.fontFamily.body,
          fontSize: tokens.typography.fontSize.bodySm,
          textAlign: layout === 'hero' ? 'center' : 'left',
        }}>
        {audioUnavailable ? t('orb.voice.needsDevBuild') : t('orb.voice.tapHint')}
      </Text>
    ) : null;

  if (layout === 'hero') {
    return (
      <View style={{ alignItems: 'center', gap: tokens.spacing.space3, width: '100%' }}>
        {voiceNode}
        {orbPressable}
        {hint}
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
      <View style={{ gap: tokens.spacing.space1, paddingTop: tokens.spacing.space1 }}>
        {orbPressable}
      </View>

      <View style={{ flex: 1, gap: tokens.spacing.space2 }}>
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
        {hint}
      </View>
    </View>
  );
}
