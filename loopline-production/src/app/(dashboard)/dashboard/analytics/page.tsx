import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { DashboardTopbar } from "@/components/dashboard/sidebar";
import { WorkspaceAnalyticsClient } from "./workspace-analytics-client";

export default async function WorkspaceAnalyticsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.workspaceId) redirect("/signin");
  const wsId = session.user.workspaceId;

  let bots: Array<{ id: string; name: string; primaryColor: string }> = [];
  try {
    const { db } = await import("@/lib/db");
    bots = await db.bot.findMany({
      where: { workspaceId: wsId },
      select: { id: true, name: true, primaryColor: true },
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("[loopline analytics] showcase fallback", error);
  }

  return (
    <>
      <DashboardTopbar title="Analytics" subtitle="Workspace-wide conversation metrics" />
      <div className="container-loopline py-6">
        {bots.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-border bg-card p-12 text-center">
            <h2 className="font-display text-xl text-foreground">No bots yet</h2>
            <p className="mt-2 text-sm text-muted-foreground">Create a bot to start collecting analytics.</p>
          </div>
        ) : (
          <WorkspaceAnalyticsClient bots={bots} />
        )}
      </div>
    </>
  );
}
