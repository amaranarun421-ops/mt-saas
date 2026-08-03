import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import type { Plan } from "@prisma/client";

/**
 * Simulated billing success page.
 *
 * In simulated mode (no Stripe keys), the /api/billing/checkout endpoint
 * returns a URL pointing here with ?simulated=1&plan=PRO. This page applies
 * the upgrade directly to the workspace's subscription.
 *
 * When real Stripe is configured, checkout redirects to ?session_id={CHECKOUT_SESSION_ID}
 * and the actual upgrade is applied by the webhook handler at /api/billing/webhook.
 * In that case this page just shows a success message.
 */
export default async function BillingSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ simulated?: string; plan?: string; session_id?: string }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.workspaceId) redirect("/signin");
  const wsId = session.user.workspaceId;
  const sp = await searchParams;

  // Only handle simulated upgrades (real Stripe upgrades happen via webhook)
  if (sp.simulated === "1" && sp.plan) {
    const plan = sp.plan as Plan;
    if (plan === "PRO" || plan === "AGENCY") {
      await db.subscription.upsert({
        where: { workspaceId: wsId },
        create: { workspaceId: wsId, plan, status: "ACTIVE" },
        update: { plan, status: "ACTIVE" },
      });
      await db.workspace.update({ where: { id: wsId }, data: { plan } });
    }
  }

  redirect("/dashboard/billing?upgraded=1");
}
