import { useEffect, useMemo } from 'react';
import { Modal, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import Animated, {
  cancelAnimation,
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { useThemeMode } from '@/theme/ThemeModeContext';

export type CelebrationType =
  | 'orb_gain'
  | 'streak_milestone'
  | 'lesson_complete'
  | 'section_milestone'
  | 'capstone_complete'
  | 'path_complete';

export type CelebrationOverlayEvent = {
  id: string;
  type: CelebrationType;
  orbCount?: number;
  pathTitleKey?: string;
};

type CelebrationOverlayProps = {
  event: CelebrationOverlayEvent | null;
  onDismiss: () => void;
};

const CONFETTI_COUNT = 24;

type ConfettiParticle = {
  id: number;
  left: number;
  delay: number;
  size: number;
  color: string;
  drift: number;
};

function createParticles(
  width: number,
  count: number,
  palette: readonly string[],
): ConfettiParticle[] {
  return Array.from({ length: count }, (_, index) => ({
    id: index,
    left: Math.random() * width,
    delay: Math.random() * 120,
    size: 6 + Math.random() * 6,
    color: palette[index % palette.length] ?? palette[0],
    drift: (Math.random() - 0.5) * 80,
  }));
}

function ConfettiParticleView({
  particle,
  height,
}: {
  particle: ConfettiParticle;
  height: number;
}) {
  const translateY = useSharedValue(-40);
  const translateX = useSharedValue(0);
  const opacity = useSharedValue(1);
  const rotation = useSharedValue(0);

  useEffect(() => {
    translateY.value = withDelay(
      particle.delay,
      withTiming(height + 40, {
        duration: 600,
        easing: Easing.out(Easing.quad),
      }),
    );
    translateX.value = withDelay(
      particle.delay,
      withTiming(particle.drift, {
        duration: 600,
        easing: Easing.out(Easing.quad),
      }),
    );
    rotation.value = withDelay(
      particle.delay,
      withTiming(360, { duration: 600, easing: Easing.linear }),
    );
    opacity.value = withDelay(
      particle.delay + 400,
      withTiming(0, { duration: 200 }),
    );
  }, [height, opacity, particle.delay, particle.drift, rotation, translateX, translateY]);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { rotate: `${rotation.value}deg` },
    ],
  }));

  return (
    <Animated.View
      style={[
        style,
        {
          backgroundColor: particle.color,
          borderRadius: 2,
          height: particle.size,
          left: particle.left,
          position: 'absolute',
          top: 0,
          width: particle.size * 0.6,
        },
      ]}
    />
  );
}

function PlayfulConfetti({
  height,
  width,
  particleCount,
  palette,
}: {
  height: number;
  width: number;
  particleCount: number;
  palette: readonly string[];
}) {
  const particles = useMemo(
    () => createParticles(width, particleCount, palette),
    [palette, particleCount, width],
  );

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {particles.map((particle) => (
        <ConfettiParticleView height={height} key={particle.id} particle={particle} />
      ))}
    </View>
  );
}

function FocusPulse({ celebrationType }: { celebrationType: CelebrationType }) {
  const { tokens } = useThemeMode();
  const pulseOpacity = useSharedValue(0);

  useEffect(() => {
    const duration = getCelebrationDurationMs(
      celebrationType,
      tokens.motion.duration.celebration,
    );
    const half = duration / 2;
    pulseOpacity.value = withSequence(
      withTiming(
        celebrationType === 'path_complete'
          ? 0.28
          : celebrationType === 'capstone_complete'
            ? 0.22
            : 0.18,
        {
        duration: half,
        easing: Easing.out(Easing.quad),
      }),
      withTiming(0, {
        duration: half,
        easing: Easing.in(Easing.quad),
      }),
    );
  }, [celebrationType, pulseOpacity, tokens.motion.duration.celebration]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: pulseOpacity.value,
  }));

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        StyleSheet.absoluteFill,
        animatedStyle,
        { backgroundColor: tokens.colors.accent.primary },
      ]}
    />
  );
}

function getCelebrationCopyKey(type: CelebrationType): string {
  switch (type) {
    case 'orb_gain':
      return 'celebration.orbGain';
    case 'streak_milestone':
      return 'celebration.streakMilestone';
    case 'lesson_complete':
      return 'celebration.lessonComplete';
    case 'section_milestone':
      return 'celebration.sectionMilestone';
    case 'capstone_complete':
      return 'celebration.capstoneComplete';
    case 'path_complete':
      return 'celebration.pathComplete';
  }
}

function getCelebrationDurationMs(
  type: CelebrationType,
  defaultDuration: number,
): number {
  if (type === 'path_complete') {
    return defaultDuration * 2;
  }

  if (type === 'capstone_complete') {
    return Math.round(defaultDuration * 1.35);
  }

  return defaultDuration;
}

function getConfettiCount(type: CelebrationType): number {
  if (type === 'path_complete') {
    return CONFETTI_COUNT * 2;
  }

  if (type === 'capstone_complete') {
    return Math.round(CONFETTI_COUNT * 1.25);
  }

  if (type === 'section_milestone') {
    return Math.round(CONFETTI_COUNT * 0.75);
  }

  return CONFETTI_COUNT;
}

export function CelebrationOverlay({ event, onDismiss }: CelebrationOverlayProps) {
  const { tokens, t } = useThemeMode();
  const { height, width } = useWindowDimensions();
  const visible = event !== null;
  const contentScale = useSharedValue(0.85);
  const contentOpacity = useSharedValue(0);

  useEffect(() => {
    if (!event) {
      return;
    }

    contentOpacity.value = 0;
    contentScale.value = 0.85;

    contentOpacity.value = withTiming(1, {
      duration: tokens.motion.duration.fast,
    });

    if (tokens.presentation.allowCelebrationSpring) {
      contentScale.value = withSpring(1, tokens.motion.spring.bouncy);
    } else {
      contentScale.value = withSpring(1, tokens.motion.spring.default);
    }

    const dismissTimer = setTimeout(() => {
      contentOpacity.value = withTiming(0, { duration: tokens.motion.duration.fast }, () => {
        runOnJS(onDismiss)();
      });
    }, getCelebrationDurationMs(event.type, tokens.motion.duration.celebration));

    return () => {
      clearTimeout(dismissTimer);
      cancelAnimation(contentOpacity);
      cancelAnimation(contentScale);
    };
  }, [
    contentOpacity,
    contentScale,
    event,
    onDismiss,
    tokens.motion.duration.celebration,
    tokens.motion.duration.fast,
    tokens.motion.spring,
    tokens.presentation.allowCelebrationSpring,
  ]);

  const contentStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
    transform: [{ scale: contentScale.value }],
  }));

  if (!event) {
    return null;
  }

  const copyKey = getCelebrationCopyKey(event.type);
  const label =
    (event.type === 'path_complete' || event.type === 'capstone_complete') &&
    event.pathTitleKey
      ? t(copyKey, { path: t(event.pathTitleKey) })
      : event.type === 'orb_gain' && event.orbCount !== undefined
        ? t(copyKey, { count: event.orbCount })
        : t(copyKey);

  const confettiCount = getConfettiCount(event.type);
  const confettiPalette = [
    tokens.colors.accent.primary,
    tokens.colors.accent.structure,
    tokens.colors.accent.success,
    tokens.colors.accent.warning,
    tokens.colors.accent.primaryDim,
  ] as const;
  const overlayScrim =
    tokens.appearance === 'light'
      ? 'rgba(26, 18, 37, 0.28)'
      : 'rgba(10, 6, 18, 0.45)';

  return (
    <Modal animationType="none" transparent visible={visible}>
      <View
        pointerEvents="none"
        style={{
          ...StyleSheet.absoluteFill,
          alignItems: 'center',
          backgroundColor: overlayScrim,
          justifyContent: 'center',
        }}>
        {tokens.presentation.confettiEnabled ? (
          <PlayfulConfetti
            height={height}
            palette={confettiPalette}
            particleCount={confettiCount}
            width={width}
          />
        ) : (
          <FocusPulse celebrationType={event.type} />
        )}

        <Animated.View
          style={[
            contentStyle,
            {
              alignItems: 'center',
              justifyContent: 'center',
              paddingHorizontal: tokens.spacing.space5,
            },
          ]}>
          <Text
            style={{
              color: tokens.colors.text.primary,
              fontFamily: tokens.typography.fontFamily.display,
              fontSize:
                event.type === 'path_complete'
                  ? tokens.typography.fontSize.displayLg
                  : tokens.typography.fontSize.headingLg,
              textAlign: 'center',
            }}>
            {label}
          </Text>
        </Animated.View>
      </View>
    </Modal>
  );
}
