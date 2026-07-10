import { Check, X } from 'lucide-react-native';
import { Text, View } from 'react-native';

import { PressableScale } from '@/components/ui';
import type { ResolvedLessonStep } from '@/data/mockLessons';
import { useThemeMode } from '@/theme';

export type CategorizeStepViewProps = {
  step: Extract<ResolvedLessonStep, { type: 'categorize' }>;
  selectedItemIndex: number | null;
  assignments: Record<number, number>;
  isChecked: boolean;
  onSelectItem: (itemIndex: number) => void;
  onSelectCategory: (categoryIndex: number) => void;
};

const CATEGORY_ACCENT_KEYS = ['primary', 'structure', 'warning'] as const;

function getCategoryAccentColor(
  categoryIndex: number,
  accent: ReturnType<typeof useThemeMode>['tokens']['colors']['accent'],
): string {
  const key = CATEGORY_ACCENT_KEYS[categoryIndex % CATEGORY_ACCENT_KEYS.length];
  return accent[key];
}

type ItemChipProps = {
  label: string;
  borderColor: string;
  backgroundColor: string;
  disabled: boolean;
  onPress: () => void;
  showAsCorrect?: boolean;
  showAsWrong?: boolean;
};

function ItemChip({
  label,
  borderColor,
  backgroundColor,
  disabled,
  onPress,
  showAsCorrect,
  showAsWrong,
}: ItemChipProps) {
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
        paddingHorizontal: tokens.spacing.space3,
        paddingVertical: tokens.spacing.space2,
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

export function CategorizeStepView({
  step,
  selectedItemIndex,
  assignments,
  isChecked,
  onSelectItem,
  onSelectCategory,
}: CategorizeStepViewProps) {
  const { tokens, t } = useThemeMode();

  const unassignedIndices = step.items
    .map((_, index) => index)
    .filter((index) => assignments[index] === undefined);

  const renderItemChip = (itemIndex: number) => {
    const item = step.items[itemIndex];
    const assignedCategory = assignments[itemIndex];
    const isSelected = selectedItemIndex === itemIndex;
    const categoryAccent =
      assignedCategory !== undefined
        ? getCategoryAccentColor(assignedCategory, tokens.colors.accent)
        : tokens.colors.border.subtle;
    const isCorrect =
      isChecked && assignedCategory !== undefined && assignedCategory === item.correctCategoryIndex;
    const isWrong =
      isChecked && assignedCategory !== undefined && assignedCategory !== item.correctCategoryIndex;

    const borderColor = isCorrect
      ? tokens.colors.accent.success
      : isWrong
        ? tokens.colors.accent.danger
        : isSelected
          ? tokens.colors.accent.primary
          : assignedCategory !== undefined
            ? categoryAccent
            : tokens.colors.border.subtle;

    return (
      <ItemChip
        backgroundColor={
          isSelected || assignedCategory !== undefined
            ? tokens.colors.surface.cardHover
            : tokens.colors.surface.card
        }
        borderColor={borderColor}
        disabled={isChecked}
        key={`item-${itemIndex}`}
        label={item.text}
        onPress={() => onSelectItem(itemIndex)}
        showAsCorrect={isCorrect}
        showAsWrong={isWrong}
      />
    );
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
      <Text
        style={{
          color: tokens.colors.text.secondary,
          fontFamily: tokens.typography.fontFamily.body,
          fontSize: tokens.typography.fontSize.bodyMd,
        }}>
        {t('lesson.categorizeInstruction')}
      </Text>

      <View style={{ flexDirection: 'row', gap: tokens.spacing.space2 }}>
        {step.categories.map((category, categoryIndex) => {
          const categoryAccent = getCategoryAccentColor(categoryIndex, tokens.colors.accent);
          const assignedIndices = step.items
            .map((_, index) => index)
            .filter((index) => assignments[index] === categoryIndex);
          const canAssign = selectedItemIndex !== null && !isChecked;

          return (
            <View
              key={`category-${categoryIndex}`}
              style={{
                backgroundColor: tokens.colors.surface.card,
                borderColor: canAssign ? categoryAccent : tokens.colors.border.subtle,
                borderRadius: tokens.radius.md,
                borderWidth: 1,
                flex: 1,
                gap: tokens.spacing.space2,
                minHeight: tokens.spacing.space8,
                padding: tokens.spacing.space2,
              }}>
              <PressableScale
                accessibilityRole="button"
                disabled={!canAssign}
                onPress={() => onSelectCategory(categoryIndex)}
                style={{
                  borderBottomColor: tokens.colors.border.subtle,
                  borderBottomWidth: 1,
                  paddingBottom: tokens.spacing.space2,
                }}>
                <Text
                  style={{
                    color: categoryAccent,
                    fontFamily: tokens.typography.fontFamily.bodyMedium,
                    fontSize: tokens.typography.fontSize.bodySm,
                    textAlign: 'center',
                  }}>
                  {category}
                </Text>
              </PressableScale>
              <View style={{ gap: tokens.spacing.space2 }}>
                {assignedIndices.map((itemIndex) => renderItemChip(itemIndex))}
              </View>
            </View>
          );
        })}
      </View>

      {unassignedIndices.length > 0 ? (
        <View style={{ gap: tokens.spacing.space2 }}>
          <Text
            style={{
              color: tokens.colors.text.tertiary,
              fontFamily: tokens.typography.fontFamily.bodyMedium,
              fontSize: tokens.typography.fontSize.bodySm,
            }}>
            {t('lesson.categorizePoolLabel')}
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: tokens.spacing.space2 }}>
            {unassignedIndices.map((itemIndex) => renderItemChip(itemIndex))}
          </View>
        </View>
      ) : null}
    </View>
  );
}
