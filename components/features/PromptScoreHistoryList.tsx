import { Text, View } from 'react-native';

import { Badge, Card, PressableScale } from '@/components/ui';
import type { PromptScoreHistoryEntry } from '@/lib/progressTypes';
import { useThemeMode } from '@/theme';

type PromptScoreHistoryListProps = {
  entries: PromptScoreHistoryEntry[];
  onSelectPrompt: (prompt: string) => void;
};

/**
 * Lists recent scored prompts (newest first) so users can reload past inputs.
 */
export function PromptScoreHistoryList({
  entries,
  onSelectPrompt,
}: PromptScoreHistoryListProps) {
  const { tokens, t } = useThemeMode();
  const ordered = [...entries].reverse();

  if (ordered.length === 0) {
    return (
      <Text
        style={{
          color: tokens.colors.text.secondary,
          fontFamily: tokens.typography.fontFamily.body,
          fontSize: tokens.typography.fontSize.bodySm,
          lineHeight: tokens.typography.fontSize.bodySm * 1.45,
        }}>
        {t('promptLab.promptHistoryEmpty')}
      </Text>
    );
  }

  return (
    <View style={{ gap: tokens.spacing.space2 }}>
      {ordered.map((entry, index) => {
        const promptText = entry.prompt?.trim() ?? '';
        const hasPrompt = promptText.length > 0;
        const key = `${entry.recordedAt}-${entry.score}-${index}`;

        return (
          <PressableScale
            accessibilityHint={
              hasPrompt ? t('promptLab.promptHistoryReuseHint') : undefined
            }
            accessibilityLabel={t('promptLab.promptHistoryItemA11y', {
              score: entry.score,
            })}
            accessibilityRole={hasPrompt ? 'button' : 'text'}
            disabled={!hasPrompt}
            key={key}
            onPress={() => {
              if (hasPrompt) {
                onSelectPrompt(promptText);
              }
            }}>
            <Card variant="solid">
              <View style={{ gap: tokens.spacing.space2 }}>
                <View
                  style={{
                    alignItems: 'center',
                    flexDirection: 'row',
                    gap: tokens.spacing.space2,
                    justifyContent: 'space-between',
                  }}>
                  <Badge
                    label={t('promptLab.promptHistoryScore', { score: entry.score })}
                    tone="structure"
                  />
                  {hasPrompt ? (
                    <Text
                      style={{
                        color: tokens.colors.text.tertiary,
                        fontFamily: tokens.typography.fontFamily.body,
                        fontSize: tokens.typography.fontSize.bodySm,
                      }}>
                      {t('promptLab.promptHistoryTapReuse')}
                    </Text>
                  ) : null}
                </View>
                <Text
                  numberOfLines={3}
                  style={{
                    color: hasPrompt
                      ? tokens.colors.text.primary
                      : tokens.colors.text.tertiary,
                    fontFamily: tokens.typography.fontFamily.body,
                    fontSize: tokens.typography.fontSize.bodyMd,
                    lineHeight: tokens.typography.fontSize.bodyMd * 1.45,
                  }}>
                  {hasPrompt ? promptText : t('promptLab.promptHistoryMissing')}
                </Text>
              </View>
            </Card>
          </PressableScale>
        );
      })}
    </View>
  );
}
