import { useFocusEffect, useRouter } from 'expo-router';
import { KeyRound } from 'lucide-react-native';
import { useCallback, useEffect, useState } from 'react';
import { ScrollView, Text, TextInput, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { ScoreChart } from '@/components/features';
import { ModelComparer } from '@/components/features/ModelComparer';
import { OrbCompanion } from '@/components/features/OrbCompanion';
import { Badge, Button, Card, PressableScale, ProgressBar } from '@/components/ui';
import { useOrbCompanionState } from '@/hooks/useOrbCompanionState';
import { trackEvent } from '@/lib/analytics';
import {
  ScoringError,
  detectProvider,
  getProviderLabel,
  scorePromptRemote,
} from '@/lib/aiScoring';
import { listApiKeys, type ByokKeyEntry } from '@/lib/secureKeyStore';
import {
  buildDemoImprovedPrompt,
  comparePromptScores,
  DEMO_WEAK_PROMPT,
  getMissingHints,
  scorePrompt,
  type PromptScore,
  type PromptScoreComparison,
} from '@/lib/promptScoring';
import { useProgressStore } from '@/store/progressStore';
import { useThemeMode } from '@/theme';

const HINT_COPY_KEY = {
  structure: 'promptLab.hintStructure',
  goal: 'promptLab.hintGoal',
  constraints: 'promptLab.hintConstraints',
} as const;

const FALLBACK_COPY_KEY: Record<ScoringError['reason'], string> = {
  invalidKey: 'promptLab.fallbackInvalidKey',
  quota: 'promptLab.fallbackQuota',
  network: 'promptLab.fallbackNetwork',
  generic: 'promptLab.fallbackGeneric',
};

type PromptLabMode = 'score' | 'compare';

export default function PromptLabScreen() {
  const { tokens, t, locale } = useThemeMode();
  const router = useRouter();
  const [labMode, setLabMode] = useState<PromptLabMode>('score');
  const history = useProgressStore((state) => state.promptScoreHistory);
  const addPromptScore = useProgressStore((state) => state.addPromptScore);
  const [promptInput, setPromptInput] = useState('');
  const [score, setScore] = useState<PromptScore | null>(null);
  const [comparison, setComparison] = useState<PromptScoreComparison | null>(null);
  const [baselineScore, setBaselineScore] = useState<PromptScore | null>(null);
  const [baselinePrompt, setBaselinePrompt] = useState<string | null>(null);
  const [storedKeys, setStoredKeys] = useState<ByokKeyEntry[]>([]);
  const [isScoring, setIsScoring] = useState(false);
  const [fallbackNotice, setFallbackNotice] = useState<string | null>(null);
  const [inputFocused, setInputFocused] = useState(false);
  const companionState = useOrbCompanionState(inputFocused ? 'attentive' : undefined);

  // Key bei jedem Tab-Fokus neu lesen – falls er gerade im Profil
  // hinzugefügt oder gelöscht wurde.
  useFocusEffect(
    useCallback(() => {
      let cancelled = false;

      listApiKeys()
        .then((keys) => {
          if (!cancelled) {
            setStoredKeys(keys);
          }
        })
        .catch(() => {
          if (!cancelled) {
            setStoredKeys([]);
          }
        });

      return () => {
        cancelled = true;
      };
    }, []),
  );

  const primaryKey = storedKeys[0]?.key ?? null;
  const provider = primaryKey ? detectProvider(primaryKey) : null;
  const liveProviderLabel =
    storedKeys.length > 1
      ? storedKeys
          .map((entry) => getProviderLabel(entry.provider))
          .join(' + ')
      : provider
        ? getProviderLabel(provider)
        : null;

  const handleDemoPromptViewed = (demoPrompt: string) => {
    setPromptInput(demoPrompt);
    trackEvent('guest_demo_prompt_viewed');
  };

  const handleScore = async () => {
    if (isScoring) {
      return;
    }

    setIsScoring(true);
    setFallbackNotice(null);

    let result: PromptScore;

    // Fallback-Kette: Remote-Bewertung, bei jedem Fehler lokale Heuristik.
    // Ein API-Problem (ungültiger Key, kein Guthaben, offline) darf die App
    // niemals crashen – der Nutzer bekommt immer ein Ergebnis plus Hinweis.
    if (primaryKey) {
      try {
        result = await scorePromptRemote(promptInput, primaryKey);
      } catch (error) {
        const reason =
          error instanceof ScoringError ? error.reason : ('generic' as const);
        setFallbackNotice(FALLBACK_COPY_KEY[reason]);
        result = scorePrompt(promptInput, locale);
      }
    } else {
      result = scorePrompt(promptInput, locale);
    }

    setScore(result);

    if (baselineScore && baselinePrompt && baselinePrompt !== promptInput.trim()) {
      setComparison(comparePromptScores(baselineScore, result));
    } else {
      setComparison(null);
      setBaselineScore(result);
      setBaselinePrompt(promptInput.trim());
    }

    addPromptScore(result.total);
    setIsScoring(false);
  };

  const feedbackKey =
    score === null
      ? null
      : score.total >= 80
        ? 'promptLab.feedbackStrong'
        : score.total >= 55
          ? 'promptLab.feedbackOkay'
          : 'promptLab.feedbackWeak';

  return (
    <ScrollView
      contentContainerStyle={{
        gap: tokens.spacing.space5,
        paddingBottom: tokens.spacing.space7,
        paddingHorizontal: tokens.spacing.screenPadding,
        paddingTop: tokens.spacing.space5,
      }}
      style={{ backgroundColor: tokens.colors.background.base, flex: 1 }}>
      <View style={{ flexDirection: 'row', gap: tokens.spacing.space2 }}>
        <View style={{ flex: 1 }}>
          <Button
            label={t('promptLab.modeScore')}
            onPress={() => setLabMode('score')}
            variant={labMode === 'score' ? 'primary' : 'ghost'}
          />
        </View>
        <View style={{ flex: 1 }}>
          <Button
            label={t('promptLab.modeCompare')}
            onPress={() => setLabMode('compare')}
            variant={labMode === 'compare' ? 'primary' : 'ghost'}
          />
        </View>
      </View>

      {labMode === 'compare' ? (
        <ModelComparer availableKeys={storedKeys} />
      ) : (
        <>
      {storedKeys.length === 0 ? (
        <PressableScale
          accessibilityRole="button"
          onPress={() => router.push('/profil')}
          style={{
            alignItems: 'center',
            backgroundColor: tokens.colors.surface.card,
            borderColor: tokens.colors.accent.warning,
            borderRadius: tokens.radius.md,
            borderWidth: 1,
            flexDirection: 'row',
            gap: tokens.spacing.space3,
            padding: tokens.spacing.space3,
          }}>
          <KeyRound
            color={tokens.colors.accent.warning}
            size={tokens.icons.sizes.md}
            strokeWidth={tokens.icons.strokeWidth}
          />
          <View style={{ flex: 1, gap: tokens.spacing.space1 }}>
            <Text
              style={{
                color: tokens.colors.text.primary,
                fontFamily: tokens.typography.fontFamily.body,
                fontSize: tokens.typography.fontSize.bodySm,
                lineHeight: tokens.typography.fontSize.bodySm * 1.4,
              }}>
              {t('promptLab.demoBanner')}
            </Text>
            <Text
              style={{
                color: tokens.colors.accent.warning,
                fontFamily: tokens.typography.fontFamily.bodyMedium,
                fontSize: tokens.typography.fontSize.bodySm,
              }}>
              {t('promptLab.addKeyCta')}
            </Text>
          </View>
        </PressableScale>
      ) : liveProviderLabel !== null ? (
        <View style={{ alignSelf: 'flex-start' }}>
          <Badge
            label={t('promptLab.liveBadge', { provider: liveProviderLabel })}
            tone="success"
          />
        </View>
      ) : null}

      <View
        style={{
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <Text
          style={{
            color: tokens.colors.text.primary,
            flex: 1,
            fontFamily: tokens.typography.fontFamily.heading,
            fontSize: tokens.typography.fontSize.headingMd,
          }}>
          {t('promptLab.inputLabel')}
        </Text>
        <OrbCompanion size={tokens.icons.sizes.md} state={companionState} />
      </View>

      <View style={{ gap: tokens.spacing.space3 }}>
        <TextInput
          multiline
          onBlur={() => setInputFocused(false)}
          onChangeText={setPromptInput}
          onFocus={() => setInputFocused(true)}
          placeholder={t('promptLab.inputPlaceholder')}
          placeholderTextColor={tokens.colors.text.tertiary}
          style={{
            backgroundColor: tokens.colors.surface.card,
            borderColor: tokens.colors.border.strong,
            borderRadius: tokens.radius.md,
            borderWidth: 1,
            color: tokens.colors.text.primary,
            fontFamily: tokens.typography.fontFamily.body,
            fontSize: tokens.typography.fontSize.bodyLg,
            lineHeight: tokens.typography.fontSize.bodyLg * 1.4,
            minHeight: 140,
            padding: tokens.spacing.space4,
            textAlignVertical: 'top',
          }}
          value={promptInput}
        />

        <Button
          disabled={promptInput.trim().length === 0 || isScoring}
          label={
            isScoring ? t('promptLab.scoringInProgress') : t('promptLab.scoreButton')
          }
          onPress={handleScore}
          variant="primary"
        />

        {storedKeys.length === 0 ? (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: tokens.spacing.space2 }}>
            <Button
              label={t('promptLab.demoWeakExample')}
              onPress={() => handleDemoPromptViewed(DEMO_WEAK_PROMPT)}
              variant="ghost"
            />
            <Button
              label={t('promptLab.demoImprovedExample')}
              onPress={() => handleDemoPromptViewed(buildDemoImprovedPrompt(locale))}
              variant="ghost"
            />
          </View>
        ) : null}
      </View>

      {fallbackNotice !== null ? (
        <View
          style={{
            backgroundColor: tokens.colors.surface.card,
            borderColor: tokens.colors.accent.warning,
            borderRadius: tokens.radius.md,
            borderWidth: 1,
            padding: tokens.spacing.space3,
          }}>
          <Text
            style={{
              color: tokens.colors.text.primary,
              fontFamily: tokens.typography.fontFamily.body,
              fontSize: tokens.typography.fontSize.bodySm,
              lineHeight: tokens.typography.fontSize.bodySm * 1.4,
            }}>
            {t(fallbackNotice)}
          </Text>
        </View>
      ) : null}

      {score !== null && feedbackKey !== null ? (
        <ScoreResult comparison={comparison} feedbackKey={feedbackKey} score={score} />
      ) : null}

      <View style={{ gap: tokens.spacing.space3 }}>
        <Text
          style={{
            color: tokens.colors.text.primary,
            fontFamily: tokens.typography.fontFamily.heading,
            fontSize: tokens.typography.fontSize.headingMd,
          }}>
          {t('promptLab.historyTitle')}
        </Text>

        <Card variant="solid">
          <ScoreChart scores={history.map((entry) => entry.score)} />
        </Card>
      </View>
        </>
      )}
    </ScrollView>
  );
}

type ScoreResultProps = {
  score: PromptScore;
  feedbackKey: string;
  comparison: PromptScoreComparison | null;
};

function ScoreResult({ score, feedbackKey, comparison }: ScoreResultProps) {
  const { tokens, t } = useThemeMode();
  const scale = useSharedValue(0.97);
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: tokens.motion.duration.fast });
    scale.value = withSpring(1, tokens.motion.spring.default);
  }, [opacity, scale, score, tokens.motion.duration.fast, tokens.motion.spring.default]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  const categories = [
    { copyKey: 'promptLab.catStructure', value: score.structure },
    { copyKey: 'promptLab.catGoal', value: score.goal },
    { copyKey: 'promptLab.catConstraints', value: score.constraints },
  ];

  return (
    <Animated.View style={animatedStyle}>
      <Card variant="solid">
        <View style={{ gap: tokens.spacing.space4 }}>
          <View
            style={{
              alignItems: 'center',
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <Text
              style={{
                color: tokens.colors.text.primary,
                fontFamily: tokens.typography.fontFamily.heading,
                fontSize: tokens.typography.fontSize.headingMd,
              }}>
              {t('promptLab.scoreTitle')}
            </Text>
            <Text
              style={{
                color: tokens.colors.accent.structure,
                fontFamily: tokens.typography.fontFamily.display,
                fontSize: tokens.typography.fontSize.displayLg,
              }}>
              {score.total}
              <Text
                style={{
                  color: tokens.colors.text.tertiary,
                  fontFamily: tokens.typography.fontFamily.mono,
                  fontSize: tokens.typography.fontSize.bodyMd,
                }}>
                {' '}
                / 100
              </Text>
            </Text>
          </View>

          <Text
            style={{
              color: tokens.colors.text.primary,
              fontFamily: tokens.typography.fontFamily.bodyMedium,
              fontSize: tokens.typography.fontSize.bodyLg,
            }}>
            {t(feedbackKey)}
          </Text>

          <View style={{ gap: tokens.spacing.space3 }}>
            {categories.map((category) => (
              <View key={category.copyKey} style={{ gap: tokens.spacing.space1 }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text
                    style={{
                      color: tokens.colors.text.secondary,
                      fontFamily: tokens.typography.fontFamily.body,
                      fontSize: tokens.typography.fontSize.bodySm,
                    }}>
                    {t(category.copyKey)}
                  </Text>
                  <Text
                    style={{
                      color: tokens.colors.text.secondary,
                      fontFamily: tokens.typography.fontFamily.mono,
                      fontSize: tokens.typography.fontSize.bodySm,
                    }}>
                    {category.value}
                  </Text>
                </View>
                <ProgressBar color="structure" progress={category.value / 100} />
              </View>
            ))}
          </View>

          {getMissingHints(score).length > 0 ? (
            <View style={{ gap: tokens.spacing.space2 }}>
              <Text
                style={{
                  color: tokens.colors.text.primary,
                  fontFamily: tokens.typography.fontFamily.bodyMedium,
                  fontSize: tokens.typography.fontSize.bodyMd,
                }}>
                {t('promptLab.detailHintsTitle')}
              </Text>
              {getMissingHints(score).map((hint) => (
                <Text
                  key={hint}
                  style={{
                    color: tokens.colors.text.secondary,
                    fontFamily: tokens.typography.fontFamily.body,
                    fontSize: tokens.typography.fontSize.bodySm,
                    lineHeight: tokens.typography.fontSize.bodySm * 1.5,
                  }}>
                  • {hint}
                </Text>
              ))}
            </View>
          ) : null}

          {comparison !== null && comparison.totalDelta > 0 ? (
            <View
              style={{
                backgroundColor: tokens.colors.surface.card,
                borderColor: tokens.colors.accent.success,
                borderRadius: tokens.radius.md,
                borderWidth: 1,
                gap: tokens.spacing.space2,
                padding: tokens.spacing.space3,
              }}>
              <Text
                style={{
                  color: tokens.colors.accent.success,
                  fontFamily: tokens.typography.fontFamily.bodyMedium,
                  fontSize: tokens.typography.fontSize.bodyMd,
                }}>
                {t('promptLab.comparisonTitle', { delta: comparison.totalDelta })}
              </Text>
              {comparison.improvementNotes.map((note) => (
                <Text
                  key={note}
                  style={{
                    color: tokens.colors.text.secondary,
                    fontFamily: tokens.typography.fontFamily.body,
                    fontSize: tokens.typography.fontSize.bodySm,
                    lineHeight: tokens.typography.fontSize.bodySm * 1.5,
                  }}>
                  • {note}
                </Text>
              ))}
            </View>
          ) : null}

          <Text
            style={{
              color: tokens.colors.text.secondary,
              fontFamily: tokens.typography.fontFamily.body,
              fontSize: tokens.typography.fontSize.bodyMd,
              lineHeight: tokens.typography.fontSize.bodyMd * 1.5,
            }}>
            {t(HINT_COPY_KEY[score.weakestCategory])}
          </Text>
        </View>
      </Card>
    </Animated.View>
  );
}
