import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { createPortalSession } from "@/lib/stripe";

export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.workspaceId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const wsId = session.user.workspaceId;

  const workspace = await db.workspace.findUnique({
    where: { id: wsId },
    include: { subscription: true },
  });
  if (!workspace) {
    return NextResponse.json({ error: "Workspace not found" }, { status: 404 });
  }

  // Need a Stripe customer ID for portal access
  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { stripeCustomerId: true },
  });
  const customerId = user?.stripeCustomerId;
  if (!customerId) {
    return NextResponse.json(
      { error: "No Stripe customer found. Please complete a checkout first." },
      { status: 400 },
    );
  }

  const origin = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const result = await createPortalSession({
    customerId,
    returnUrl: `${origin}/dashboard/billing`,
  });

  return NextResponse.json(result);
}
