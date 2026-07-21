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
  type ThemeMode,
} from './theme';

const THEME_MODE_STORAGE_KEY = 'structai.theme-mode';
const LOCALE_STORAGE_KEY = 'structai.locale';
const DEFAULT_MODE: ThemeMode = 'focus';

const storage = appStorage;

type ThemeModeContextValue = {
  mode: ThemeMode;
  locale: Locale;
  tokens: ResolvedThemeTokens;
  copy: CopyCatalog;
  setMode: (mode: ThemeMode) => void;
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
  const [mode, setModeState] = useState<ThemeMode>(() => readStoredMode());
  const [locale, setLocaleState] = useState<Locale>(() => resolveLocale(false));

  useEffect(() => {
    let cancelled = false;

    void hydrateAppStorage().then(() => {
      if (cancelled) {
        return;
      }

      setModeState(readStoredMode());
      setLocaleState(resolveLocale(true));
    });

    return () => {
      cancelled = true;
    };
  }, []);

  const setMode = useCallback((nextMode: ThemeMode) => {
    setModeState(nextMode);
    storage.set(THEME_MODE_STORAGE_KEY, nextMode);
  }, []);

  const setLocale = useCallback((nextLocale: Locale) => {
    setLocaleState(nextLocale);
    storage.set(LOCALE_STORAGE_KEY, nextLocale);
  }, []);

  const tokens = useMemo(() => resolveThemeTokens(mode), [mode]);
  const copy = useMemo(() => getCatalogForLocale(locale), [locale]);

  const value = useMemo<ThemeModeContextValue>(
    () => ({
      mode,
      locale,
      tokens,
      copy,
      setMode,
      setLocale,
      t: (key: string, vars?: Record<string, string | number>) =>
        formatCopyText(key, mode, copy, vars),
    }),
    [copy, locale, mode, setLocale, setMode, tokens],
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
  const tokens = useMemo(() => resolveThemeTokens(mode), [mode]);

  const value = useMemo<ThemeModeContextValue>(
    () => ({
      mode,
      locale: parent.locale,
      tokens,
      copy: parent.copy,
      setMode: parent.setMode,
      setLocale: parent.setLocale,
      t: (key: string, vars?: Record<string, string | number>) =>
        formatCopyText(key, mode, parent.copy, vars),
    }),
    [mode, parent.copy, parent.locale, parent.setLocale, parent.setMode, tokens],
  );

  return (
    <ThemeModeContext.Provider value={value}>{children}</ThemeModeContext.Provider>
  );
}
