import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { z } from "zod";

const SHOWCASE_MODE = process.env.NEXT_PUBLIC_SHOWCASE_MODE !== "0";

interface Params {
  params: Promise<{ id: string }>;
}

async function ensureBotInWorkspace(botId: string, wsId: string) {
  const { db } = await import("@/lib/db");
  const bot = await db.bot.findUnique({
    where: { id: botId },
    select: { workspaceId: true },
  });
  if (!bot || bot.workspaceId !== wsId) return null;
  return bot;
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
        welcomeMessage: "Hi! How can I help you today?",
        avatarUrl: null,
        knowledgeChunks: [],
        _count: { conversations: 0 },
      },
      showcase: true,
    });
  }

  const owned = await ensureBotInWorkspace(id, session.user.workspaceId);
  if (!owned) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { db } = await import("@/lib/db");
  const bot = await db.bot.findUnique({
    where: { id },
    include: {
      knowledgeChunks: {
        orderBy: { createdAt: "desc" },
        select: { id: true, sourceName: true, content: true, createdAt: true },
      },
      _count: { select: { conversations: true } },
    },
  });
  return NextResponse.json({ bot });
}

const patchSchema = z.object({
  name: z.string().min(1).max(60).optional(),
  primaryColor: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(),
  welcomeMessage: z.string().max(280).optional(),
  avatarUrl: z.string().url().optional().or(z.literal("")).or(z.null()),
});

export async function PATCH(req: Request, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.workspaceId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;

  const body = await req.json().catch(() => ({}));
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || "Invalid input" },
      { status: 400 },
    );
  }

  if (SHOWCASE_MODE || !process.env.DATABASE_URL) {
    const data = { ...parsed.data } as Record<string, unknown>;
    if (data.avatarUrl === "") data.avatarUrl = null;
    return NextResponse.json({ bot: { id, ...data }, showcase: true });
  }

  const owned = await ensureBotInWorkspace(id, session.user.workspaceId);
  if (!owned) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const data: Record<string, unknown> = { ...parsed.data };
  if (data.avatarUrl === "") data.avatarUrl = null;

  const { db } = await import("@/lib/db");
  const bot = await db.bot.update({
    where: { id },
    data,
  });
  return NextResponse.json({ bot });
}

export async function DELETE(_req: Request, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.workspaceId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;

  if (SHOWCASE_MODE || !process.env.DATABASE_URL) {
    return NextResponse.json({ ok: true, showcase: true });
  }

  const owned = await ensureBotInWorkspace(id, session.user.workspaceId);
  if (!owned) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { db } = await import("@/lib/db");
  await db.bot.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}