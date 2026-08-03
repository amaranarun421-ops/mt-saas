import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PLANS, computeUsageState } from "@/lib/billing";
import { z } from "zod";

const SHOWCASE_MODE = process.env.NEXT_PUBLIC_SHOWCASE_MODE !== "0";

const createSchema = z.object({
  name: z.string().min(1, "Bot name is required").max(60),
  primaryColor: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Invalid color").default("#1a56db"),
  welcomeMessage: z.string().max(280).default("Hi! How can I help you today?"),
  avatarUrl: z.string().url().optional().or(z.literal("")),
});

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.workspaceId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (SHOWCASE_MODE || !process.env.DATABASE_URL) {
    return NextResponse.json({ bots: [] });
  }

  const { db } = await import("@/lib/db");
  const bots = await db.bot.findMany({
    where: { workspaceId: session.user.workspaceId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      primaryColor: true,
      welcomeMessage: true,
      avatarUrl: true,
      createdAt: true,
      _count: { select: { conversations: true, knowledgeChunks: true } },
    },
  });
  return NextResponse.json({ bots });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.workspaceId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const wsId = session.user.workspaceId;

  const body = await req.json().catch(() => ({}));
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || "Invalid input" },
      { status: 400 },
    );
  }

  if (SHOWCASE_MODE || !process.env.DATABASE_URL) {
    return NextResponse.json({
      bot: {
        id: `demo-bot-${Date.now()}`,
        workspaceId: wsId,
        name: parsed.data.name,
        primaryColor: parsed.data.primaryColor,
        welcomeMessage: parsed.data.welcomeMessage,
        avatarUrl: parsed.data.avatarUrl || null,
      },
      showcase: true,
    });
  }

  const { db } = await import("@/lib/db");
  const [workspace, botCount] = await Promise.all([
    db.workspace.findUnique({
      where: { id: wsId },
      include: { subscription: true },
    }),
    db.bot.count({ where: { workspaceId: wsId } }),
  ]);
  const plan = workspace?.subscription?.plan || "FREE";
  const usage = computeUsageState(plan, botCount, 0);

  if (!usage.canCreateBot) {
    return NextResponse.json(
      {
        error: `You've reached the ${PLANS[plan].name} plan's bot limit (${PLANS[plan].botLimit}). Upgrade to create more bots.`,
      },
      { status: 403 },
    );
  }

  const bot = await db.bot.create({
    data: {
      workspaceId: wsId,
      name: parsed.data.name,
      primaryColor: parsed.data.primaryColor,
      welcomeMessage: parsed.data.welcomeMessage,
      avatarUrl: parsed.data.avatarUrl || null,
    },
  });

  return NextResponse.json({ bot });
}