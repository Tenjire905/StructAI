import { Check, X } from 'lucide-react-native';
import { Text, View } from 'react-native';

import { InlineGlossaryText } from '@/components/features/lesson/InlineGlossaryText';
import { PressableScale } from '@/components/ui';
import type { ResolvedLessonStep } from '@/data/mockLessons';
import { useThemeMode } from '@/theme';

export type MatchingStepViewProps = {
  step: Extract<ResolvedLessonStep, { type: 'matching' }>;
  selectedTermIndex: number | null;
  matches: Record<number, number>;
  isChecked: boolean;
  onSelectTerm: (termIndex: number) => void;
  onSelectDefinition: (displayIndex: number) => void;
};

const PAIR_ACCENT_KEYS = ['primary', 'structure', 'warning', 'primaryDim'] as const;

function getPairAccentColor(
  pairIndex: number,
  accent: ReturnType<typeof useThemeMode>['tokens']['colors']['accent'],
): string {
  const key = PAIR_ACCENT_KEYS[pairIndex % PAIR_ACCENT_KEYS.length];
  return accent[key];
}

function isDefinitionMatched(matches: Record<number, number>, displayIndex: number): boolean {
  return Object.values(matches).includes(displayIndex);
}

function isPairCorrect(
  step: MatchingStepViewProps['step'],
  termIndex: number,
  displayIndex: number,
): boolean {
  return step.definitionOrder[displayIndex] === termIndex;
}

type MatchCellProps = {
  label: string;
  borderColor: string;
  backgroundColor: string;
  disabled: boolean;
  onPress: () => void;
  showAsCorrect?: boolean;
  showAsWrong?: boolean;
};

function MatchCell({
  label,
  borderColor,
  backgroundColor,
  disabled,
  onPress,
  showAsCorrect,
  showAsWrong,
}: MatchCellProps) {
  const { tokens } = useThemeMode();

  return (
    <PressableScale
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={{
        alignItems: 'center',
        backgroundColor,
        borderColor,
        borderRadius: tokens.radius.md,
        borderWidth: 1,
        flexDirection: 'row',
        gap: tokens.spacing.space2,
        minHeight: tokens.spacing.space7,
        padding: tokens.spacing.space3,
      }}>
      <Text
        style={{
          color: tokens.colors.text.primary,
          flex: 1,
          fontFamily: tokens.typography.fontFamily.body,
          fontSize: tokens.typography.fontSize.bodySm,
          lineHeight: tokens.typography.fontSize.bodySm * 1.4,
        }}>
        {label}
      </Text>
      {showAsCorrect ? (
        <Check
          color={tokens.colors.accent.success}
          size={tokens.icons.sizes.sm}
          strokeWidth={tokens.icons.strokeWidth}
        />
      ) : null}
      {showAsWrong ? (
        <X
          color={tokens.colors.accent.danger}
          size={tokens.icons.sizes.sm}
          strokeWidth={tokens.icons.strokeWidth}
        />
      ) : null}
    </PressableScale>
  );
}

export function MatchingStepView({
  step,
  selectedTermIndex,
  matches,
  isChecked,
  onSelectTerm,
  onSelectDefinition,
}: MatchingStepViewProps) {
  const { tokens, t } = useThemeMode();

  const handleTermPress = (termIndex: number) => {
    if (isChecked) {
      return;
    }

    onSelectTerm(termIndex);
  };

  const handleDefinitionPress = (displayIndex: number) => {
    if (isChecked || selectedTermIndex === null) {
      return;
    }

    if (isDefinitionMatched(matches, displayIndex)) {
      return;
    }

    onSelectDefinition(displayIndex);
  };

  return (
    <View style={{ gap: tokens.spacing.space3 }}>
      <InlineGlossaryText
        style={{
          color: tokens.colors.text.primary,
          fontFamily: tokens.typography.fontFamily.heading,
          fontSize: tokens.typography.fontSize.headingMd,
        }}
        text={step.instruction}
      />
      <Text
        style={{
          color: tokens.colors.text.secondary,
          fontFamily: tokens.typography.fontFamily.body,
          fontSize: tokens.typography.fontSize.bodyMd,
        }}>
        {t('lesson.matchingInstruction')}
      </Text>
      <View style={{ flexDirection: 'row', gap: tokens.spacing.space3 }}>
        <View style={{ flex: 1, gap: tokens.spacing.space2 }}>
          {step.pairs.map((pair, termIndex) => {
            const matchedDisplayIndex = matches[termIndex];
            const isMatched = matchedDisplayIndex !== undefined;
            const isSelected = selectedTermIndex === termIndex;
            const pairAccent = getPairAccentColor(termIndex, tokens.colors.accent);
            const isCorrect =
              isChecked && isMatched && isPairCorrect(step, termIndex, matchedDisplayIndex);
            const isWrong =
              isChecked && isMatched && !isPairCorrect(step, termIndex, matchedDisplayIndex);

            const borderColor = isCorrect
              ? tokens.colors.accent.success
              : isWrong
                ? tokens.colors.accent.danger
                : isMatched
                  ? pairAccent
                  : isSelected
                    ? tokens.colors.accent.primary
                    : tokens.colors.border.subtle;

            return (
              <MatchCell
                backgroundColor={
                  isMatched || isSelected
                    ? tokens.colors.surface.cardHover
                    : tokens.colors.surface.card
                }
                borderColor={borderColor}
                disabled={isChecked}
                key={`term-${termIndex}`}
                label={pair.term}
                onPress={() => handleTermPress(termIndex)}
                showAsCorrect={isCorrect}
                showAsWrong={isWrong}
              />
            );
          })}
        </View>
        <View style={{ flex: 1, gap: tokens.spacing.space2 }}>
          {step.definitionOrder.map((pairIndex, displayIndex) => {
            const matchedTermIndex = Number(
              Object.entries(matches).find(([, value]) => value === displayIndex)?.[0],
            );
            const isMatched = !Number.isNaN(matchedTermIndex);
            const pairAccent = isMatched
              ? getPairAccentColor(matchedTermIndex, tokens.colors.accent)
              : tokens.colors.border.subtle;
            const isCorrect =
              isChecked &&
              isMatched &&
              isPairCorrect(step, matchedTermIndex, displayIndex);
            const isWrong =
              isChecked &&
              isMatched &&
              !isPairCorrect(step, matchedTermIndex, displayIndex);
            const definitionLocked = isDefinitionMatched(matches, displayIndex);

            const borderColor = isCorrect
              ? tokens.colors.accent.success
              : isWrong
                ? tokens.colors.accent.danger
                : isMatched
                  ? pairAccent
                  : tokens.colors.border.subtle;

            return (
              <MatchCell
                backgroundColor={
                  isMatched ? tokens.colors.surface.cardHover : tokens.colors.surface.card
                }
                borderColor={borderColor}
                disabled={isChecked || definitionLocked || selectedTermIndex === null}
                key={`definition-${displayIndex}`}
                label={step.pairs[pairIndex]?.definition ?? ''}
                onPress={() => handleDefinitionPress(displayIndex)}
                showAsCorrect={isCorrect}
                showAsWrong={isWrong}
              />
            );
          })}
        </View>
      </View>
    </View>
  );
}
