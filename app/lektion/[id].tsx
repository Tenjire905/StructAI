import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Check, X } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { OrbIcon } from '@/components/features';
import { Button, Card, ProgressBar } from '@/components/ui';
import { getMockLesson, type LessonChoiceStep } from '@/data/mockLessons';
import { getShadow, useThemeMode } from '@/theme';

export default function LektionScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { tokens, t } = useThemeMode();
  const router = useRouter();
  const lesson = getMockLesson(id ?? '');

  const [stepIndex, setStepIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isChecked, setIsChecked] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const headerOptions = {
    headerShown: true,
    title: lesson?.title ?? '',
    headerStyle: { backgroundColor: tokens.colors.background.elevated },
    headerTintColor: tokens.colors.text.primary,
    headerTitleStyle: { fontFamily: tokens.typography.fontFamily.heading },
  };

  if (!lesson) {
    return (
      <>
        <Stack.Screen options={headerOptions} />
        <View
          style={{
            alignItems: 'center',
            backgroundColor: tokens.colors.background.base,
            flex: 1,
            justifyContent: 'center',
            paddingHorizontal: tokens.spacing.screenPadding,
          }}>
          <Text
            style={{
              color: tokens.colors.text.secondary,
              fontFamily: tokens.typography.fontFamily.body,
              fontSize: tokens.typography.fontSize.bodyLg,
            }}>
            {t('lesson.notFound')}
          </Text>
        </View>
      </>
    );
  }

  const step = lesson.steps[stepIndex];
  const isLastStep = stepIndex === lesson.steps.length - 1;
  const choiceStep = step.type === 'choice' ? step : null;
  const isCorrect =
    choiceStep !== null && isChecked && selectedOption === choiceStep.correctIndex;

  const handlePrimaryAction = () => {
    if (choiceStep && !isChecked) {
      setIsChecked(true);
      return;
    }

    if (isLastStep) {
      setIsFinished(true);
      return;
    }

    setStepIndex((index) => index + 1);
    setSelectedOption(null);
    setIsChecked(false);
  };

  const primaryLabel =
    choiceStep && !isChecked ? t('lesson.check') : t('lesson.next');
  const primaryDisabled = choiceStep !== null && !isChecked && selectedOption === null;

  if (isFinished) {
    return (
      <>
        <Stack.Screen options={headerOptions} />
        <CompletionView
          onFinish={() => router.back()}
          orbsReward={lesson.orbsReward}
        />
      </>
    );
  }

  return (
    <>
      <Stack.Screen options={headerOptions} />
      <View style={{ backgroundColor: tokens.colors.background.base, flex: 1 }}>
        <ScrollView
          contentContainerStyle={{
            gap: tokens.spacing.space5,
            paddingBottom: tokens.spacing.space7,
            paddingHorizontal: tokens.spacing.screenPadding,
            paddingTop: tokens.spacing.space5,
          }}
          style={{ flex: 1 }}>
          <View style={{ gap: tokens.spacing.space2 }}>
            <Text
              style={{
                color: tokens.colors.text.secondary,
                fontFamily: tokens.typography.fontFamily.mono,
                fontSize: tokens.typography.fontSize.bodySm,
              }}>
              {t('lesson.stepLabel', {
                current: stepIndex + 1,
                total: lesson.steps.length,
              })}
            </Text>
            <ProgressBar
              color="primary"
              progress={(stepIndex + 1) / lesson.steps.length}
            />
          </View>

          {step.type === 'info' ? (
            <Card variant="solid">
              <View style={{ gap: tokens.spacing.space3 }}>
                <Text
                  style={{
                    color: tokens.colors.text.primary,
                    fontFamily: tokens.typography.fontFamily.heading,
                    fontSize: tokens.typography.fontSize.headingLg,
                  }}>
                  {step.title}
                </Text>
                <Text
                  style={{
                    color: tokens.colors.text.secondary,
                    fontFamily: tokens.typography.fontFamily.body,
                    fontSize: tokens.typography.fontSize.bodyLg,
                    lineHeight: tokens.typography.fontSize.bodyLg * 1.5,
                  }}>
                  {step.body}
                </Text>
              </View>
            </Card>
          ) : (
            <ChoiceStepView
              isChecked={isChecked}
              onSelect={setSelectedOption}
              selectedOption={selectedOption}
              step={step}
            />
          )}

          {choiceStep && isChecked ? (
            <FeedbackBanner
              explanation={choiceStep.explanation}
              isCorrect={isCorrect}
            />
          ) : null}
        </ScrollView>

        <View
          style={{
            paddingBottom: tokens.spacing.space6,
            paddingHorizontal: tokens.spacing.screenPadding,
            paddingTop: tokens.spacing.space3,
          }}>
          <Button
            disabled={primaryDisabled}
            label={primaryLabel}
            onPress={handlePrimaryAction}
            variant="primary"
          />
        </View>
      </View>
    </>
  );
}

type ChoiceStepViewProps = {
  step: LessonChoiceStep;
  selectedOption: number | null;
  isChecked: boolean;
  onSelect: (index: number) => void;
};

function ChoiceStepView({
  step,
  selectedOption,
  isChecked,
  onSelect,
}: ChoiceStepViewProps) {
  const { tokens } = useThemeMode();

  return (
    <View style={{ gap: tokens.spacing.space3 }}>
      <Text
        style={{
          color: tokens.colors.text.primary,
          fontFamily: tokens.typography.fontFamily.heading,
          fontSize: tokens.typography.fontSize.headingMd,
        }}>
        {step.question}
      </Text>

      {step.options.map((option, index) => {
        const isSelected = selectedOption === index;
        const showAsCorrect = isChecked && index === step.correctIndex;
        const showAsWrong = isChecked && isSelected && index !== step.correctIndex;

        const borderColor = showAsCorrect
          ? tokens.colors.accent.success
          : showAsWrong
            ? tokens.colors.accent.danger
            : isSelected
              ? tokens.colors.accent.primary
              : tokens.colors.border.subtle;

        return (
          <Pressable
            accessibilityRole="button"
            disabled={isChecked}
            key={option}
            onPress={() => onSelect(index)}
            style={{
              backgroundColor: isSelected
                ? tokens.colors.surface.cardHover
                : tokens.colors.surface.card,
              borderColor,
              borderRadius: tokens.radius.md,
              borderWidth: 1,
              flexDirection: 'row',
              gap: tokens.spacing.space3,
              padding: tokens.spacing.space4,
            }}>
            <Text
              style={{
                color: tokens.colors.text.primary,
                flex: 1,
                fontFamily: tokens.typography.fontFamily.body,
                fontSize: tokens.typography.fontSize.bodyLg,
                lineHeight: tokens.typography.fontSize.bodyLg * 1.4,
              }}>
              {option}
            </Text>
            {showAsCorrect ? (
              <Check
                color={tokens.colors.accent.success}
                size={tokens.icons.sizes.md}
                strokeWidth={tokens.icons.strokeWidth}
              />
            ) : null}
            {showAsWrong ? (
              <X
                color={tokens.colors.accent.danger}
                size={tokens.icons.sizes.md}
                strokeWidth={tokens.icons.strokeWidth}
              />
            ) : null}
          </Pressable>
        );
      })}
    </View>
  );
}

type FeedbackBannerProps = {
  isCorrect: boolean;
  explanation: string;
};

function FeedbackBanner({ isCorrect, explanation }: FeedbackBannerProps) {
  const { tokens, t } = useThemeMode();
  const scale = useSharedValue(0.9);
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: tokens.motion.duration.fast });

    if (tokens.presentation.allowCelebrationSpring && isCorrect) {
      scale.value = withSpring(1, tokens.motion.spring.bouncy);
    } else {
      scale.value = withSpring(1, tokens.motion.spring.default);
    }
  }, [isCorrect, opacity, scale, tokens.motion, tokens.presentation]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  const accentColor = isCorrect
    ? tokens.colors.accent.success
    : tokens.colors.accent.danger;

  return (
    <Animated.View
      style={[
        animatedStyle,
        {
          backgroundColor: tokens.colors.surface.card,
          borderColor: accentColor,
          borderRadius: tokens.radius.md,
          borderWidth: 1,
          gap: tokens.spacing.space2,
          padding: tokens.spacing.space4,
        },
      ]}>
      <Text
        style={{
          color: accentColor,
          fontFamily: tokens.typography.fontFamily.bodyMedium,
          fontSize: tokens.typography.fontSize.bodyLg,
        }}>
        {isCorrect ? t('lesson.correctFeedback') : t('lesson.wrongFeedback')}
      </Text>
      <Text
        style={{
          color: tokens.colors.text.secondary,
          fontFamily: tokens.typography.fontFamily.body,
          fontSize: tokens.typography.fontSize.bodyMd,
          lineHeight: tokens.typography.fontSize.bodyMd * 1.5,
        }}>
        {explanation}
      </Text>
    </Animated.View>
  );
}

type CompletionViewProps = {
  orbsReward: number;
  onFinish: () => void;
};

function CompletionView({ orbsReward, onFinish }: CompletionViewProps) {
  const { tokens, t } = useThemeMode();
  const scale = useSharedValue(0.6);
  const isPlayful = tokens.presentation.orbStyle === 'illustrated';

  useEffect(() => {
    scale.value = withSpring(
      1,
      isPlayful ? tokens.motion.spring.bouncy : tokens.motion.spring.default,
    );
  }, [isPlayful, scale, tokens.motion.spring]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <View
      style={{
        alignItems: 'center',
        backgroundColor: tokens.colors.background.base,
        flex: 1,
        gap: tokens.spacing.space5,
        justifyContent: 'center',
        paddingHorizontal: tokens.spacing.screenPadding,
      }}>
      <Animated.View
        style={[
          animatedStyle,
          isPlayful ? getShadow('glow') : undefined,
          {
            alignItems: 'center',
            backgroundColor: tokens.colors.surface.card,
            borderRadius: tokens.radius.pill,
            height: tokens.spacing.space8,
            justifyContent: 'center',
            width: tokens.spacing.space8,
          },
        ]}>
        <OrbIcon size={tokens.icons.sizes.xl} />
      </Animated.View>

      <Text
        style={{
          color: tokens.colors.text.primary,
          fontFamily: tokens.typography.fontFamily.display,
          fontSize: tokens.typography.fontSize.displayLg,
          textAlign: 'center',
        }}>
        {t('lesson.completeTitle')}
      </Text>

      <Text
        style={{
          color: tokens.colors.accent.structure,
          fontFamily: tokens.typography.fontFamily.mono,
          fontSize: tokens.typography.fontSize.headingLg,
        }}>
        {t('lesson.orbsEarned', { count: orbsReward })}
      </Text>

      <Button
        label={t('lesson.backToPath')}
        onPress={onFinish}
        style={{ alignSelf: 'stretch' }}
        variant="primary"
      />
    </View>
  );
}
