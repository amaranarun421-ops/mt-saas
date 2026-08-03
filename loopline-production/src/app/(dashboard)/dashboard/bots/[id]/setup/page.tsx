import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect, notFound } from "next/navigation";
import { DashboardTopbar } from "@/components/dashboard/sidebar";
import { BotSetupTabs } from "../bot-setup-tabs";
import { BotNavTabs } from "../bot-nav-tabs";

export default async function BotSetupPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.workspaceId) redirect("/signin");
  const { id } = await params;

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

  if (!bot || bot.workspaceId !== session.user.workspaceId) {
    notFound();
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || "http://localhost:3000";
  const installSnippet = `<script
  src="${appUrl}/widget.js"
  data-bot-id="${bot.id}"
  defer
></script>`;

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
