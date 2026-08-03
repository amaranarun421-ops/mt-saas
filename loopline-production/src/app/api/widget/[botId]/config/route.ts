import { NextResponse } from "next/server";
import { db } from "@/lib/db";

interface Params {
  params: Promise<{ botId: string }>;
}

/**
 * Public endpoint — returns a bot's public configuration.
 * No auth required (end-users load this in the widget iframe).
 */
export async function GET(_req: Request, { params }: Params) {
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
  if (!bot) {
    return NextResponse.json({ error: "Bot not found" }, { status: 404 });
  }
  return NextResponse.json({ bot });
}
