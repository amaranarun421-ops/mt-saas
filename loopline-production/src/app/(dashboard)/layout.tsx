import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { DashboardSidebar, type SidebarBot } from "@/components/dashboard/sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect("/signin");
  }

  // Ensure user has a workspace — auto-create if missing (defensive)
  let workspaceId = session.user.workspaceId;
  if (!workspaceId) {
    const ws = await db.workspace.create({
      data: {
        name: `${session.user.name || session.user.email!.split("@")[0]}'s Workspace`,
        ownerId: session.user.id,
        plan: "FREE",
      },
    });
    await db.user.update({
      where: { id: session.user.id },
      data: { workspaceId: ws.id },
    });
    await db.subscription.create({
      data: { workspaceId: ws.id, plan: "FREE", status: "ACTIVE" },
    });
    workspaceId = ws.id;
  }

  const [workspace, botsRaw] = await Promise.all([
    db.workspace.findUnique({
      where: { id: workspaceId },
      include: { subscription: true },
    }),
    db.bot.findMany({
      where: { workspaceId },
      select: {
        id: true,
        name: true,
        primaryColor: true,
        conversations: {
          select: { id: true },
          take: 1,
        },
      },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  if (!workspace) {
    redirect("/signin");
  }

  const bots: SidebarBot[] = botsRaw.map((b) => ({
    id: b.id,
    name: b.name,
    primaryColor: b.primaryColor,
    hasConversations: b.conversations.length > 0,
  }));

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <DashboardSidebar
        bots={bots}
        workspaceName={workspace.name}
        plan={workspace.subscription?.plan || "FREE"}
      />
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Page content area — pages apply their own container-loopline padding */}
        <div className="flex-1 overflow-y-auto scrollbar-loopline">{children}</div>
      </div>
    </div>
  );
}
