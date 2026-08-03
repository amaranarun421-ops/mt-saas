import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { planFromPriceId } from "@/lib/stripe";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";

/**
 * Stripe webhook handler.
 *
 * In simulated mode (no STRIPE_SECRET_KEY), this route is never hit —
 * /dashboard/billing/success handles the fake "checkout completed" event
 * directly.
 *
 * When real Stripe keys are present, point your webhook at this URL:
 *   https://your-deployment.app/api/billing/webhook
 * with events:
 *   - checkout.session.completed
 *   - customer.subscription.updated
 *   - customer.subscription.deleted
 *   - invoice.payment_failed
 */
export async function POST(req: Request) {
  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json(
      { error: "Stripe not configured" },
      { status: 400 },
    );
  }

  const sig = req.headers.get("stripe-signature");
  if (!sig) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;
  const rawBody = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
  } catch (err: any) {
    console.error("[webhook] signature verification failed:", err.message);
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 },
    );
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const wsId = session.client_reference_id || session.metadata?.workspaceId;
        const plan = session.metadata?.plan as
          | "PRO"
          | "AGENCY"
          | undefined;
        if (!wsId || !plan) break;

        // Ensure user has a stripeCustomerId
        if (session.customer) {
          const ws = await db.workspace.findUnique({
            where: { id: wsId },
            select: { ownerId: true },
          });
          if (ws) {
            await db.user.update({
              where: { id: ws.ownerId },
              data: { stripeCustomerId: session.customer as string },
            });
          }
        }

        await db.subscription.upsert({
          where: { workspaceId: wsId },
          create: {
            workspaceId: wsId,
            plan,
            status: "ACTIVE",
            stripeSubscriptionId: session.subscription as string,
            stripePriceId: session.metadata?.priceId,
          },
          update: {
            plan,
            status: "ACTIVE",
            stripeSubscriptionId: session.subscription as string,
            stripePriceId: session.metadata?.priceId,
          },
        });
        await db.workspace.update({
          where: { id: wsId },
          data: { plan },
        });
        break;
      }

      case "customer.subscription.updated": {
        const sub = event.data.object as Stripe.Subscription;
        const wsId = sub.metadata?.workspaceId;
        if (!wsId) break;
        const plan = planFromPriceId(sub.items.data[0]?.price?.id) || (sub.metadata.plan as any);

        await db.subscription.update({
          where: { workspaceId: wsId },
          data: {
            plan: plan || "FREE",
            status: sub.status === "active" ? "ACTIVE" : (sub.status.toUpperCase() as any),
            currentPeriodEnd: new Date(sub.current_period_end * 1000),
            cancelAtPeriodEnd: sub.cancel_at_period_end,
            stripeSubscriptionId: sub.id,
            stripePriceId: sub.items.data[0]?.price?.id,
          },
        });
        if (plan) {
          await db.workspace.update({ where: { id: wsId }, data: { plan } });
        }
        break;
      }

      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        const wsId = sub.metadata?.workspaceId;
        if (!wsId) break;
        await db.subscription.update({
          where: { workspaceId: wsId },
          data: { plan: "FREE", status: "CANCELED", cancelAtPeriodEnd: false },
        });
        await db.workspace.update({ where: { id: wsId }, data: { plan: "FREE" } });
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const wsId = invoice.subscription_details?.metadata?.workspaceId;
        if (!wsId) break;
        await db.subscription.update({
          where: { workspaceId: wsId },
          data: { status: "PAST_DUE" },
        });
        break;
      }

      default:
        // Ignore unhandled events
        break;
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error("[webhook] handler error:", err);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 },
    );
  }
}
