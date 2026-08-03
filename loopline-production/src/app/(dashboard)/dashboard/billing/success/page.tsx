import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

type Plan = "PRO" | "AGENCY";

export default async function BillingSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ simulated?: string; plan?: string; session_id?: string }>;
}) {
  const SHOWCASE_MODE = process.env.NEXT_PUBLIC_SHOWCASE_MODE !== "0";
  const session = await getServerSession(authOptions);
  if (!session?.user?.workspaceId) redirect("/signin");
  const wsId = session.user.workspaceId;
  const sp = await searchParams;

  if (!SHOWCASE_MODE && process.env.DATABASE_URL && sp.simulated === "1" && sp.plan) {
    const plan = sp.plan as Plan;
    if (plan === "PRO" || plan === "AGENCY") {
      const { db } = await import("@/lib/db");
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