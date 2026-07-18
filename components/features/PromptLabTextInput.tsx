import { forwardRef } from 'react';
import { TextInput, type TextInputProps } from 'react-native';

import { useThemeMode } from '@/theme';

type PromptLabTextInputProps = Pick<
  TextInputProps,
  'value' | 'onChangeText' | 'placeholder' | 'onFocus' | 'onBlur' | 'editable'
>;

/**
 * Fixed-height multiline prompt field: scrolls inside the field only
 * so long prompts never stretch the whole Prompt Lab screen.
 */
export const PromptLabTextInput = forwardRef<TextInput, PromptLabTextInputProps>(
  function PromptLabTextInput(
    {
      value,
      onChangeText,
      placeholder,
      onFocus,
      onBlur,
      editable = true,
    },
    ref,
  ) {
    const { tokens } = useThemeMode();
    // ~3× space8 keeps a stable editor band; content scrolls inside.
    const fieldHeight = tokens.spacing.space8 * 3;

    return (
      <TextInput
        editable={editable}
        multiline
        onBlur={onBlur}
        onChangeText={onChangeText}
        onFocus={onFocus}
        placeholder={placeholder}
        placeholderTextColor={tokens.colors.text.tertiary}
        ref={ref}
        scrollEnabled
        style={{
          backgroundColor: tokens.colors.surface.card,
          borderColor: tokens.colors.border.strong,
          borderRadius: tokens.radius.md,
          borderWidth: 1,
          color: tokens.colors.text.primary,
          fontFamily: tokens.typography.fontFamily.body,
          fontSize: tokens.typography.fontSize.bodyLg,
          height: fieldHeight,
          lineHeight: tokens.typography.fontSize.bodyLg * 1.4,
          maxHeight: fieldHeight,
          padding: tokens.spacing.space4,
          textAlignVertical: 'top',
        }}
        value={value}
      />
    );
  },
);
