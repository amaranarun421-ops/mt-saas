// Plan definitions + usage gating for Loopline.
// Free  → 1 bot,   50 conversations/mo
// Pro   → 5 bots,  unlimited conversations ($29/mo)
// Agency→ ∞ bots,  unlimited conversations ($79/mo)

import type { Plan } from "@prisma/client";

export interface PlanDef {
  id: Plan;
  name: string;
  priceMonthly: number | null; // null = free
  priceId: string | null;
  botLimit: number | null; // null = unlimited
  conversationMonthlyLimit: number | null;
  tagline: string;
  features: string[];
  highlight?: boolean;
}

export const PLANS: Record<Plan, PlanDef> = {
  FREE: {
    id: "FREE",
    name: "Free",
    priceMonthly: 0,
    priceId: null,
    botLimit: 1,
    conversationMonthlyLimit: 50,
    tagline: "For trying out Loopline on a single site.",
    features: [
      "1 chatbot",
      "50 conversations / month",
      "Knowledge base upload",
      "Streaming AI responses",
      "Basic analytics",
      "Loopline branding in widget",
    ],
  },
  PRO: {
    id: "PRO",
    name: "Pro",
    priceMonthly: 29,
    priceId: process.env.STRIPE_PRICE_PRO_MONTHLY || "price_pro_monthly",
    botLimit: 5,
    conversationMonthlyLimit: null,
    tagline: "For SaaS teams running support at scale.",
    features: [
      "5 chatbots",
      "Unlimited conversations",
      "Human handoff inbox",
      "Per-bot theming + avatar",
      "Advanced analytics",
      "Remove Loopline branding",
      "Email support",
    ],
    highlight: true,
  },
  AGENCY: {
    id: "AGENCY",
    name: "Agency",
    priceMonthly: 79,
    priceId: process.env.STRIPE_PRICE_AGENCY_MONTHLY || "price_agency_monthly",
    botLimit: null,
    conversationMonthlyLimit: null,
    tagline: "For agencies managing multiple client sites.",
    features: [
      "Unlimited chatbots",
      "Unlimited conversations",
      "Workspace member seats",
      "White-label widget",
      "Priority support",
      "Custom SLA",
    ],
  },
};

export const PLAN_LIST = [PLANS.FREE, PLANS.PRO, PLANS.AGENCY];

export function isStripeConfigured(): boolean {
  return Boolean(
    process.env.STRIPE_SECRET_KEY && process.env.STRIPE_WEBHOOK_SECRET,
  );
}

export interface UsageState {
  plan: Plan;
  botCount: number;
  conversationCountThisMonth: number;
  canCreateBot: boolean;
  canStartConversation: boolean;
  warningThresholdReached: boolean;
  limit: {
    bots: number | null;
    conversations: number | null;
  };
}

export function computeUsageState(
  plan: Plan,
  botCount: number,
  conversationCountThisMonth: number,
): UsageState {
  const def = PLANS[plan];
  const botLimit = def.botLimit;
  const convoLimit = def.conversationMonthlyLimit;

  return {
    plan,
    botCount,
    conversationCountThisMonth,
    canCreateBot: botLimit === null || botCount < botLimit,
    canStartConversation:
      convoLimit === null || conversationCountThisMonth < convoLimit,
    warningThresholdReached:
      convoLimit !== null && conversationCountThisMonth >= convoLimit * 0.8,
    limit: {
      bots: botLimit,
      conversations: convoLimit,
    },
  };
}
