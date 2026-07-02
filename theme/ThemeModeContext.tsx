import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react';
import { createMMKV } from 'react-native-mmkv';

import { copy, formatCopyText, type CopyCatalog } from './copy';
import {
  resolveThemeTokens,
  type ResolvedThemeTokens,
  type ThemeMode,
} from './theme';

const THEME_MODE_STORAGE_KEY = 'structai.theme-mode';
const DEFAULT_MODE: ThemeMode = 'focus';

const storage = createMMKV({ id: 'structai-storage' });

type ThemeModeContextValue = {
  mode: ThemeMode;
  tokens: ResolvedThemeTokens;
  copy: CopyCatalog;
  setMode: (mode: ThemeMode) => void;
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

export function ThemeModeProvider({ children }: PropsWithChildren) {
  const [mode, setModeState] = useState<ThemeMode>(() => readStoredMode());

  useEffect(() => {
    storage.set(THEME_MODE_STORAGE_KEY, mode);
  }, [mode]);

  const setMode = useCallback((nextMode: ThemeMode) => {
    setModeState(nextMode);
  }, []);

  const tokens = useMemo(() => resolveThemeTokens(mode), [mode]);

  const value = useMemo<ThemeModeContextValue>(
    () => ({
      mode,
      tokens,
      copy,
      setMode,
      t: (key: string, vars?: Record<string, string | number>) =>
        formatCopyText(key, mode, vars),
    }),
    [mode, tokens, setMode],
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
      tokens,
      copy: parent.copy,
      setMode: parent.setMode,
      t: (key: string, vars?: Record<string, string | number>) =>
        formatCopyText(key, mode, vars),
    }),
    [mode, tokens, parent.copy, parent.setMode],
  );

  return (
    <ThemeModeContext.Provider value={value}>{children}</ThemeModeContext.Provider>
  );
}
