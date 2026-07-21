import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';

type ActiveGlossaryTerm = {
  id: string;
  label: string;
  definition: string;
  nonce: number;
};

type HighlightPassState = {
  passId: number;
  claimedIds: Set<string>;
};

type LessonGlossaryContextValue = {
  activeTerm: ActiveGlossaryTerm | null;
  showTerm: (term: { id: string; label: string; definition: string }) => void;
  dismissTerm: () => void;
  /**
   * Start a fresh highlight pass for the currently rendering step tree.
   * First InlineGlossaryText wins per term id; later siblings stay plain.
   */
  beginHighlightPass: () => void;
  /** Returns true when this term id may be highlighted in the current pass. */
  claimHighlightTerm: (termId: string) => boolean;
};

const LessonGlossaryContext = createContext<LessonGlossaryContextValue | null>(null);

export function LessonGlossaryProvider({ children }: { children: React.ReactNode }) {
  const [activeTerm, setActiveTerm] = useState<ActiveGlossaryTerm | null>(null);
  const highlightPassRef = useRef<HighlightPassState>({
    passId: 0,
    claimedIds: new Set(),
  });

  const showTerm = useCallback((term: { id: string; label: string; definition: string }) => {
    setActiveTerm({
      ...term,
      nonce: Date.now(),
    });
  }, []);

  const dismissTerm = useCallback(() => {
    setActiveTerm(null);
  }, []);

  const beginHighlightPass = useCallback(() => {
    highlightPassRef.current = {
      passId: highlightPassRef.current.passId + 1,
      claimedIds: new Set(),
    };
  }, []);

  const claimHighlightTerm = useCallback((termId: string) => {
    const claimed = highlightPassRef.current.claimedIds;

    if (claimed.has(termId)) {
      return false;
    }

    claimed.add(termId);
    return true;
  }, []);

  const value = useMemo(
    () => ({
      activeTerm,
      showTerm,
      dismissTerm,
      beginHighlightPass,
      claimHighlightTerm,
    }),
    [activeTerm, beginHighlightPass, claimHighlightTerm, dismissTerm, showTerm],
  );

  return (
    <LessonGlossaryContext.Provider value={value}>{children}</LessonGlossaryContext.Provider>
  );
}

/**
 * Wraps one lesson-step content tree so glossary marks are unique across
 * title, body, questions, and feedback — not only inside a single string.
 */
export function GlossaryHighlightPass({ children }: { children: React.ReactNode }) {
  const glossary = useLessonGlossary();
  glossary.beginHighlightPass();
  return <>{children}</>;
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
