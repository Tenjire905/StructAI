import { Text, View } from 'react-native';

import type { LessonLearningBeat } from '@/lib/lessonLearningBeat';
import { useThemeMode } from '@/theme';

import { getGlossaryTermHighlightStyle } from './glossaryHighlightStyle';

type LearningBeatStripProps = {
  beat: LessonLearningBeat;
};

/**
 * Compact “remember this pattern” strip under check feedback —
 * the Mimo-style learning beat without a big modal.
 */
export function LearningBeatStrip({ beat }: LearningBeatStripProps) {
  const { tokens, t } = useThemeMode();
  const termHighlight = getGlossaryTermHighlightStyle(tokens);
  const isFocus = tokens.presentation.orbStyle === 'minimal';

  return (
    <View
      style={{
        backgroundColor: tokens.colors.surface.inset,
        borderColor: tokens.colors.border.subtle,
        borderRadius: isFocus ? tokens.radius.sm : tokens.radius.md,
        borderWidth: 1,
        gap: tokens.spacing.space1,
        paddingHorizontal: isFocus ? tokens.spacing.space2 : tokens.spacing.space3,
        paddingVertical: isFocus ? tokens.spacing.space1 : tokens.spacing.space2,
      }}>
      <Text
        style={{
          color: tokens.colors.accent.primary,
          fontFamily: tokens.typography.fontFamily.bodyMedium,
          fontSize: tokens.typography.fontSize.bodySm,
        }}>
        {t('lesson.learningBeatLabel')}
        {': '}
        <Text style={termHighlight}>{beat.term}</Text>
      </Text>
      <Text
        style={{
          color: tokens.colors.text.secondary,
          fontFamily: tokens.typography.fontFamily.body,
          fontSize: tokens.typography.fontSize.bodySm,
          lineHeight: tokens.typography.fontSize.bodySm * 1.45,
        }}>
        {beat.definition}
      </Text>
    </View>
  );
}
