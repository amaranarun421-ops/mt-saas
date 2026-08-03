'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import {
  Check,
  X,
  Zap,
  CreditCard,
  ArrowRight,
  Loader2,
  ExternalLink,
  Calendar,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const PLANS = [
  {
    id: 'free' as const,
    name: 'Free',
    price: 0,
    period: '/mo',
    description: 'For trying out Scripta',
    features: [
      { label: '10 monthly credits', included: true },
      { label: 'Blog Post + Social Caption', included: true },
      { label: 'Email + Product modes', included: false },
      { label: 'Folders + tags + search', included: true },
      { label: 'Stripe customer portal', included: false },
    ],
  },
  {
    id: 'pro' as const,
    name: 'Pro',
    price: 19,
    period: '/mo',
    annual: 180,
    description: 'For serious content creators',
    features: [
      { label: 'Unlimited generations', included: true },
      { label: 'Blog Post + Social Caption', included: true },
      { label: 'Email + Product modes', included: true },
      { label: 'Folders + tags + search', included: true },
      { label: 'Stripe customer portal', included: true },
    ],
  },
];

interface BillingClientProps {
  currentPlan: string;
  creditsRemaining: number;
  stripeReady: boolean;
  hasSubscription: boolean;
  subscription: {
    status: string;
    plan: string;
    currentPeriodEnd: string | null;
    cancelAtPeriodEnd: boolean;
  } | null;
}

export function BillingClient({
  currentPlan,
  creditsRemaining,
  stripeReady,
  hasSubscription,
  subscription,
}: BillingClientProps) {
  const router = useRouter();
  const [loadingPlan, setLoadingPlan] = React.useState<'monthly' | 'annual' | null>(null);
  const [portalLoading, setPortalLoading] = React.useState(false);

  const startCheckout = async (plan: 'monthly' | 'annual') => {
    if (!stripeReady) {
      toast.error('Stripe is not configured in this demo deploy.');
      return;
    }
    setLoadingPlan(plan);
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
      });
      const json = await res.json();
      if (!res.ok || !json.url) {
        toast.error(json.error ?? 'Failed to start checkout.');
        return;
      }
      window.location.href = json.url;
    } catch {
      toast.error('Network error.');
    } finally {
      setLoadingPlan(null);
    }
  };

  const openPortal = async () => {
    setPortalLoading(true);
    try {
      const res = await fetch('/api/stripe/portal', { method: 'POST' });
      const json = await res.json();
      if (!res.ok || !json.url) {
        toast.error(json.error ?? 'Failed to open portal.');
        return;
      }
      window.location.href = json.url;
    } catch {
      toast.error('Network error.');
    } finally {
      setPortalLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Current plan summary */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-border/60 card-lift">
          <CardContent className="p-5">
            <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Current plan
            </div>
            <div className="mt-2 flex items-center gap-2">
              <span className="text-2xl font-bold capitalize">{currentPlan}</span>
              {currentPlan === 'pro' && (
                <span className="rounded-full bg-primary-600 px-2 py-0.5 text-[10px] font-semibold text-white">
                  PRO
                </span>
              )}
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/60 card-lift">
          <CardContent className="p-5">
            <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Credits remaining
            </div>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-2xl font-bold">
                {currentPlan === 'pro' ? '∞' : creditsRemaining}
              </span>
              <span className="text-sm text-muted-foreground">
                {currentPlan === 'pro' ? 'unlimited' : '/ 10 monthly'}
              </span>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/60 card-lift">
          <CardContent className="p-5">
            <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Subscription status
            </div>
            <div className="mt-2 flex items-center gap-2">
              <span className="text-2xl font-bold capitalize">
                {subscription?.status ?? 'inactive'}
              </span>
              {hasSubscription && (
                <Check className="h-4 w-4 text-green-500" />
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active subscription details */}
      {subscription && hasSubscription && (
        <Card className="border-border/60">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary-500" />
              Subscription details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Plan</span>
              <span className="font-medium capitalize">{subscription.plan}</span>
            </div>
            {subscription.currentPeriodEnd && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  {subscription.cancelAtPeriodEnd ? 'Cancels' : 'Renews'}
                </span>
                <span className="font-medium">
                  {new Date(subscription.currentPeriodEnd).toLocaleDateString(
                    undefined,
                    { year: 'numeric', month: 'long', day: 'numeric' }
                  )}
                </span>
              </div>
            )}
            {subscription.cancelAtPeriodEnd && (
              <div className="mt-2 rounded-md border border-amber-200 bg-amber-50 dark:bg-amber-500/10 dark:border-amber-500/30 px-3 py-2 text-xs text-amber-700 dark:text-amber-300">
                Your subscription is set to cancel at the end of the current
                billing period. You&apos;ll retain Pro access until then.
              </div>
            )}
            <div className="pt-3">
              <Button
                onClick={openPortal}
                disabled={portalLoading || !stripeReady}
                variant="outline"
                className="h-10"
              >
                {portalLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <ExternalLink className="mr-2 h-4 w-4" />
                )}
                Open Stripe customer portal
              </Button>
              <p className="mt-2 text-xs text-muted-foreground">
                Manage your card, switch between monthly/annual, or cancel
                from the Stripe-hosted portal.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Plan picker */}
      <div>
        <h2 className="text-lg font-semibold mb-3">Available plans</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {PLANS.map((plan) => {
            const isCurrent =
              (currentPlan === 'free' && plan.id === 'free') ||
              (currentPlan === 'pro' && plan.id === 'pro');
            return (
              <Card
                key={plan.id}
                className={`border-border/60 card-lift ${
                  plan.id === 'pro'
                    ? 'gradient-border-active border-primary-500'
                    : ''
                }`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">{plan.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {plan.description}
                      </p>
                    </div>
                    {plan.id === 'pro' && (
                      <span className="rounded-full bg-primary-600 px-2 py-0.5 text-[10px] font-semibold text-white">
                        Most popular
                      </span>
                    )}
                  </div>
                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-3xl font-bold">${plan.price}</span>
                    <span className="text-sm text-muted-foreground">
                      {plan.period}
                    </span>
                  </div>
                  {plan.id === 'pro' && (
                    <p className="mt-1 text-xs text-amber-600 font-medium">
                      ${plan.annual}/yr — save $48
                    </p>
                  )}
                  <ul className="mt-5 space-y-2.5">
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

                  <div className="mt-6 space-y-2">
                    {isCurrent ? (
                      <Button disabled variant="outline" className="w-full h-10">
                        <Check className="mr-2 h-4 w-4" />
                        Your current plan
                      </Button>
                    ) : plan.id === 'free' ? (
                      <Button asChild variant="outline" className="w-full h-10">
                        <Link href="/dashboard">
                          Back to dashboard
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    ) : (
                      <div className="space-y-2">
                        <Button
                          onClick={() => startCheckout('monthly')}
                          disabled={loadingPlan !== null}
                          className="w-full btn-elevated btn-press h-10"
                        >
                          {loadingPlan === 'monthly' ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : (
                            <Zap className="mr-2 h-4 w-4" />
                          )}
                          Upgrade monthly — $19/mo
                        </Button>
                        <Button
                          onClick={() => startCheckout('annual')}
                          disabled={loadingPlan !== null}
                          variant="outline"
                          className="w-full h-10"
                        >
                          {loadingPlan === 'annual' ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : (
                            <CreditCard className="mr-2 h-4 w-4" />
                          )}
                          Upgrade annual — $180/yr
                        </Button>
                      </div>
                    )}
                    {!stripeReady && plan.id === 'pro' && !isCurrent && (
                      <p className="text-xs text-muted-foreground text-center">
                        <code className="rounded bg-muted px-1">STRIPE_SECRET_KEY</code>{' '}
                        and price IDs are required for checkout.
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
