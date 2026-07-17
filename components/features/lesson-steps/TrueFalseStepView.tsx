import { View } from 'react-native';

import { InlineGlossaryText } from '@/components/features/lesson/InlineGlossaryText';
import type { ResolvedLessonStep } from '@/data/mockLessons';
import { useThemeMode } from '@/theme';

import { OptionRow } from './OptionRow';

export type TrueFalseStepViewProps = {
  step: Extract<ResolvedLessonStep, { type: 'true_false' }>;
  selected: boolean | null;
  isChecked: boolean;
  onSelect: (value: boolean) => void;
};

export function TrueFalseStepView({ step, selected, isChecked, onSelect }: TrueFalseStepViewProps) {
  const { tokens, t } = useThemeMode();

  return (
    <View style={{ gap: tokens.spacing.space3 }}>
      <InlineGlossaryText
        style={{
          color: tokens.colors.text.primary,
          fontFamily: tokens.typography.fontFamily.heading,
          fontSize: tokens.typography.fontSize.headingMd,
        }}
        text={step.statement}
      />
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
