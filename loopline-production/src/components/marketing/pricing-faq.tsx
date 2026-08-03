"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PLANS, type PlanDef } from "@/lib/billing";
import { Check, ChevronDown } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function PricingSection({
  showHeader = true,
}: {
  showHeader?: boolean;
}) {
  return (
    <section id="pricing" className="bg-background section-padding">
      <div className="container-loopline">
        {showHeader && (
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-brand-500">
              Pricing
            </p>
            <h2 className="mt-3 font-display text-4xl text-foreground sm:text-5xl">
              Honest pricing. No surprise overages.
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Start free. Upgrade when your support load justifies it. Cancel
              anytime from the customer portal.
            </p>
          </div>
        )}

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          <PlanCard plan={PLANS.FREE} />
          <PlanCard plan={PLANS.PRO} />
          <PlanCard plan={PLANS.AGENCY} />
        </div>

        <p className="mt-8 text-center text-sm text-muted-foreground">
          All plans include streaming AI, knowledge base upload, and the
          embeddable widget. Need a custom enterprise deal?{" "}
          <Link href="/contact" className="font-medium text-brand-500 underline-offset-4 hover:underline">
            Talk to us
          </Link>
          .
        </p>
      </div>
    </section>
  );
}

function PlanCard({ plan }: { plan: PlanDef }) {
  // ICP (ideal customer profile) one-liners — Resend/Linear pattern
  const icp: Record<string, string> = {
    FREE: "For solo founders trying out AI support.",
    PRO: "For SaaS teams of 5–50 handling support.",
    AGENCY: "For agencies managing multiple client sites.",
  };

  return (
    <div
      className={cn(
        "relative flex flex-col rounded-2xl border bg-card p-7 transition",
        plan.highlight
          ? "border-brand-500 shadow-[var(--shadow-lift)] lg:-translate-y-2"
          : "border-border hover:border-brand-300 hover:shadow-[var(--shadow-soft)]",
      )}
    >
      {plan.highlight && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-brand-500 px-3 py-1 text-xs font-semibold text-white shadow-[var(--shadow-soft)]">
          Most popular
        </span>
      )}

      <div>
        <h3 className="font-display text-2xl text-foreground">{plan.name}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{icp[plan.id] || plan.tagline}</p>
      </div>

      <div className="mt-5 flex items-baseline gap-1">
        <span className="font-display text-5xl text-foreground tabular-nums">
          ${plan.priceMonthly}
        </span>
        <span className="text-sm text-muted-foreground">
          {plan.priceMonthly === 0 ? "/ forever" : "/ month"}
        </span>
      </div>

      <Button
        asChild
        size="lg"
        variant={plan.highlight ? "default" : "outline"}
        className="mt-6 w-full"
      >
        <Link href="/signup">
          {plan.priceMonthly === 0 ? "Start free" : `Get ${plan.name}`}
        </Link>
      </Button>

      <ul className="mt-7 space-y-3">
        {plan.features.map((f) => (
          <li key={f} className="flex items-start gap-2.5 text-sm">
            <span
              className={cn(
                "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full",
                plan.highlight
                  ? "bg-brand-500 text-white"
                  : "bg-mint-500/15 text-mint-600",
              )}
            >
              <Check className="h-3 w-3" strokeWidth={3} />
            </span>
            <span className="text-foreground/90">{f}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

const FAQS = [
  {
    q: "How does the widget actually get on my site?",
    a: "After you create a bot, you copy a single <script> tag from the setup page and paste it anywhere in your site's HTML — usually just before </body>. The script loads a self-contained iframe from your Loopline deployment, themed to the bot's primary color. There's no build step on the host site, no React requirement, and no flash of unstyled content.",
  },
  {
    q: "Can I run multiple bots for different products?",
    a: "Yes — that's the core multi-bot workspace model. A single workspace can hold as many bots as your plan allows (1 on Free, 5 on Pro, unlimited on Agency). Each bot has its own knowledge base, theming, welcome message, and conversation history. This is especially useful for agencies managing support for multiple client sites.",
  },
  {
    q: "How does the AI know about my product?",
    a: "You upload text or markdown content to the bot's knowledge base — FAQs, docs, onboarding guides, anything. Loopline chunks it into ~500-character passages and retrieves the top-matching chunks by keyword overlap when a visitor asks a question. Those chunks are injected into the system prompt so the AI's answer is grounded in your actual content. The docs page calls out vector search as a Pro upsell path for buyers who want semantic retrieval.",
  },
  {
    q: "What happens when the bot can't help?",
    a: "Visitors can tap 'Talk to a human' at any point. That flags the conversation as NEEDS_HUMAN in your dashboard inbox, surfaces a badge, and any subsequent replies you send from the inbox are delivered as a human_agent message — breaking the conversation out of AI mode for that thread. The AI stops auto-responding until you mark it resolved.",
  },
  {
    q: "Do I need a real Stripe account to test billing?",
    a: "No. Loopline ships in a 'simulated billing' mode when Stripe keys aren't configured — checkout sessions complete instantly and your workspace is upgraded to the chosen plan. Drop in your STRIPE_SECRET_KEY and STRIPE_WEBHOOK_SECRET when you're ready to go live and the same code paths switch to real Stripe Checkout + Customer Portal automatically.",
  },
  {
    q: "Can I resell this template on Gumroad?",
    a: "Yes — that's exactly what it's built for. The base Next.js starter kit is MIT-licensed; you keep the original LICENSE in the repo root and add a CREDITS.md noting the attribution. All Loopline illustrations are original artwork owned by the template project, so there are no third-party asset licensing concerns.",
  },
];

export function FaqSection() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="border-y border-border bg-muted/30 section-padding">
      <div className="container-loopline-narrow">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-brand-500">
            FAQ
          </p>
          <h2 className="mt-3 font-display text-4xl text-foreground sm:text-5xl">
            Questions buyers ask.
          </h2>
        </div>

        <div className="mt-12 space-y-3">
          {FAQS.map((item, i) => {
            const isOpen = open === i;
            return (
              <div
                key={i}
                className={cn(
                  "overflow-hidden rounded-2xl border bg-card transition",
                  isOpen ? "border-brand-300 shadow-[var(--shadow-soft)]" : "border-border",
                )}
              >
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                >
                  <span className="font-display text-base text-foreground">
                    {item.q}
                  </span>
                  <ChevronDown
                    className={cn(
                      "h-5 w-5 shrink-0 text-muted-foreground transition-transform",
                      isOpen && "rotate-180 text-brand-500",
                    )}
                  />
                </button>
                <div
                  className={cn(
                    "grid transition-all duration-300 ease-out",
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
                  )}
                >
                  <div className="overflow-hidden">
                    <p className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground">
                      {item.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function CtaBand() {
  return (
    <section className="relative overflow-hidden bg-loopline-aurora section-padding">
      <div className="absolute inset-0 bg-loopline-navy-grid opacity-30" />
      <div className="container-loopline relative mx-auto max-w-4xl text-center">
        <h2 className="font-display text-4xl text-white sm:text-5xl lg:text-6xl">
          <span className="text-gradient-loopline">Stop answering</span>
          <br />
          the same five tickets.
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-lg text-slate-300">
          Free forever for one bot. Upgrade when your support load actually
          justifies it. No card required to start.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button size="xl" variant="default" asChild>
            <Link href="/signup">Start free</Link>
          </Button>
          <Button size="xl" variant="outlineLight" asChild>
            <Link href="/pricing">See pricing</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
