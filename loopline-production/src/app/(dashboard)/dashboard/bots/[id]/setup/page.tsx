import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { DashboardTopbar } from "@/components/dashboard/sidebar";
import { BotSetupTabs } from "../bot-setup-tabs";
import { BotNavTabs } from "../bot-nav-tabs";

const SHOWCASE_MODE = process.env.NEXT_PUBLIC_SHOWCASE_MODE !== "0";

export default async function BotSetupPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.workspaceId) redirect("/signin");
  const { id } = await params;

  let bot:
    | {
        id: string;
        name: string;
        primaryColor: string;
        welcomeMessage: string;
        avatarUrl: string | null;
        workspaceId: string;
        knowledgeChunks: Array<{ id: string; sourceName: string; content: string; createdAt: Date }>;
        _count: { conversations: number };
      }
    | null = null;

  if (SHOWCASE_MODE || !process.env.DATABASE_URL) {
    bot = {
      id,
      name: "Loopline Assistant",
      primaryColor: "#F97316",
      welcomeMessage: "Hi! I am the Loopline demo assistant. Ask me anything about the product.",
      avatarUrl: null,
      workspaceId: session.user.workspaceId,
      knowledgeChunks: [
        {
          id: "demo-kb-1",
          sourceName: "Product FAQ",
          content: "Loopline helps teams launch support chat widgets with AI replies, inbox routing, and lightweight analytics.",
          createdAt: new Date(),
        },
      ],
      _count: { conversations: 12 },
    };
  } else {
    const { db } = await import("@/lib/db");
    bot = await db.bot.findUnique({
      where: { id },
      include: {
        knowledgeChunks: {
          orderBy: { createdAt: "desc" },
          select: { id: true, sourceName: true, content: true, createdAt: true },
        },
        _count: { select: { conversations: true } },
      },
    });
  }

  if (!bot || bot.workspaceId !== session.user.workspaceId) {
    notFound();
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || "http://localhost:3000";
  const installSnippet = `<script\n  src="${appUrl}/widget.js"\n  data-bot-id="${bot.id}"\n  defer\n></script>`;

  return (
    <>
      <DashboardTopbar
        title={bot.name}
        subtitle="Configure, theme, and install your widget"
      />
      <div className="container-loopline py-6">
        <BotNavTabs botId={bot.id} active="setup" />

        <BotSetupTabs
          bot={{
            id: bot.id,
            name: bot.name,
            primaryColor: bot.primaryColor,
            welcomeMessage: bot.welcomeMessage,
            avatarUrl: bot.avatarUrl,
          }}
          knowledgeChunks={bot.knowledgeChunks.map((c) => ({
            id: c.id,
            sourceName: c.sourceName,
            content: c.content,
            createdAt: c.createdAt.toISOString(),
          }))}
          installSnippet={installSnippet}
          appUrl={appUrl}
        />
      </div>
    </>
  );
}