import { Text, View } from 'react-native';

import { Card } from '@/components/ui';
import { resolveSessionSkillSummary } from '@/lib/sessionSkillSummary';
import { useThemeMode } from '@/theme';

type SessionSkillSummaryCardProps = {
  lessonId: string;
};

/**
 * Session closure: name the skill gained this session (Perplexity Week-1 #1).
 */
export function SessionSkillSummaryCard({ lessonId }: SessionSkillSummaryCardProps) {
  const { tokens, t } = useThemeMode();
  const summary = resolveSessionSkillSummary(lessonId);
  const isFocus = tokens.presentation.orbStyle === 'minimal';

  return (
    <Card variant="solid" style={{ alignSelf: 'stretch', width: '100%' }}>
      <View style={{ gap: isFocus ? tokens.spacing.space1 : tokens.spacing.space2 }}>
        <Text
          style={{
            color: tokens.colors.accent.structure,
            fontFamily: tokens.typography.fontFamily.bodyMedium,
            fontSize: tokens.typography.fontSize.bodySm,
            textTransform: 'uppercase',
          }}>
          {t('sessionSkill.eyebrow')}
        </Text>
        <Text
          style={{
            color: tokens.colors.text.primary,
            fontFamily: tokens.typography.fontFamily.heading,
            fontSize: tokens.typography.fontSize.headingMd,
          }}>
          {t(summary.nameKey)}
        </Text>
        <Text
          style={{
            color: tokens.colors.text.secondary,
            fontFamily: tokens.typography.fontFamily.body,
            fontSize: tokens.typography.fontSize.bodyMd,
            lineHeight: tokens.typography.fontSize.bodyMd * 1.45,
          }}>
          {t(summary.proofKey)}
        </Text>
        <Text
          style={{
            color: tokens.colors.text.tertiary,
            fontFamily: tokens.typography.fontFamily.body,
            fontSize: tokens.typography.fontSize.bodySm,
            lineHeight: tokens.typography.fontSize.bodySm * 1.45,
          }}>
          {t('sessionSkill.comeBackTomorrow')}
        </Text>
      </View>
    </Card>
  );
}
