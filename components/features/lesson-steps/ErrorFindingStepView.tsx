import { Text, View } from 'react-native';

import { InlineGlossaryText } from '@/components/features/lesson/InlineGlossaryText';
import { Card, PressableScale } from '@/components/ui';
import type { ResolvedLessonStep } from '@/data/mockLessons';
import { useThemeMode } from '@/theme';

export type ErrorFindingStepViewProps = {
  step: Extract<ResolvedLessonStep, { type: 'error_finding' }>;
  selectedIndex: number | null;
  wrongIndices: number[];
  isChecked: boolean;
  onSelectSegment: (index: number) => void;
};

export function ErrorFindingStepView({
  step,
  selectedIndex,
  wrongIndices,
  isChecked,
  onSelectSegment,
}: ErrorFindingStepViewProps) {
  const { tokens, t } = useThemeMode();

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
        {t('lesson.errorFindingInstruction')}
      </Text>
      <Card variant="solid">
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            rowGap: tokens.spacing.space2,
          }}>
          {step.textSegments.map((segment, index) => {
            const isWrong = wrongIndices.includes(index);
            const isCorrectSelection =
              isChecked && selectedIndex === index && segment.isError;
            const showAsWrong = isWrong && !isCorrectSelection;

            const borderColor = isCorrectSelection
              ? tokens.colors.accent.success
              : showAsWrong
                ? tokens.colors.accent.danger
                : 'transparent';

            const backgroundColor = isCorrectSelection
              ? tokens.colors.surface.cardHover
              : showAsWrong
                ? tokens.colors.surface.cardHover
                : 'transparent';

            const textColor = isCorrectSelection
              ? tokens.colors.accent.success
              : showAsWrong
                ? tokens.colors.accent.danger
                : tokens.colors.text.primary;

            return (
              <PressableScale
                accessibilityRole="button"
                disabled={isChecked}
                key={`segment-${index}`}
                onPress={() => onSelectSegment(index)}
                pressFeedbackDisabled={isChecked}
                style={{
                  backgroundColor,
                  borderColor,
                  borderRadius: tokens.radius.sm,
                  borderWidth: showAsWrong || isCorrectSelection ? 1 : 0,
                  paddingHorizontal: isCorrectSelection || showAsWrong ? tokens.spacing.space1 : 0,
                  paddingVertical: isCorrectSelection || showAsWrong ? tokens.spacing.space1 : 0,
                }}>
                <Text
                  style={{
                    color: textColor,
                    fontFamily: tokens.typography.fontFamily.body,
                    fontSize: tokens.typography.fontSize.bodyLg,
                    lineHeight: tokens.typography.fontSize.bodyLg * 1.5,
                  }}>
                  {segment.text}
                </Text>
              </PressableScale>
            );
          })}
        </View>
      </Card>
    </View>
  );
}
