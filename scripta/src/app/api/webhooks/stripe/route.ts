import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { db } from '@/lib/db';
import { getStripe } from '@/lib/stripe';

export async function POST(req: Request) {
  try {
    const stripe = getStripe();
    if (!stripe) {
      return NextResponse.json(
        { error: 'Stripe is not configured.' },
        { status: 503 }
      );
    }

    const body = await req.text();
    const signature = req.headers.get('stripe-signature');
    if (!signature) {
      return NextResponse.json(
        { error: 'Missing stripe-signature header' },
        { status: 400 }
      );
    }

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      return NextResponse.json(
        { error: 'STRIPE_WEBHOOK_SECRET is not configured.' },
        { status: 503 }
      );
    }

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Invalid signature';
      console.error('[stripe/webhook] signature verification failed:', msg);
      return NextResponse.json({ error: msg }, { status: 400 });
    }

    switch (event.type) {
      case 'checkout.session.completed': {
        const cs = event.data.object as Stripe.Checkout.Session;
        const userId = cs.metadata?.userId;
        const plan = cs.metadata?.plan;
        if (userId) {
          // Update user plan + create subscription record
          const subId = typeof cs.subscription === 'string' ? cs.subscription : null;
          const customerId =
            typeof cs.customer === 'string' ? cs.customer : null;

          if (subId && customerId) {
            const sub = await stripe.subscriptions.retrieve(subId);
            const currentPeriodEnd = (sub as unknown as { current_period_end: number }).current_period_end;
            await db.user.update({
              where: { id: userId },
              data: {
                plan: 'pro',
                stripeCustomerId: customerId,
                creditsRemaining: 999999, // effectively unlimited
              },
            });

            await db.subscription.upsert({
              where: { stripeSubscriptionId: subId },
              create: {
                userId,
                stripeSubscriptionId: subId,
                status: sub.status,
                plan: 'pro',
                currentPeriodEnd: new Date(currentPeriodEnd * 1000),
                cancelAtPeriodEnd: sub.cancel_at_period_end,
              },
              update: {
                userId,
                status: sub.status,
                plan: 'pro',
                currentPeriodEnd: new Date(currentPeriodEnd * 1000),
                cancelAtPeriodEnd: sub.cancel_at_period_end,
              },
            });
          } else if (plan) {
            // One-off (no subscription) — still mark as pro
            await db.user.update({
              where: { id: userId },
              data: { plan: 'pro' },
            });
          }
        }
        break;
      }

      case 'customer.subscription.updated': {
        const sub = event.data.object as Stripe.Subscription;
        const customerId = typeof sub.customer === 'string' ? sub.customer : null;
        const user = customerId
          ? await db.user.findUnique({ where: { stripeCustomerId: customerId } })
          : null;

        if (user) {
          const isActive = sub.status === 'active' || sub.status === 'trialing';
          const currentPeriodEnd = (sub as unknown as { current_period_end: number }).current_period_end;
          await db.user.update({
            where: { id: user.id },
            data: {
              plan: isActive ? 'pro' : 'free',
              creditsRemaining: isActive
                ? 999999
                : Math.max(user.creditsRemaining, 0) < 999999
                ? user.creditsRemaining
                : 10,
            },
          });
          await db.subscription.upsert({
            where: { stripeSubscriptionId: sub.id },
            create: {
              userId: user.id,
              stripeSubscriptionId: sub.id,
              status: sub.status,
              plan: 'pro',
              currentPeriodEnd: new Date(currentPeriodEnd * 1000),
              cancelAtPeriodEnd: sub.cancel_at_period_end,
            },
            update: {
              userId: user.id,
              status: sub.status,
              plan: 'pro',
              currentPeriodEnd: new Date(currentPeriodEnd * 1000),
              cancelAtPeriodEnd: sub.cancel_at_period_end,
            },
          });
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const sub = event.data.object as Stripe.Subscription;
        const customerId = typeof sub.customer === 'string' ? sub.customer : null;
        const user = customerId
          ? await db.user.findUnique({ where: { stripeCustomerId: customerId } })
          : null;

        if (user) {
          await db.user.update({
            where: { id: user.id },
            data: { plan: 'free', creditsRemaining: 10 },
          });
          await db.subscription.updateMany({
            where: { stripeSubscriptionId: sub.id },
            data: { status: 'canceled' },
          });
        }
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId =
          typeof invoice.customer === 'string' ? invoice.customer : null;
        const user = customerId
          ? await db.user.findUnique({ where: { stripeCustomerId: customerId } })
          : null;
        if (user) {
          // Downgrade on payment failure
          await db.user.update({
            where: { id: user.id },
            data: { plan: 'free', creditsRemaining: 10 },
          });
        }
        break;
      }

      default:
        // No-op for unhandled event types
        break;
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error('[stripe/webhook] error', err);
    return NextResponse.json(
      { error: 'Webhook handler failed.' },
      { status: 500 }
    );
  }
}
