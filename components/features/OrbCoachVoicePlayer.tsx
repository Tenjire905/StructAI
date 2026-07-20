/**
 * Expo voiceover player — official useAudioPlayer + downloadFirst.
 * Only imported when expo-audio native module can load.
 */

import {
  setAudioModeAsync,
  setIsAudioActiveAsync,
  useAudioPlayer,
  useAudioPlayerStatus,
} from 'expo-audio';
import { useEffect, useRef } from 'react';

type OrbCoachVoicePlayerProps = {
  /** Metro asset module id from require(...mp3). */
  source: number;
  /** Stable id for this line (key+locale+mode). */
  playId: string;
  /** Increment to force replay (e.g. orb tap). */
  replayNonce?: number;
};

export function OrbCoachVoicePlayer({
  source,
  playId,
  replayNonce = 0,
}: OrbCoachVoicePlayerProps) {
  const player = useAudioPlayer(source, { downloadFirst: true, updateInterval: 200 });
  const status = useAudioPlayerStatus(player);
  const startedFor = useRef<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      try {
        await setIsAudioActiveAsync(true);
        await setAudioModeAsync({
          playsInSilentMode: true,
          interruptionMode: 'duckOthers',
          shouldPlayInBackground: false,
          allowsRecording: false,
        });
      } catch {
        // best-effort
      }

      if (cancelled) {
        return;
      }

      const token = `${playId}#${replayNonce}`;
      // Wait briefly for downloadFirst / isLoaded
      for (let i = 0; i < 20 && !cancelled; i += 1) {
        if (player.isLoaded || status.isLoaded) {
          break;
        }
        await new Promise((r) => setTimeout(r, 50));
      }

      if (cancelled) {
        return;
      }

      startedFor.current = token;
      try {
        await player.seekTo(0);
      } catch {
        // ignore
      }
      try {
        player.volume = 1;
        player.muted = false;
        player.play();
      } catch {
        // ignore
      }
    };

    const timer = setTimeout(() => {
      void run();
    }, 60);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
    // Intentionally do not pause on cleanup — Strict Mode was killing audio.
    // Parent unmount / new playId remounts a fresh player instead.
  }, [playId, player, replayNonce, source, status.isLoaded]);

  return null;
}
