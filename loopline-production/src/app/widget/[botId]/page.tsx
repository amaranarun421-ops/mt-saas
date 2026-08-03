import { notFound } from "next/navigation";
import { WidgetApp } from "./widget-app";

export const dynamic = "force-dynamic";

const SHOWCASE_MODE = process.env.NEXT_PUBLIC_SHOWCASE_MODE !== "0";
const DEMO_BOT = {
  id: "demo-bot",
  name: "Loopline Assistant",
  avatarUrl: null,
  primaryColor: "#F97316",
  welcomeMessage: "Hi! I am the Loopline demo assistant. Ask me anything about the product.",
};

export default async function WidgetPage({
  params,
}: {
  params: Promise<{ botId: string }>;
}) {
  const { botId } = await params;

  if (SHOWCASE_MODE || !process.env.DATABASE_URL) {
    return <WidgetApp bot={{ ...DEMO_BOT, id: botId || DEMO_BOT.id }} />;
  }

  const { db } = await import("@/lib/db");
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