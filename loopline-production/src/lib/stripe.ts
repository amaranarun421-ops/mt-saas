// Stripe wrapper — falls back to a simulated billing mode when keys are absent.
// Buyers of the template plug in STRIPE_SECRET_KEY + webhook secret to go live.

import Stripe from "stripe";
import type { Plan } from "@prisma/client";
import { PLANS, isStripeConfigured } from "./billing";

let _stripe: Stripe | null = null;

export function getStripe(): Stripe | null {
  if (!isStripeConfigured()) return null;
  if (_stripe) return _stripe;
  _stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2025-08-27.basil" as Stripe.LatestApiVersion,
    typescript: true,
  });
  return _stripe;
}

/**
 * Create a Checkout Session for upgrading to a paid plan.
 * In simulated mode, returns a fake session with a URL pointing to our
 * internal /dashboard/billing/success endpoint.
 */
export async function createCheckoutSession(opts: {
  workspaceId: string;
  workspaceName: string;
  customerId?: string | null;
  plan: Plan;
  successUrl: string;
  cancelUrl: string;
}): Promise<{ id: string; url: string; simulated: boolean }> {
  const stripe = getStripe();
  const def = PLANS[opts.plan];

  if (!stripe || !def.priceId) {
    // Simulated mode — return a session that "completes" instantly.
    const id = "sim_cs_" + Math.random().toString(36).slice(2, 12);
    const url = `${opts.successUrl}?session_id=${id}&simulated=1&plan=${opts.plan}`;
    return { id, url, simulated: true };
  }

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: opts.customerId || undefined,
    customer_email: opts.customerId ? undefined : undefined,
    line_items: [{ price: def.priceId, quantity: 1 }],
    client_reference_id: opts.workspaceId,
    metadata: {
      workspaceId: opts.workspaceId,
      workspaceName: opts.workspaceName,
      plan: opts.plan,
    },
    subscription_data: {
      metadata: {
        workspaceId: opts.workspaceId,
        workspaceName: opts.workspaceName,
        plan: opts.plan,
      },
    },
    success_url: `${opts.successUrl}?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: opts.cancelUrl,
  });

  return { id: session.id, url: session.url!, simulated: false };
}

/**
 * Create a billing portal session for the customer to manage their subscription.
 * In simulated mode, returns the dashboard billing page.
 */
export async function createPortalSession(opts: {
  customerId: string;
  returnUrl: string;
}): Promise<{ url: string; simulated: boolean }> {
  const stripe = getStripe();
  if (!stripe) {
    return { url: opts.returnUrl, simulated: true };
  }
  const session = await stripe.billingPortal.sessions.create({
    customer: opts.customerId,
    return_url: opts.returnUrl,
  });
  return { url: session.url, simulated: false };
}

/**
 * Map a Stripe price ID back to a Loopline plan.
 */
export function planFromPriceId(priceId: string | null | undefined): Plan | null {
  if (!priceId) return null;
  for (const plan of Object.values(PLANS)) {
    if (plan.priceId === priceId) return plan.id;
  }
  return null;
}
