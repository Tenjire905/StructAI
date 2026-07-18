/**
 * Free vs Pro framing (P3.2) — no payment infrastructure yet (Block H deferred).
 *
 * Free forever: all lessons, local Prompt Lab coach, streaks/XP/orbs, certificate preview.
 * Soft-gated as Pro: live Lab AI grades (remote BYOK scoring), certificate export/share.
 *
 * Preview unlock is local MMKV only so Soft gates can be demoed before IAP ships.
 */

import {
  clearProPreviewUnlocked,
  isProPreviewUnlocked,
  setProPreviewUnlocked,
} from '@/lib/appStorage';

export type PlanId = 'free' | 'pro';

export type ProFeature = 'liveLabGrades' | 'certificateExport';

export function getPlanId(): PlanId {
  return isProPreviewUnlocked() ? 'pro' : 'free';
}

export function isProUnlocked(): boolean {
  return getPlanId() === 'pro';
}

export function canUseProFeature(feature: ProFeature): boolean {
  void feature;
  return isProUnlocked();
}

export async function unlockProPreview(): Promise<void> {
  await setProPreviewUnlocked();
}

export async function lockProPreview(): Promise<void> {
  await clearProPreviewUnlocked();
}
