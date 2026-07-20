/**
 * Expo-Go voiceover player — only loaded when ExpoAudio native module exists.
 * Uses the official `useAudioPlayer` hook (more reliable than createAudioPlayer).
 */

import {
  setAudioModeAsync,
  setIsAudioActiveAsync,
  useAudioPlayer,
} from 'expo-audio';
import { useEffect, useRef } from 'react';

type OrbCoachVoicePlayerProps = {
  /** Metro asset module id from require(...mp3). */
  source: number;
  /** Change this to force replay of the same source. */
  playId: string;
};

/**
 * Plays a bundled MP3 once when `playId` / `source` changes.
 * Does not tear down mid-play on React Strict Mode double-invoke of parents
 * beyond pausing; remount with same playId will seek+play again.
 */
export function OrbCoachVoicePlayer({ source, playId }: OrbCoachVoicePlayerProps) {
  const player = useAudioPlayer(source);
  const lastPlayId = useRef<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      try {
        await setIsAudioActiveAsync(true);
        await setAudioModeAsync({
          playsInSilentMode: true,
          interruptionMode: 'duckOthers',
          shouldPlayInBackground: false,
        });
      } catch {
        // Continue — mode setup is best-effort.
      }

      if (cancelled) {
        return;
      }

      lastPlayId.current = playId;
      try {
        await player.seekTo(0);
      } catch {
        // ignore
      }
      if (cancelled) {
        return;
      }
      try {
        player.volume = 1;
        player.play();
      } catch {
        // ignore
      }
    };

    // Short defer so the native player finishes binding the source.
    const timer = setTimeout(() => {
      void run();
    }, 80);

    return () => {
      cancelled = true;
      clearTimeout(timer);
      try {
        player.pause();
      } catch {
        // ignore
      }
    };
  }, [playId, player, source]);

  return null;
}
