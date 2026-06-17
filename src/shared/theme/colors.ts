export const AppColors = {
  background: {
    primary: '#0F172A',
    secondary: '#020617',
    card: 'rgba(255,255,255,0.04)',
  },
  border: {
    subtle: 'rgba(255,255,255,0.08)',
    glow: 'rgba(0,122,255,0.35)',
  },
  text: {
    primary: '#FFFFFF',
    secondary: 'rgba(255,255,255,0.75)',
    muted: 'rgba(255,255,255,0.5)',
  },
  accent: {
    everyday: '#007AFF',
    code: '#00E5FF',
    visual: '#FF007F',
  },
  feedback: {
    success: '#22C55E',
    warning: '#F59E0B',
    danger: '#EF4444',
  },
  gradient: {
    hero: ['#0F172A', '#020617', '#0F172A'] as const,
    button: ['#007AFF', '#00E5FF'] as const,
  },
  glow: {
    ambient: 'rgba(0,122,255,0.12)',
    accent: 'rgba(0,122,255,0.25)',
  },
  tabBar: {
    background: 'rgba(15,23,42,0.92)',
    active: '#007AFF',
    inactive: 'rgba(255,255,255,0.45)',
  },
} as const;

export type AppColorPalette = typeof AppColors;
