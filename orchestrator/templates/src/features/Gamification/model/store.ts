import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { GamificationStore } from './types';

const ORB_REGEN_MS = 30 * 60 * 1000;
const MAX_ORBS = 5;

const initialState = {
  userStats: {
    xp: 0,
    level: 1,
    streak: 0,
    lastActiveDate: '',
  },
  energy: {
    currentOrbs: MAX_ORBS,
    maxOrbs: MAX_ORBS,
    lastRegenTimestamp: Date.now(),
  },
  isPremium: false,
};

export const useGamificationStore = create<GamificationStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      addXP: (amount: number) => {
        set((state) => {
          let xp = state.userStats.xp + amount;
          let level = state.userStats.level;
          const threshold = 100 * level;
          if (xp >= threshold) {
            level += 1;
            xp = 0;
          }
          return {
            userStats: {
              ...state.userStats,
              xp,
              level,
            },
          };
        });
      },

      useOrb: () => {
        const { energy, isPremium } = get();
        if (isPremium) {
          return true;
        }
        if (energy.currentOrbs === 0) {
          return false;
        }
        set({
          energy: {
            ...energy,
            currentOrbs: energy.currentOrbs - 1,
          },
        });
        return true;
      },

      regenOrbs: () => {
        const { energy, isPremium } = get();
        if (isPremium) {
          return;
        }
        const now = Date.now();
        const elapsed = now - energy.lastRegenTimestamp;
        const orbsToRegen = Math.floor(elapsed / ORB_REGEN_MS);
        if (orbsToRegen <= 0) {
          return;
        }
        const newOrbs = Math.min(energy.currentOrbs + orbsToRegen, energy.maxOrbs);
        set({
          energy: {
            ...energy,
            currentOrbs: newOrbs,
            lastRegenTimestamp: now,
          },
        });
      },

      incrementStreak: () => {
        const today = new Date().toISOString().split('T')[0];
        set((state) => {
          if (state.userStats.lastActiveDate === today) {
            return state;
          }
          return {
            userStats: {
              ...state.userStats,
              streak: state.userStats.streak + 1,
              lastActiveDate: today,
            },
          };
        });
      },

      setPremium: (val: boolean) => {
        set({ isPremium: val });
      },
    }),
    {
      name: 'structai-gamification',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);

export function validateStoreLogic(): void {
  const store = useGamificationStore.getState();

  if (typeof store.addXP !== 'function') {
    console.error('[validateStoreLogic] addXP ist keine Funktion');
    return;
  }
  if (typeof store.useOrb !== 'function') {
    console.error('[validateStoreLogic] useOrb ist keine Funktion');
    return;
  }

  const snapshot = {
    userStats: { ...store.userStats },
    energy: { ...store.energy },
    isPremium: store.isPremium,
  };

  const initialOrbs = store.energy.currentOrbs;
  if (initialOrbs > 0) {
    const used = store.useOrb();
    const afterOrbs = useGamificationStore.getState().energy.currentOrbs;
    if (!used || afterOrbs !== initialOrbs - 1) {
      console.error('[validateStoreLogic] useOrb hat Orbs nicht korrekt reduziert');
    }
  }

  const levelBefore = useGamificationStore.getState().userStats.level;
  const xpNeeded = 100 * levelBefore;
  store.addXP(xpNeeded);
  const afterLevel = useGamificationStore.getState().userStats.level;
  if (afterLevel <= levelBefore) {
    console.error('[validateStoreLogic] addXP Level-Up fehlgeschlagen');
  }

  useGamificationStore.setState(snapshot);
}
