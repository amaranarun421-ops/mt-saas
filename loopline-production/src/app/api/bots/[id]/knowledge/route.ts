import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { chunkText } from "@/lib/utils";
import { z } from "zod";

const SHOWCASE_MODE = process.env.NEXT_PUBLIC_SHOWCASE_MODE !== "0";

interface Params {
  params: Promise<{ id: string }>;
}

const uploadSchema = z.object({
  content: z.string().min(1, "Content is required").max(200_000, "Content too long (max 200k chars)"),
  sourceName: z.string().min(1, "Source name is required").max(120),
});

async function ensureBot(id: string, workspaceId: string) {
  const { db } = await import("@/lib/db");
  const bot = await db.bot.findUnique({
    where: { id },
    select: { workspaceId: true },
  });
  if (!bot || bot.workspaceId !== workspaceId) return null;
  return bot;
}

export async function POST(req: Request, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.workspaceId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;

  const body = await req.json().catch(() => ({}));
  const parsed = uploadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || "Invalid input" },
      { status: 400 },
    );
  }

  if (SHOWCASE_MODE || !process.env.DATABASE_URL) {
    const chunks = chunkText(parsed.data.content, parsed.data.sourceName).map((content, index) => ({
      id: `demo-chunk-${index + 1}`,
      botId: id,
      content,
      sourceName: parsed.data.sourceName,
    }));
    return NextResponse.json({ count: chunks.length, chunks, showcase: true });
  }

  const bot = await ensureBot(id, session.user.workspaceId);
  if (!bot) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const { db } = await import("@/lib/db");
  const chunks = chunkText(parsed.data.content, parsed.data.sourceName);
  const created = await db.$transaction(
    chunks.map((content) =>
      db.knowledgeChunk.create({
        data: {
          botId: id,
          content,
          sourceName: parsed.data.sourceName,
        },
      }),
    ),
  );

  return NextResponse.json({ count: created.length, chunks: created });
}

export async function GET(_req: Request, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.workspaceId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;

  if (SHOWCASE_MODE || !process.env.DATABASE_URL) {
    return NextResponse.json({ chunks: [] });
  }

  const bot = await ensureBot(id, session.user.workspaceId);
  if (!bot) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const { db } = await import("@/lib/db");
  const chunks = await db.knowledgeChunk.findMany({
    where: { botId: id },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      sourceName: true,
      content: true,
      createdAt: true,
    },
  });
  return NextResponse.json({ chunks });
}

export async function DELETE(req: Request, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.workspaceId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;

  if (SHOWCASE_MODE || !process.env.DATABASE_URL) {
    return NextResponse.json({ ok: true, showcase: true });
  }

  const bot = await ensureBot(id, session.user.workspaceId);
  if (!bot) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const { db } = await import("@/lib/db");
  const { searchParams } = new URL(req.url);
  const chunkId = searchParams.get("chunkId");

  if (chunkId) {
    await db.knowledgeChunk.delete({ where: { id: chunkId } });
  } else {
    await db.knowledgeChunk.deleteMany({ where: { botId: id } });
  }
  return NextResponse.json({ ok: true });
}