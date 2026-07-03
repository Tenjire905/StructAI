import { Text, View } from 'react-native';

import { OrbCompanion } from '@/components/features/OrbCompanion';
import { Button } from '@/components/ui';
import { useOrbCompanionState } from '@/hooks/useOrbCompanionState';
import { useThemeMode } from '@/theme';

export type RetryPromptViewProps = {
  correctCount: number;
  gradedCount: number;
  onRetry: () => void;
  onContinueLater: () => void;
};

export function RetryPromptView({
  correctCount,
  gradedCount,
  onRetry,
  onContinueLater,
}: RetryPromptViewProps) {
  const { tokens, t } = useThemeMode();
  const companionState = useOrbCompanionState('attentive');

  return (
    <View
      style={{
        alignItems: 'center',
        backgroundColor: tokens.colors.background.base,
        flex: 1,
        gap: tokens.spacing.space5,
        justifyContent: 'center',
        paddingHorizontal: tokens.spacing.screenPadding,
      }}>
      <View
        style={{
          alignItems: 'center',
          backgroundColor: tokens.colors.surface.card,
          borderRadius: tokens.radius.pill,
          height: tokens.spacing.space8,
          justifyContent: 'center',
          width: tokens.spacing.space8,
        }}>
        <OrbCompanion size={tokens.spacing.space8 * 0.75} state={companionState} />
      </View>

      <Text
        style={{
          color: tokens.colors.text.primary,
          fontFamily: tokens.typography.fontFamily.display,
          fontSize: tokens.typography.fontSize.displayLg,
          textAlign: 'center',
        }}>
        {t('lesson.retryTitle')}
      </Text>

      <Text
        style={{
          color: tokens.colors.text.secondary,
          fontFamily: tokens.typography.fontFamily.body,
          fontSize: tokens.typography.fontSize.bodyLg,
          lineHeight: tokens.typography.fontSize.bodyLg * 1.5,
          textAlign: 'center',
        }}>
        {t('lesson.retrySummary', {
          correct: correctCount,
          total: gradedCount,
        })}
      </Text>

      <View
        style={{
          alignSelf: 'stretch',
          gap: tokens.spacing.space3,
          width: '100%',
        }}>
        <Button
          label={t('lesson.retryPrimary')}
          onPress={onRetry}
          style={{ alignSelf: 'stretch' }}
          variant="primary"
        />
        <Button
          label={t('lesson.retrySecondary')}
          onPress={onContinueLater}
          style={{ alignSelf: 'stretch' }}
          variant="ghost"
        />
      </View>
    </View>
  );
}
