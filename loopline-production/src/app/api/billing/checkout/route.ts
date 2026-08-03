import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { createCheckoutSession } from "@/lib/stripe";
import { z } from "zod";
import type { Plan } from "@prisma/client";

const schema = z.object({
  plan: z.enum(["PRO", "AGENCY"]),
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
  const plan = parsed.data.plan as Plan;

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
