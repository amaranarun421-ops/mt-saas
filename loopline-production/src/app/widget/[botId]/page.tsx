import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { WidgetApp } from "./widget-app";

export const dynamic = "force-dynamic";

export default async function WidgetPage({
  params,
}: {
  params: Promise<{ botId: string }>;
}) {
  const { botId } = await params;
  const bot = await db.bot.findUnique({
    where: { id: botId },
    select: {
      id: true,
      name: true,
      avatarUrl: true,
      primaryColor: true,
      welcomeMessage: true,
    },
  });
  if (!bot) notFound();

  return <WidgetApp bot={bot} />;
}
