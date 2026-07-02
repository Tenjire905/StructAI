import { createContext, useCallback, useContext, useMemo, useState } from 'react';

import {
  CelebrationOverlay,
  type CelebrationType,
} from '@/components/features/CelebrationOverlay';

export type { CelebrationType };

type CelebrateOptions = {
  orbCount?: number;
};

type CelebrationContextValue = {
  celebrate: (type: CelebrationType, options?: CelebrateOptions) => void;
};

const CelebrationContext = createContext<CelebrationContextValue | null>(null);

export function CelebrationProvider({ children }: { children: React.ReactNode }) {
  const [event, setEvent] = useState<{
    id: string;
    type: CelebrationType;
    orbCount?: number;
  } | null>(null);

  const celebrate = useCallback((type: CelebrationType, options?: CelebrateOptions) => {
    setEvent({
      id: `${type}-${Date.now()}`,
      type,
      orbCount: options?.orbCount,
    });
  }, []);

  const dismiss = useCallback(() => {
    setEvent(null);
  }, []);

  const value = useMemo(() => ({ celebrate }), [celebrate]);

  return (
    <CelebrationContext.Provider value={value}>
      {children}
      <CelebrationOverlay event={event} onDismiss={dismiss} />
    </CelebrationContext.Provider>
  );
}

export function useCelebration(): CelebrationContextValue {
  const context = useContext(CelebrationContext);

  if (!context) {
    throw new Error('useCelebration must be used within CelebrationProvider');
  }

  return context;
}
