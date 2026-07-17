import { Text, View } from 'react-native';

import { InlineGlossaryText } from '@/components/features/lesson/InlineGlossaryText';
import { LearningBeatStrip } from '@/components/features/lesson/LearningBeatStrip';
import type { WrongAnswerCoaching } from '@/lib/lessonWrongAnswerCoaching';
import { useThemeMode } from '@/theme';

type WrongAnswerCoachingBlockProps = {
  coaching: WrongAnswerCoaching;
};

/**
 * Why this fails + what to do next — the coaching layer beyond a plain hint.
 */
export function WrongAnswerCoachingBlock({ coaching }: WrongAnswerCoachingBlockProps) {
  const { tokens, t } = useThemeMode();

  const nextBody = coaching.nextHint
    ? coaching.nextHint
    : coaching.beat
      ? t('lesson.coachingNextFromBeat', { term: coaching.beat.term })
      : t('lesson.coachingNextFallback');

  return (
    <View style={{ gap: tokens.spacing.space3 }}>
      <View style={{ gap: tokens.spacing.space1 }}>
        <Text
          style={{
            color: tokens.colors.accent.danger,
            fontFamily: tokens.typography.fontFamily.bodyMedium,
            fontSize: tokens.typography.fontSize.bodySm,
          }}>
          {t('lesson.coachingWhyLabel')}
        </Text>
        <InlineGlossaryText
          style={{
            color: tokens.colors.text.secondary,
            fontFamily: tokens.typography.fontFamily.body,
            fontSize: tokens.typography.fontSize.bodyMd,
            lineHeight: tokens.typography.fontSize.bodyMd * 1.5,
          }}
          text={coaching.why}
        />
      </View>

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
            color: tokens.colors.accent.structure,
            fontFamily: tokens.typography.fontFamily.bodyMedium,
            fontSize: tokens.typography.fontSize.bodySm,
          }}>
          {t('lesson.coachingNextLabel')}
        </Text>
        {coaching.nextHint ? (
          <InlineGlossaryText
            style={{
              color: tokens.colors.text.primary,
              fontFamily: tokens.typography.fontFamily.body,
              fontSize: tokens.typography.fontSize.bodyMd,
              lineHeight: tokens.typography.fontSize.bodyMd * 1.45,
            }}
            text={nextBody}
          />
        ) : (
          <Text
            style={{
              color: tokens.colors.text.primary,
              fontFamily: tokens.typography.fontFamily.body,
              fontSize: tokens.typography.fontSize.bodyMd,
              lineHeight: tokens.typography.fontSize.bodyMd * 1.45,
            }}>
            {nextBody}
          </Text>
        )}
      </View>

      {coaching.beat ? <LearningBeatStrip beat={coaching.beat} /> : null}
    </View>
  );
}
