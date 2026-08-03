import Link from 'next/link';
import { Check, Sparkles, Zap, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { auth } from '@/auth';
import { stripeConfigured } from '@/lib/stripe';

const PLANS = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    period: '/mo',
    description: 'For trying out Scripta',
    cta: 'Start free',
    href: '/signup',
    features: [
      { label: '10 monthly credits', included: true },
      { label: 'Blog Post generator', included: true },
      { label: 'Social Caption generator', included: true },
      { label: 'Email Copy generator', included: false },
      { label: 'Product Description generator', included: false },
      { label: 'Saved documents + folders', included: true },
      { label: 'Email verification flow', included: true },
      { label: 'Stripe customer portal', included: false },
    ],
    highlight: false,
    annualNote: null as string | null,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 19,
    period: '/mo',
    description: 'For serious content creators',
    cta: 'Upgrade to Pro',
    href: '/dashboard/billing',
    annualNote: '$180/yr — save $48',
    features: [
      { label: 'Unlimited generations', included: true },
      { label: 'Blog Post generator', included: true },
      { label: 'Social Caption generator', included: true },
      { label: 'Email Copy generator', included: true },
      { label: 'Product Description generator', included: true },
      { label: 'Saved documents + folders', included: true },
      { label: 'Email verification flow', included: true },
      { label: 'Stripe customer portal', included: true },
    ],
    highlight: true,
  },
];

export default async function PricingPage() {
  const session = await auth();
  const isAuthed = !!session?.user;
  const isPro = session?.user?.plan === 'pro';
  const stripeReady = stripeConfigured();

  return (
    <div className="px-6 md:px-12 lg:px-20 py-16 md:py-24">
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary-200 bg-primary-50 px-3 py-1 text-xs font-medium text-primary-700">
          <Sparkles className="h-3 w-3" />
          <span>Pricing</span>
        </div>
        <h1 className="mt-4 text-4xl md:text-5xl font-bold tracking-tight">
          Pick the plan that fits
        </h1>
        <p className="mt-4 text-muted-foreground">
          Free is genuinely usable — 10 monthly credits, no card required. Pro
          unlocks unlimited generations and all 4 write modes.
        </p>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-2 max-w-3xl mx-auto">
        {PLANS.map((plan) => {
          const ctaLabel = isPro && plan.id === 'pro'
            ? 'You are on Pro'
            : isAuthed && plan.id === 'free'
              ? 'You are on Free'
              : plan.cta;
          const ctaDisabled =
            (isPro && plan.id === 'pro') ||
            (isAuthed && !isPro && plan.id === 'free' && !stripeReady);

          return (
            <div
              key={plan.id}
              className={`relative rounded-2xl border p-8 shadow-theme-sm card-lift ${
                plan.highlight
                  ? 'border-primary-500 bg-card shadow-theme-md'
                  : 'border-border/60 bg-card'
              }`}
            >
              {plan.highlight && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary-600 px-3 py-1 text-xs font-semibold text-white shadow-md">
                  Most popular
                </span>
              )}
              <h3 className="text-lg font-semibold">{plan.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {plan.description}
              </p>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-bold">
                  ${plan.price}
                </span>
                <span className="text-sm text-muted-foreground">
                  {plan.period}
                </span>
              </div>
              {plan.annualNote && (
                <p className="mt-1 text-xs text-amber-600 font-medium">
                  {plan.annualNote}
                </p>
              )}

              <Button
                asChild={!ctaDisabled}
                disabled={ctaDisabled}
                className={`mt-6 w-full btn-press h-11 ${
                  plan.highlight ? 'btn-elevated' : ''
                }`}
                variant={plan.highlight ? 'default' : 'outline'}
              >
                {ctaDisabled ? (
                  <span>{ctaLabel}</span>
                ) : (
                  <Link href={plan.href}>{ctaLabel}</Link>
                )}
              </Button>

              {!stripeReady && plan.id === 'pro' && (
                <p className="mt-2 text-xs text-center text-muted-foreground">
                  Stripe not configured in this demo deploy.
                </p>
              )}

              <ul className="mt-6 space-y-3">
                {plan.features.map((f) => (
                  <li
                    key={f.label}
                    className={`flex items-start gap-2 text-sm ${
                      !f.included ? 'text-muted-foreground/60' : ''
                    }`}
                  >
                    {f.included ? (
                      <Check className="mt-0.5 h-4 w-4 text-primary-500 shrink-0" />
                    ) : (
                      <X className="mt-0.5 h-4 w-4 text-muted-foreground/40 shrink-0" />
                    )}
                    <span>{f.label}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      {/* FAQ-ish answer */}
      <div className="mt-16 max-w-2xl mx-auto text-center">
        <h2 className="text-2xl font-bold">Common questions</h2>
        <div className="mt-6 space-y-4 text-left">
          <FaqItem
            q="What's a credit?"
            a="Each AI generation — whether a blog post, social caption, email, or product description — costs one credit. Free plan gets 10 per month; Pro is unlimited."
          />
          <FaqItem
            q="Do credits roll over?"
            a="No — credits refresh on the first of every month. Pro users don't have to worry about credits at all."
          />
          <FaqItem
            q="Can I cancel anytime?"
            a="Yes. Pro is month-to-month (or annual). Cancel from the Stripe customer portal inside your billing page; you keep access until the end of the current billing period."
          />
          <FaqItem
            q="Which AI model is used?"
            a="Scripta ships wired to OpenAI's gpt-4o-mini by default. The model is a single config line in src/lib/ai/model.ts — swap to any provider the Vercel AI SDK supports."
          />
        </div>
      </div>
    </div>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  return (
    <div className="rounded-xl border border-border/60 bg-card p-5">
      <h3 className="text-sm font-semibold flex items-start gap-2">
        <Zap className="mt-0.5 h-3.5 w-3.5 text-primary-500 shrink-0" />
        {q}
      </h3>
      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
        {a}
      </p>
    </div>
  );
}
