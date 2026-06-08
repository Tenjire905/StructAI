import {
  useGamificationStore,
  validateStoreLogic,
} from '../../src/features/Gamification/model/store';
import type { GamificationStore } from '../../src/features/Gamification/model/types';

describe('Gamification Store', () => {
  beforeEach(() => {
    // Reset Store auf definierten Anfangszustand
    useGamificationStore.setState({
      userStats: { xp: 0, level: 1, streak: 0, lastActiveDate: '' },
      energy: { currentOrbs: 5, maxOrbs: 5, lastRegenTimestamp: Date.now() },
      isPremium: false,
    });
  });

  describe('Initialzustand', () => {
    it('startet mit 5/5 Orbs', () => {
      const state = useGamificationStore.getState();
      expect(state.energy.currentOrbs).toBe(5);
      expect(state.energy.maxOrbs).toBe(5);
    });

    it('startet mit Level 1 und 0 XP', () => {
      const state = useGamificationStore.getState();
      expect(state.userStats.level).toBe(1);
      expect(state.userStats.xp).toBe(0);
    });

    it('startet mit isPremium = false', () => {
      const state = useGamificationStore.getState();
      expect(state.isPremium).toBe(false);
    });
  });

  describe('addXP', () => {
    it('erhöht XP ohne Level-Up', () => {
      useGamificationStore.getState().addXP(50);
      const state = useGamificationStore.getState();
      expect(state.userStats.xp).toBe(50);
      expect(state.userStats.level).toBe(1);
    });

    it('löst Level-Up aus, wenn xp >= 100 * level', () => {
      useGamificationStore.getState().addXP(100);
      const state = useGamificationStore.getState();
      expect(state.userStats.level).toBe(2);
      expect(state.userStats.xp).toBe(0);
    });

    it('akzeptiert 0 XP idempotent', () => {
      useGamificationStore.getState().addXP(0);
      const state = useGamificationStore.getState();
      expect(state.userStats.xp).toBe(0);
      expect(state.userStats.level).toBe(1);
    });
  });

  describe('useOrb', () => {
    it('reduziert Orbs um 1', () => {
      const result = useGamificationStore.getState().useOrb();
      expect(result).toBe(true);
      expect(useGamificationStore.getState().energy.currentOrbs).toBe(4);
    });

    it('gibt false zurück, wenn 0 Orbs vorhanden', () => {
      useGamificationStore.setState({
        energy: { currentOrbs: 0, maxOrbs: 5, lastRegenTimestamp: Date.now() },
      });
      const result = useGamificationStore.getState().useOrb();
      expect(result).toBe(false);
    });

    it('bypassed Orb-Limit für Premium', () => {
      useGamificationStore.setState({
        energy: { currentOrbs: 0, maxOrbs: 5, lastRegenTimestamp: Date.now() },
        isPremium: true,
      });
      const result = useGamificationStore.getState().useOrb();
      expect(result).toBe(true);
      expect(useGamificationStore.getState().energy.currentOrbs).toBe(0);
    });
  });

  describe('regenOrbs', () => {
    it('regeneriert 1 Orb nach 30 Min', () => {
      const now = Date.now();
      useGamificationStore.setState({
        energy: { currentOrbs: 3, maxOrbs: 5, lastRegenTimestamp: now - 30 * 60 * 1000 },
      });
      useGamificationStore.getState().regenOrbs();
      expect(useGamificationStore.getState().energy.currentOrbs).toBe(4);
    });

    it('regeneriert 2 Orbs nach 60 Min, capped auf max', () => {
      useGamificationStore.setState({
        energy: { currentOrbs: 4, maxOrbs: 5, lastRegenTimestamp: Date.now() - 60 * 60 * 1000 },
      });
      useGamificationStore.getState().regenOrbs();
      expect(useGamificationStore.getState().energy.currentOrbs).toBe(5);
    });

    it('regenoriert bei Premium', () => {
      useGamificationStore.setState({
        energy: { currentOrbs: 3, maxOrbs: 5, lastRegenTimestamp: Date.now() - 60 * 60 * 1000 },
        isPremium: true,
      });
      useGamificationStore.getState().regenOrbs();
      expect(useGamificationStore.getState().energy.currentOrbs).toBe(3);
    });

    it('macht nichts, wenn weniger als 30 Min vergangen sind', () => {
      useGamificationStore.setState({
        energy: { currentOrbs: 3, maxOrbs: 5, lastRegenTimestamp: Date.now() - 5 * 60 * 1000 },
      });
      useGamificationStore.getState().regenOrbs();
      expect(useGamificationStore.getState().energy.currentOrbs).toBe(3);
    });
  });

  describe('incrementStreak', () => {
    it('erhöht Streak am ersten Tag', () => {
      useGamificationStore.getState().incrementStreak();
      const state = useGamificationStore.getState();
      expect(state.userStats.streak).toBe(1);
    });

    it('ist idempotent am selben Tag', () => {
      useGamificationStore.getState().incrementStreak();
      useGamificationStore.getState().incrementStreak();
      useGamificationStore.getState().incrementStreak();
      expect(useGamificationStore.getState().userStats.streak).toBe(1);
    });
  });

  describe('setPremium', () => {
    it('setzt isPremium auf true', () => {
      useGamificationStore.getState().setPremium(true);
      expect(useGamificationStore.getState().isPremium).toBe(true);
    });

    it('setzt isPremium zurück auf false', () => {
      useGamificationStore.getState().setPremium(true);
      useGamificationStore.getState().setPremium(false);
      expect(useGamificationStore.getState().isPremium).toBe(false);
    });
  });

  describe('validateStoreLogic', () => {
    it('läuft ohne Fehler', () => {
      // Stille Konsolen-Errors während Validierung
      const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
      expect(() => validateStoreLogic()).not.toThrow();
      spy.mockRestore();
    });

    it('stellt Store-Invariante sicher (Orb-Reduktion)', () => {
      const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
      const initial = useGamificationStore.getState().energy.currentOrbs;
      useGamificationStore.getState().useOrb();
      const after = useGamificationStore.getState().energy.currentOrbs;
      expect(after).toBe(initial - 1);
      spy.mockRestore();
    });

    it('stellt Store-Invariante sicher (Level-Up)', () => {
      const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
      const levelBefore = useGamificationStore.getState().userStats.level;
      useGamificationStore.getState().addXP(100 * levelBefore);
      const levelAfter = useGamificationStore.getState().userStats.level;
      expect(levelAfter).toBeGreaterThan(levelBefore);
      spy.mockRestore();
    });
  });
});
