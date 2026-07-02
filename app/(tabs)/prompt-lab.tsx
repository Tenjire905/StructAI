import { useRouter } from 'expo-router';
import { KeyRound } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { ScoreChart } from '@/components/features';
import { Button, Card, ProgressBar } from '@/components/ui';
import { getApiKey } from '@/lib/secureKeyStore';
import { scorePrompt, type PromptScore } from '@/lib/promptScoring';
import { useThemeMode } from '@/theme';

const MOCK_SCORE_HISTORY = [58, 64, 71, 69, 76];

const HINT_COPY_KEY = {
  structure: 'promptLab.hintStructure',
  goal: 'promptLab.hintGoal',
  constraints: 'promptLab.hintConstraints',
} as const;

export default function PromptLabScreen() {
  const { tokens, t } = useThemeMode();
  const router = useRouter();
  const [promptInput, setPromptInput] = useState('');
  const [score, setScore] = useState<PromptScore | null>(null);
  const [history, setHistory] = useState<number[]>(MOCK_SCORE_HISTORY);
  const [hasStoredKey, setHasStoredKey] = useState(true);

  useEffect(() => {
    getApiKey().then((storedKey) => {
      setHasStoredKey(storedKey !== null && storedKey.length > 0);
    });
  }, []);

  const handleScore = () => {
    const result = scorePrompt(promptInput);
    setScore(result);
    setHistory((previous) => [...previous.slice(-9), result.total]);
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
      {!hasStoredKey ? (
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
          disabled={promptInput.trim().length === 0}
          label={t('promptLab.scoreButton')}
          onPress={handleScore}
          variant="primary"
        />
      </View>

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
