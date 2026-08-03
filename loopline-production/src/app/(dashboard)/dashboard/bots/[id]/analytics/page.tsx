import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { DashboardTopbar } from "@/components/dashboard/sidebar";
import { BotNavTabs } from "../bot-nav-tabs";
import { AnalyticsPanel } from "./analytics-panel";

const SHOWCASE_MODE = process.env.NEXT_PUBLIC_SHOWCASE_MODE !== "0";

export default async function BotAnalyticsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.workspaceId) redirect("/signin");
  const { id } = await params;

  let bot:
    | { id: string; name: string; primaryColor: string; workspaceId: string; createdAt: Date }
    | null = null;

  if (SHOWCASE_MODE || !process.env.DATABASE_URL) {
    bot = {
      id,
      name: "Loopline Assistant",
      primaryColor: "#F97316",
      workspaceId: session.user.workspaceId,
      createdAt: new Date(),
    };
  } else {
    const { db } = await import("@/lib/db");
    bot = await db.bot.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        primaryColor: true,
        workspaceId: true,
        createdAt: true,
      },
    });
  }

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