import { useRouter } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { OnboardingChrome } from '@/components/features/onboarding/OnboardingChrome';
import { OrbPresence } from '@/components/features/OrbPresence';
import { useOrbCompanionState } from '@/hooks/useOrbCompanionState';
import { playSfx } from '@/lib/sfx';
import { useThemeMode } from '@/theme';

/**
 * Jimbo/Liftoff coach meet: Orb + speech bubble, one affirmative CTA.
 * Keeps one idea per beat (hello → ready) before mode pick.
 */
export default function OnboardingMeetScreen() {
  const { tokens, t } = useThemeMode();
  const router = useRouter();
  const [beat, setBeat] = useState<'hello' | 'ready'>('hello');
  const companionState = useOrbCompanionState(beat === 'hello' ? 'attentive' : 'happy');
  const soundEnabled = tokens.presentation.soundEnabled;
  const speechKey =
    beat === 'hello'
      ? 'orb.speech.onboarding.welcome'
      : 'orb.speech.onboarding.meetReady';

  return (
    <OnboardingChrome
      ctaLabel={
        beat === 'hello' ? t('onboarding.meetCta') : t('onboarding.meetReadyCta')
      }
      onCta={() => {
        playSfx(beat === 'hello' ? 'tap' : 'success', soundEnabled);
        if (beat === 'hello') {
          setBeat('ready');
          return;
        }
        router.push('/onboarding/modus');
      }}
      onSkip={() => {
        playSfx('tap', soundEnabled);
        router.push('/onboarding/modus');
      }}
      progressStep={1}
      skipLabel={t('onboarding.skip')}>
      <View
        style={{
          alignItems: 'center',
          flex: 1,
          justifyContent: 'center',
          paddingBottom: tokens.spacing.space6,
        }}>
        <OrbPresence
          interaction={beat === 'hello' ? 'enter' : 'react'}
          layout="hero"
          showSpeech
          size={tokens.spacing.space8 * 1.55}
          speechKey={speechKey}
          state={companionState}
        />
      </View>
    </OnboardingChrome>
  );
}
