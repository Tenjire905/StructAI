export interface UserStats {
  xp: number;
  level: number;
  streak: number;
  lastActiveDate: string;
}

export interface EnergyState {
  currentOrbs: number;
  maxOrbs: number;
  lastRegenTimestamp: number;
}

export interface GamificationStore {
  userStats: UserStats;
  energy: EnergyState;
  isPremium: boolean;
  addXP: (amount: number) => void;
  useOrb: () => boolean;
  regenOrbs: () => void;
  incrementStreak: () => void;
  setPremium: (val: boolean) => void;
}
