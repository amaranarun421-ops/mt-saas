import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import {
  CREDIT_PACKS,
  SUBSCRIPTION_PLAN,
  formatPrice,
} from "@/lib/constants";

const SHOWCASE_MODE = process.env.NEXT_PUBLIC_SHOWCASE_MODE !== "0";

const PurchaseSchema = z.object({
  packId: z.enum(["50", "200", "500", "subscription"]),
});

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }
  const parsed = PurchaseSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "validation_error", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  const { packId } = parsed.data;
  const currentCredits = session.user.creditsRemaining ?? 100;

  if (SHOWCASE_MODE || !process.env.DATABASE_URL) {
    if (packId === "subscription") {
      return NextResponse.json({
        ok: true,
        subscriptionId: `demo-sub-${Date.now()}`,
        creditsAdded: SUBSCRIPTION_PLAN.credits,
        creditsRemaining: currentCredits + SUBSCRIPTION_PLAN.credits,
        showcase: true,
      });
    }

    const pack = CREDIT_PACKS.find((p) => p.id === packId);
    if (!pack) {
      return NextResponse.json({ error: "unknown_pack" }, { status: 400 });
    }

    return NextResponse.json({
      ok: true,
      paymentIntentId: `demo-pi-${Date.now()}`,
      creditsAdded: pack.credits,
      priceLabel: formatPrice(pack.priceCents),
      creditsRemaining: currentCredits + pack.credits,
      showcase: true,
    });
  }

  const { db } = await import("@/lib/db");
  const userId = session.user.id;

  if (packId === "subscription") {
    const now = new Date();
    const periodEnd = new Date(now);
    periodEnd.setDate(periodEnd.getDate() + 30);

    const existing = await db.subscription.findFirst({
      where: { userId, status: "active" },
    });

    let subscriptionId: string;
    if (existing) {
      await db.subscription.update({
        where: { id: existing.id },
        data: {
          currentPeriodEnd: periodEnd,
          status: "active",
        },
      });
      subscriptionId = existing.id;
    } else {
      const created = await db.subscription.create({
        data: {
          userId,
          stripeSubscriptionId: `mock_sub_${Date.now()}`,
          status: "active",
          currentPeriodEnd: periodEnd,
          plan: "pro",
        },
      });
      subscriptionId = created.id;
    }

    await db.$transaction([
      db.user.update({
        where: { id: userId },
        data: {
          creditsRemaining: { increment: SUBSCRIPTION_PLAN.credits },
        },
      }),
      db.creditTransaction.create({
        data: {
          userId,
          amount: SUBSCRIPTION_PLAN.credits,
          type: "subscription_refill",
        },
      }),
    ]);

    const updated = await db.user.findUnique({
      where: { id: userId },
      select: { creditsRemaining: true },
    });

    return NextResponse.json({
      ok: true,
      subscriptionId,
      creditsAdded: SUBSCRIPTION_PLAN.credits,
      creditsRemaining: updated?.creditsRemaining ?? 0,
    });
  }

  const pack = CREDIT_PACKS.find((p) => p.id === packId);
  if (!pack) {
    return NextResponse.json({ error: "unknown_pack" }, { status: 400 });
  }

  const mockPi = `mock_pi_${Date.now()}`;

  await db.$transaction([
    db.creditPurchase.create({
      data: {
        userId,
        stripePaymentIntentId: mockPi,
        creditsPurchased: pack.credits,
        amountPaidCents: pack.priceCents,
      },
    }),
    db.user.update({
      where: { id: userId },
      data: { creditsRemaining: { increment: pack.credits } },
    }),
    db.creditTransaction.create({
      data: {
        userId,
        amount: pack.credits,
        type: "purchase",
      },
    }),
  ]);

  const updated = await db.user.findUnique({
    where: { id: userId },
    select: { creditsRemaining: true },
  });

  return NextResponse.json({
    ok: true,
    paymentIntentId: mockPi,
    creditsAdded: pack.credits,
    priceLabel: formatPrice(pack.priceCents),
    creditsRemaining: updated?.creditsRemaining ?? 0,
  });
}
