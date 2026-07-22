import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react';

import { appStorage, hydrateAppStorage } from '@/lib/appStorage';

import { getCatalogForLocale } from './copy/index';
import { formatCopyText, type CopyCatalog } from './copy/types';
import { isLocale, resolveLocaleFromDevice, type Locale } from './locale';
import {
  resolveThemeTokens,
  type ResolvedThemeTokens,
  type ThemeAppearance,
  type ThemeMode,
} from './theme';

const THEME_MODE_STORAGE_KEY = 'structai.theme-mode';
const THEME_APPEARANCE_STORAGE_KEY = 'structai.theme-appearance';
const LOCALE_STORAGE_KEY = 'structai.locale';
const DEFAULT_MODE: ThemeMode = 'focus';
const DEFAULT_APPEARANCE: ThemeAppearance = 'dark';

const storage = appStorage;

type ThemeModeContextValue = {
  mode: ThemeMode;
  appearance: ThemeAppearance;
  locale: Locale;
  tokens: ResolvedThemeTokens;
  copy: CopyCatalog;
  /** False until AsyncStorage hydrate finishes — avoids Focus→Playful flash on refresh. */
  isReady: boolean;
  setMode: (mode: ThemeMode) => void;
  setAppearance: (appearance: ThemeAppearance) => void;
  toggleAppearance: () => void;
  setLocale: (locale: Locale) => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
};

const ThemeModeContext = createContext<ThemeModeContextValue | null>(null);

function readStoredMode(): ThemeMode {
  const stored = storage.getString(THEME_MODE_STORAGE_KEY);

  if (stored === 'playful' || stored === 'focus') {
    return stored;
  }

  return DEFAULT_MODE;
}

function readStoredAppearance(): ThemeAppearance {
  const stored = storage.getString(THEME_APPEARANCE_STORAGE_KEY);

  if (stored === 'light' || stored === 'dark') {
    return stored;
  }

  return DEFAULT_APPEARANCE;
}

/**
 * Prefer an explicit stored choice. On first launch (empty key), adopt the
 * phone language mapped to de|en|fr|ru. Persist only after storage hydrate
 * so Expo Go AsyncStorage values are not raced with a premature write.
 */
function resolveLocale(persistIfMissing: boolean): Locale {
  const stored = storage.getString(LOCALE_STORAGE_KEY);

  if (stored && isLocale(stored)) {
    return stored;
  }

  const deviceLocale = resolveLocaleFromDevice();

  if (persistIfMissing) {
    storage.set(LOCALE_STORAGE_KEY, deviceLocale);
  }

  return deviceLocale;
}

export function ThemeModeProvider({ children }: PropsWithChildren) {
  const [mode, setModeState] = useState<ThemeMode>(DEFAULT_MODE);
  const [appearance, setAppearanceState] =
    useState<ThemeAppearance>(DEFAULT_APPEARANCE);
  const [locale, setLocaleState] = useState<Locale>(() => resolveLocale(false));
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    void hydrateAppStorage().then(() => {
      if (cancelled) {
        return;
      }

      setModeState(readStoredMode());
      setAppearanceState(readStoredAppearance());
      setLocaleState(resolveLocale(true));
      setIsReady(true);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  const setMode = useCallback((nextMode: ThemeMode) => {
    setModeState(nextMode);
    storage.set(THEME_MODE_STORAGE_KEY, nextMode);
  }, []);

  const setAppearance = useCallback((next: ThemeAppearance) => {
    setAppearanceState(next);
    storage.set(THEME_APPEARANCE_STORAGE_KEY, next);
  }, []);

  const toggleAppearance = useCallback(() => {
    setAppearanceState((current) => {
      const next: ThemeAppearance = current === 'light' ? 'dark' : 'light';
      storage.set(THEME_APPEARANCE_STORAGE_KEY, next);
      return next;
    });
  }, []);

  const setLocale = useCallback((nextLocale: Locale) => {
    setLocaleState(nextLocale);
    storage.set(LOCALE_STORAGE_KEY, nextLocale);
  }, []);

  const tokens = useMemo(
    () => resolveThemeTokens(mode, appearance),
    [appearance, mode],
  );
  const copy = useMemo(() => getCatalogForLocale(locale), [locale]);

  const value = useMemo<ThemeModeContextValue>(
    () => ({
      mode,
      appearance,
      locale,
      tokens,
      copy,
      isReady,
      setMode,
      setAppearance,
      toggleAppearance,
      setLocale,
      t: (key: string, vars?: Record<string, string | number>) =>
        formatCopyText(key, mode, copy, vars),
    }),
    [
      appearance,
      copy,
      isReady,
      locale,
      mode,
      setAppearance,
      setLocale,
      setMode,
      toggleAppearance,
      tokens,
    ],
  );

  return (
    <ThemeModeContext.Provider value={value}>{children}</ThemeModeContext.Provider>
  );
}

export function useThemeMode(): ThemeModeContextValue {
  const context = useContext(ThemeModeContext);

  if (!context) {
    throw new Error('useThemeMode must be used within ThemeModeProvider');
  }

  return context;
}

type ThemeModeScopeProps = PropsWithChildren<{
  mode: ThemeMode;
}>;

export function ThemeModeScope({ mode, children }: ThemeModeScopeProps) {
  const parent = useThemeMode();
  const tokens = useMemo(
    () => resolveThemeTokens(mode, parent.appearance),
    [mode, parent.appearance],
  );

  const value = useMemo<ThemeModeContextValue>(
    () => ({
      mode,
      appearance: parent.appearance,
      locale: parent.locale,
      tokens,
      copy: parent.copy,
      isReady: parent.isReady,
      setMode: parent.setMode,
      setAppearance: parent.setAppearance,
      toggleAppearance: parent.toggleAppearance,
      setLocale: parent.setLocale,
      t: (key: string, vars?: Record<string, string | number>) =>
        formatCopyText(key, mode, parent.copy, vars),
    }),
    [
      mode,
      parent.appearance,
      parent.copy,
      parent.isReady,
      parent.locale,
      parent.setAppearance,
      parent.setLocale,
      parent.setMode,
      parent.toggleAppearance,
      tokens,
    ],
  );

  return (
    <ThemeModeContext.Provider value={value}>{children}</ThemeModeContext.Provider>
  );
}
