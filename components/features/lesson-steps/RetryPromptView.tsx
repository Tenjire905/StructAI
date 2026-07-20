import { Text, View } from 'react-native';

import { OrbPresence } from '@/components/features/OrbPresence';
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
  const companionState = useOrbCompanionState('worry');

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
      <OrbPresence
        showSpeech
        size={tokens.spacing.space8 * 0.85}
        speechKey="orb.speech.lessonRetry"
        speechSeed={gradedCount}
        state={companionState}
      />

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
