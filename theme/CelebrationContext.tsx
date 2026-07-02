import { createContext, useCallback, useContext, useMemo, useState } from 'react';

import {
  CelebrationOverlay,
  type CelebrationType,
} from '@/components/features/CelebrationOverlay';

export type { CelebrationType };

export type CelebrationLastEvent = {
  id: string;
  type: CelebrationType;
  orbCount?: number;
  isActive: boolean;
};

type CelebrateOptions = {
  orbCount?: number;
};

type CelebrationContextValue = {
  celebrate: (type: CelebrationType, options?: CelebrateOptions) => void;
  /** Most recent celebration event; isActive while the overlay is visible. */
  lastEvent: CelebrationLastEvent | null;
};

const CelebrationContext = createContext<CelebrationContextValue | null>(null);

export function CelebrationProvider({ children }: { children: React.ReactNode }) {
  const [lastEvent, setLastEvent] = useState<CelebrationLastEvent | null>(null);

  const celebrate = useCallback((type: CelebrationType, options?: CelebrateOptions) => {
    setLastEvent({
      id: `${type}-${Date.now()}`,
      type,
      orbCount: options?.orbCount,
      isActive: true,
    });
  }, []);

  const dismiss = useCallback(() => {
    setLastEvent((current) =>
      current ? { ...current, isActive: false } : null,
    );
  }, []);

  const value = useMemo(
    () => ({
      celebrate,
      lastEvent,
    }),
    [celebrate, lastEvent],
  );

  return (
    <CelebrationContext.Provider value={value}>
      {children}
      <CelebrationOverlay
        event={
          lastEvent?.isActive
            ? {
                id: lastEvent.id,
                type: lastEvent.type,
                orbCount: lastEvent.orbCount,
              }
            : null
        }
        onDismiss={dismiss}
      />
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
