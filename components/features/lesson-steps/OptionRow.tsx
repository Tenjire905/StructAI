import { Check, X } from 'lucide-react-native';
import { Text } from 'react-native';

import { PressableScale } from '@/components/ui';
import { useThemeMode } from '@/theme';

type OptionRowProps = {
  label: string;
  isSelected: boolean;
  isChecked: boolean;
  showAsCorrect: boolean;
  showAsWrong: boolean;
  onPress: () => void;
};

export function OptionRow({
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
