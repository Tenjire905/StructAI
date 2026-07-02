import { ChevronDown, ChevronUp } from 'lucide-react-native';
import { Text, View } from 'react-native';

import { PressableScale } from '@/components/ui';
import type { ResolvedLessonStep } from '@/data/mockLessons';
import { useThemeMode } from '@/theme';

export type ReorderStepViewProps = {
  step: Extract<ResolvedLessonStep, { type: 'reorder' }>;
  order: number[];
  isChecked: boolean;
  onChange: (order: number[]) => void;
};

export function ReorderStepView({ step, order, isChecked, onChange }: ReorderStepViewProps) {
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
