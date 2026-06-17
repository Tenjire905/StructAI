import {
  StyleSheet,
  TextInput,
  TextInputProps,
} from 'react-native';

import { theme } from '../theme';

type SFTextInputProps = TextInputProps;

export function SFTextInput({
  style,
  placeholderTextColor = theme.colors.text.muted,
  ...rest
}: SFTextInputProps): React.JSX.Element {
  return (
    <TextInput
      style={[styles.input, style]}
      placeholderTextColor={placeholderTextColor}
      textAlignVertical="top"
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    minHeight: 120,
    backgroundColor: theme.colors.background.card,
    borderColor: theme.colors.border.subtle,
    borderWidth: 1,
    borderRadius: 16,
    color: theme.colors.text.primary,
    padding: 16,
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.regular,
  },
});
