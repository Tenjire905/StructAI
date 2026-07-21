import { Text, View } from 'react-native';

import { Button, Card } from '@/components/ui';
import type { DailyChallenge } from '@/lib/dailyChallenge';
import { FIRST_SESSION_PROOF_SKILL_COPY_KEY, getFirstSessionProofSkillKey } from '@/lib/appStorage';
import { useThemeMode } from '@/theme';

type HomeDailyChallengeCardProps = {
  challenge: DailyChallenge;
  onStart: () => void;
};

/**
 * One clear job today — primary Home CTA above path browsing.
 * Reuses Card + Button; no new card system.
 * Week-1 proofReuse framing ties the CTA to the first-session skill claim.
 */
export function HomeDailyChallengeCard({ challenge, onStart }: HomeDailyChallengeCardProps) {
  const { tokens, t } = useThemeMode();
  const isFocus = tokens.presentation.orbStyle === 'minimal';
  const isProofReuse = challenge.framing === 'proofReuse';
  const skillKey = getFirstSessionProofSkillKey() ?? FIRST_SESSION_PROOF_SKILL_COPY_KEY;

  const eyebrow = isProofReuse
    ? t('home.dailyChallenge.eyebrowProofReuse')
    : t('home.dailyChallenge.eyebrow');
  const title = isProofReuse
    ? t('home.dailyChallenge.titleProofReuse')
    : t('home.dailyChallenge.title');
  const body = isProofReuse
    ? t('home.dailyChallenge.bodyProofReuse', {
        path: t(challenge.pathTitleKey),
        skill: t(skillKey),
      })
    : challenge.isFreshStart
      ? t('home.dailyChallenge.bodyFresh', { path: t(challenge.pathTitleKey) })
      : t('home.dailyChallenge.bodyContinue', { path: t(challenge.pathTitleKey) });
  const cta = isProofReuse
    ? t('home.dailyChallenge.ctaProofReuse')
    : challenge.isFreshStart
      ? t('home.dailyChallenge.ctaFresh')
      : t('home.dailyChallenge.ctaContinue');

  return (
    <Card variant="solid">
      <View style={{ gap: isFocus ? tokens.spacing.space2 : tokens.spacing.space3 }}>
        <Text
          style={{
            color: tokens.colors.accent.structure,
            fontFamily: tokens.typography.fontFamily.bodyMedium,
            fontSize: tokens.typography.fontSize.bodySm,
          }}>
          {eyebrow}
        </Text>

        <Text
          style={{
            color: tokens.colors.text.primary,
            fontFamily: tokens.typography.fontFamily.heading,
            fontSize: tokens.typography.fontSize.headingMd,
          }}>
          {title}
        </Text>

        <Text
          style={{
            color: tokens.colors.text.secondary,
            fontFamily: tokens.typography.fontFamily.body,
            fontSize: tokens.typography.fontSize.bodyMd,
            lineHeight: tokens.typography.fontSize.bodyMd * 1.5,
          }}>
          {body}
        </Text>

        <Button label={cta} onPress={onStart} variant="primary" />
      </View>
    </Card>
  );
}
