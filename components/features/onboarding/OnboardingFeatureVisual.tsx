import { LinearGradient } from 'expo-linear-gradient';
import { Beaker, BookOpen, Check, Home, User } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { useRef, useState } from 'react';
import { Text, View } from 'react-native';

import { OrbCompanion } from '@/components/features/OrbCompanion';
import { getShadow, useThemeMode } from '@/theme';

export type OnboardingFeatureVisualKind = 'score' | 'path' | 'coach';

type OnboardingFeatureVisualProps = {
  kind: OnboardingFeatureVisualKind;
};

/** Crop window — shows ~top 86% of a full iPhone (soft Liftoff cut, not a stub). */
const CROP_ASPECT = 9 / 16.8;
/** Full chassis aspect inside the crop. */
const PHONE_ASPECT = 9 / 19.5;

/**
 * Liftoff product reveal: iPhone chassis with a mild bottom crop.
 * Fills the carousel slot (height-first) so the device never looks like a
 * tiny truncated stub with empty void underneath.
 */
export function OnboardingFeatureVisual({ kind }: OnboardingFeatureVisualProps) {
  const { tokens, mode } = useThemeMode();
  const isPlayful = mode === 'playful';
  const [phoneSize, setPhoneSize] = useState<{ width: number; height: number } | null>(
    null,
  );
  const lockedKeyRef = useRef('');

  return (
    <View
      onLayout={(event) => {
        const { width: slotW, height: slotH } = event.nativeEvent.layout;
        // Wait until the slot has real height — early 0/tiny layouts caused undersized crops.
        const minSlotH = tokens.spacing.space8 * 4;
        if (slotW < tokens.spacing.space8 || slotH < minSlotH) {
          return;
        }

        const maxW = tokens.spacing.space8 * 3.7;
        // Height-first: consume the carousel slot so no large empty gap under the phone.
        let nextH = slotH;
        let nextW = nextH * CROP_ASPECT;
        const widthCap = Math.min(slotW * 0.9, maxW);
        if (nextW > widthCap) {
          nextW = widthCap;
          nextH = nextW / CROP_ASPECT;
        }

        const width = Math.round(nextW);
        const height = Math.round(nextH);
        if (width < 1 || height < 1) {
          return;
        }

        const key = `${width}x${height}`;
        if (lockedKeyRef.current) {
          // Only accept growth (safe-area jitter may shrink once); never shrink the crop.
          const [lockedW, lockedH] = lockedKeyRef.current.split('x').map(Number);
          if (width < lockedW || height < lockedH) {
            return;
          }
          if (
            Math.abs(width - lockedW) < tokens.spacing.space2 &&
            Math.abs(height - lockedH) < tokens.spacing.space2
          ) {
            return;
          }
        }

        lockedKeyRef.current = key;
        setPhoneSize({ width, height });
      }}
      style={{
        alignItems: 'center',
        flex: 1,
        justifyContent: 'flex-start',
        overflow: 'hidden',
        width: '100%',
      }}>
      {/* Soft brand glow — clipped with the phone, never under the caption. */}
      <LinearGradient
        colors={[
          tokens.colors.accent.primary,
          tokens.colors.accent.primaryDim,
          tokens.colors.background.base,
        ]}
        end={{ x: 0.5, y: 1 }}
        start={{ x: 0.5, y: 0 }}
        style={{
          borderRadius: tokens.radius.pill,
          bottom: '8%',
          left: '2%',
          opacity: isPlayful ? 0.28 : 0.16,
          position: 'absolute',
          right: '2%',
          top: '2%',
        }}
      />

      {phoneSize ? (
        <View
          style={{
            alignItems: 'center',
            alignSelf: 'center',
            height: phoneSize.height,
            overflow: 'hidden',
            width: phoneSize.width,
          }}>
          <View
            style={{
              aspectRatio: PHONE_ASPECT,
              top: 0,
              width: '100%',
            }}>
            <PhoneMockFrame>
              {kind === 'score' ? <ScoreScreenMock /> : null}
              {kind === 'path' ? <PathScreenMock /> : null}
              {kind === 'coach' ? <CoachScreenMock /> : null}
            </PhoneMockFrame>
          </View>
          {/* Soft fade at the crop edge — reads as intentional, not a hard clip. */}
          <LinearGradient
            colors={['transparent', tokens.colors.background.base]}
            end={{ x: 0.5, y: 1 }}
            pointerEvents="none"
            start={{ x: 0.5, y: 0 }}
            style={{
              bottom: 0,
              height: tokens.spacing.space6,
              left: 0,
              position: 'absolute',
              right: 0,
            }}
          />
        </View>
      ) : null}
    </View>
  );
}

function PhoneMockFrame({ children }: { children: ReactNode }) {
  const { tokens, mode } = useThemeMode();
  const isPlayful = mode === 'playful';
  const chassisRadius = tokens.radius.xl;
  const screenRadius = tokens.radius.lg;
  const lip = tokens.spacing.space1;

  return (
    <View
      accessibilityRole="image"
      style={{
        flex: 1,
        width: '100%',
        ...getShadow(2),
        ...(isPlayful ? getShadow('glow') : {}),
      }}>
      <HardwareButton side="left" style={{ top: tokens.spacing.space7 }} tall={tokens.spacing.space3} />
      <HardwareButton side="left" style={{ top: tokens.spacing.space8 }} tall={tokens.spacing.space5} />
      <HardwareButton
        side="left"
        style={{ top: tokens.spacing.space8 + tokens.spacing.space6 }}
        tall={tokens.spacing.space5}
      />
      <HardwareButton
        side="right"
        style={{ top: tokens.spacing.space8 + tokens.spacing.space3 }}
        tall={tokens.spacing.space7}
      />

      <LinearGradient
        colors={[
          tokens.colors.border.strong,
          tokens.colors.surface.cardHover,
          tokens.colors.border.subtle,
          tokens.colors.surface.cardHover,
          tokens.colors.border.strong,
        ]}
        end={{ x: 1, y: 1 }}
        start={{ x: 0, y: 0 }}
        style={{
          borderRadius: chassisRadius,
          flex: 1,
          padding: lip,
        }}>
        <View
          style={{
            backgroundColor: tokens.colors.background.elevated,
            borderRadius: chassisRadius - lip,
            flex: 1,
            overflow: 'hidden',
            padding: tokens.spacing.space1,
          }}>
          <View
            style={{
              backgroundColor: tokens.colors.background.base,
              borderColor: tokens.colors.border.subtle,
              borderRadius: screenRadius,
              borderWidth: 1,
              flex: 1,
              overflow: 'hidden',
            }}>
            <DynamicIsland />
            <StatusBarMock />
            <View style={{ flex: 1, paddingBottom: tokens.spacing.space1 }}>{children}</View>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}

function HardwareButton({
  side,
  tall,
  style,
}: {
  side: 'left' | 'right';
  tall: number;
  style: { top: number };
}) {
  const { tokens } = useThemeMode();

  return (
    <View
      style={{
        backgroundColor: tokens.colors.surface.cardHover,
        borderColor: tokens.colors.border.strong,
        borderRadius: tokens.radius.pill,
        borderWidth: 1,
        height: tall,
        position: 'absolute',
        width: tokens.spacing.space1,
        zIndex: 2,
        ...(side === 'left'
          ? { left: -tokens.spacing.space1 }
          : { right: -tokens.spacing.space1 }),
        ...style,
      }}
    />
  );
}

function DynamicIsland() {
  const { tokens } = useThemeMode();

  return (
    <View
      pointerEvents="none"
      style={{
        alignItems: 'center',
        left: 0,
        paddingTop: tokens.spacing.space2,
        position: 'absolute',
        right: 0,
        zIndex: 5,
      }}>
      <View
        style={{
          alignItems: 'center',
          backgroundColor: tokens.colors.background.base,
          borderColor: tokens.colors.border.subtle,
          borderRadius: tokens.radius.pill,
          borderWidth: 1,
          flexDirection: 'row',
          height: tokens.spacing.space4 + tokens.spacing.space1,
          justifyContent: 'flex-end',
          paddingHorizontal: tokens.spacing.space2,
          width: tokens.spacing.space8 + tokens.spacing.space6,
        }}>
        <View
          style={{
            backgroundColor: tokens.colors.surface.cardHover,
            borderRadius: tokens.radius.pill,
            height: tokens.spacing.space2,
            marginRight: tokens.spacing.space2,
            width: tokens.spacing.space2,
          }}
        />
        <View
          style={{
            backgroundColor: tokens.colors.accent.primaryDim,
            borderRadius: tokens.radius.pill,
            height: tokens.spacing.space2,
            opacity: 0.7,
            width: tokens.spacing.space2,
          }}
        />
      </View>
    </View>
  );
}

function StatusBarMock() {
  const { tokens } = useThemeMode();

  return (
    <View
      style={{
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: tokens.spacing.space4,
        paddingTop: tokens.spacing.space5 + tokens.spacing.space1,
      }}>
      <Text
        style={{
          color: tokens.colors.text.primary,
          fontFamily: tokens.typography.fontFamily.bodyMedium,
          fontSize: tokens.typography.fontSize.bodySm,
        }}>
        9:41
      </Text>
      <View style={{ alignItems: 'center', flexDirection: 'row', gap: tokens.spacing.space1 }}>
        <View
          style={{
            backgroundColor: tokens.colors.text.primary,
            borderRadius: tokens.radius.pill,
            height: tokens.spacing.space2,
            opacity: 0.9,
            width: tokens.spacing.space3,
          }}
        />
        <View
          style={{
            backgroundColor: tokens.colors.text.primary,
            borderRadius: tokens.spacing.space1 / 2,
            height: tokens.spacing.space2,
            opacity: 0.9,
            width: tokens.spacing.space4,
          }}
        />
      </View>
    </View>
  );
}

function MiniBar({
  progress,
  color = 'primary',
}: {
  progress: number;
  color?: 'primary' | 'structure';
}) {
  const { tokens } = useThemeMode();
  const fill =
    color === 'structure'
      ? tokens.colors.accent.structure
      : tokens.colors.accent.primary;

  return (
    <View
      style={{
        backgroundColor: tokens.colors.border.subtle,
        borderRadius: tokens.radius.pill,
        height: tokens.spacing.space1,
        overflow: 'hidden',
        width: '100%',
      }}>
      <View
        style={{
          backgroundColor: fill,
          borderRadius: tokens.radius.pill,
          height: '100%',
          width: `${Math.round(Math.min(1, Math.max(0, progress)) * 100)}%`,
        }}
      />
    </View>
  );
}

function ScoreScreenMock() {
  const { tokens, t, mode } = useThemeMode();
  const cardRadius = tokens.presentation.preferredCardRadius;
  const pad = tokens.presentation.preferredCardPadding;

  return (
    <View
      style={{
        flex: 1,
        gap: tokens.spacing.space2,
        paddingHorizontal: tokens.spacing.space3,
        paddingTop: tokens.spacing.space2,
      }}>
      <View
        style={{
          alignItems: 'center',
          alignSelf: 'center',
          backgroundColor: tokens.colors.surface.card,
          borderRadius: tokens.radius.pill,
          paddingHorizontal: tokens.spacing.space3,
          paddingVertical: tokens.spacing.space1,
        }}>
        <Text
          style={{
            color: tokens.colors.text.secondary,
            fontFamily: tokens.typography.fontFamily.bodyMedium,
            fontSize: tokens.typography.fontSize.bodySm,
          }}>
          {t('onboarding.introVisual.scoreNav')}
        </Text>
      </View>

      <View
        style={{
          backgroundColor: tokens.colors.surface.card,
          borderRadius: cardRadius,
          gap: tokens.spacing.space2,
          padding: pad,
          ...getShadow(1),
        }}>
        <Text
          style={{
            color: tokens.colors.text.secondary,
            fontFamily: tokens.typography.fontFamily.body,
            fontSize: tokens.typography.fontSize.bodySm,
          }}>
          {t('onboarding.introVisual.scoreLabel')}
        </Text>
        <View style={{ alignItems: 'baseline', flexDirection: 'row', gap: tokens.spacing.space1 }}>
          <Text
            style={{
              color: tokens.colors.accent.structure,
              fontFamily: tokens.typography.fontFamily.display,
              fontSize: tokens.typography.fontSize.displayLg,
              lineHeight: tokens.typography.fontSize.displayLg * 1.05,
            }}>
            87
          </Text>
          <Text
            style={{
              color: tokens.colors.text.tertiary,
              fontFamily: tokens.typography.fontFamily.mono,
              fontSize: tokens.typography.fontSize.bodyMd,
            }}>
            /100
          </Text>
        </View>
        <Text
          style={{
            color: tokens.colors.text.primary,
            fontFamily:
              mode === 'playful'
                ? tokens.typography.fontFamily.bodyMedium
                : tokens.typography.fontFamily.body,
            fontSize: tokens.typography.fontSize.bodySm,
            lineHeight: tokens.typography.fontSize.bodySm * 1.35,
          }}>
          {t('onboarding.introVisual.scoreFeedback')}
        </Text>

        {(
          [
            ['onboarding.introVisual.scoreChip1', 0.92],
            ['onboarding.introVisual.scoreChip2', 0.84],
            ['onboarding.introVisual.scoreChip3', 0.78],
          ] as const
        ).map(([key, value]) => (
          <View key={key} style={{ gap: tokens.spacing.space1 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text
                style={{
                  color: tokens.colors.text.secondary,
                  fontFamily: tokens.typography.fontFamily.body,
                  fontSize: tokens.typography.fontSize.bodySm,
                }}>
                {t(key)}
              </Text>
              <Text
                style={{
                  color: tokens.colors.accent.structure,
                  fontFamily: tokens.typography.fontFamily.mono,
                  fontSize: tokens.typography.fontSize.bodySm,
                }}>
                {Math.round(value * 100)}
              </Text>
            </View>
            <MiniBar color="structure" progress={value} />
          </View>
        ))}
      </View>

      <LinearGradient
        colors={[tokens.colors.accent.primary, tokens.colors.accent.primaryDim]}
        end={tokens.gradients.primaryButton.end}
        start={tokens.gradients.primaryButton.start}
        style={{
          alignItems: 'center',
          borderRadius: tokens.radius.pill,
          marginTop: tokens.spacing.space1,
          paddingVertical: tokens.spacing.space3,
        }}>
        <Text
          style={{
            color: tokens.colors.text.onAccent,
            fontFamily: tokens.typography.fontFamily.bodyMedium,
            fontSize: tokens.typography.fontSize.bodySm,
          }}>
          {t('onboarding.introVisual.scoreCta')}
        </Text>
      </LinearGradient>
    </View>
  );
}

function PathScreenMock() {
  const { tokens, t } = useThemeMode();
  const cardRadius = tokens.presentation.preferredCardRadius;
  const pad = tokens.presentation.preferredCardPadding;
  const iconStroke = tokens.icons.strokeWidth;
  const iconSize = tokens.icons.sizes.sm;

  const paths = [
    { progress: 0.72, titleKey: 'onboarding.introVisual.pathCard1' as const },
    { progress: 0.35, titleKey: 'onboarding.introVisual.pathCard2' as const },
    { progress: 0.12, titleKey: 'onboarding.introVisual.pathCard3' as const },
  ];

  return (
    <View
      style={{
        flex: 1,
        gap: tokens.spacing.space2,
        paddingHorizontal: tokens.spacing.space3,
        paddingTop: tokens.spacing.space2,
      }}>
      <View
        style={{
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <Text
          style={{
            color: tokens.colors.text.primary,
            fontFamily: tokens.typography.fontFamily.display,
            fontSize: tokens.typography.fontSize.headingMd,
          }}>
          {t('onboarding.introVisual.pathHome')}
        </Text>
        <View
          style={{
            alignItems: 'center',
            backgroundColor: tokens.colors.surface.card,
            borderRadius: tokens.radius.pill,
            flexDirection: 'row',
            gap: tokens.spacing.space1,
            paddingHorizontal: tokens.spacing.space2,
            paddingVertical: tokens.spacing.space1,
          }}>
          <View
            style={{
              backgroundColor: tokens.colors.accent.primary,
              borderRadius: tokens.radius.pill,
              height: tokens.spacing.space3,
              width: tokens.spacing.space3,
            }}
          />
          <Text
            style={{
              color: tokens.colors.text.primary,
              fontFamily: tokens.typography.fontFamily.mono,
              fontSize: tokens.typography.fontSize.bodySm,
            }}>
            24
          </Text>
        </View>
      </View>

      <Text
        style={{
          color: tokens.colors.text.secondary,
          fontFamily: tokens.typography.fontFamily.body,
          fontSize: tokens.typography.fontSize.bodySm,
        }}>
        {t('onboarding.introVisual.pathSection')}
      </Text>

      {paths.map((path) => (
        <View
          key={path.titleKey}
          style={{
            backgroundColor: tokens.colors.surface.card,
            borderRadius: cardRadius,
            gap: tokens.spacing.space2,
            padding: pad,
            ...getShadow(1),
          }}>
          <Text
            style={{
              color: tokens.colors.text.primary,
              fontFamily: tokens.typography.fontFamily.heading,
              fontSize: tokens.typography.fontSize.bodyMd,
            }}>
            {t(path.titleKey)}
          </Text>
          <Text
            style={{
              color: tokens.colors.text.tertiary,
              fontFamily: tokens.typography.fontFamily.body,
              fontSize: tokens.typography.fontSize.bodySm,
            }}>
            {t('onboarding.introVisual.pathMeta')}
          </Text>
          <MiniBar color="structure" progress={path.progress} />
        </View>
      ))}

      <View
        style={{
          alignItems: 'center',
          backgroundColor: tokens.colors.background.elevated,
          borderRadius: tokens.radius.lg,
          flexDirection: 'row',
          justifyContent: 'space-around',
          marginTop: 'auto',
          paddingVertical: tokens.spacing.space2,
        }}>
        {(
          [
            [Home, true],
            [BookOpen, false],
            [Beaker, false],
            [User, false],
          ] as const
        ).map(([Icon, active], index) => (
          <Icon
            key={`tab-${index}`}
            color={
              active ? tokens.colors.accent.primary : tokens.colors.text.tertiary
            }
            size={iconSize}
            strokeWidth={iconStroke}
          />
        ))}
      </View>
    </View>
  );
}

function CoachScreenMock() {
  const { tokens, t, mode } = useThemeMode();
  const cardRadius = tokens.presentation.preferredCardRadius;
  const pad = tokens.presentation.preferredCardPadding;
  const isPlayful = mode === 'playful';

  return (
    <View
      style={{
        flex: 1,
        gap: tokens.spacing.space3,
        paddingHorizontal: tokens.spacing.space3,
        paddingTop: tokens.spacing.space2,
      }}>
      <View style={{ gap: tokens.spacing.space2 }}>
        <Text
          style={{
            color: tokens.colors.text.tertiary,
            fontFamily: tokens.typography.fontFamily.mono,
            fontSize: tokens.typography.fontSize.bodySm,
          }}>
          {t('onboarding.introVisual.coachStep')}
        </Text>
        <MiniBar progress={0.45} />
      </View>

      <View
        style={{
          alignItems: 'flex-start',
          flexDirection: 'row',
          gap: tokens.spacing.space2,
        }}>
        <OrbCompanion interaction="watch" size={tokens.spacing.space7} state="attentive" />
        <View
          style={{
            backgroundColor: tokens.colors.surface.card,
            borderColor: isPlayful
              ? tokens.colors.border.strong
              : tokens.colors.border.subtle,
            borderRadius: tokens.radius.lg,
            borderWidth: 1,
            flex: 1,
            paddingHorizontal: tokens.spacing.space3,
            paddingVertical: tokens.spacing.space2,
            ...getShadow(1),
          }}>
          <Text
            style={{
              color: tokens.colors.text.primary,
              fontFamily: isPlayful
                ? tokens.typography.fontFamily.bodyMedium
                : tokens.typography.fontFamily.body,
              fontSize: tokens.typography.fontSize.bodySm,
              lineHeight: tokens.typography.fontSize.bodySm * 1.35,
            }}>
            {t('onboarding.introVisual.coachBubble')}
          </Text>
        </View>
      </View>

      <View
        style={{
          backgroundColor: tokens.colors.surface.card,
          borderRadius: cardRadius,
          gap: tokens.spacing.space2,
          padding: pad,
          ...getShadow(1),
        }}>
        <Text
          style={{
            color: tokens.colors.text.secondary,
            fontFamily: tokens.typography.fontFamily.bodyMedium,
            fontSize: tokens.typography.fontSize.bodySm,
          }}>
          {t('onboarding.introVisual.coachPromptLabel')}
        </Text>
        <Text
          style={{
            color: tokens.colors.text.primary,
            fontFamily: tokens.typography.fontFamily.body,
            fontSize: tokens.typography.fontSize.bodySm,
            lineHeight: tokens.typography.fontSize.bodySm * 1.4,
          }}>
          {t('onboarding.introVisual.coachPromptBody')}
        </Text>
      </View>

      <View
        style={{
          alignItems: 'center',
          backgroundColor: tokens.colors.accent.success,
          borderRadius: tokens.radius.pill,
          flexDirection: 'row',
          gap: tokens.spacing.space1,
          justifyContent: 'center',
          marginTop: 'auto',
          paddingVertical: tokens.spacing.space3,
        }}>
        <Check
          color={tokens.colors.background.base}
          size={tokens.icons.sizes.sm}
          strokeWidth={tokens.icons.strokeWidth}
        />
        <Text
          style={{
            color: tokens.colors.background.base,
            fontFamily: tokens.typography.fontFamily.bodyMedium,
            fontSize: tokens.typography.fontSize.bodySm,
          }}>
          {t('onboarding.introVisual.coachCheck')}
        </Text>
      </View>
    </View>
  );
}
