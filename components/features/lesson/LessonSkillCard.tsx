import { Text, View } from 'react-native';

import type { LessonSkillSummary } from '@/lib/lessonSkillSummary';
import { useThemeMode } from '@/theme';

type LessonSkillCardProps = {
  summary: LessonSkillSummary;
  /** Defaults to lesson end copy; Home passes a competence-framed key. */
  titleKey?: string;
};

/**
 * End-of-session skill closure: “Today you practiced X” — competence, not just Orbs.
 * Uses elevated surface (same family as LearningBeatStrip), cyan only for the skill list.
 */
export function LessonSkillCard({
  summary,
  titleKey = 'lesson.skillCardTitle',
}: LessonSkillCardProps) {
  const { tokens, t } = useThemeMode();

  const practicedLabel = summary.practiced.map((tag) => tag.term).join(' · ');
  const improvedLabel = summary.improved.map((tag) => tag.term).join(' · ');
  const missedLabel = summary.missed.map((tag) => tag.term).join(' · ');

  return (
    <View
      style={{
        alignSelf: 'stretch',
        backgroundColor: tokens.colors.background.elevated,
        borderColor: tokens.colors.border.subtle,
        borderRadius: tokens.radius.md,
        borderWidth: 1,
        gap: tokens.spacing.space2,
        paddingHorizontal: tokens.spacing.space4,
        paddingVertical: tokens.spacing.space3,
      }}>
      <Text
        style={{
          color: tokens.colors.text.secondary,
          fontFamily: tokens.typography.fontFamily.bodyMedium,
          fontSize: tokens.typography.fontSize.bodySm,
        }}>
        {t(titleKey)}
      </Text>

      <Text
        style={{
          color: tokens.colors.accent.structure,
          fontFamily: tokens.typography.fontFamily.heading,
          fontSize: tokens.typography.fontSize.headingMd,
          lineHeight: tokens.typography.fontSize.headingMd * 1.35,
        }}>
        {practicedLabel}
      </Text>

      {improvedLabel ? (
        <Text
          style={{
            color: tokens.colors.accent.success,
            fontFamily: tokens.typography.fontFamily.body,
            fontSize: tokens.typography.fontSize.bodySm,
            lineHeight: tokens.typography.fontSize.bodySm * 1.4,
          }}>
          {t('lesson.skillCardImproved', { skills: improvedLabel })}
        </Text>
      ) : null}

      {missedLabel ? (
        <Text
          style={{
            color: tokens.colors.text.secondary,
            fontFamily: tokens.typography.fontFamily.body,
            fontSize: tokens.typography.fontSize.bodySm,
            lineHeight: tokens.typography.fontSize.bodySm * 1.4,
          }}>
          {t('lesson.skillCardMissed', { skills: missedLabel })}
        </Text>
      ) : null}
    </View>
  );
}
