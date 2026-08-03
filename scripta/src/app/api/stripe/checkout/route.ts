import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/lib/db';
import { getStripe } from '@/lib/stripe';

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const stripe = getStripe();
    if (!stripe) {
      return NextResponse.json(
        { error: 'Stripe is not configured on this server.' },
        { status: 503 }
      );
    }

    const body = await req.json();
    const plan = body.plan as 'monthly' | 'annual';
    if (plan !== 'monthly' && plan !== 'annual') {
      return NextResponse.json(
        { error: 'Invalid plan. Use "monthly" or "annual".' },
        { status: 400 }
      );
    }

    const priceId =
      plan === 'monthly'
        ? process.env.STRIPE_PRICE_PRO_MONTHLY
        : process.env.STRIPE_PRICE_PRO_ANNUAL;

    if (!priceId) {
      return NextResponse.json(
        { error: 'Stripe price ID is not configured for this plan.' },
        { status: 503 }
      );
    }

    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, email: true, stripeCustomerId: true, name: true },
    });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Re-use existing Stripe customer if we have one
    let customerId = user.stripeCustomerId;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name ?? undefined,
        metadata: { userId: user.id },
      });
      customerId = customer.id;
      await db.user.update({
        where: { id: user.id },
        data: { stripeCustomerId: customerId },
      });
    }

    const origin =
      process.env.NEXTAUTH_URL ??
      req.headers.get('origin') ??
      'http://localhost:3000';

    const checkout = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer: customerId,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${origin}/dashboard/billing?checkout=success`,
      cancel_url: `${origin}/dashboard/billing?checkout=cancelled`,
      metadata: { userId: user.id, plan },
    });

    if (!checkout.url) {
      return NextResponse.json(
        { error: 'Stripe did not return a checkout URL.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ url: checkout.url });
  } catch (err) {
    console.error('[stripe/checkout] error', err);
    return NextResponse.json(
      { error: 'Failed to start Stripe checkout.' },
      { status: 500 }
    );
  }
}
