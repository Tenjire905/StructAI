import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { OrbCompanion } from '@/components/features';
import { GuestSaveProgressHint } from '@/components/features/GuestSaveProgressHint';
import { PathCompletionView } from '@/components/features/PathCompletionView';
import {
  CategorizeStepView,
  ChoiceStepView,
  ErrorFindingStepView,
  FillBlankStepView,
  MatchingStepView,
  ReorderStepView,
  RetryPromptView,
  TrueFalseStepView,
} from '@/components/features/lesson-steps';
import { Button, Card, ProgressBar } from '@/components/ui';
import { useOrbCompanionState } from '@/hooks/useOrbCompanionState';
import {
  getMockLesson,
  type ResolvedLessonStep,
} from '@/data/mockLessons';
import {
  computeLessonOrbReward,
  computeLessonPassRatio,
  hasPassedLessonThreshold,
  type LessonAnswerResult,
} from '@/lib/lessonRewards';
import { getPathIdForLesson } from '@/lib/pathLessonUtils';
import { prepareLessonSteps } from '@/lib/lessonSession';
import { useProgressStore } from '@/store/progressStore';
import { getShadow, useCelebration, useThemeMode } from '@/theme';
import { useAuth } from '@/providers/AuthProvider';

type GradedStep = Exclude<ResolvedLessonStep, { type: 'info' }>;

function isGradedStep(step: ResolvedLessonStep): step is GradedStep {
  return step.type !== 'info';
}

function stepKind(step: GradedStep): LessonAnswerResult['kind'] {
  return step.type;
}

type LessonOutcome = 'active' | 'passed' | 'path_complete' | 'failed';

export function LessonSessionScreen({ lessonId }: { lessonId: string }) {
  const { tokens, t, locale } = useThemeMode();
  const router = useRouter();
  const pathProgress = useProgressStore((state) => state.pathProgress);
  const recordLessonOpened = useProgressStore((state) => state.recordLessonOpened);
  const recordLessonFailed = useProgressStore((state) => state.recordLessonFailed);
  const completeLesson = useProgressStore((state) => state.completeLesson);

  const baseLesson = useMemo(
    () => getMockLesson(lessonId, locale),
    [lessonId, locale],
  );

  const [sessionNonce, setSessionNonce] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [selectedTrueFalse, setSelectedTrueFalse] = useState<boolean | null>(null);
  const [reorderIndices, setReorderIndices] = useState<number[]>([]);
  const [selectedTermIndex, setSelectedTermIndex] = useState<number | null>(null);
  const [matchingPairs, setMatchingPairs] = useState<Record<number, number>>({});
  const [errorFindingSelectedIndex, setErrorFindingSelectedIndex] = useState<number | null>(null);
  const [errorFindingWrongIndices, setErrorFindingWrongIndices] = useState<number[]>([]);
  const [selectedCategorizeItemIndex, setSelectedCategorizeItemIndex] = useState<number | null>(
    null,
  );
  const [categorizeAssignments, setCategorizeAssignments] = useState<Record<number, number>>({});
  const [isChecked, setIsChecked] = useState(false);
  const [lessonOutcome, setLessonOutcome] = useState<LessonOutcome>('active');
  const [earnedOrbs, setEarnedOrbs] = useState(0);
  const [completedPathId, setCompletedPathId] = useState<string | null>(null);
  const [failureStats, setFailureStats] = useState({ correctCount: 0, gradedCount: 0 });
  const [stepAttempts, setStepAttempts] = useState<Record<number, number>>({});
  const [answerResults, setAnswerResults] = useState<LessonAnswerResult[]>([]);
  const openedRef = useRef(false);

  const lesson = useMemo(() => {
    if (!baseLesson) {
      return undefined;
    }

    return {
      ...baseLesson,
      steps: prepareLessonSteps(
        baseLesson.steps,
        baseLesson.id,
        t('lesson.reorderHint'),
        sessionNonce,
      ),
    };
  }, [baseLesson, sessionNonce, t]);

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
      case 'matching':
        return gradedStep.pairs.every(
          (_, termIndex) =>
            matchingPairs[termIndex] !== undefined &&
            gradedStep.definitionOrder[matchingPairs[termIndex]] === termIndex,
        );
      case 'error_finding':
        return (
          errorFindingSelectedIndex !== null &&
          gradedStep.textSegments[errorFindingSelectedIndex]?.isError === true
        );
      case 'categorize':
        return gradedStep.items.every(
          (item, itemIndex) => categorizeAssignments[itemIndex] === item.correctCategoryIndex,
        );
    }
  })();

  const resetStepInput = () => {
    setSelectedOption(null);
    setSelectedTrueFalse(null);
    setReorderIndices([]);
    setSelectedTermIndex(null);
    setMatchingPairs({});
    setErrorFindingSelectedIndex(null);
    setErrorFindingWrongIndices([]);
    setSelectedCategorizeItemIndex(null);
    setCategorizeAssignments({});
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
      case 'matching':
        return Object.keys(matchingPairs).length === gradedStep.pairs.length;
      case 'error_finding':
        return errorFindingSelectedIndex !== null;
      case 'categorize':
        return Object.keys(categorizeAssignments).length === gradedStep.items.length;
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
      if (step.type !== 'error_finding') {
        setIsChecked(true);
        setStepAttempts((previous) => ({
          ...previous,
          [stepIndex]: (previous[stepIndex] ?? 0) + 1,
        }));
      }
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

  const resetLessonSession = () => {
    setStepIndex(0);
    setSelectedOption(null);
    setSelectedTrueFalse(null);
    setReorderIndices([]);
    setSelectedTermIndex(null);
    setMatchingPairs({});
    setErrorFindingSelectedIndex(null);
    setErrorFindingWrongIndices([]);
    setSelectedCategorizeItemIndex(null);
    setCategorizeAssignments({});
    setIsChecked(false);
    setEarnedOrbs(0);
    setFailureStats({ correctCount: 0, gradedCount: 0 });
    setStepAttempts({});
    setAnswerResults([]);
    setLessonOutcome('active');
    setCompletedPathId(null);
  };

  const retryLesson = () => {
    setSessionNonce((nonce) => nonce + 1);
    resetLessonSession();
  };

  const finishLesson = (results: LessonAnswerResult[]) => {
    if (hasPassedLessonThreshold(results)) {
      const pathId = getPathIdForLesson(lesson.id);
      const wasAlreadyCompleted =
        pathId !== undefined &&
        (pathProgress[pathId]?.completedLessonIds.includes(lesson.id) ?? false);
      const reward = wasAlreadyCompleted
        ? 0
        : computeLessonOrbReward(lesson.orbsReward, results);

      setEarnedOrbs(reward);
      const newlyCompletedPathId = completeLesson(lesson.id, reward);

      if (newlyCompletedPathId) {
        setCompletedPathId(newlyCompletedPathId);
        setLessonOutcome('path_complete');
      } else {
        setLessonOutcome('passed');
      }
      return;
    }

    const { correctCount, gradedCount } = computeLessonPassRatio(results);
    setFailureStats({ correctCount, gradedCount });
    setLessonOutcome('failed');
  };

  const handleSelectMatchingTerm = (termIndex: number) => {
    if (matchingPairs[termIndex] !== undefined) {
      const next = { ...matchingPairs };
      delete next[termIndex];
      setMatchingPairs(next);
      setSelectedTermIndex(null);
      return;
    }

    setSelectedTermIndex((current) => (current === termIndex ? null : termIndex));
  };

  const handleSelectMatchingDefinition = (displayIndex: number) => {
    if (selectedTermIndex === null) {
      return;
    }

    setMatchingPairs((previous) => ({
      ...previous,
      [selectedTermIndex]: displayIndex,
    }));
    setSelectedTermIndex(null);
  };

  const handleSelectErrorFindingSegment = (segmentIndex: number) => {
    if (step.type !== 'error_finding' || isChecked) {
      return;
    }

    const segment = step.textSegments[segmentIndex];

    setStepAttempts((previous) => ({
      ...previous,
      [stepIndex]: (previous[stepIndex] ?? 0) + 1,
    }));

    if (segment?.isError) {
      setErrorFindingSelectedIndex(segmentIndex);
      setIsChecked(true);
      return;
    }

    setErrorFindingWrongIndices((previous) =>
      previous.includes(segmentIndex) ? previous : [...previous, segmentIndex],
    );
  };

  const handleSelectCategorizeItem = (itemIndex: number) => {
    if (step.type !== 'categorize' || isChecked) {
      return;
    }

    if (categorizeAssignments[itemIndex] !== undefined) {
      const next = { ...categorizeAssignments };
      delete next[itemIndex];
      setCategorizeAssignments(next);
      setSelectedCategorizeItemIndex(null);
      return;
    }

    setSelectedCategorizeItemIndex((current) => (current === itemIndex ? null : itemIndex));
  };

  const handleSelectCategorizeCategory = (categoryIndex: number) => {
    if (step.type !== 'categorize' || isChecked || selectedCategorizeItemIndex === null) {
      return;
    }

    setCategorizeAssignments((previous) => ({
      ...previous,
      [selectedCategorizeItemIndex]: categoryIndex,
    }));
    setSelectedCategorizeItemIndex(null);
  };

  const primaryLabel = gradedStep && !isChecked ? t('lesson.check') : t('lesson.next');
  const primaryDisabled = gradedStep !== null && !isChecked && !hasSelection;

  if (lessonOutcome === 'path_complete' && completedPathId) {
    return (
      <>
        <Stack.Screen options={headerOptions} />
        <PathCompletionView
          onFinish={() => router.back()}
          orbsReward={earnedOrbs}
          pathId={completedPathId}
        />
      </>
    );
  }

  if (lessonOutcome === 'passed') {
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

  if (lessonOutcome === 'failed') {
    return (
      <>
        <Stack.Screen options={headerOptions} />
        <RetryPromptView
          correctCount={failureStats.correctCount}
          gradedCount={failureStats.gradedCount}
          onContinueLater={() => {
            recordLessonFailed(lesson.id);
            router.back();
          }}
          onRetry={retryLesson}
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

          {step.type === 'matching' ? (
            <MatchingStepView
              isChecked={isChecked}
              matches={matchingPairs}
              onSelectDefinition={handleSelectMatchingDefinition}
              onSelectTerm={handleSelectMatchingTerm}
              selectedTermIndex={selectedTermIndex}
              step={step}
            />
          ) : null}

          {step.type === 'error_finding' ? (
            <ErrorFindingStepView
              isChecked={isChecked}
              onSelectSegment={handleSelectErrorFindingSegment}
              selectedIndex={errorFindingSelectedIndex}
              step={step}
              wrongIndices={errorFindingWrongIndices}
            />
          ) : null}

          {step.type === 'categorize' ? (
            <CategorizeStepView
              assignments={categorizeAssignments}
              isChecked={isChecked}
              onSelectCategory={handleSelectCategorizeCategory}
              onSelectItem={handleSelectCategorizeItem}
              selectedItemIndex={selectedCategorizeItemIndex}
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
    matching: 'lesson.typeMatching',
    error_finding: 'lesson.typeErrorFinding',
    categorize: 'lesson.typeCategorize',
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
  const { session } = useAuth();
  const completedLessons = useProgressStore((state) => state.completedLessons);
  const { celebrate } = useCelebration();
  const companionState = useOrbCompanionState();
  const isPlayful = tokens.presentation.orbStyle === 'illustrated';
  const finishedRef = useRef(false);

  useEffect(() => {
    if (finishedRef.current) {
      return;
    }

    finishedRef.current = true;

    if (orbsReward > 0) {
      celebrate('lesson_complete', { orbCount: orbsReward });
    }
  }, [celebrate, orbsReward]);

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
      <View
        style={[
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
        <OrbCompanion size={tokens.spacing.space8 * 0.75} state={companionState} />
      </View>

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
        {orbsReward > 0 ? t('lesson.orbsEarned', { count: orbsReward }) : t('lesson.practiceComplete')}
      </Text>

      <Button
        label={t('lesson.backToPath')}
        onPress={onFinish}
        style={{ alignSelf: 'stretch' }}
        variant="primary"
      />

      {!session && completedLessons === 1 ? (
        <GuestSaveProgressHint variant="inline" />
      ) : null}
    </View>
  );
}

export default function LektionScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return <LessonSessionScreen lessonId={id ?? ''} />;
}
