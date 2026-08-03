import Stripe from 'stripe';
import type { WriteMode } from '@/lib/ai/prompts';

/**
 * Lazily-initialised Stripe client. Reads STRIPE_SECRET_KEY from env.
 * Returns null when the key is absent so callers can fail gracefully
 * (e.g. demo deploys without a Stripe account).
 */
let _client: Stripe | null = null;

export function getStripe(): Stripe | null {
  if (_client) return _client;
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  _client = new Stripe(key, { apiVersion: '2025-08-27.basil' as Stripe.LatestApiVersion });
  return _client;
}

/** True when both monthly and annual Pro price IDs are configured. */
export function stripeConfigured(): boolean {
  return !!(
    process.env.STRIPE_SECRET_KEY &&
    process.env.STRIPE_PRICE_PRO_MONTHLY &&
    process.env.STRIPE_PRICE_PRO_ANNUAL
  );
}

export interface PlanConfig {
  id: string;
  name: string;
  priceMonthly: number;
  priceAnnual?: number;
  creditsMonthly: number;
  modes: WriteMode[];
}

export const PLANS: Record<'free' | 'pro', PlanConfig> = {
  free: {
    id: 'free',
    name: 'Free',
    priceMonthly: 0,
    creditsMonthly: 10,
    modes: ['blog', 'social'],
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    priceMonthly: 19,
    priceAnnual: 180,
    creditsMonthly: Number.POSITIVE_INFINITY,
    modes: ['blog', 'social', 'email', 'product'],
  },
};

export type PlanId = keyof typeof PLANS;

