import { Text, View } from 'react-native';

import { ProgressBar } from '@/components/ui';
import type { SkillRankProgress } from '@/lib/skillRank';
import { useThemeMode } from '@/theme';

type SkillRankStripProps = {
  progress: SkillRankProgress;
  /** Compact for Home header; detailed for Profile. */
  variant?: 'compact' | 'detailed';
};

/**
 * Soft XP / rank readout — derived from lessons + orbs, not a second currency.
 */
export function SkillRankStrip({
  progress,
  variant = 'compact',
}: SkillRankStripProps) {
  const { tokens, t } = useThemeMode();
  const isDetailed = variant === 'detailed';

  return (
    <View
      style={{
        backgroundColor: tokens.colors.surface.card,
        borderColor: tokens.colors.border.subtle,
        borderRadius: tokens.radius.lg,
        borderWidth: 1,
        gap: tokens.spacing.space2,
        padding: tokens.spacing.space4,
      }}>
      <View
        style={{
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'space-between',
          gap: tokens.spacing.space3,
        }}>
        <View style={{ flex: 1, gap: tokens.spacing.space1 }}>
          <Text
            style={{
              color: tokens.colors.text.tertiary,
              fontFamily: tokens.typography.fontFamily.body,
              fontSize: tokens.typography.fontSize.bodySm,
              textTransform: 'uppercase',
            }}>
            {t('skillRank.eyebrow')}
          </Text>
          <Text
            style={{
              color: tokens.colors.text.primary,
              fontFamily: tokens.typography.fontFamily.heading,
              fontSize: isDetailed
                ? tokens.typography.fontSize.headingMd
                : tokens.typography.fontSize.bodyLg,
            }}>
            {t(progress.rankCopyKey)}
          </Text>
        </View>
        <Text
          style={{
            color: tokens.colors.accent.structure,
            fontFamily: tokens.typography.fontFamily.mono,
            fontSize: tokens.typography.fontSize.headingMd,
          }}>
          {t('skillRank.level', { level: progress.level })}
        </Text>
      </View>

      <ProgressBar color="structure" progress={progress.progress} />

      <Text
        style={{
          color: tokens.colors.text.secondary,
          fontFamily: tokens.typography.fontFamily.body,
          fontSize: tokens.typography.fontSize.bodySm,
        }}>
        {t('skillRank.xpProgress', {
          current: progress.xpIntoLevel,
          next: progress.xpForNextLevel,
        })}
      </Text>

      {isDetailed ? (
        <Text
          style={{
            color: tokens.colors.text.tertiary,
            fontFamily: tokens.typography.fontFamily.body,
            fontSize: tokens.typography.fontSize.bodySm,
            lineHeight: tokens.typography.fontSize.bodySm * 1.4,
          }}>
          {t('skillRank.totalXp', { xp: progress.xp })}
        </Text>
      ) : null}
    </View>
  );
}
