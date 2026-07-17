import { createContext, useCallback, useContext, useMemo, useState } from 'react';

type ActiveGlossaryTerm = {
  id: string;
  label: string;
  definition: string;
  nonce: number;
};

type LessonGlossaryContextValue = {
  activeTerm: ActiveGlossaryTerm | null;
  showTerm: (term: { id: string; label: string; definition: string }) => void;
  dismissTerm: () => void;
};

const LessonGlossaryContext = createContext<LessonGlossaryContextValue | null>(null);

export function LessonGlossaryProvider({ children }: { children: React.ReactNode }) {
  const [activeTerm, setActiveTerm] = useState<ActiveGlossaryTerm | null>(null);

  const showTerm = useCallback((term: { id: string; label: string; definition: string }) => {
    setActiveTerm({
      ...term,
      nonce: Date.now(),
    });
  }, []);

  const dismissTerm = useCallback(() => {
    setActiveTerm(null);
  }, []);

  const value = useMemo(
    () => ({
      activeTerm,
      showTerm,
      dismissTerm,
    }),
    [activeTerm, dismissTerm, showTerm],
  );

  return (
    <LessonGlossaryContext.Provider value={value}>{children}</LessonGlossaryContext.Provider>
  );
}

export function useLessonGlossary(): LessonGlossaryContextValue {
  const context = useContext(LessonGlossaryContext);

  if (!context) {
    throw new Error('useLessonGlossary must be used within LessonGlossaryProvider');
  }

  return context;
}

/** Safe for components that may render outside a lesson session. */
export function useOptionalLessonGlossary(): LessonGlossaryContextValue | null {
  return useContext(LessonGlossaryContext);
}
