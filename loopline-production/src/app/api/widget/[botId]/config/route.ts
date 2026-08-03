import { NextResponse } from "next/server";

const SHOWCASE_MODE = process.env.NEXT_PUBLIC_SHOWCASE_MODE !== "0";

interface Params {
  params: Promise<{ botId: string }>;
}

export async function GET(_req: Request, { params }: Params) {
  const { botId } = await params;

  if (SHOWCASE_MODE || !process.env.DATABASE_URL) {
    return NextResponse.json({
      bot: {
        id: botId,
        name: "Demo Bot",
        avatarUrl: null,
        primaryColor: "#1a56db",
        welcomeMessage: "Hi! How can I help you today?",
      },
      showcase: true,
    });
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
  if (!bot) {
    return NextResponse.json({ error: "Bot not found" }, { status: 404 });
  }
  return NextResponse.json({ bot });
}