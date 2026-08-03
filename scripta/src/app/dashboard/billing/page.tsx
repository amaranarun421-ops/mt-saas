import Link from 'next/link';
import { auth } from '@/auth';
import { db } from '@/lib/db';
import { BillingClient } from '@/components/dashboard/billing-client';
import { stripeConfigured, PLANS } from '@/lib/stripe';
import { Check, Zap, Sparkles, CreditCard, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default async function BillingPage({
  searchParams,
}: {
  searchParams: Promise<{ checkout?: string }>;
}) {
  const session = await auth();
  const userId = session!.user.id;
  const params = await searchParams;

  const [subscription, user] = await Promise.all([
    db.subscription.findFirst({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
    }),
    db.user.findUnique({
      where: { id: userId },
      select: {
        plan: true,
        creditsRemaining: true,
        stripeCustomerId: true,
        email: true,
      },
    }),
  ]);

  const stripeReady = stripeConfigured();

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Billing</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your subscription, usage, and Stripe customer portal.
        </p>
      </div>

      {params.checkout === 'success' && (
        <div className="rounded-xl border border-green-200 bg-green-50 dark:bg-green-500/10 dark:border-green-500/30 px-4 py-3 text-sm text-green-700 dark:text-green-300">
          <Check className="inline h-4 w-4 mr-1.5" />
          Your subscription is active. Enjoy Pro!
        </div>
      )}
      {params.checkout === 'cancelled' && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 dark:bg-amber-500/10 dark:border-amber-500/30 px-4 py-3 text-sm text-amber-700 dark:text-amber-300">
          Checkout was cancelled. No charge was made.
        </div>
      )}

      <BillingClient
        currentPlan={user?.plan ?? 'free'}
        creditsRemaining={user?.creditsRemaining ?? 0}
        stripeReady={stripeReady}
        hasSubscription={!!subscription && subscription.status === 'active'}
        subscription={
          subscription
            ? {
                status: subscription.status,
                plan: subscription.plan,
                currentPeriodEnd: subscription.currentPeriodEnd?.toISOString() ?? null,
                cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
              }
            : null
        }
      />
    </div>
  );
}
