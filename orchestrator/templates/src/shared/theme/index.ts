import { AppColors } from './colors';
import { AppTypography } from './typography';

export const theme = {
  colors: AppColors,
  typography: AppTypography,
} as const;

export type Theme = typeof theme;

export { AppColors, AppTypography };
