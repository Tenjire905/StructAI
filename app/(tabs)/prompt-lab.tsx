import { useFocusEffect, useRouter } from 'expo-router';
import { KeyRound } from 'lucide-react-native';
import { useCallback, useEffect, useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { ScoreChart } from '@/components/features';
import { Badge, Button, Card, ProgressBar } from '@/components/ui';
import {
  ScoringError,
  detectProvider,
  getProviderLabel,
  scorePromptRemote,
} from '@/lib/aiScoring';
import { getApiKey } from '@/lib/secureKeyStore';
import { scorePrompt, type PromptScore } from '@/lib/promptScoring';
import { useThemeMode } from '@/theme';

const MOCK_SCORE_HISTORY = [58, 64, 71, 69, 76];

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

export default function PromptLabScreen() {
  const { tokens, t } = useThemeMode();
  const router = useRouter();
  const [promptInput, setPromptInput] = useState('');
  const [score, setScore] = useState<PromptScore | null>(null);
  const [history, setHistory] = useState<number[]>(MOCK_SCORE_HISTORY);
  const [storedKey, setStoredKey] = useState<string | null>(null);
  const [isScoring, setIsScoring] = useState(false);
  const [fallbackNotice, setFallbackNotice] = useState<string | null>(null);

  // Key bei jedem Tab-Fokus neu lesen – falls er gerade im Profil
  // hinzugefügt oder gelöscht wurde.
  useFocusEffect(
    useCallback(() => {
      let cancelled = false;

      getApiKey()
        .then((key) => {
          if (!cancelled) {
            setStoredKey(key && key.length > 0 ? key : null);
          }
        })
        .catch(() => {
          if (!cancelled) {
            setStoredKey(null);
          }
        });

      return () => {
        cancelled = true;
      };
    }, []),
  );

  const provider = storedKey ? detectProvider(storedKey) : null;

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
    if (storedKey) {
      try {
        result = await scorePromptRemote(promptInput, storedKey);
      } catch (error) {
        const reason =
          error instanceof ScoringError ? error.reason : ('generic' as const);
        setFallbackNotice(FALLBACK_COPY_KEY[reason]);
        result = scorePrompt(promptInput);
      }
    } else {
      result = scorePrompt(promptInput);
    }

    setScore(result);
    setHistory((previous) => [...previous.slice(-9), result.total]);
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
      {storedKey === null ? (
        <Pressable
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
        </Pressable>
      ) : provider !== null ? (
        <View style={{ alignSelf: 'flex-start' }}>
          <Badge
            label={t('promptLab.liveBadge', { provider: getProviderLabel(provider) })}
            tone="success"
          />
        </View>
      ) : null}

      <View style={{ gap: tokens.spacing.space3 }}>
        <Text
          style={{
            color: tokens.colors.text.primary,
            fontFamily: tokens.typography.fontFamily.heading,
            fontSize: tokens.typography.fontSize.headingMd,
          }}>
          {t('promptLab.inputLabel')}
        </Text>

        <TextInput
          multiline
          onChangeText={setPromptInput}
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
        <ScoreResult feedbackKey={feedbackKey} score={score} />
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
          <ScoreChart scores={history} />
        </Card>
      </View>
    </ScrollView>
  );
}

type ScoreResultProps = {
  score: PromptScore;
  feedbackKey: string;
};

function ScoreResult({ score, feedbackKey }: ScoreResultProps) {
  const { tokens, t } = useThemeMode();
  const scale = useSharedValue(0.9);

  useEffect(() => {
    scale.value = withSpring(
      1,
      tokens.presentation.allowCelebrationSpring
        ? tokens.motion.spring.bouncy
        : tokens.motion.spring.default,
    );
  }, [scale, score, tokens.motion.spring, tokens.presentation.allowCelebrationSpring]);

  const animatedStyle = useAnimatedStyle(() => ({
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
