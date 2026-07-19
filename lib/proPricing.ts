/**
 * Display pricing for Pro (P3.2 paywall).
 * App Store / Play Billing (Block H) is not wired yet — amounts are product framing only.
 */

export type ProBillingPeriod = 'monthly' | 'yearly';

export type ProPriceOffer = {
  period: ProBillingPeriod;
  /** Display amount including currency symbol, e.g. "€9.99". */
  priceLabel: string;
  /** Approx monthly equivalent for yearly (display only). */
  monthlyEquivalentLabel?: string;
};

export const PRO_PRICE_OFFERS: Record<ProBillingPeriod, ProPriceOffer> = {
  monthly: {
    period: 'monthly',
    priceLabel: '€9.99',
  },
  yearly: {
    period: 'yearly',
    priceLabel: '€59.99',
    monthlyEquivalentLabel: '€5.00',
  },
};

export const DEFAULT_PRO_BILLING_PERIOD: ProBillingPeriod = 'yearly';
