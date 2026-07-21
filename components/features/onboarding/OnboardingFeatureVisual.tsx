import { LinearGradient } from 'expo-linear-gradient';
import { Beaker, BookOpen, Check, Home, User } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { Text, View } from 'react-native';

import { OrbCompanion } from '@/components/features/OrbCompanion';
import { getShadow, useThemeMode } from '@/theme';

export type OnboardingFeatureVisualKind = 'score' | 'path' | 'coach';

type OnboardingFeatureVisualProps = {
  kind: OnboardingFeatureVisualKind;
};

/**
 * Liftoff-style iPhone mock: real bezel + miniature StructAI screens.
 * Local Views/SVG only — no remote images.
 */
export function OnboardingFeatureVisual({ kind }: OnboardingFeatureVisualProps) {
  return (
    <View style={{ alignItems: 'center', width: '100%' }}>
      <PhoneMockFrame>
        {kind === 'score' ? <ScoreScreenMock /> : null}
        {kind === 'path' ? <PathScreenMock /> : null}
        {kind === 'coach' ? <CoachScreenMock /> : null}
      </PhoneMockFrame>
    </View>
  );
}

function PhoneMockFrame({ children }: { children: ReactNode }) {
  const { tokens, mode } = useThemeMode();
  const isPlayful = mode === 'playful';
  const bezelRadius = isPlayful ? tokens.radius.xl : tokens.radius.lg;
  const screenRadius = tokens.radius.lg;

  return (
    <View
      accessibilityRole="image"
      style={{
        backgroundColor: tokens.colors.background.elevated,
        borderColor: tokens.colors.border.strong,
        borderRadius: bezelRadius,
        borderWidth: tokens.spacing.space1,
        maxWidth: tokens.spacing.space8 * 3.6,
        paddingBottom: tokens.spacing.space2,
        paddingHorizontal: tokens.spacing.space1,
        paddingTop: tokens.spacing.space1,
        width: '78%',
        ...(isPlayful ? getShadow('glow') : getShadow(2)),
      }}>
      {/* Side button hints */}
      <View
        style={{
          backgroundColor: tokens.colors.border.strong,
          borderRadius: tokens.radius.pill,
          height: tokens.spacing.space5,
          position: 'absolute',
          right: -tokens.spacing.space1,
          top: tokens.spacing.space8,
          width: tokens.spacing.space1 / 2,
        }}
      />
      <View
        style={{
          backgroundColor: tokens.colors.border.strong,
          borderRadius: tokens.radius.pill,
          height: tokens.spacing.space4,
          left: -tokens.spacing.space1,
          position: 'absolute',
          top: tokens.spacing.space7,
          width: tokens.spacing.space1 / 2,
        }}
      />

      <View
        style={{
          backgroundColor: tokens.colors.background.base,
          borderRadius: screenRadius,
          overflow: 'hidden',
        }}>
        <StatusBarMock />
        <View style={{ minHeight: tokens.spacing.space8 * 4.2, paddingBottom: tokens.spacing.space3 }}>
          {children}
        </View>
        {/* Home indicator */}
        <View
          style={{
            alignItems: 'center',
            paddingBottom: tokens.spacing.space2,
            paddingTop: tokens.spacing.space1,
          }}>
          <View
            style={{
              backgroundColor: tokens.colors.border.strong,
              borderRadius: tokens.radius.pill,
              height: tokens.spacing.space1,
              width: tokens.spacing.space7,
            }}
          />
        </View>
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
        paddingTop: tokens.spacing.space2,
      }}>
      <Text
        style={{
          color: tokens.colors.text.primary,
          fontFamily: tokens.typography.fontFamily.bodyMedium,
          fontSize: tokens.typography.fontSize.bodySm,
        }}>
        9:41
      </Text>
      <View
        style={{
          backgroundColor: tokens.colors.background.elevated,
          borderRadius: tokens.radius.pill,
          height: tokens.spacing.space3,
          width: tokens.spacing.space7,
        }}
      />
      <View style={{ flexDirection: 'row', gap: tokens.spacing.space1 }}>
        <View
          style={{
            backgroundColor: tokens.colors.text.primary,
            borderRadius: tokens.radius.pill,
            height: tokens.spacing.space2,
            opacity: 0.85,
            width: tokens.spacing.space3,
          }}
        />
        <View
          style={{
            backgroundColor: tokens.colors.text.primary,
            borderRadius: tokens.spacing.space1 / 2,
            height: tokens.spacing.space2,
            opacity: 0.85,
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
        height: tokens.spacing.space2,
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
    <View style={{ gap: tokens.spacing.space3, paddingHorizontal: tokens.spacing.space3 }}>
      <Text
        style={{
          color: tokens.colors.text.secondary,
          fontFamily: tokens.typography.fontFamily.bodyMedium,
          fontSize: tokens.typography.fontSize.bodySm,
          textAlign: 'center',
        }}>
        {t('onboarding.introVisual.scoreNav')}
      </Text>

      <View
        style={{
          backgroundColor: tokens.colors.surface.card,
          borderRadius: cardRadius,
          gap: tokens.spacing.space3,
          padding: pad,
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
            lineHeight: tokens.typography.fontSize.bodySm * 1.4,
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
          paddingVertical: tokens.spacing.space2,
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
  ];

  return (
    <View style={{ gap: tokens.spacing.space3, paddingHorizontal: tokens.spacing.space3 }}>
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
          borderTopColor: tokens.colors.border.subtle,
          borderTopWidth: 1,
          flexDirection: 'row',
          justifyContent: 'space-around',
          marginTop: tokens.spacing.space1,
          paddingTop: tokens.spacing.space2,
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
    <View style={{ gap: tokens.spacing.space3, paddingHorizontal: tokens.spacing.space3 }}>
      <Text
        style={{
          color: tokens.colors.text.tertiary,
          fontFamily: tokens.typography.fontFamily.mono,
          fontSize: tokens.typography.fontSize.bodySm,
        }}>
        {t('onboarding.introVisual.coachStep')}
      </Text>
      <MiniBar progress={0.45} />

      <View
        style={{
          alignItems: 'flex-start',
          flexDirection: 'row',
          gap: tokens.spacing.space2,
        }}>
        <OrbCompanion size={tokens.spacing.space6} state="attentive" />
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
        <View
          style={{
            alignItems: 'center',
            backgroundColor: tokens.colors.accent.success,
            borderRadius: tokens.radius.pill,
            flexDirection: 'row',
            gap: tokens.spacing.space1,
            justifyContent: 'center',
            marginTop: tokens.spacing.space1,
            paddingVertical: tokens.spacing.space2,
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
    </View>
  );
}
