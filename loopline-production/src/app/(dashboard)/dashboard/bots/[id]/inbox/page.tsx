import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { DashboardTopbar } from "@/components/dashboard/sidebar";
import { InboxView } from "@/components/dashboard/inbox-view";
import { BotNavTabs } from "../bot-nav-tabs";

const SHOWCASE_MODE = process.env.NEXT_PUBLIC_SHOWCASE_MODE !== "0";

export default async function BotInboxPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.workspaceId) redirect("/signin");
  const { id } = await params;

  let bot: { id: string; name: string; primaryColor: string; workspaceId: string } | null = null;
  let allBots: Array<{ id: string; name: string; primaryColor: string }> = [];

  if (SHOWCASE_MODE || !process.env.DATABASE_URL) {
    bot = {
      id,
      name: "Loopline Assistant",
      primaryColor: "#F97316",
      workspaceId: session.user.workspaceId,
    };
    allBots = [bot];
  } else {
    const { db } = await import("@/lib/db");
    bot = await db.bot.findUnique({
      where: { id },
      select: { id: true, name: true, primaryColor: true, workspaceId: true },
    });

    if (bot && bot.workspaceId === session.user.workspaceId) {
      allBots = await db.bot.findMany({
        where: { workspaceId: session.user.workspaceId },
        select: { id: true, name: true, primaryColor: true },
        orderBy: { createdAt: "desc" },
      });
    }
  }

  if (!bot || bot.workspaceId !== session.user.workspaceId) notFound();

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