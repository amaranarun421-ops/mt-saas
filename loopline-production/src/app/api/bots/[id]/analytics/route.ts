import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const SHOWCASE_MODE = process.env.NEXT_PUBLIC_SHOWCASE_MODE !== "0";

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(_req: Request, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.workspaceId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;

  if (SHOWCASE_MODE || !process.env.DATABASE_URL) {
    return NextResponse.json({
      bot: {
        id,
        name: "Demo Bot",
        primaryColor: "#1a56db",
        createdAt: new Date().toISOString(),
      },
      summary: {
        totalConversations: 0,
        messageCount: 0,
        chunkCount: 0,
        resolved: 0,
        needsHuman: 0,
        aiHandled: 0,
        resolutionRate: 0,
      },
      volumeByDay: Array.from({ length: 14 }, (_, index) => {
        const d = new Date();
        d.setDate(d.getDate() - (13 - index));
        return { date: d.toISOString().slice(5, 10), count: 0 };
      }),
      topQuestions: [],
      showcase: true,
    });
  }

  const { db } = await import("@/lib/db");
  const bot = await db.bot.findUnique({
    where: { id },
    select: { workspaceId: true, name: true, primaryColor: true, createdAt: true },
  });
  if (!bot || bot.workspaceId !== session.user.workspaceId) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const [conversations, messageCount, chunkCount] = await Promise.all([
    db.conversation.findMany({
      where: { botId: id },
      orderBy: { createdAt: "desc" },
      take: 500,
      select: {
        id: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        messages: {
          where: { role: "USER" },
          select: { content: true },
          take: 1,
          orderBy: { createdAt: "asc" },
        },
      },
    }),
    db.message.count({ where: { conversation: { botId: id } } }),
    db.knowledgeChunk.count({ where: { botId: id } }),
  ]);

  const fourteenDaysAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);
  const recentConversations = conversations.filter((c) => c.createdAt >= fourteenDaysAgo);

  const volumeByDay: { date: string; count: number }[] = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - i);
    const next = new Date(d);
    next.setDate(next.getDate() + 1);
    const count = recentConversations.filter((c) => c.createdAt >= d && c.createdAt < next).length;
    volumeByDay.push({
      date: d.toISOString().slice(5, 10),
      count,
    });
  }

  const resolved = conversations.filter((c) => c.status === "RESOLVED").length;
  const needsHuman = conversations.filter((c) => c.status === "NEEDS_HUMAN").length;
  const aiHandled = conversations.filter((c) => c.status === "AI").length;
  const resolutionRate = conversations.length === 0 ? 0 : Math.round(((conversations.length - needsHuman) / conversations.length) * 100);

  const questionCounts = new Map<string, number>();
  for (const c of conversations) {
    const q = c.messages[0]?.content?.trim().toLowerCase().slice(0, 100);
    if (q) questionCounts.set(q, (questionCounts.get(q) || 0) + 1);
  }
  const topQuestions = Array.from(questionCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([question, count]) => ({ question, count }));

  return NextResponse.json({
    bot,
    summary: {
      totalConversations: conversations.length,
      messageCount,
      chunkCount,
      resolved,
      needsHuman,
      aiHandled,
      resolutionRate,
    },
    volumeByDay,
    topQuestions,
  });
}