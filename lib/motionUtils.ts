import type { BaseMotion, SpringPreset } from '@/theme/theme';

/** Stagger delay per index using motion.duration.instant (100 ms). */
export function staggerDelay(index: number, motion: BaseMotion): number {
  return index * motion.duration.instant;
}

export function resolveSpringPreset(
  motion: BaseMotion,
  preset: 'default' | 'bouncy',
): (typeof motion.spring)[SpringPreset] {
  return motion.spring[preset];
}
