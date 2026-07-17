import { Text, View } from 'react-native';

import type { LessonLearningBeat } from '@/lib/lessonLearningBeat';
import { useThemeMode } from '@/theme';

type LearningBeatStripProps = {
  beat: LessonLearningBeat;
};

/**
 * Compact “remember this pattern” strip under check feedback —
 * the Mimo-style learning beat without a big modal.
 */
export function LearningBeatStrip({ beat }: LearningBeatStripProps) {
  const { tokens, t } = useThemeMode();

  return (
    <View
      style={{
        backgroundColor: tokens.colors.background.elevated,
        borderColor: tokens.colors.border.subtle,
        borderRadius: tokens.radius.md,
        borderWidth: 1,
        gap: tokens.spacing.space1,
        paddingHorizontal: tokens.spacing.space3,
        paddingVertical: tokens.spacing.space2,
      }}>
      <Text
        style={{
          color: tokens.colors.accent.primary,
          fontFamily: tokens.typography.fontFamily.bodyMedium,
          fontSize: tokens.typography.fontSize.bodySm,
        }}>
        {t('lesson.learningBeatLabel')}
        {': '}
        <Text
          style={{
            color: tokens.colors.accent.primary,
            fontFamily: tokens.typography.fontFamily.bodyMedium,
            textShadowColor: tokens.colors.accent.primary,
            textShadowOffset: { width: 0, height: 0 },
            textShadowRadius: tokens.spacing.space1,
          }}>
          {beat.term}
        </Text>
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
