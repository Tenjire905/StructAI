import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Check, ChevronDown, ChevronUp, X } from 'lucide-react-native';
import { useEffect, useMemo, useRef, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { OrbIcon } from '@/components/features';
import { Button, Card, PressableScale, ProgressBar } from '@/components/ui';
import {
  getMockLesson,
  type ResolvedLessonStep,
} from '@/data/mockLessons';
import {
  computeLessonOrbReward,
  type LessonAnswerResult,
} from '@/lib/lessonRewards';
import { prepareLessonSteps } from '@/lib/lessonSession';
import { useProgressStore } from '@/store/progressStore';
import { getShadow, useCelebration, useThemeMode } from '@/theme';

type GradedStep = Exclude<ResolvedLessonStep, { type: 'info' }>;

function isGradedStep(step: ResolvedLessonStep): step is GradedStep {
  return step.type !== 'info';
}

function stepKind(step: GradedStep): LessonAnswerResult['kind'] {
  return step.type;
}

export default function LektionScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const lessonId = id ?? '';
  const { tokens, t, locale } = useThemeMode();
  const router = useRouter();
  const recordLessonOpened = useProgressStore((state) => state.recordLessonOpened);
  const completeLesson = useProgressStore((state) => state.completeLesson);

  const baseLesson = useMemo(
    () => getMockLesson(lessonId, locale),
    [lessonId, locale],
  );

  const lesson = useMemo(() => {
    if (!baseLesson) {
      return undefined;
    }

    return {
      ...baseLesson,
      steps: prepareLessonSteps(baseLesson.steps, baseLesson.id, t('lesson.reorderHint')),
    };
  }, [baseLesson, t]);

  const [stepIndex, setStepIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [selectedTrueFalse, setSelectedTrueFalse] = useState<boolean | null>(null);
  const [reorderIndices, setReorderIndices] = useState<number[]>([]);
  const [isChecked, setIsChecked] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [earnedOrbs, setEarnedOrbs] = useState(0);
  const [stepAttempts, setStepAttempts] = useState<Record<number, number>>({});
  const [answerResults, setAnswerResults] = useState<LessonAnswerResult[]>([]);
  const openedRef = useRef(false);

  useEffect(() => {
    if (!lessonId || openedRef.current) {
      return;
    }

    openedRef.current = true;
    recordLessonOpened(lessonId);
  }, [lessonId, recordLessonOpened]);

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
  const gradedStep = isGradedStep(step) ? step : null;

  const isAnswerCorrect = (() => {
    if (!gradedStep || !isChecked) {
      return false;
    }

    switch (gradedStep.type) {
      case 'choice':
      case 'fill_blank':
        return selectedOption === gradedStep.correctIndex;
      case 'true_false':
        return selectedTrueFalse === gradedStep.correct;
      case 'reorder':
        return reorderIndices.every(
          (value, index) => value === gradedStep.correctOrder[index],
        );
    }
  })();

  const resetStepInput = () => {
    setSelectedOption(null);
    setSelectedTrueFalse(null);
    setReorderIndices([]);
    setIsChecked(false);
  };

  const initReorder = (nextStep: GradedStep) => {
    if (nextStep.type === 'reorder') {
      setReorderIndices(nextStep.items.map((_, index) => index));
    }
  };

  useEffect(() => {
    if (gradedStep?.type === 'reorder' && reorderIndices.length === 0) {
      initReorder(gradedStep);
    }
  }, [gradedStep, reorderIndices.length]);

  const hasSelection = (() => {
    if (!gradedStep) {
      return true;
    }

    switch (gradedStep.type) {
      case 'choice':
      case 'fill_blank':
        return selectedOption !== null;
      case 'true_false':
        return selectedTrueFalse !== null;
      case 'reorder':
        return reorderIndices.length === gradedStep.items.length;
    }
  })();

  const handlePrimaryAction = () => {
    if (step.type === 'info') {
      if (isLastStep) {
        finishLesson([]);
        return;
      }

      setStepIndex((index) => index + 1);
      resetStepInput();
      return;
    }

    if (!isChecked) {
      setIsChecked(true);
      setStepAttempts((previous) => ({
        ...previous,
        [stepIndex]: (previous[stepIndex] ?? 0) + 1,
      }));
      return;
    }

    const attempts = stepAttempts[stepIndex] ?? 1;
    const result: LessonAnswerResult = {
      stepIndex,
      kind: stepKind(step),
      correct: isAnswerCorrect,
      attempts,
    };

    const nextResults = [...answerResults, result];

    if (isLastStep) {
      finishLesson(nextResults);
      return;
    }

    setAnswerResults(nextResults);
    setStepIndex((index) => index + 1);
    resetStepInput();
  };

  const finishLesson = (results: LessonAnswerResult[]) => {
    const reward = computeLessonOrbReward(lesson.orbsReward, results);
    setEarnedOrbs(reward);
    completeLesson(lesson.id, reward);
    setIsFinished(true);
  };

  const primaryLabel = gradedStep && !isChecked ? t('lesson.check') : t('lesson.next');
  const primaryDisabled = gradedStep !== null && !isChecked && !hasSelection;

  if (isFinished) {
    return (
      <>
        <Stack.Screen options={headerOptions} />
        <CompletionView
          onFinish={() => router.back()}
          orbsReward={earnedOrbs}
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

          <StepTypeBadge step={step} />

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
          ) : null}

          {step.type === 'choice' ? (
            <ChoiceStepView
              isChecked={isChecked}
              onSelect={setSelectedOption}
              selectedOption={selectedOption}
              step={step}
            />
          ) : null}

          {step.type === 'fill_blank' ? (
            <FillBlankStepView
              isChecked={isChecked}
              onSelect={setSelectedOption}
              selectedOption={selectedOption}
              step={step}
            />
          ) : null}

          {step.type === 'true_false' ? (
            <TrueFalseStepView
              isChecked={isChecked}
              onSelect={setSelectedTrueFalse}
              selected={selectedTrueFalse}
              step={step}
            />
          ) : null}

          {step.type === 'reorder' ? (
            <ReorderStepView
              isChecked={isChecked}
              onChange={setReorderIndices}
              order={reorderIndices}
              step={step}
            />
          ) : null}

          {gradedStep && isChecked ? (
            <FeedbackBanner
              explanation={gradedStep.explanation}
              isCorrect={isAnswerCorrect}
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

function StepTypeBadge({ step }: { step: ResolvedLessonStep }) {
  const { tokens, t } = useThemeMode();

  if (step.type === 'info') {
    return null;
  }

  const labelKey = {
    choice: 'lesson.typeChoice',
    fill_blank: 'lesson.typeFillBlank',
    true_false: 'lesson.typeTrueFalse',
    reorder: 'lesson.typeReorder',
  }[step.type];

  return (
    <Text
      style={{
        color: tokens.colors.text.tertiary,
        fontFamily: tokens.typography.fontFamily.bodyMedium,
        fontSize: tokens.typography.fontSize.bodySm,
      }}>
      {t(labelKey)}
    </Text>
  );
}

type ChoiceStepViewProps = {
  step: Extract<ResolvedLessonStep, { type: 'choice' }>;
  selectedOption: number | null;
  isChecked: boolean;
  onSelect: (index: number) => void;
};

function ChoiceStepView({ step, selectedOption, isChecked, onSelect }: ChoiceStepViewProps) {
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
      {step.options.map((option, index) => (
        <OptionRow
          isChecked={isChecked}
          isSelected={selectedOption === index}
          key={`${option}-${index}`}
          label={option}
          onPress={() => onSelect(index)}
          showAsCorrect={isChecked && index === step.correctIndex}
          showAsWrong={isChecked && selectedOption === index && index !== step.correctIndex}
        />
      ))}
    </View>
  );
}

type FillBlankStepViewProps = {
  step: Extract<ResolvedLessonStep, { type: 'fill_blank' }>;
  selectedOption: number | null;
  isChecked: boolean;
  onSelect: (index: number) => void;
};

function FillBlankStepView({
  step,
  selectedOption,
  isChecked,
  onSelect,
}: FillBlankStepViewProps) {
  const { tokens, t } = useThemeMode();

  return (
    <View style={{ gap: tokens.spacing.space3 }}>
      <Text
        style={{
          color: tokens.colors.text.secondary,
          fontFamily: tokens.typography.fontFamily.body,
          fontSize: tokens.typography.fontSize.bodyMd,
        }}>
        {t('lesson.fillBlankInstruction')}
      </Text>
      <Card variant="solid">
        <Text
          style={{
            color: tokens.colors.text.primary,
            fontFamily: tokens.typography.fontFamily.body,
            fontSize: tokens.typography.fontSize.bodyLg,
            lineHeight: tokens.typography.fontSize.bodyLg * 1.5,
          }}>
          {step.prefix}
          <Text
            style={{
              color:
                selectedOption !== null
                  ? tokens.colors.accent.primary
                  : tokens.colors.text.tertiary,
              fontFamily: tokens.typography.fontFamily.bodyMedium,
            }}>
            {selectedOption !== null ? step.options[selectedOption] : '___'}
          </Text>
          {step.suffix}
        </Text>
      </Card>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: tokens.spacing.space2 }}>
        {step.options.map((option, index) => (
          <PressableScale
            disabled={isChecked}
            key={`${option}-${index}`}
            onPress={() => onSelect(index)}
            style={{
              backgroundColor:
                selectedOption === index
                  ? tokens.colors.surface.cardHover
                  : tokens.colors.surface.card,
              borderColor:
                selectedOption === index
                  ? tokens.colors.accent.primary
                  : tokens.colors.border.subtle,
              borderRadius: tokens.radius.pill,
              borderWidth: 1,
              paddingHorizontal: tokens.spacing.space3,
              paddingVertical: tokens.spacing.space2,
            }}>
            <Text
              style={{
                color: tokens.colors.text.primary,
                fontFamily: tokens.typography.fontFamily.bodyMedium,
                fontSize: tokens.typography.fontSize.bodyMd,
              }}>
              {option}
            </Text>
          </PressableScale>
        ))}
      </View>
    </View>
  );
}

type TrueFalseStepViewProps = {
  step: Extract<ResolvedLessonStep, { type: 'true_false' }>;
  selected: boolean | null;
  isChecked: boolean;
  onSelect: (value: boolean) => void;
};

function TrueFalseStepView({ step, selected, isChecked, onSelect }: TrueFalseStepViewProps) {
  const { tokens, t } = useThemeMode();

  return (
    <View style={{ gap: tokens.spacing.space3 }}>
      <Text
        style={{
          color: tokens.colors.text.primary,
          fontFamily: tokens.typography.fontFamily.heading,
          fontSize: tokens.typography.fontSize.headingMd,
        }}>
        {step.statement}
      </Text>
      <View style={{ flexDirection: 'row', gap: tokens.spacing.space3 }}>
        {[true, false].map((value) => {
          const isSelected = selected === value;
          const showAsCorrect = isChecked && value === step.correct;
          const showAsWrong = isChecked && isSelected && value !== step.correct;

          return (
            <View key={String(value)} style={{ flex: 1 }}>
              <OptionRow
                isChecked={isChecked}
                isSelected={isSelected}
                label={value ? t('lesson.trueLabel') : t('lesson.falseLabel')}
                onPress={() => onSelect(value)}
                showAsCorrect={showAsCorrect}
                showAsWrong={showAsWrong}
              />
            </View>
          );
        })}
      </View>
    </View>
  );
}

type ReorderStepViewProps = {
  step: Extract<ResolvedLessonStep, { type: 'reorder' }>;
  order: number[];
  isChecked: boolean;
  onChange: (order: number[]) => void;
};

function ReorderStepView({ step, order, isChecked, onChange }: ReorderStepViewProps) {
  const { tokens } = useThemeMode();

  const moveItem = (displayIndex: number, direction: -1 | 1) => {
    if (isChecked) {
      return;
    }

    const targetIndex = displayIndex + direction;

    if (targetIndex < 0 || targetIndex >= order.length) {
      return;
    }

    const next = [...order];
    [next[displayIndex], next[targetIndex]] = [next[targetIndex], next[displayIndex]];
    onChange(next);
  };

  return (
    <View style={{ gap: tokens.spacing.space3 }}>
      <Text
        style={{
          color: tokens.colors.text.primary,
          fontFamily: tokens.typography.fontFamily.heading,
          fontSize: tokens.typography.fontSize.headingMd,
        }}>
        {step.instruction}
      </Text>
      {order.map((itemIndex, displayIndex) => (
        <View
          key={`${itemIndex}-${displayIndex}`}
          style={{
            alignItems: 'center',
            backgroundColor: tokens.colors.surface.card,
            borderColor: tokens.colors.border.subtle,
            borderRadius: tokens.radius.md,
            borderWidth: 1,
            flexDirection: 'row',
            gap: tokens.spacing.space2,
            padding: tokens.spacing.space3,
          }}>
          <Text
            style={{
              color: tokens.colors.text.tertiary,
              fontFamily: tokens.typography.fontFamily.mono,
              fontSize: tokens.typography.fontSize.bodySm,
              width: tokens.spacing.space4,
            }}>
            {displayIndex + 1}.
          </Text>
          <Text
            style={{
              color: tokens.colors.text.primary,
              flex: 1,
              fontFamily: tokens.typography.fontFamily.body,
              fontSize: tokens.typography.fontSize.bodyLg,
            }}>
            {step.items[itemIndex]}
          </Text>
          {!isChecked ? (
            <View style={{ flexDirection: 'row', gap: tokens.spacing.space1 }}>
              <PressableScale
                onPress={() => moveItem(displayIndex, -1)}
                pressFeedbackDisabled={displayIndex === 0}
                style={{ opacity: displayIndex === 0 ? 0.35 : 1, padding: tokens.spacing.space1 }}>
                <ChevronUp
                  color={tokens.colors.text.secondary}
                  size={tokens.icons.sizes.md}
                  strokeWidth={tokens.icons.strokeWidth}
                />
              </PressableScale>
              <PressableScale
                onPress={() => moveItem(displayIndex, 1)}
                pressFeedbackDisabled={displayIndex === order.length - 1}
                style={{
                  opacity: displayIndex === order.length - 1 ? 0.35 : 1,
                  padding: tokens.spacing.space1,
                }}>
                <ChevronDown
                  color={tokens.colors.text.secondary}
                  size={tokens.icons.sizes.md}
                  strokeWidth={tokens.icons.strokeWidth}
                />
              </PressableScale>
            </View>
          ) : null}
        </View>
      ))}
    </View>
  );
}

type OptionRowProps = {
  label: string;
  isSelected: boolean;
  isChecked: boolean;
  showAsCorrect: boolean;
  showAsWrong: boolean;
  onPress: () => void;
};

function OptionRow({
  label,
  isSelected,
  isChecked,
  showAsCorrect,
  showAsWrong,
  onPress,
}: OptionRowProps) {
  const { tokens } = useThemeMode();

  const borderColor = showAsCorrect
    ? tokens.colors.accent.success
    : showAsWrong
      ? tokens.colors.accent.danger
      : isSelected
        ? tokens.colors.accent.primary
        : tokens.colors.border.subtle;

  return (
    <PressableScale
      accessibilityRole="button"
      disabled={isChecked}
      onPress={onPress}
      style={{
        alignItems: 'center',
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
        {label}
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
    </PressableScale>
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
    scale.value = withSpring(1, tokens.motion.spring.default);
  }, [isCorrect, opacity, scale, tokens.motion]);

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
  const { celebrate } = useCelebration();
  const scale = useSharedValue(0.6);
  const isPlayful = tokens.presentation.orbStyle === 'illustrated';
  const finishedRef = useRef(false);

  useEffect(() => {
    if (finishedRef.current) {
      return;
    }

    finishedRef.current = true;
    celebrate('lesson_complete', { orbCount: orbsReward });

    if (tokens.presentation.allowCelebrationSpring) {
      scale.value = withSequence(
        withSpring(1.08, tokens.motion.spring.bouncy),
        withSpring(1, tokens.motion.spring.default),
      );
    } else {
      scale.value = withSpring(1, tokens.motion.spring.default);
    }
  }, [
    celebrate,
    orbsReward,
    scale,
    tokens.motion.spring,
    tokens.presentation.allowCelebrationSpring,
  ]);

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
