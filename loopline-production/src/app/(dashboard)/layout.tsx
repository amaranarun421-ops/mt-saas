import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { DashboardSidebar, type SidebarBot } from "@/components/dashboard/sidebar";

const SHOWCASE_MODE = process.env.NEXT_PUBLIC_SHOWCASE_MODE !== "0";
const DEMO_WORKSPACE_ID = "demo-workspace";
const DEMO_WORKSPACE_NAME = "Loopline Demo Workspace";
const DEMO_PLAN = "FREE";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/signin");

  let workspaceName = DEMO_WORKSPACE_NAME;
  let plan = DEMO_PLAN;
  let bots: SidebarBot[] = [];

  if (!SHOWCASE_MODE) {
    try {
      const workspaceId = session.user.workspaceId;
      if (!workspaceId) redirect("/signin");

      const [workspace, botsRaw] = await Promise.all([
        db.workspace.findUnique({ where: { id: workspaceId }, include: { subscription: true } }),
        db.bot.findMany({
          where: { workspaceId },
          select: {
            id: true,
            name: true,
            primaryColor: true,
            conversations: { select: { id: true }, take: 1 },
          },
          orderBy: { createdAt: "desc" },
        }),
      ]);

      if (!workspace) redirect("/signin");
      workspaceName = workspace.name;
      plan = workspace.subscription?.plan || DEMO_PLAN;
      bots = botsRaw.map((b) => ({
        id: b.id,
        name: b.name,
        primaryColor: b.primaryColor,
        hasConversations: b.conversations.length > 0,
      }));
    } catch (error) {
      console.error("[loopline layout] showcase fallback", error);
    }
  }

  if (!session.user.workspaceId) {
    // @ts-expect-error demo session augmentation
    session.user.workspaceId = DEMO_WORKSPACE_ID;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <DashboardSidebar bots={bots} workspaceName={workspaceName} plan={plan} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto scrollbar-loopline">{children}</div>
      </div>
    </div>
  );
}
