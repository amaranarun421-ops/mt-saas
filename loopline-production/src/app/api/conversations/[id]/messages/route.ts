import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const SHOWCASE_MODE = process.env.NEXT_PUBLIC_SHOWCASE_MODE !== "0";

interface Params {
  params: Promise<{ id: string }>;
}

export async function POST(req: Request, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.workspaceId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id: conversationId } = await params;

  const body = await req.json().catch(() => ({}));
  const content: string = String(body.content || "").trim();
  if (!content) {
    return NextResponse.json({ error: "Content required" }, { status: 400 });
  }

  if (SHOWCASE_MODE || !process.env.DATABASE_URL) {
    return NextResponse.json({
      message: {
        id: `demo-message-${Date.now()}`,
        conversationId,
        role: "HUMAN_AGENT",
        content,
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

  const message = await db.message.create({
    data: {
      conversationId,
      role: "HUMAN_AGENT",
      content,
    },
  });

  await db.conversation.update({
    where: { id: conversationId },
    data: { status: "NEEDS_HUMAN", updatedAt: new Date() },
  });

  return NextResponse.json({ message });
}

export async function GET(_req: Request, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.workspaceId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id: conversationId } = await params;

  if (SHOWCASE_MODE || !process.env.DATABASE_URL) {
    return NextResponse.json({ messages: [] });
  }

  const { db } = await import("@/lib/db");
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