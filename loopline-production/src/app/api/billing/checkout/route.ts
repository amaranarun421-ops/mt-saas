import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createCheckoutSession } from "@/lib/stripe";
import { z } from "zod";

const SHOWCASE_MODE = process.env.NEXT_PUBLIC_SHOWCASE_MODE !== "0";
const PLAN_VALUES = ["PRO", "AGENCY"] as const;
type Plan = (typeof PLAN_VALUES)[number];

const schema = z.object({
  plan: z.enum(PLAN_VALUES),
});

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.workspaceId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const wsId = session.user.workspaceId;

  const body = await req.json().catch(() => ({}));
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
  }
  const plan: Plan = parsed.data.plan;

  if (SHOWCASE_MODE || !process.env.DATABASE_URL) {
    return NextResponse.json({
      url: `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/dashboard/billing/success?showcase=1&plan=${plan}`,
      showcase: true,
    });
  }

  const { db } = await import("@/lib/db");
  const workspace = await db.workspace.findUnique({
    where: { id: wsId },
    include: { subscription: true },
  });
  if (!workspace) {
    return NextResponse.json({ error: "Workspace not found" }, { status: 404 });
  }

  const origin = req.headers.get("origin") || process.env.NEXTAUTH_URL || "http://localhost:3000";
  const result = await createCheckoutSession({
    workspaceId: wsId,
    workspaceName: workspace.name,
    customerId: workspace.subscription?.stripeSubscriptionId || null,
    plan,
    successUrl: `${origin}/dashboard/billing/success`,
    cancelUrl: `${origin}/dashboard/billing`,
  });

  return NextResponse.json(result);
}