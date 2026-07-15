import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';

import { Button } from '@/components/ui';
import { useThemeMode, type ThemeMode } from '@/theme';

import { ModePreviewCard } from '@/components/features/onboarding/ModePreviewCard';

export default function OnboardingModusScreen() {
  const { tokens, t, setMode } = useThemeMode();
  const router = useRouter();
  const [selectedMode, setSelectedMode] = useState<ThemeMode | null>(null);

  const handleConfirm = () => {
    if (!selectedMode) {
      return;
    }

    setMode(selectedMode);
    router.push('/onboarding/loop');
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
