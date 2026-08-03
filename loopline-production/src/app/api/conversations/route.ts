import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const SHOWCASE_MODE = process.env.NEXT_PUBLIC_SHOWCASE_MODE !== "0";
const CONVERSATION_STATUS_VALUES = ["OPEN", "NEEDS_HUMAN", "RESOLVED", "SPAM"] as const;
type ConversationStatus = (typeof CONVERSATION_STATUS_VALUES)[number];

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.workspaceId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const wsId = session.user.workspaceId;
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") as ConversationStatus | "all" | null;
  const botId = searchParams.get("botId");

  if (SHOWCASE_MODE || !process.env.DATABASE_URL) {
    return NextResponse.json({ conversations: [] });
  }

  const { db } = await import("@/lib/db");
  const where: Record<string, unknown> = {
    bot: { workspaceId: wsId },
  };
  if (status && status !== "all") where.status = status;
  if (botId) where.botId = botId;

  const conversations = await db.conversation.findMany({
    where,
    orderBy: { updatedAt: "desc" },
    take: 100,
    include: {
      bot: { select: { id: true, name: true, primaryColor: true } },
      messages: {
        orderBy: { createdAt: "asc" },
        select: { id: true, role: true, content: true, createdAt: true },
      },
    },
  });

  return NextResponse.json({ conversations });
}

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.workspaceId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json().catch(() => ({}));
  const { conversationId, status, visitorName } = body as {
    conversationId?: string;
    status?: ConversationStatus;
    visitorName?: string;
  };
  if (!conversationId) {
    return NextResponse.json({ error: "conversationId required" }, { status: 400 });
  }

  if (SHOWCASE_MODE || !process.env.DATABASE_URL) {
    return NextResponse.json({
      conversation: {
        id: conversationId,
        status: status || "OPEN",
        visitorName: visitorName || "Demo visitor",
      },
      showcase: true,
    });
  }

  const { db } = await import("@/lib/db");
  const conv = await db.conversation.findUnique({
    where: { id: conversationId },
    select: { bot: { select: { workspaceId: true } } },
  });
  if (!conv || conv.bot.workspaceId !== session.user.workspaceId) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const data: Record<string, unknown> = {};
  if (status) data.status = status;
  if (visitorName !== undefined) data.visitorName = visitorName;

  const updated = await db.conversation.update({
    where: { id: conversationId },
    data,
  });
  return NextResponse.json({ conversation: updated });
}