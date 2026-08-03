import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { DashboardTopbar } from "@/components/dashboard/sidebar";
import { BillingClient } from "./billing-client";
import { PLANS, computeUsageState, isStripeConfigured } from "@/lib/billing";

export default async function BillingPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.workspaceId) redirect("/signin");
  const wsId = session.user.workspaceId;

  const [workspace, botCount, monthConvoCount] = await Promise.all([
    db.workspace.findUnique({
      where: { id: wsId },
      include: { subscription: true },
    }),
    db.bot.count({ where: { workspaceId: wsId } }),
    db.conversation.count({
      where: {
        bot: { workspaceId: wsId },
        createdAt: { gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) },
      },
    }),
  ]);

  const plan = workspace?.subscription?.plan || "FREE";
  const usage = computeUsageState(plan, botCount, monthConvoCount);

  return (
    <>
      <DashboardTopbar
        title="Billing"
        subtitle={isStripeConfigured() ? "Connected to Stripe" : "Simulated billing mode (add STRIPE_SECRET_KEY to go live)"}
      />
      <div className="container-loopline py-6">
        <BillingClient
          currentPlan={plan}
          usage={usage}
          botCount={botCount}
          monthConvoCount={monthConvoCount}
          subscription={workspace?.subscription ? {
            status: workspace.subscription.status,
            currentPeriodEnd: workspace.subscription.currentPeriodEnd?.toISOString() || null,
            cancelAtPeriodEnd: workspace.subscription.cancelAtPeriodEnd,
          } : null}
          stripeConfigured={isStripeConfigured()}
        />
      </div>
    </>
  );
}
