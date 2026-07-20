import { useMemo, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { OrbPresence } from '@/components/features/OrbPresence';
import { Button, Card, ProgressBar } from '@/components/ui';
import { useOrbCompanionState } from '@/hooks/useOrbCompanionState';
import {
  buildDemoImprovedPrompt,
  buildDemoWeakPrompt,
  comparePromptScores,
  getMissingHints,
  scorePrompt,
} from '@/lib/promptScoring';
import { useThemeMode } from '@/theme';

type ProofStep = 'weak' | 'critique' | 'rewrite' | 'compare' | 'summary';

type FirstSessionProofViewProps = {
  onContinue: () => void;
};

/**
 * Week-1 first-session proof: vague prompt → critique → rewrite → compare → skill summary.
 * Local heuristic only — no BYOK hurdle.
 */
export function FirstSessionProofView({ onContinue }: FirstSessionProofViewProps) {
  const { tokens, t, locale } = useThemeMode();
  const insets = useSafeAreaInsets();
  const [step, setStep] = useState<ProofStep>('weak');
  const orbOverride =
    step === 'critique' || step === 'compare'
      ? 'think'
      : step === 'summary'
        ? 'celebrating'
        : step === 'rewrite'
          ? 'happy'
          : 'attentive';
  const companionState = useOrbCompanionState(orbOverride);

  const weakPrompt = useMemo(() => buildDemoWeakPrompt(locale), [locale]);
  const improvedPrompt = useMemo(() => buildDemoImprovedPrompt(locale), [locale]);
  const beforeScore = useMemo(() => scorePrompt(weakPrompt, locale), [locale, weakPrompt]);
  const afterScore = useMemo(
    () => scorePrompt(improvedPrompt, locale),
    [improvedPrompt, locale],
  );
  const comparison = useMemo(
    () => comparePromptScores(beforeScore, afterScore),
    [afterScore, beforeScore],
  );
  const critiqueHints = useMemo(() => getMissingHints(beforeScore, 3), [beforeScore]);
  const critiqueBody =
    critiqueHints.length > 0
      ? critiqueHints.join(' ')
      : t('firstSessionProof.critiqueBody');

  const advance = () => {
    const order: ProofStep[] = ['weak', 'critique', 'rewrite', 'compare', 'summary'];
    const index = order.indexOf(step);
    if (index < order.length - 1) {
      setStep(order[index + 1]);
      return;
    }
    onContinue();
  };

  const ctaLabel =
    step === 'summary'
      ? t('firstSessionProof.ctaDone')
      : step === 'weak'
        ? t('firstSessionProof.ctaCritique')
        : step === 'critique'
          ? t('firstSessionProof.ctaRewrite')
          : step === 'rewrite'
            ? t('firstSessionProof.ctaCompare')
            : t('firstSessionProof.ctaSummary');

  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        gap: tokens.presentation.preferredSectionGap,
        justifyContent: 'center',
        paddingBottom: tokens.spacing.space7 + insets.bottom,
        paddingHorizontal: tokens.spacing.screenPadding,
        paddingTop: insets.top + tokens.spacing.space5,
      }}
      style={{ backgroundColor: tokens.colors.background.base, flex: 1 }}>
      <OrbPresence
        interaction={step === 'summary' ? 'react' : 'watch'}
        layout="hero"
        showSpeech={step === 'summary'}
        size={tokens.spacing.space8 * 1.05}
        speechKey={step === 'summary' ? 'orb.speech.onboarding.proofDone' : null}
        state={companionState}
      />

      <View style={{ gap: tokens.spacing.space2 }}>
        <Text
          style={{
            color: tokens.colors.accent.primary,
            fontFamily: tokens.typography.fontFamily.display,
            fontSize: tokens.typography.fontSize.headingLg,
          }}>
          {t('firstSessionProof.brand')}
        </Text>
        <Text
          style={{
            color: tokens.colors.text.primary,
            fontFamily: tokens.typography.fontFamily.heading,
            fontSize: tokens.typography.fontSize.headingMd,
            lineHeight: tokens.typography.fontSize.headingMd * 1.25,
          }}>
          {t('firstSessionProof.headline')}
        </Text>
        <Text
          style={{
            color: tokens.colors.text.secondary,
            fontFamily: tokens.typography.fontFamily.body,
            fontSize: tokens.typography.fontSize.bodyMd,
            lineHeight: tokens.typography.fontSize.bodyMd * 1.45,
          }}>
          {t('firstSessionProof.sub')}
        </Text>
      </View>

      {step === 'weak' || step === 'critique' ? (
        <Card variant="solid">
          <View style={{ gap: tokens.spacing.space3 }}>
            <Text
              style={{
                color: tokens.colors.text.tertiary,
                fontFamily: tokens.typography.fontFamily.bodyMedium,
                fontSize: tokens.typography.fontSize.bodySm,
                textTransform: 'uppercase',
              }}>
              {t('firstSessionProof.weakLabel')}
            </Text>
            <Text
              style={{
                color: tokens.colors.text.primary,
                fontFamily: tokens.typography.fontFamily.body,
                fontSize: tokens.typography.fontSize.bodyLg,
                lineHeight: tokens.typography.fontSize.bodyLg * 1.4,
              }}>
              {weakPrompt}
            </Text>
            {step === 'critique' ? (
              <View style={{ gap: tokens.spacing.space2 }}>
                <Text
                  style={{
                    color: tokens.colors.accent.warning,
                    fontFamily: tokens.typography.fontFamily.heading,
                    fontSize: tokens.typography.fontSize.headingMd,
                  }}>
                  {t('firstSessionProof.scoreLabel', { score: beforeScore.total })}
                </Text>
                <Text
                  style={{
                    color: tokens.colors.text.secondary,
                    fontFamily: tokens.typography.fontFamily.body,
                    fontSize: tokens.typography.fontSize.bodyMd,
                    lineHeight: tokens.typography.fontSize.bodyMd * 1.45,
                  }}>
                  {critiqueBody}
                </Text>
                <ProgressBar color="structure" progress={beforeScore.total / 100} />
              </View>
            ) : null}
          </View>
        </Card>
      ) : null}

      {step === 'rewrite' || step === 'compare' || step === 'summary' ? (
        <Card variant="solid">
          <View style={{ gap: tokens.spacing.space3 }}>
            <Text
              style={{
                color: tokens.colors.text.tertiary,
                fontFamily: tokens.typography.fontFamily.bodyMedium,
                fontSize: tokens.typography.fontSize.bodySm,
                textTransform: 'uppercase',
              }}>
              {t('firstSessionProof.improvedLabel')}
            </Text>
            <Text
              style={{
                color: tokens.colors.text.primary,
                fontFamily: tokens.typography.fontFamily.body,
                fontSize: tokens.typography.fontSize.bodyMd,
                lineHeight: tokens.typography.fontSize.bodyMd * 1.45,
              }}>
              {improvedPrompt}
            </Text>
          </View>
        </Card>
      ) : null}

      {step === 'compare' || step === 'summary' ? (
        <Card variant="solid">
          <View style={{ gap: tokens.spacing.space3 }}>
            <Text
              style={{
                color: tokens.colors.accent.structure,
                fontFamily: tokens.typography.fontFamily.heading,
                fontSize: tokens.typography.fontSize.headingMd,
              }}>
              {t('firstSessionProof.compareTitle', {
                before: beforeScore.total,
                after: afterScore.total,
                delta: comparison.totalDelta,
              })}
            </Text>
            {comparison.improvementNotes.slice(0, 2).map((note) => (
              <Text
                key={note}
                style={{
                  color: tokens.colors.text.secondary,
                  fontFamily: tokens.typography.fontFamily.body,
                  fontSize: tokens.typography.fontSize.bodySm,
                  lineHeight: tokens.typography.fontSize.bodySm * 1.45,
                }}>
                {note}
              </Text>
            ))}
          </View>
        </Card>
      ) : null}

      {step === 'summary' ? (
        <Card variant="solid">
          <View style={{ gap: tokens.spacing.space2 }}>
            <Text
              style={{
                color: tokens.colors.accent.structure,
                fontFamily: tokens.typography.fontFamily.bodyMedium,
                fontSize: tokens.typography.fontSize.bodySm,
                textTransform: 'uppercase',
              }}>
              {t('sessionSkill.eyebrow')}
            </Text>
            <Text
              style={{
                color: tokens.colors.text.primary,
                fontFamily: tokens.typography.fontFamily.heading,
                fontSize: tokens.typography.fontSize.headingMd,
              }}>
              {t('firstSessionProof.skillName')}
            </Text>
            <Text
              style={{
                color: tokens.colors.text.secondary,
                fontFamily: tokens.typography.fontFamily.body,
                fontSize: tokens.typography.fontSize.bodyMd,
                lineHeight: tokens.typography.fontSize.bodyMd * 1.45,
              }}>
              {t('firstSessionProof.skillProof')}
            </Text>
            <Text
              style={{
                color: tokens.colors.text.tertiary,
                fontFamily: tokens.typography.fontFamily.body,
                fontSize: tokens.typography.fontSize.bodySm,
                lineHeight: tokens.typography.fontSize.bodySm * 1.45,
              }}>
              {t('firstSessionProof.comeBackTomorrow')}
            </Text>
          </View>
        </Card>
      ) : null}

      <Button label={ctaLabel} onPress={advance} variant="primary" />
    </ScrollView>
  );
}
