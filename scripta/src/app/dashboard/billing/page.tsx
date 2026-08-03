import { auth } from '@/auth';
import { db } from '@/lib/db';
import { BillingClient } from '@/components/dashboard/billing-client';
import { stripeConfigured } from '@/lib/stripe';
import { Check } from 'lucide-react';

export default async function BillingPage({
  searchParams,
}: {
  searchParams: Promise<{ checkout?: string }>;
}) {
  const session = await auth();
  const userId = session!.user.id;
  const params = await searchParams;

  let subscription: {
    status: string;
    plan: string;
    currentPeriodEnd: Date | null;
    cancelAtPeriodEnd: boolean;
  } | null = null;
  let user: {
    plan: string;
    creditsRemaining: number;
    stripeCustomerId: string | null;
    email: string;
  } | null = {
    plan: session!.user.plan,
    creditsRemaining: session!.user.creditsRemaining,
    stripeCustomerId: null,
    email: session!.user.email!,
  };

  try {
    const [dbSubscription, dbUser] = await Promise.all([
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

    subscription = dbSubscription;
    user = dbUser ?? user;
  } catch (error) {
    console.error('[billing page] showcase fallback', error);
  }

  const stripeReady = stripeConfigured();

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Billing</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your subscription, usage, and Stripe customer portal.
        </p>
      </div>

      {params.checkout === 'success' && (
        <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 dark:border-green-500/30 dark:bg-green-500/10 dark:text-green-300">
          <Check className="mr-1.5 inline h-4 w-4" />
          Your subscription is active. Enjoy Pro!
        </div>
      )}
      {params.checkout === 'cancelled' && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300">
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
