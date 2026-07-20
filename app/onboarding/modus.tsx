import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';

import { ModePreviewCard } from '@/components/features/onboarding/ModePreviewCard';
import { OrbPresence } from '@/components/features/OrbPresence';
import { Button } from '@/components/ui';
import { useOrbCompanionState } from '@/hooks/useOrbCompanionState';
import { useThemeMode, type ThemeMode } from '@/theme';

/**
 * Mode pick — Orb coaches the choice (reacts when you select).
 */
export default function OnboardingModusScreen() {
  const { tokens, t, setMode } = useThemeMode();
  const router = useRouter();
  const [selectedMode, setSelectedMode] = useState<ThemeMode | null>(null);
  const companionState = useOrbCompanionState(selectedMode ? 'happy' : 'attentive');
  const speechKey =
    selectedMode === 'playful'
      ? 'orb.speech.onboarding.modePlayful'
      : selectedMode === 'focus'
        ? 'orb.speech.onboarding.modeFocus'
        : 'orb.speech.onboarding.mode';

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
      <OrbPresence
        interaction={selectedMode ? 'react' : 'enter'}
        layout="hero"
        showSpeech
        size={tokens.spacing.space8 * 1.25}
        speechKey={speechKey}
        state={companionState}
      />

      <Text
        style={{
          color: tokens.colors.text.primary,
          fontFamily: tokens.typography.fontFamily.display,
          fontSize: tokens.typography.fontSize.headingLg,
          lineHeight: tokens.typography.fontSize.headingLg * 1.25,
          textAlign: 'center',
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

      <Button
        disabled={selectedMode === null}
        label={t('onboarding.modeCta')}
        onPress={handleConfirm}
        variant="primary"
      />
    </ScrollView>
  );
}
