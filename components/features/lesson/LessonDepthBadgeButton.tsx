import { Text, View } from 'react-native';

import { AutoDismissPeek } from '@/components/ui/AutoDismissPeek';
import { Badge, Card, PressableScale } from '@/components/ui';
import { getProfileAge } from '@/lib/appStorage';
import type { LessonDepthBadge } from '@/data/mockLessons.resolved.types';
import { isPlayfulModeRecommended } from '@/lib/userProfile';
import { useThemeMode } from '@/theme';

type LessonDepthBadgeChipProps = {
  depthBadge: LessonDepthBadge;
  onPress: () => void;
};

export function LessonDepthBadgeChip({ depthBadge, onPress }: LessonDepthBadgeChipProps) {
  const { t } = useThemeMode();
  const isPlayful = depthBadge === 'playful';

  return (
    <PressableScale
      accessibilityHint={t('lesson.depthInfoAccessibilityHint')}
      accessibilityLabel={isPlayful ? t('lesson.depthBadgePlayful') : t('lesson.depthBadgeFocus')}
      accessibilityRole="button"
      onPress={onPress}>
      <Badge
        label={isPlayful ? t('lesson.depthBadgePlayful') : t('lesson.depthBadgeFocus')}
        tone={isPlayful ? 'structure' : 'primary'}
      />
    </PressableScale>
  );
}

type LessonDepthInfoPeekProps = {
  depthBadge: LessonDepthBadge;
  visible: boolean;
  revealNonce?: number;
  onDismiss: () => void;
};

export function LessonDepthInfoPeek({
  depthBadge,
  visible,
  revealNonce = 0,
  onDismiss,
}: LessonDepthInfoPeekProps) {
  const { tokens, t } = useThemeMode();
  const profileAge = getProfileAge();
  const ageRecommendedPlayful = isPlayfulModeRecommended(profileAge ?? null);
  const isPlayful = depthBadge === 'playful';

  return (
    <AutoDismissPeek
      maxHeight={220}
      onDismiss={onDismiss}
      revealNonce={revealNonce}
      visible={visible}>
      <Card variant="solid">
        <View style={{ gap: tokens.spacing.space2 }}>
          <Text
            style={{
              color: tokens.colors.text.primary,
              fontFamily: tokens.typography.fontFamily.heading,
              fontSize: tokens.typography.fontSize.bodyMd,
            }}>
            {t('lesson.depthInfoTitle')}
          </Text>
          <Text
            style={{
              color: tokens.colors.text.secondary,
              fontFamily: tokens.typography.fontFamily.body,
              fontSize: tokens.typography.fontSize.bodySm,
              lineHeight: tokens.typography.fontSize.bodySm * 1.5,
            }}>
            {isPlayful ? t('lesson.depthInfoBodyPlayful') : t('lesson.depthInfoBodyFocus')}
          </Text>
          <Text
            style={{
              color: tokens.colors.text.tertiary,
              fontFamily: tokens.typography.fontFamily.body,
              fontSize: tokens.typography.fontSize.bodySm,
              lineHeight: tokens.typography.fontSize.bodySm * 1.45,
            }}>
            {ageRecommendedPlayful
              ? t('lesson.depthInfoAgeRecommended')
              : t('lesson.depthInfoSettingsHint')}
          </Text>
        </View>
      </Card>
    </AutoDismissPeek>
  );
}
