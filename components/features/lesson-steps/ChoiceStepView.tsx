import { Text, View } from 'react-native';

import type { ResolvedLessonStep } from '@/data/mockLessons';
import { useThemeMode } from '@/theme';

import { OptionRow } from './OptionRow';

export type ChoiceStepViewProps = {
  step: Extract<ResolvedLessonStep, { type: 'choice' }>;
  selectedOption: number | null;
  isChecked: boolean;
  onSelect: (index: number) => void;
};

export function ChoiceStepView({ step, selectedOption, isChecked, onSelect }: ChoiceStepViewProps) {
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
