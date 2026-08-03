import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { DashboardTopbar } from "@/components/dashboard/sidebar";
import { InboxView } from "@/components/dashboard/inbox-view";

export default async function WorkspaceInboxPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.workspaceId) redirect("/signin");
  const wsId = session.user.workspaceId;

  const bots = await db.bot.findMany({
    where: { workspaceId: wsId },
    select: { id: true, name: true, primaryColor: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <>
      <DashboardTopbar
        title="Inbox"
        subtitle={`${bots.length} bot${bots.length === 1 ? "" : "s"} · live conversation feed`}
      />
      {bots.length === 0 ? (
        <div className="container-loopline py-6">
          <div className="rounded-3xl border border-dashed border-border bg-card p-12 text-center">
            <h2 className="font-display text-xl text-foreground">No bots yet</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Create a bot first — conversations will appear here once visitors start chatting.
            </p>
          </div>
        </div>
      ) : (
        <InboxView workspaceBots={bots} />
      )}
    </>
  );
}
