/**
 * Driftframe shared constants — credit packs, style presets, aspect ratios.
 */

export type CreditPackId = "50" | "200" | "500";

export interface CreditPack {
  id: CreditPackId;
  credits: number;
  priceCents: number;
  priceLabel: string;
  perCredit: string;
  highlight?: boolean;
}

/** Pricing: $9 / 50, $29 / 200, $59 / 500, $19/mo subscription (300 credits/mo). */
export const CREDIT_PACKS: CreditPack[] = [
  {
    id: "50",
    credits: 50,
    priceCents: 900,
    priceLabel: "$9",
    perCredit: "$0.18 / credit",
  },
  {
    id: "200",
    credits: 200,
    priceCents: 2900,
    priceLabel: "$29",
    perCredit: "$0.15 / credit",
    highlight: true,
  },
  {
    id: "500",
    credits: 500,
    priceCents: 5900,
    priceLabel: "$59",
    perCredit: "$0.12 / credit",
  },
];

export interface SubscriptionPlan {
  id: "subscription";
  credits: number;
  priceCents: number;
  priceLabel: string;
  period: string;
}

export const SUBSCRIPTION_PLAN: SubscriptionPlan = {
  id: "subscription",
  credits: 300,
  priceCents: 1900,
  priceLabel: "$19",
  period: "per month",
};

export interface StylePreset {
  id: string;
  label: string;
  hint: string;
}

/** Style preset chips on the prompt sidebar. */
export const STYLE_PRESETS: StylePreset[] = [
  { id: "photographic", label: "Photographic", hint: "Realistic, lens-rendered" },
  { id: "anime", label: "Anime", hint: "Cel-shaded illustration" },
  { id: "3d-render", label: "3D Render", hint: "Octane, ray-traced" },
  { id: "painting", label: "Painting", hint: "Painterly, textured" },
  { id: "sketch", label: "Sketch", hint: "Graphite, line work" },
];

export interface AspectRatioPreset {
  id: string;
  label: string;
  /** width / height */
  w: number;
  h: number;
}

/** Aspect ratio chips on the prompt sidebar. */
export const ASPECT_RATIOS: AspectRatioPreset[] = [
  { id: "1:1", label: "1:1", w: 1, h: 1 },
  { id: "16:9", label: "16:9", w: 16, h: 9 },
  { id: "9:16", label: "9:16", w: 9, h: 16 },
  { id: "4:3", label: "4:3", w: 4, h: 3 },
];

/** Cost of a single batch-of-4 generation, in credits. */
export const GENERATION_COST_CREDITS = 4;

/** How many images a single Generate produces. */
export const GENERATION_BATCH_SIZE = 4;

/** Free credits granted to a brand-new user on signup. */
export const SIGNUP_FREE_CREDITS = 10;

/** Helper: format a credit amount with a sign for transaction tables. */
export function formatCreditAmount(amount: number): string {
  const sign = amount > 0 ? "+" : "";
  return `${sign}${amount}`;
}

/** Helper: format cents into a USD label. */
export function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(0)}`;
}
