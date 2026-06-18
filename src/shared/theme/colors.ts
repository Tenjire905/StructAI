export const AppColors = {
  background: {
    primary: '#0F172A',
    secondary: '#020617',
    card: 'rgba(255,255,255,0.04)',
  },
  border: {
    subtle: 'rgba(255,255,255,0.08)',
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
} as const;

export type AppColorPalette = typeof AppColors;
