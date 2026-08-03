import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect, notFound } from "next/navigation";
import { DashboardTopbar } from "@/components/dashboard/sidebar";
import { BotNavTabs } from "../../bot-nav-tabs";
import { AnalyticsPanel } from "./analytics-panel";

export default async function BotAnalyticsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.workspaceId) redirect("/signin");
  const { id } = await params;

  const bot = await db.bot.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      primaryColor: true,
      workspaceId: true,
      createdAt: true,
    },
  });
  if (!bot || bot.workspaceId !== session.user.workspaceId) notFound();

  return (
    <>
      <DashboardTopbar title={bot.name} subtitle="Analytics" />
      <div className="container-loopline py-6">
        <BotNavTabs botId={bot.id} active="analytics" />
        <AnalyticsPanel botId={bot.id} botName={bot.name} botColor={bot.primaryColor} />
      </div>
    </>
  );
}
