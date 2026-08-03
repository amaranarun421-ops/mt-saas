import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

interface Params {
  params: Promise<{ id: string }>;
}

/**
 * POST a new message into an existing conversation.
 * Used by human agents replying from the dashboard inbox.
 */
export async function POST(req: Request, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.workspaceId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id: conversationId } = await params;

  const conv = await db.conversation.findUnique({
    where: { id: conversationId },
    select: { bot: { select: { workspaceId: true } } },
  });
  if (!conv || conv.bot.workspaceId !== session.user.workspaceId) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = await req.json().catch(() => ({}));
  const content: string = String(body.content || "").trim();
  if (!content) {
    return NextResponse.json({ error: "Content required" }, { status: 400 });
  }

  const message = await db.message.create({
    data: {
      conversationId,
      role: "HUMAN_AGENT",
      content,
    },
  });

  // Break the conversation out of AI mode — needs human stays until resolved
  await db.conversation.update({
    where: { id: conversationId },
    data: { status: "NEEDS_HUMAN", updatedAt: new Date() },
  });

  return NextResponse.json({ message });
}

/**
 * GET all messages for a conversation (used by the inbox to refresh).
 */
export async function GET(_req: Request, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.workspaceId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id: conversationId } = await params;

  const conv = await db.conversation.findUnique({
    where: { id: conversationId },
    select: { bot: { select: { workspaceId: true } } },
  });
  if (!conv || conv.bot.workspaceId !== session.user.workspaceId) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const messages = await db.message.findMany({
    where: { conversationId },
    orderBy: { createdAt: "asc" },
  });
  return NextResponse.json({ messages });
}
