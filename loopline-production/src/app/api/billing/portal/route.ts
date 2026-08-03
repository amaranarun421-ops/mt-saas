import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createPortalSession } from "@/lib/stripe";

const SHOWCASE_MODE = process.env.NEXT_PUBLIC_SHOWCASE_MODE !== "0";

export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.workspaceId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const wsId = session.user.workspaceId;

  if (SHOWCASE_MODE || !process.env.DATABASE_URL) {
    return NextResponse.json({
      url: `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/dashboard/billing`,
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