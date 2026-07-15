import { Text, View } from 'react-native';

import { OrbIcon } from '@/components/features';
import { PressableScale, ProgressBar } from '@/components/ui';
import { Badge } from '@/components/ui/Badge';
import { getShadow, ThemeModeScope, useThemeMode, type ThemeMode } from '@/theme';

type ModePreviewCardProps = {
  mode: ThemeMode;
  label: string;
  isSelected: boolean;
  onSelect: () => void;
  recommended?: boolean;
  recommendCopy?: string;
};

/**
 * Miniatur des Home-Screens im jeweiligen Modus (THEME_MODES.md Abschnitt 4).
 */
export function ModePreviewCard({
  mode,
  label,
  isSelected,
  onSelect,
  recommended = false,
  recommendCopy,
}: ModePreviewCardProps) {
  const { tokens: outerTokens, t } = useThemeMode();
  const showRecommendation = recommended && mode === 'playful';

  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityState={{ selected: isSelected }}
      onPress={onSelect}
      style={{ flex: 1, gap: outerTokens.spacing.space2 }}>
      <View
        style={[
          showRecommendation ? getShadow('glow') : undefined,
          {
            borderColor: isSelected
              ? outerTokens.colors.accent.primary
              : showRecommendation
                ? outerTokens.colors.accent.primary
                : outerTokens.colors.border.subtle,
            borderRadius: outerTokens.radius.lg,
            borderWidth: showRecommendation ? 2 : isSelected ? 2 : 1,
            overflow: 'hidden',
          },
        ]}>
        {showRecommendation ? (
          <View
            style={{
              left: outerTokens.spacing.space2,
              position: 'absolute',
              top: outerTokens.spacing.space2,
              zIndex: 1,
            }}>
            <Badge label={t('onboarding.profilePlayfulBadge')} tone="primary" />
          </View>
        ) : null}
        <ThemeModeScope mode={mode}>
          <MiniHomePreview />
        </ThemeModeScope>
      </View>
      <Text
        style={{
          color: isSelected
            ? outerTokens.colors.text.primary
            : outerTokens.colors.text.secondary,
          fontFamily: outerTokens.typography.fontFamily.bodyMedium,
          fontSize: outerTokens.typography.fontSize.bodyMd,
          textAlign: 'center',
        }}>
        {label}
      </Text>
      {showRecommendation && recommendCopy ? (
        <Text
          style={{
            color: outerTokens.colors.accent.primary,
            fontFamily: outerTokens.typography.fontFamily.body,
            fontSize: outerTokens.typography.fontSize.bodySm,
            lineHeight: outerTokens.typography.fontSize.bodySm * 1.4,
            textAlign: 'center',
          }}>
          {recommendCopy}
        </Text>
      ) : null}
    </PressableScale>
  );
}

function MiniHomePreview() {
  const { tokens, t } = useThemeMode();
  const isPlayful = tokens.presentation.orbStyle === 'illustrated';
  const streakDays = [true, true, true, false, false, false, false];

  return (
    <View
      style={{
        backgroundColor: tokens.colors.background.base,
        gap: tokens.spacing.space2,
        padding: tokens.spacing.space3,
        paddingTop: tokens.spacing.space5,
      }}>
      <View
        style={{
          alignItems: 'center',
          flexDirection: 'row',
          gap: tokens.spacing.space2,
          justifyContent: 'space-between',
        }}>
        <Text
          numberOfLines={2}
          style={{
            color: tokens.colors.text.primary,
            flexShrink: 1,
            fontFamily: tokens.typography.fontFamily.heading,
            fontSize: tokens.typography.fontSize.bodySm,
          }}>
          {t('home.greeting', { name: 'Alex' })}
        </Text>

        {isPlayful ? (
          <OrbIcon size={tokens.icons.sizes.md} />
        ) : (
          <View
            style={{
              alignItems: 'center',
              borderColor: tokens.colors.accent.primary,
              borderRadius: tokens.radius.pill,
              borderWidth: 2,
              height: tokens.icons.sizes.md,
              justifyContent: 'center',
              width: tokens.icons.sizes.md,
            }}>
            <Text
              style={{
                color: tokens.colors.text.secondary,
                fontFamily: tokens.typography.fontFamily.mono,
                fontSize: 7,
              }}>
              71
            </Text>
          </View>
        )}
      </View>

      <View style={{ flexDirection: 'row', gap: tokens.spacing.space1 }}>
        {streakDays.map((completed, index) => (
          <View
            key={index}
            style={{
              backgroundColor: completed
                ? tokens.colors.accent.primary
                : tokens.colors.surface.card,
              borderRadius: isPlayful ? tokens.radius.sm / 2 : tokens.spacing.space1 / 2,
              flex: 1,
              height: tokens.spacing.space2,
            }}
          />
        ))}
      </View>

      <View
        style={{
          backgroundColor: tokens.colors.surface.card,
          borderRadius: tokens.presentation.preferredCardRadius / 2,
          gap: tokens.spacing.space1,
          padding: tokens.spacing.space2,
        }}>
        <Text
          numberOfLines={1}
          style={{
            color: tokens.colors.text.primary,
            fontFamily: tokens.typography.fontFamily.heading,
            fontSize: tokens.typography.fontSize.bodySm,
          }}>
          {t('onboarding.previewPathTitle')}
        </Text>
        <Text
          numberOfLines={1}
          style={{
            color: tokens.colors.text.secondary,
            fontFamily: tokens.typography.fontFamily.body,
            fontSize: 9,
          }}>
          {t('pathCard.chapters', { current: 3, total: 8 })}
        </Text>
        <ProgressBar color="structure" height={4} progress={0.42} />
      </View>
    </View>
  );
}
