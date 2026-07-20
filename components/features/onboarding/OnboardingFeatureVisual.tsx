import { Text, View } from 'react-native';
import Svg, { Circle, Rect } from 'react-native-svg';

import { getShadow, useThemeMode } from '@/theme';

export type OnboardingFeatureVisualKind = 'score' | 'path' | 'coach';

type OnboardingFeatureVisualProps = {
  kind: OnboardingFeatureVisualKind;
};

/**
 * Local phone-frame feature mocks for Liftoff-style intro slides.
 * Token colors only — no remote images.
 */
export function OnboardingFeatureVisual({ kind }: OnboardingFeatureVisualProps) {
  const { tokens, mode } = useThemeMode();
  const isPlayful = mode === 'playful';
  const frameRadius = isPlayful ? tokens.radius.xl : tokens.radius.lg;

  return (
    <View style={{ alignItems: 'center', width: '100%' }}>
      <View
        style={{
          backgroundColor: tokens.colors.background.elevated,
          borderColor: tokens.colors.border.strong,
          borderRadius: frameRadius,
          borderWidth: 1,
          maxWidth: tokens.spacing.space8 * 4,
          overflow: 'hidden',
          padding: tokens.spacing.space4,
          width: '88%',
          ...(isPlayful ? getShadow('glow') : getShadow(1)),
        }}>
        <View
          style={{
            alignSelf: 'center',
            backgroundColor: tokens.colors.border.subtle,
            borderRadius: tokens.radius.pill,
            height: tokens.spacing.space1,
            marginBottom: tokens.spacing.space4,
            width: tokens.spacing.space6,
          }}
        />
        {kind === 'score' ? <ScoreMock /> : null}
        {kind === 'path' ? <PathMock /> : null}
        {kind === 'coach' ? <CoachMock /> : null}
      </View>
    </View>
  );
}

function ScoreMock() {
  const { tokens, t } = useThemeMode();

  return (
    <View style={{ gap: tokens.spacing.space4 }}>
      <Text
        style={{
          color: tokens.colors.text.secondary,
          fontFamily: tokens.typography.fontFamily.bodyMedium,
          fontSize: tokens.typography.fontSize.bodySm,
          textAlign: 'center',
        }}>
        {t('onboarding.introVisual.scoreLabel')}
      </Text>
      <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        <Svg height={120} viewBox="0 0 120 120" width={120}>
          <Circle
            cx="60"
            cy="60"
            fill="none"
            r="46"
            stroke={tokens.colors.border.subtle}
            strokeWidth="10"
          />
          <Circle
            cx="60"
            cy="60"
            fill="none"
            r="46"
            stroke={tokens.colors.accent.structure}
            strokeDasharray="220"
            strokeDashoffset="48"
            strokeLinecap="round"
            strokeWidth="10"
            transform="rotate(-90 60 60)"
          />
        </Svg>
        <View style={{ alignItems: 'center', position: 'absolute' }}>
          <Text
            style={{
              color: tokens.colors.accent.structure,
              fontFamily: tokens.typography.fontFamily.mono,
              fontSize: tokens.typography.fontSize.displayLg,
            }}>
            87
          </Text>
          <Text
            style={{
              color: tokens.colors.text.tertiary,
              fontFamily: tokens.typography.fontFamily.body,
              fontSize: tokens.typography.fontSize.bodySm,
            }}>
            /100
          </Text>
        </View>
      </View>
      <View style={{ flexDirection: 'row', gap: tokens.spacing.space2 }}>
        {(
          [
            'onboarding.introVisual.scoreChip1',
            'onboarding.introVisual.scoreChip2',
            'onboarding.introVisual.scoreChip3',
          ] as const
        ).map((key) => (
          <View
            key={key}
            style={{
              backgroundColor: tokens.colors.surface.card,
              borderRadius: tokens.radius.sm,
              flex: 1,
              paddingVertical: tokens.spacing.space2,
            }}>
            <Text
              style={{
                color: tokens.colors.text.secondary,
                fontFamily: tokens.typography.fontFamily.body,
                fontSize: tokens.typography.fontSize.bodySm,
                textAlign: 'center',
              }}>
              {t(key)}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function PathMock() {
  const { tokens, t } = useThemeMode();
  const steps = [1, 1, 1, 0.45, 0, 0];

  return (
    <View style={{ gap: tokens.spacing.space4 }}>
      <Text
        style={{
          color: tokens.colors.text.primary,
          fontFamily: tokens.typography.fontFamily.heading,
          fontSize: tokens.typography.fontSize.headingMd,
        }}>
        {t('onboarding.introVisual.pathTitle')}
      </Text>
      <View style={{ gap: tokens.spacing.space3 }}>
        {steps.map((fill, index) => (
          <View
            key={`path-${index}`}
            style={{
              alignItems: 'center',
              flexDirection: 'row',
              gap: tokens.spacing.space3,
            }}>
            <View
              style={{
                alignItems: 'center',
                backgroundColor:
                  fill > 0
                    ? tokens.colors.accent.primary
                    : tokens.colors.surface.card,
                borderRadius: tokens.radius.pill,
                height: tokens.spacing.space5,
                justifyContent: 'center',
                width: tokens.spacing.space5,
              }}>
              <Text
                style={{
                  color:
                    fill > 0
                      ? tokens.colors.text.onAccent
                      : tokens.colors.text.tertiary,
                  fontFamily: tokens.typography.fontFamily.mono,
                  fontSize: tokens.typography.fontSize.bodySm,
                }}>
                {index + 1}
              </Text>
            </View>
            <View
              style={{
                backgroundColor: tokens.colors.border.subtle,
                borderRadius: tokens.radius.pill,
                flex: 1,
                height: tokens.spacing.space2,
                overflow: 'hidden',
              }}>
              <View
                style={{
                  backgroundColor: tokens.colors.accent.primary,
                  height: '100%',
                  width: `${Math.round(fill * 100)}%`,
                }}
              />
            </View>
          </View>
        ))}
      </View>
      <Text
        style={{
          color: tokens.colors.accent.primary,
          fontFamily: tokens.typography.fontFamily.bodyMedium,
          fontSize: tokens.typography.fontSize.bodyMd,
          textAlign: 'center',
        }}>
        {t('onboarding.introVisual.pathOrbs')}
      </Text>
    </View>
  );
}

function CoachMock() {
  const { tokens, t } = useThemeMode();

  return (
    <View style={{ alignItems: 'center', gap: tokens.spacing.space4 }}>
      <View
        style={{
          backgroundColor: tokens.colors.surface.card,
          borderColor: tokens.colors.border.strong,
          borderRadius: tokens.radius.lg,
          borderWidth: 1,
          paddingHorizontal: tokens.spacing.space4,
          paddingVertical: tokens.spacing.space3,
          width: '100%',
        }}>
        <Text
          style={{
            color: tokens.colors.text.primary,
            fontFamily: tokens.typography.fontFamily.bodyMedium,
            fontSize: tokens.typography.fontSize.bodyMd,
            lineHeight: tokens.typography.fontSize.bodyMd * 1.4,
            textAlign: 'center',
          }}>
          {t('onboarding.introVisual.coachBubble')}
        </Text>
      </View>
      <Svg height={96} viewBox="0 0 96 96" width={96}>
        <Circle
          cx="48"
          cy="48"
          fill={tokens.colors.accent.primaryDim}
          opacity={0.35}
          r="40"
        />
        <Circle cx="48" cy="48" fill={tokens.colors.background.base} r="22" />
        <Circle
          cx="48"
          cy="48"
          fill="none"
          r="28"
          stroke={tokens.colors.accent.primary}
          strokeWidth="3"
        />
        <Rect
          fill={tokens.colors.accent.primary}
          height="6"
          opacity={0.7}
          rx="3"
          width="18"
          x="39"
          y="44"
        />
      </Svg>
      <Text
        style={{
          color: tokens.colors.text.secondary,
          fontFamily: tokens.typography.fontFamily.body,
          fontSize: tokens.typography.fontSize.bodySm,
          textAlign: 'center',
        }}>
        {t('onboarding.introVisual.coachCaption')}
      </Text>
    </View>
  );
}
