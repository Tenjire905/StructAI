import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { LockedPathView, OrbPresence, SessionSkillSummaryCard } from '@/components/features';
import { CapstoneIncompleteView } from '@/components/features/CapstoneIncompleteView';
import { GuestSaveProgressHint } from '@/components/features/GuestSaveProgressHint';
import { PathCompletionView } from '@/components/features/PathCompletionView';
import { SectionMilestoneView } from '@/components/features/SectionMilestoneView';
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
import {
  LessonDepthBadgeChip,
  LessonDepthInfoPeek,
} from '@/components/features/lesson/LessonDepthBadgeButton';
import { GlossaryTermPeek } from '@/components/features/lesson/GlossaryTermPeek';
import { InlineGlossaryText } from '@/components/features/lesson/InlineGlossaryText';
import { LearningBeatStrip } from '@/components/features/lesson/LearningBeatStrip';
import { WrongAnswerCoachingBlock } from '@/components/features/lesson/WrongAnswerCoachingBlock';
import {
  LessonGlossaryProvider,
  useLessonGlossary,
} from '@/components/features/lesson/LessonGlossaryContext';
import { Button, Card, ProgressBar } from '@/components/ui';
import { useOrbCompanionState } from '@/hooks/useOrbCompanionState';
import {
  getMockLesson,
  type ResolvedLessonStep,
} from '@/data/mockLessons';
import {
  ORB_READING_THINK_DELAY_MS,
  resolveLessonMoment,
  resolveLessonOrbState,
  resolveLessonSpeechCopyKey,
} from '@/lib/orbLanguage';
import { lessonCompletionXpGain } from '@/lib/skillRank';
import {
  computeLessonOrbReward,
  computeLessonPassRatio,
  hasPassedLessonThreshold,
  type LessonAnswerResult,
} from '@/lib/lessonRewards';
import { resolveLessonLearningBeat } from '@/lib/lessonLearningBeat';
import { resolveWrongAnswerCoaching } from '@/lib/lessonWrongAnswerCoaching';
import { trackEvent } from '@/lib/analytics';
import { isProfileOnboardingCompleted } from '@/lib/appStorage';
import {
  hapticCorrectAnswer,
  hapticLessonComplete,
  hapticPathComplete,
  hapticWrongAnswer,
} from '@/lib/haptics';
import { playSfx } from '@/lib/sfx';
import { suppressHomeCelebrations } from '@/lib/lessonCelebrationGate';
import { leaveLesson, openLesson, returnToPath, isLessonOpenedFromPath } from '@/lib/lessonNavigation';
import { runAfterUISettles } from '@/lib/runAfterUISettles';
import { resolveHomeRoute } from '@/lib/homeNavigation';
import { getPathIdForLesson, getFirstLessonIdForPath, getNextLessonId } from '@/lib/pathLessonUtils';
import { isPathFinalCapstone, isPathMidCapstone } from '@/lib/pathCapstone';
import { getLessonChapterStatus, isLessonPlayable, pathTitleKey } from '@/lib/pathProgress';
import { getNextPathId, getPathUnlockBlockReason } from '@/lib/pathUnlock';
import { prepareLessonSteps } from '@/lib/lessonSession';
import { matchReorderHint } from '@/lib/reorderHints';
import { useProgressStore } from '@/store/progressStore';
import { useAuth } from '@/providers/AuthProvider';
import { useCelebration, useThemeMode } from '@/theme';

type GradedStep = Exclude<ResolvedLessonStep, { type: 'info' }>;

function isGradedStep(step: ResolvedLessonStep): step is GradedStep {
  return step.type !== 'info';
}

function stepKind(step: GradedStep): LessonAnswerResult['kind'] {
  return step.type;
}

type GradedAnswerInput = {
  selectedOption: number | null;
  selectedTrueFalse: boolean | null;
  reorderIndices: number[];
  matchingPairs: Record<number, number>;
  errorFindingSelectedIndex: number | null;
  categorizeAssignments: Record<number, number>;
};

function evaluateGradedStepAnswers(
  candidate: GradedStep | null,
  input: GradedAnswerInput,
): boolean {
  if (!candidate) {
    return false;
  }

  switch (candidate.type) {
    case 'choice':
    case 'fill_blank':
      return input.selectedOption === candidate.correctIndex;
    case 'true_false':
      return input.selectedTrueFalse === candidate.correct;
    case 'reorder':
      return input.reorderIndices.every(
        (value, index) => value === candidate.correctOrder[index],
      );
    case 'matching':
      return candidate.pairs.every(
        (_, termIndex) =>
          input.matchingPairs[termIndex] !== undefined &&
          candidate.definitionOrder[input.matchingPairs[termIndex]] === termIndex,
      );
    case 'error_finding':
      return (
        input.errorFindingSelectedIndex !== null &&
        candidate.textSegments[input.errorFindingSelectedIndex]?.isError === true
      );
    case 'categorize':
      return candidate.items.every(
        (item, itemIndex) =>
          input.categorizeAssignments[itemIndex] === item.correctCategoryIndex,
      );
  }
}

type LessonOutcome =
  | 'active'
  | 'passed'
  | 'path_complete'
  | 'capstone_incomplete'
  | 'section_milestone'
  | 'failed';

export function LessonSessionScreen({
  lessonId,
  openedFromPath = false,
}: {
  lessonId: string;
  openedFromPath?: boolean;
}) {
  return (
    <LessonGlossaryProvider>
      <LessonSessionScreenContent lessonId={lessonId} openedFromPath={openedFromPath} />
    </LessonGlossaryProvider>
  );
}

function LessonSessionScreenContent({
  lessonId,
  openedFromPath = false,
}: {
  lessonId: string;
  openedFromPath?: boolean;
}) {
  const { tokens, t, locale, mode } = useThemeMode();
  const soundEnabled = tokens.presentation.soundEnabled;
  const router = useRouter();
  const { dismissCelebration } = useCelebration();
  const { activeTerm, dismissTerm } = useLessonGlossary();
  const pathProgress = useProgressStore((state) => state.pathProgress);
  const recordLessonOpened = useProgressStore((state) => state.recordLessonOpened);
  const recordLessonFailed = useProgressStore((state) => state.recordLessonFailed);
  const completeLesson = useProgressStore((state) => state.completeLesson);

  const baseLesson = useMemo(
    () => getMockLesson(lessonId, locale, mode),
    [lessonId, locale, mode],
  );
  const pathId = useMemo(() => getPathIdForLesson(lessonId), [lessonId]);
  const lessonChapterStatus = useMemo(
    () => getLessonChapterStatus(lessonId, pathProgress),
    [lessonId, pathProgress],
  );
  const canPlayLesson = isLessonPlayable(lessonChapterStatus);
  const pathBlockReason = pathId ? getPathUnlockBlockReason(pathId, pathProgress) : null;
  const navigationInFlightRef = useRef(false);

  const goBackToPath = () => {
    if (navigationInFlightRef.current) {
      return;
    }

    navigationInFlightRef.current = true;
    dismissCelebration();

    const navigateAway = () => {
    if (pathId) {
      returnToPath(router, pathId);
      return;
    }

      if (router.canGoBack()) {
        suppressHomeCelebrations();
        router.back();
        return;
      }

      leaveLesson(router, resolveHomeRoute(useProgressStore.getState().completedLessons));
    };

    runAfterUISettles(navigateAway);
  };

  const continueToLesson = (nextLessonId: string) => {
    dismissCelebration();
    openLesson(router, nextLessonId, { fromPath: openedFromPath });
  };

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
  const [depthInfoPeek, setDepthInfoPeek] = useState<{ visible: boolean; nonce: number }>({
    visible: false,
    nonce: 0,
  });
  const [readingSettled, setReadingSettled] = useState(false);
  const openedRef = useRef(false);

  const lesson = useMemo(() => {
    if (!baseLesson) {
      return undefined;
    }

    return {
      ...baseLesson,
      steps: prepareLessonSteps(baseLesson.steps, baseLesson.id, sessionNonce),
    };
  }, [baseLesson, sessionNonce]);

  useEffect(() => {
    if (!lessonId || openedRef.current || !canPlayLesson) {
      return;
    }

    openedRef.current = true;
    recordLessonOpened(lessonId);
  }, [canPlayLesson, lessonId, recordLessonOpened]);

  useEffect(() => {
    setDepthInfoPeek((current) => ({ ...current, visible: false }));
    dismissTerm();
  }, [dismissTerm, stepIndex]);

  useEffect(() => {
    setReadingSettled(false);
    const current = lesson?.steps[stepIndex];

    if (!current || current.type !== 'info') {
      return;
    }

    const timer = setTimeout(() => {
      setReadingSettled(true);
    }, ORB_READING_THINK_DELAY_MS);

    return () => {
      clearTimeout(timer);
    };
  }, [lesson, sessionNonce, stepIndex]);

  const previewStep = lesson?.steps[stepIndex];
  const previewGraded = previewStep && isGradedStep(previewStep) ? previewStep : null;
  const gradedAnswerInput: GradedAnswerInput = {
    categorizeAssignments,
    errorFindingSelectedIndex,
    matchingPairs,
    reorderIndices,
    selectedOption,
    selectedTrueFalse,
  };
  const previewAnswerCorrect =
    isChecked && evaluateGradedStepAnswers(previewGraded, gradedAnswerInput);
  const lessonMoment =
    lessonOutcome === 'active' && previewStep
      ? resolveLessonMoment({
          isAnswerCorrect: previewAnswerCorrect,
          isChecked,
          isInfoStep: previewStep.type === 'info',
          readingSettled,
        })
      : null;
  const lessonOrbOverride =
    lessonMoment !== null ? resolveLessonOrbState(lessonMoment) : undefined;
  const companionState = useOrbCompanionState(lessonOrbOverride);
  const lessonSpeechKey =
    lessonMoment !== null
      ? resolveLessonSpeechCopyKey(lessonMoment, mode, stepIndex)
      : null;

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

  if (pathBlockReason) {
    const prerequisiteTitle = t(pathTitleKey(pathBlockReason.prerequisitePathId));

    return (
      <>
        <Stack.Screen options={headerOptions} />
        <LockedPathView onBack={goBackToPath} prerequisitePathTitle={prerequisiteTitle} />
      </>
    );
  }

  if (!canPlayLesson) {
    return (
      <>
        <Stack.Screen options={headerOptions} />
        <LockedLessonView onBack={goBackToPath} />
      </>
    );
  }

  const step = lesson.steps[stepIndex];
  const isLastStep = stepIndex === lesson.steps.length - 1;
  const gradedStep = isGradedStep(step) ? step : null;

  const evaluateGradedStep = (candidate: GradedStep | null): boolean =>
    evaluateGradedStepAnswers(candidate, gradedAnswerInput);

  const isAnswerCorrect = isChecked && evaluateGradedStep(gradedStep);

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
      playSfx('tap', soundEnabled);
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

        if (evaluateGradedStep(gradedStep)) {
          playSfx('success', soundEnabled);
          hapticCorrectAnswer(mode);
        } else {
          // No fail SFX — haptic + coaching only.
          hapticWrongAnswer(mode);
        }
      }
      return;
    }

    playSfx('tap', soundEnabled);
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
      const isFirstLessonCompletion =
        pathId !== undefined &&
        !wasAlreadyCompleted &&
        useProgressStore.getState().completedLessons === 0;

      setEarnedOrbs(reward);
      suppressHomeCelebrations();
      const newlyCompletedPathId = completeLesson(lesson.id, reward);

      if (isFirstLessonCompletion && useProgressStore.getState().completedLessons === 1) {
        trackEvent('first_lesson_completed');
      }

      if (
        isFirstLessonCompletion &&
        useProgressStore.getState().completedLessons === 1 &&
        !isProfileOnboardingCompleted()
      ) {
        // Week-1 proof loop before profile onboarding (critique → rewrite → compare).
        dismissCelebration();
        leaveLesson(router, '/onboarding/proof');
        return;
      }

      if (newlyCompletedPathId) {
        setCompletedPathId(newlyCompletedPathId);
        setLessonOutcome('path_complete');
        playSfx('success', soundEnabled);
        hapticPathComplete(mode);
      } else if (pathId && isPathFinalCapstone(pathId, lesson.id)) {
        setLessonOutcome('capstone_incomplete');
        playSfx('success', soundEnabled);
        hapticLessonComplete();
      } else if (pathId && isPathMidCapstone(pathId, lesson.id)) {
        setLessonOutcome('section_milestone');
        playSfx('success', soundEnabled);
        hapticLessonComplete();
      } else {
        setLessonOutcome('passed');
        playSfx('success', soundEnabled);
        hapticLessonComplete();
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
      playSfx('success', soundEnabled);
      hapticCorrectAnswer(mode);
      return;
    }

    setErrorFindingWrongIndices((previous) =>
      previous.includes(segmentIndex) ? previous : [...previous, segmentIndex],
    );
    hapticWrongAnswer(mode);
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
    const nextPathId = getNextPathId(completedPathId);

    return (
      <>
        <Stack.Screen options={headerOptions} />
        <PathCompletionView
          onFinish={goBackToPath}
          onStartNextPath={
            nextPathId
              ? () => {
                  const firstLessonId = getFirstLessonIdForPath(nextPathId);

                  if (firstLessonId) {
                    continueToLesson(firstLessonId);
                    return;
                  }

                  returnToPath(router, nextPathId);
                }
              : undefined
          }
          orbsReward={earnedOrbs}
          pathId={completedPathId}
        />
      </>
    );
  }

  if (lessonOutcome === 'capstone_incomplete' && pathId) {
    return (
      <>
        <Stack.Screen options={headerOptions} />
        <CapstoneIncompleteView
          onBackToPath={goBackToPath}
          onOpenMissing={goBackToPath}
          orbsReward={earnedOrbs}
          pathId={pathId}
        />
      </>
    );
  }

  if (lessonOutcome === 'section_milestone') {
    const nextLessonId = pathId ? getNextLessonId(pathId, lesson.id) : undefined;

    return (
      <>
        <Stack.Screen options={headerOptions} />
        <SectionMilestoneView
          nextLessonId={nextLessonId}
          onBackToPath={goBackToPath}
          onContinueNext={continueToLesson}
          orbsReward={earnedOrbs}
        />
      </>
    );
  }

  if (lessonOutcome === 'passed') {
    return (
      <>
        <Stack.Screen options={headerOptions} />
        <CompletionView
          lessonId={lesson.id}
          onContinueNext={continueToLesson}
          onFinish={goBackToPath}
          orbsReward={earnedOrbs}
          pathId={pathId}
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
            const nextLessonId = pathId ? getNextLessonId(pathId, lesson.id) : undefined;

            if (nextLessonId) {
              continueToLesson(nextLessonId);
              return;
            }

            goBackToPath();
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
          onScrollBeginDrag={() =>
            setDepthInfoPeek((current) => (current.visible ? { ...current, visible: false } : current))
          }
          style={{ flex: 1 }}>
          <View style={{ gap: tokens.spacing.space2 }}>
            <View
              style={{
                alignItems: 'center',
                flexDirection: 'row',
                flexWrap: 'wrap',
                gap: tokens.spacing.space2,
                justifyContent: 'space-between',
              }}>
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
              {lesson.depthBadge ? (
                <LessonDepthBadgeChip
                  depthBadge={lesson.depthBadge}
                  onPress={() =>
                    setDepthInfoPeek((current) =>
                      current.visible
                        ? { visible: false, nonce: current.nonce }
                        : { visible: true, nonce: 0 },
                    )
                  }
                />
              ) : null}
            </View>
            {lesson.depthBadge ? (
              <LessonDepthInfoPeek
                depthBadge={lesson.depthBadge}
                onDismiss={() =>
                  setDepthInfoPeek((current) => ({ ...current, visible: false }))
                }
                revealNonce={depthInfoPeek.nonce}
                visible={depthInfoPeek.visible}
              />
            ) : null}
            <GlossaryTermPeek
              definition={activeTerm?.definition ?? ''}
              onDismiss={dismissTerm}
              revealNonce={activeTerm?.nonce ?? 0}
              termLabel={activeTerm?.label ?? ''}
              visible={activeTerm !== null}
            />
            <ProgressBar
              color="primary"
              progress={(stepIndex + 1) / lesson.steps.length}
            />
          </View>

          <View style={{ gap: tokens.spacing.space3 }}>
            <StepTypeBadge step={step} />
            <OrbPresence
              showSpeech
              speechKey={lessonSpeechKey}
              speechSeed={stepIndex}
              state={companionState}
            />
          </View>

          {step.type === 'info' ? (
            <Card variant="solid">
              <View style={{ gap: tokens.spacing.space3 }}>
                <InlineGlossaryText
                  style={{
                    color: tokens.colors.text.primary,
                    fontFamily: tokens.typography.fontFamily.heading,
                    fontSize: tokens.typography.fontSize.headingLg,
                  }}
                  text={step.title}
                />
                <InlineGlossaryText
                  style={{
                    color: tokens.colors.text.secondary,
                    fontFamily: tokens.typography.fontFamily.body,
                    fontSize: tokens.typography.fontSize.bodyLg,
                    lineHeight: tokens.typography.fontSize.bodyLg * 1.5,
                  }}
                  text={step.body}
                />
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
              hint={
                gradedStep.type === 'reorder' && !isAnswerCorrect
                  ? matchReorderHint(
                      gradedStep.correctOrder,
                      reorderIndices,
                      gradedStep.reorderHints,
                    )
                  : undefined
              }
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
  hint?: string;
};

function FeedbackBanner({ isCorrect, explanation, hint }: FeedbackBannerProps) {
  const { tokens, t, locale, mode } = useThemeMode();
  const scale = useSharedValue(0.9);
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: tokens.motion.duration.fast });
    // Settlement pulse: slightly overshoot then land — correct/incorrect feels decided.
    scale.value = withSequence(
      withTiming(isCorrect ? 1.03 : 0.97, { duration: tokens.motion.duration.fast }),
      withSpring(1, tokens.motion.spring.default),
    );
  }, [isCorrect, hint, opacity, scale, tokens.motion]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  const accentColor = isCorrect
    ? tokens.colors.accent.success
    : tokens.colors.accent.danger;

  const learningBeat = isCorrect
    ? resolveLessonLearningBeat(explanation, locale, mode)
    : null;
  const wrongCoaching = !isCorrect
    ? resolveWrongAnswerCoaching(explanation, hint, locale, mode)
    : null;

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
      {wrongCoaching ? (
        <WrongAnswerCoachingBlock coaching={wrongCoaching} />
      ) : (
        <>
          <InlineGlossaryText
            style={{
              color: tokens.colors.text.secondary,
              fontFamily: tokens.typography.fontFamily.body,
              fontSize: tokens.typography.fontSize.bodyMd,
              lineHeight: tokens.typography.fontSize.bodyMd * 1.5,
            }}
            text={explanation}
          />
          {learningBeat ? <LearningBeatStrip beat={learningBeat} /> : null}
        </>
      )}
    </Animated.View>
  );
}

type CompletionViewProps = {
  lessonId: string;
  pathId: string | undefined;
  orbsReward: number;
  onFinish: () => void;
  onContinueNext: (nextLessonId: string) => void;
};

function CompletionView({
  lessonId,
  pathId,
  orbsReward,
  onFinish,
  onContinueNext,
}: CompletionViewProps) {
  const { tokens, t } = useThemeMode();
  const { session } = useAuth();
  const completedLessons = useProgressStore((state) => state.completedLessons);
  const companionState = useOrbCompanionState(orbsReward > 0 ? 'celebrating' : 'happy');
  const nextLessonId = pathId ? getNextLessonId(pathId, lessonId) : undefined;

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
      <OrbPresence
        interaction="react"
        layout="hero"
        showSpeech
        size={tokens.spacing.space8 * 1.15}
        speechKey={orbsReward > 0 ? 'orb.speech.lessonComplete' : 'orb.speech.celebrating.a'}
        speechSeed={lessonId.length}
        state={companionState}
      />

      <Text
        style={{
          color: tokens.colors.text.primary,
          fontFamily: tokens.typography.fontFamily.display,
          fontSize: tokens.typography.fontSize.displayLg,
          textAlign: 'center',
        }}>
        {t('lesson.completeTitle')}
      </Text>

      <SessionSkillSummaryCard lessonId={lessonId} />

      <Text
        style={{
          color: tokens.colors.accent.structure,
          fontFamily: tokens.typography.fontFamily.mono,
          fontSize: tokens.typography.fontSize.headingLg,
        }}>
        {orbsReward > 0 ? t('lesson.orbsEarned', { count: orbsReward }) : t('lesson.practiceComplete')}
      </Text>

      <Text
        style={{
          color: tokens.colors.text.secondary,
          fontFamily: tokens.typography.fontFamily.bodyMedium,
          fontSize: tokens.typography.fontSize.bodyMd,
          textAlign: 'center',
        }}>
        {t('skillRank.lessonXpGain', {
          xp: lessonCompletionXpGain(orbsReward),
        })}
      </Text>

      <View
        style={{
          alignSelf: 'stretch',
          gap: tokens.spacing.space3,
          width: '100%',
        }}>
        {nextLessonId ? (
          <>
            <Button
              label={t('lesson.continueNext')}
              onPress={() => onContinueNext(nextLessonId)}
              style={{ alignSelf: 'stretch' }}
              variant="primary"
            />
            <Button
              label={t('lesson.backToPath')}
              onPress={onFinish}
              style={{ alignSelf: 'stretch' }}
              variant="ghost"
            />
          </>
        ) : (
          <Button
            label={t('lesson.backToPath')}
            onPress={onFinish}
            style={{ alignSelf: 'stretch' }}
            variant="primary"
          />
        )}
      </View>

      {!session && completedLessons === 1 ? (
        <GuestSaveProgressHint variant="inline" />
      ) : null}
    </View>
  );
}

type LockedLessonViewProps = {
  onBack: () => void;
};

function LockedLessonView({ onBack }: LockedLessonViewProps) {
  const { tokens, t } = useThemeMode();

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
      <Text
        style={{
          color: tokens.colors.text.primary,
          fontFamily: tokens.typography.fontFamily.display,
          fontSize: tokens.typography.fontSize.displayLg,
          textAlign: 'center',
        }}>
        {t('lesson.lockedTitle')}
      </Text>

      <Text
        style={{
          color: tokens.colors.text.secondary,
          fontFamily: tokens.typography.fontFamily.body,
          fontSize: tokens.typography.fontSize.bodyLg,
          lineHeight: tokens.typography.fontSize.bodyLg * 1.5,
          textAlign: 'center',
        }}>
        {t('lesson.lockedBody')}
      </Text>

      <Button
        label={t('lesson.backToPath')}
        onPress={onBack}
        style={{ alignSelf: 'stretch' }}
        variant="primary"
      />
    </View>
  );
}

export default function LektionScreen() {
  const { from, id } = useLocalSearchParams<{ from?: string; id: string }>();
  const lessonId = id ?? '';
  const openedFromPath = isLessonOpenedFromPath(from);

  return (
    <LessonSessionScreen
      key={lessonId}
      lessonId={lessonId}
      openedFromPath={openedFromPath}
    />
  );
}
