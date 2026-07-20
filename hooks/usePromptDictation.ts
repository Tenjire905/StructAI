import { isRunningInExpoGo } from 'expo';
import { requireOptionalNativeModule } from 'expo-modules-core';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Platform } from 'react-native';

import type { Locale } from '@/theme/locale';

export type PromptDictationStatus =
  | 'unavailable'
  | 'idle'
  | 'requesting'
  | 'listening'
  | 'error';

export type PromptDictationState = {
  status: PromptDictationStatus;
  isListening: boolean;
  errorKey: string | null;
  available: boolean;
  toggle: () => Promise<void>;
  stop: () => void;
};

function localeToSpeechLang(locale: Locale): string {
  switch (locale) {
    case 'en':
      return 'en-US';
    case 'fr':
      return 'fr-FR';
    case 'ru':
      return 'ru-RU';
    case 'de':
    default:
      return 'de-DE';
  }
}

type SpeechModule = typeof import('expo-speech-recognition');

let speechModulePromise: Promise<SpeechModule | null> | null = null;

/**
 * Expo Go / older native builds do not ship ExpoSpeechRecognition.
 * Importing expo-speech-recognition there throws Uncaught Error at module init —
 * so we probe the native module first and never load the JS package without it.
 */
function canUseNativeSpeechRecognition(): boolean {
  if (isRunningInExpoGo()) {
    return false;
  }

  try {
    return requireOptionalNativeModule('ExpoSpeechRecognition') != null;
  } catch {
    return false;
  }
}

async function loadSpeechModule(): Promise<SpeechModule | null> {
  if (!canUseNativeSpeechRecognition()) {
    return null;
  }

  if (!speechModulePromise) {
    speechModulePromise = import('expo-speech-recognition')
      .then((mod) => mod)
      .catch(() => null);
  }

  return speechModulePromise;
}

/**
 * Prompt Lab dictation via expo-speech-recognition when the native module exists.
 * Expo Go stays crash-free and shows an unavailable hint instead.
 */
export function usePromptDictation(options: {
  locale: Locale;
  value: string;
  onChangeText: (next: string) => void;
  enabled?: boolean;
}): PromptDictationState {
  const { locale, value, onChangeText, enabled = true } = options;
  const nativeReady = enabled && canUseNativeSpeechRecognition();
  const [status, setStatus] = useState<PromptDictationStatus>(
    nativeReady ? 'idle' : 'unavailable',
  );
  const [errorKey, setErrorKey] = useState<string | null>(null);
  const [available, setAvailable] = useState(nativeReady);
  const baseTextRef = useRef(value);
  const valueRef = useRef(value);

  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      if (!enabled || !canUseNativeSpeechRecognition()) {
        setAvailable(false);
        setStatus('unavailable');
        return;
      }

      const mod = await loadSpeechModule();

      if (cancelled) {
        return;
      }

      if (!mod) {
        setAvailable(false);
        setStatus('unavailable');
        return;
      }

      try {
        const ready = mod.ExpoSpeechRecognitionModule.isRecognitionAvailable();
        setAvailable(ready);
        setStatus(ready ? 'idle' : 'unavailable');
      } catch {
        setAvailable(false);
        setStatus('unavailable');
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [enabled]);

  useEffect(() => {
    if (!canUseNativeSpeechRecognition()) {
      return;
    }

    let removeResult: (() => void) | undefined;
    let removeError: (() => void) | undefined;
    let removeEnd: (() => void) | undefined;

    void (async () => {
      const mod = await loadSpeechModule();

      if (!mod) {
        return;
      }

      const resultSub = mod.ExpoSpeechRecognitionModule.addListener('result', (event) => {
        const transcript = event.results?.[0]?.transcript?.trim();

        if (!transcript) {
          return;
        }

        const base = baseTextRef.current.trim();
        const next = base.length > 0 ? `${base} ${transcript}` : transcript;
        onChangeText(next);

        if (event.isFinal) {
          baseTextRef.current = next;
        }
      });

      const errorSub = mod.ExpoSpeechRecognitionModule.addListener('error', (event) => {
        const code = event.error;
        if (code === 'aborted' || code === 'no-speech') {
          setStatus('idle');
          setErrorKey(null);
          return;
        }

        setStatus('error');
        setErrorKey(
          code === 'not-allowed' || code === 'service-not-allowed'
            ? 'promptLab.dictationPermission'
            : 'promptLab.dictationError',
        );
      });

      const endSub = mod.ExpoSpeechRecognitionModule.addListener('end', () => {
        setStatus((current) => (current === 'listening' ? 'idle' : current));
      });

      removeResult = () => resultSub.remove();
      removeError = () => errorSub.remove();
      removeEnd = () => endSub.remove();
    })();

    return () => {
      removeResult?.();
      removeError?.();
      removeEnd?.();
      if (canUseNativeSpeechRecognition()) {
        void loadSpeechModule().then((mod) => {
          mod?.ExpoSpeechRecognitionModule.abort();
        });
      }
    };
  }, [onChangeText]);

  const stop = useCallback(() => {
    if (!canUseNativeSpeechRecognition()) {
      setStatus('unavailable');
      return;
    }

    void loadSpeechModule().then((mod) => {
      mod?.ExpoSpeechRecognitionModule.stop();
    });
    setStatus((current) => (current === 'listening' ? 'idle' : current));
  }, []);

  const toggle = useCallback(async () => {
    if (!available || !canUseNativeSpeechRecognition()) {
      setStatus('unavailable');
      setErrorKey('promptLab.dictationUnavailable');
      return;
    }

    const mod = await loadSpeechModule();

    if (!mod) {
      setStatus('unavailable');
      setErrorKey('promptLab.dictationUnavailable');
      return;
    }

    if (status === 'listening') {
      mod.ExpoSpeechRecognitionModule.stop();
      setStatus('idle');
      return;
    }

    setErrorKey(null);
    setStatus('requesting');

    try {
      const permission = await mod.ExpoSpeechRecognitionModule.requestPermissionsAsync();

      if (!permission.granted) {
        setStatus('error');
        setErrorKey('promptLab.dictationPermission');
        return;
      }

      baseTextRef.current = valueRef.current;
      mod.ExpoSpeechRecognitionModule.start({
        lang: localeToSpeechLang(locale),
        interimResults: true,
        continuous: Platform.OS === 'android',
        addsPunctuation: true,
        iosTaskHint: 'dictation',
      });
      setStatus('listening');
    } catch {
      setStatus('error');
      setErrorKey('promptLab.dictationError');
    }
  }, [available, locale, status]);

  return {
    status,
    isListening: status === 'listening',
    errorKey,
    available,
    toggle,
    stop,
  };
}
