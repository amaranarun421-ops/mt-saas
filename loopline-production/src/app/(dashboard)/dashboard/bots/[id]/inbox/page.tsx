import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect, notFound } from "next/navigation";
import { DashboardTopbar } from "@/components/dashboard/sidebar";
import { InboxView } from "@/components/dashboard/inbox-view";
import { BotNavTabs } from "../../bot-nav-tabs";

export default async function BotInboxPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.workspaceId) redirect("/signin");
  const { id } = await params;

  const bot = await db.bot.findUnique({
    where: { id },
    select: { id: true, name: true, primaryColor: true, workspaceId: true },
  });
  if (!bot || bot.workspaceId !== session.user.workspaceId) notFound();

  const allBots = await db.bot.findMany({
    where: { workspaceId: session.user.workspaceId },
    select: { id: true, name: true, primaryColor: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <>
      <DashboardTopbar title={bot.name} subtitle="Inbox" />
      <div className="container-loopline pt-0">
        <BotNavTabs botId={bot.id} active="inbox" />
      </div>
      <InboxView botId={bot.id} workspaceBots={allBots} />
    </>
  );
}
