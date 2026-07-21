import { Text, View } from 'react-native';

import { Button, Card } from '@/components/ui';
import type { DailyChallenge } from '@/lib/dailyChallenge';
import { useThemeMode } from '@/theme';

type HomeDailyChallengeCardProps = {
  challenge: DailyChallenge;
  onStart: () => void;
};

/**
 * One clear job today — primary Home CTA above path browsing.
 * Reuses Card + Button; no new card system.
 */
export function HomeDailyChallengeCard({ challenge, onStart }: HomeDailyChallengeCardProps) {
  const { tokens, t } = useThemeMode();
  const isFocus = tokens.presentation.orbStyle === 'minimal';

  return (
    <Card variant="solid">
      <View style={{ gap: isFocus ? tokens.spacing.space2 : tokens.spacing.space3 }}>
        <Text
          style={{
            color: tokens.colors.accent.structure,
            fontFamily: tokens.typography.fontFamily.bodyMedium,
            fontSize: tokens.typography.fontSize.bodySm,
          }}>
          {t('home.dailyChallenge.eyebrow')}
        </Text>

        <Text
          style={{
            color: tokens.colors.text.primary,
            fontFamily: tokens.typography.fontFamily.heading,
            fontSize: tokens.typography.fontSize.headingMd,
          }}>
          {t('home.dailyChallenge.title')}
        </Text>

        <Text
          style={{
            color: tokens.colors.text.secondary,
            fontFamily: tokens.typography.fontFamily.body,
            fontSize: tokens.typography.fontSize.bodyMd,
            lineHeight: tokens.typography.fontSize.bodyMd * 1.5,
          }}>
          {challenge.isFreshStart
            ? t('home.dailyChallenge.bodyFresh', { path: t(challenge.pathTitleKey) })
            : t('home.dailyChallenge.bodyContinue', { path: t(challenge.pathTitleKey) })}
        </Text>

        <Button
          label={
            challenge.isFreshStart
              ? t('home.dailyChallenge.ctaFresh')
              : t('home.dailyChallenge.ctaContinue')
          }
          onPress={onStart}
          variant="primary"
        />
      </View>
    </Card>
  );
}
