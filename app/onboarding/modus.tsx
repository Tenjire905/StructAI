import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';

import { OrbIcon } from '@/components/features';
import { Button, PressableScale, ProgressBar } from '@/components/ui';
import { setOnboardingCompleted } from '@/lib/appStorage';
import { ThemeModeScope, useThemeMode, type ThemeMode } from '@/theme';

export default function OnboardingModusScreen() {
  const { tokens, t, setMode } = useThemeMode();
  const router = useRouter();
  const [selectedMode, setSelectedMode] = useState<ThemeMode | null>(null);

  const handleConfirm = () => {
    if (!selectedMode) {
      return;
    }

    setMode(selectedMode);
    setOnboardingCompleted();
    router.replace('/');
  };

  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        gap: tokens.spacing.space5,
        justifyContent: 'center',
        paddingBottom: tokens.spacing.space7,
        paddingHorizontal: tokens.spacing.screenPaddingHero,
        paddingTop: tokens.spacing.space7,
      }}
      style={{ backgroundColor: tokens.colors.background.base, flex: 1 }}>
      <Text
        style={{
          color: tokens.colors.text.primary,
          fontFamily: tokens.typography.fontFamily.display,
          fontSize: tokens.typography.fontSize.displayLg,
          lineHeight: tokens.typography.fontSize.displayLg * 1.2,
        }}>
        {t('onboarding.modeQuestion')}
      </Text>

      <View style={{ flexDirection: 'row', gap: tokens.spacing.space3 }}>
        <ModePreviewCard
          isSelected={selectedMode === 'playful'}
          label={t('profile.modePlayful')}
          mode="playful"
          onSelect={() => setSelectedMode('playful')}
        />
        <ModePreviewCard
          isSelected={selectedMode === 'focus'}
          label={t('profile.modeFocus')}
          mode="focus"
          onSelect={() => setSelectedMode('focus')}
        />
      </View>

      <Text
        style={{
          color: tokens.colors.text.secondary,
          fontFamily: tokens.typography.fontFamily.body,
          fontSize: tokens.typography.fontSize.bodyMd,
          lineHeight: tokens.typography.fontSize.bodyMd * 1.5,
        }}>
        {t('onboarding.modeHint')}
      </Text>

      <Button
        disabled={selectedMode === null}
        label={t('onboarding.modeCta')}
        onPress={handleConfirm}
        variant="primary"
      />
    </ScrollView>
  );
}

type ModePreviewCardProps = {
  mode: ThemeMode;
  label: string;
  isSelected: boolean;
  onSelect: () => void;
};

/**
 * Miniatur des Home-Screens im jeweiligen Modus (THEME_MODES.md Abschnitt 4).
 * Rendert innerhalb eines ThemeModeScope, damit Farben, Radius und Copy
 * authentisch aus dem jeweiligen Modus kommen.
 */
function ModePreviewCard({ mode, label, isSelected, onSelect }: ModePreviewCardProps) {
  const { tokens: outerTokens } = useThemeMode();

  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityState={{ selected: isSelected }}
      onPress={onSelect}
      style={{ flex: 1, gap: outerTokens.spacing.space2 }}>
      <View
        style={{
          borderColor: isSelected
            ? outerTokens.colors.accent.primary
            : outerTokens.colors.border.subtle,
          borderRadius: outerTokens.radius.lg,
          borderWidth: 2,
          overflow: 'hidden',
        }}>
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
