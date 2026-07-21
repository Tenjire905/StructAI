import { useMemo } from 'react';
import { Text, View } from 'react-native';

import { InlineGlossaryText } from '@/components/features/lesson/InlineGlossaryText';
import { Card, PressableScale } from '@/components/ui';
import { getGlossaryTerms } from '@/data/glossary';
import type { ResolvedLessonStep } from '@/data/mockLessons';
import { withFillBlankJoinSpaces } from '@/lib/fillBlankJoin';
import { splitTextsWithGlossary } from '@/lib/glossary';
import { useThemeMode } from '@/theme';

export type FillBlankStepViewProps = {
  step: Extract<ResolvedLessonStep, { type: 'fill_blank' }>;
  selectedOption: number | null;
  isChecked: boolean;
  onSelect: (index: number) => void;
};

export function FillBlankStepView({
  step,
  selectedOption,
  isChecked,
  onSelect,
}: FillBlankStepViewProps) {
  const { tokens, t, locale, mode } = useThemeMode();
  const blank = selectedOption !== null ? step.options[selectedOption] : '___';
  // Mode-agnostic: Focus authored copy and Playful shorteners both get safe gaps.
  const joined = useMemo(
    () => withFillBlankJoinSpaces(step.prefix, blank, step.suffix),
    [blank, step.prefix, step.suffix],
  );
  const [prefixSegments, suffixSegments] = useMemo(
    () =>
      splitTextsWithGlossary(
        [joined.prefix, joined.suffix],
        getGlossaryTerms(locale),
        mode,
      ),
    [joined.prefix, joined.suffix, locale, mode],
  );

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
          <InlineGlossaryText nested segments={prefixSegments} text={joined.prefix} />
          <Text
            style={{
              color:
                selectedOption !== null
                  ? tokens.colors.accent.primary
                  : tokens.colors.text.tertiary,
              fontFamily: tokens.typography.fontFamily.bodyMedium,
            }}>
            {joined.blank}
          </Text>
          <InlineGlossaryText nested segments={suffixSegments} text={joined.suffix} />
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
