import { forwardRef } from 'react';
import { Text, TextInput, View, type TextInputProps } from 'react-native';
import { Mic, MicOff } from 'lucide-react-native';

import { PressableScale } from '@/components/ui/PressableScale';
import type { PromptDictationState } from '@/hooks/usePromptDictation';
import { useThemeMode } from '@/theme';

type PromptLabTextInputProps = Pick<
  TextInputProps,
  'value' | 'onChangeText' | 'placeholder' | 'onFocus' | 'onBlur' | 'editable'
> & {
  dictation?: PromptDictationState;
};

/**
 * Fixed-height multiline prompt field with optional mic dictation control.
 * Content scrolls inside the field so long prompts never stretch the screen.
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
      dictation,
    },
    ref,
  ) {
    const { tokens, t } = useThemeMode();
    // ~3× space8 keeps a stable editor band; content scrolls inside.
    const fieldHeight = tokens.spacing.space8 * 3;
    const micActive = dictation?.isListening === true;
    const MicIcon = micActive ? MicOff : Mic;

    return (
      <View style={{ gap: tokens.spacing.space2 }}>
        <View style={{ position: 'relative' }}>
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
              borderColor: micActive
                ? tokens.colors.accent.primary
                : tokens.colors.border.strong,
              borderRadius: tokens.radius.md,
              borderWidth: 1,
              color: tokens.colors.text.primary,
              fontFamily: tokens.typography.fontFamily.body,
              fontSize: tokens.typography.fontSize.bodyLg,
              height: fieldHeight,
              lineHeight: tokens.typography.fontSize.bodyLg * 1.4,
              maxHeight: fieldHeight,
              paddingBottom: tokens.spacing.space4,
              paddingLeft: tokens.spacing.space4,
              paddingRight: tokens.spacing.space8,
              paddingTop: tokens.spacing.space4,
              textAlignVertical: 'top',
            }}
            value={value}
          />
          {dictation ? (
            <PressableScale
              accessibilityLabel={
                micActive ? t('promptLab.dictationStop') : t('promptLab.dictationStart')
              }
              disabled={!editable}
              onPress={() => {
                void dictation.toggle();
              }}
              style={{
                alignItems: 'center',
                backgroundColor: micActive
                  ? tokens.colors.accent.primary
                  : tokens.colors.surface.card,
                borderRadius: tokens.radius.pill,
                bottom: tokens.spacing.space3,
                height: tokens.spacing.space7,
                justifyContent: 'center',
                opacity: dictation.status === 'unavailable' ? 0.55 : 1,
                position: 'absolute',
                right: tokens.spacing.space3,
                width: tokens.spacing.space7,
              }}>
              <MicIcon
                color={
                  micActive ? tokens.colors.text.onAccent : tokens.colors.text.primary
                }
                size={tokens.spacing.space4}
                strokeWidth={2}
              />
            </PressableScale>
          ) : null}
        </View>
        {dictation?.isListening ? (
          <Text
            style={{
              color: tokens.colors.accent.primary,
              fontFamily: tokens.typography.fontFamily.bodyMedium,
              fontSize: tokens.typography.fontSize.bodySm,
            }}>
            {t('promptLab.dictationListening')}
          </Text>
        ) : null}
        {dictation?.errorKey ? (
          <Text
            style={{
              color: tokens.colors.accent.warning,
              fontFamily: tokens.typography.fontFamily.body,
              fontSize: tokens.typography.fontSize.bodySm,
              lineHeight: tokens.typography.fontSize.bodySm * 1.4,
            }}>
            {t(dictation.errorKey)}
          </Text>
        ) : null}
      </View>
    );
  },
);
