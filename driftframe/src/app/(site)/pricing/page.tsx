import { Check, Sparkles, ShieldCheck, Zap } from "lucide-react";
import { GradientLink } from "@/components/driftframe/gradient-button";
import { GlassPanel } from "@/components/driftframe/glass-panel";
import { FaqAccordion } from "@/components/driftframe/faq-accordion";
import {
  CREDIT_PACKS,
  SUBSCRIPTION_PLAN,
} from "@/lib/constants";

export default function PricingPage() {
  return (
    <div>
      <section className="bg-radial-spotlight">
        <div className="driftframe-container py-16 md:py-20">
          <div className="mx-auto max-w-2xl text-center">
            <span className="driftframe-pill">
              <Sparkles className="h-3 w-3" />
              Pricing
            </span>
            <h1 className="mt-6 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
              Pay for what you generate.
            </h1>
            <p className="mt-3 text-muted-foreground">
              Credit packs that never expire, or a monthly subscription for
              heavy users. No hidden fees.
            </p>
          </div>

          {/* Packs */}
          <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {CREDIT_PACKS.map((pack) => (
              <GlassPanel
                key={pack.id}
                className={`relative flex flex-col ${pack.highlight ? "ring-2 ring-[#7c3aed]" : ""}`}
              >
                {pack.highlight && (
                  <span className="absolute -top-2.5 left-6 bg-[#7c3aed] inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-semibold text-white">
                    <Sparkles className="h-2.5 w-2.5" /> Most popular
                  </span>
                )}
                <p className="text-sm text-muted-foreground">
                  {pack.credits} credits
                </p>
                <p className="mt-1 font-display text-4xl font-semibold">
                  {pack.priceLabel}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {pack.perCredit}
                </p>
                <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-500" /> Never expires
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-500" /> All styles &amp; ratios
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-500" /> Public showcase opt-in
                  </li>
                </ul>
                <div className="mt-auto pt-4">
                  <GradientLink
                    href="/signup"
                    variant={pack.highlight ? "gradient" : "glass"}
                    className="w-full"
                  >
                    Buy now
                  </GradientLink>
                </div>
              </GlassPanel>
            ))}

            {/* Subscription */}
            <GlassPanel className="relative flex flex-col ring-1 ring-[#ff3d81]/30">
              <span className="absolute -top-2.5 left-6 inline-flex items-center gap-1 rounded-full bg-foreground/10 px-2.5 py-0.5 text-[10px] font-semibold text-foreground/80">
                Recurring
              </span>
              <p className="text-sm text-muted-foreground">Pro subscription</p>
              <p className="mt-1 font-display text-4xl font-semibold">
                {SUBSCRIPTION_PLAN.priceLabel}
                <span className="text-base font-normal text-muted-foreground">
                  /mo
                </span>
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                300 credits every month
              </p>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-500" /> Auto-refill monthly
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-500" /> Cancel anytime
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-500" /> Unused credits roll over
                </li>
              </ul>
              <div className="mt-auto pt-4">
                <GradientLink href="/signup" className="w-full">
                  Subscribe
                </GradientLink>
              </div>
            </GlassPanel>
          </div>

          {/* Comparison note */}
          <p className="mt-6 flex items-center justify-center gap-2 text-center text-xs text-muted-foreground">
            <Zap className="h-3.5 w-3.5" />
            Each generation produces 4 images and costs 4 credits.
          </p>
        </div>
      </section>

      {/* Guarantee band */}
      <section className="border-y border-border bg-background/50">
        <div className="driftframe-container py-8">
          <div className="flex flex-col items-center justify-center gap-3 text-center sm:flex-row sm:gap-8">
            <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              14-day refund window on unused packs
            </span>
            <span className="hidden h-4 w-px bg-border sm:inline-block" />
            <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
              <Check className="h-4 w-4 text-emerald-500" />
              Credits never expire
            </span>
            <span className="hidden h-4 w-px bg-border sm:inline-block" />
            <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
              <Check className="h-4 w-4 text-emerald-500" />
              No subscription required
            </span>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section>
        <div className="driftframe-container py-20 md:py-28">
          <div className="mx-auto max-w-2xl">
            <h2 className="font-display text-3xl font-semibold tracking-tight text-center sm:text-4xl">
              Frequently asked questions
            </h2>
            <div className="mt-8">
              <FaqAccordion />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
