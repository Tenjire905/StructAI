import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';

import { ModePreviewCard } from '@/components/features/onboarding/ModePreviewCard';
import { OnboardingChrome } from '@/components/features/onboarding/OnboardingChrome';
import { OrbPresence } from '@/components/features/OrbPresence';
import { useOrbCompanionState } from '@/hooks/useOrbCompanionState';
import { playSfx } from '@/lib/sfx';
import { useThemeMode, type ThemeMode } from '@/theme';

/**
 * Mode pick — Orb coaches the choice (Liftoff Q&A chrome).
 */
export default function OnboardingModusScreen() {
  const { tokens, t, setMode } = useThemeMode();
  const router = useRouter();
  const [selectedMode, setSelectedMode] = useState<ThemeMode | null>(null);
  const companionState = useOrbCompanionState(selectedMode ? 'happy' : 'attentive');
  const soundEnabled = tokens.presentation.soundEnabled;
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

    playSfx('success', soundEnabled);
    setMode(selectedMode);
    router.push('/onboarding/loop');
  };

  return (
    <OnboardingChrome
      ctaDisabled={selectedMode === null}
      ctaLabel={t('onboarding.modeCta')}
      onCta={handleConfirm}
      onSkip={() => {
        playSfx('tap', soundEnabled);
        setMode('playful');
        router.push('/onboarding/loop');
      }}
      progressStep={2}
      skipLabel={t('onboarding.skip')}>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          gap: tokens.spacing.space5,
          justifyContent: 'center',
          paddingBottom: tokens.spacing.space4,
        }}
        showsVerticalScrollIndicator={false}
        style={{ flex: 1 }}>
        <OrbPresence
          interaction={selectedMode ? 'react' : 'enter'}
          layout="hero"
          showSpeech
          size={tokens.spacing.space8 * 1.15}
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
            onSelect={() => {
              playSfx('tap', soundEnabled);
              setSelectedMode('playful');
            }}
          />
          <ModePreviewCard
            isSelected={selectedMode === 'focus'}
            label={t('profile.modeFocus')}
            mode="focus"
            onSelect={() => {
              playSfx('tap', soundEnabled);
              setSelectedMode('focus');
            }}
          />
        </View>
      </ScrollView>
    </OnboardingChrome>
  );
}
