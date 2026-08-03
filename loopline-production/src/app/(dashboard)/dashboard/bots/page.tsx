import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { DashboardTopbar } from "@/components/dashboard/sidebar";
import { Bot as BotIcon, ArrowRight, MessageSquare, FileText, Settings2 } from "lucide-react";
import { timeAgo } from "@/lib/utils";
import { CreateBotDialog } from "./create-bot-dialog";
import { PLANS, computeUsageState } from "@/lib/billing";

export default async function BotsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.workspaceId) redirect("/signin");
  const wsId = session.user.workspaceId;

  let workspace: { subscription: { plan: keyof typeof PLANS } | null } | null = { subscription: { plan: "FREE" as keyof typeof PLANS } };
  let bots: Array<any> = [];

  try {
    const { db } = await import("@/lib/db");
    [workspace, bots] = await Promise.all([
      db.workspace.findUnique({ where: { id: wsId }, include: { subscription: true } }),
      db.bot.findMany({
        where: { workspaceId: wsId },
        orderBy: { createdAt: "desc" },
        include: { _count: { select: { conversations: true, knowledgeChunks: true } }, conversations: { orderBy: { updatedAt: "desc" }, take: 1, select: { updatedAt: true } } },
      }),
    ]);
  } catch (error) {
    console.error("[loopline bots] showcase fallback", error);
  }

  const plan = (workspace?.subscription?.plan || "FREE") as keyof typeof PLANS;
  const usage = computeUsageState(plan, bots.length, 0);

  return (
    <>
      <DashboardTopbar title="Bots" subtitle={`${bots.length} of ${usage.limit.bots === null ? "8" : usage.limit.bots} bots used`} actions={<CreateBotDialog canCreate={usage.canCreateBot} planName={PLANS[plan].name} />} />
      <div className="container-loopline py-6">
        {bots.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-border bg-card p-12 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-300"><BotIcon className="h-6 w-6" /></div>
            <h2 className="mt-4 font-display text-2xl text-foreground">No bots yet</h2>
            <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">Create your first bot to get an install snippet and start resolving support tickets automatically.</p>
            <div className="mt-6 flex justify-center"><CreateBotDialog canCreate={usage.canCreateBot} planName={PLANS[plan].name} /></div>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {bots.map((bot) => {
              const isActive = bot._count.conversations > 0;
              const lastActive = bot.conversations[0]?.updatedAt;
              return (
                <Link key={bot.id} href={`/dashboard/bots/${bot.id}/setup`} className="group rounded-2xl border border-border bg-card p-5 transition hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-[var(--shadow-lift)]">
                  <div className="flex items-start justify-between">
                    <span className="relative flex h-12 w-12 items-center justify-center rounded-xl text-white" style={{ backgroundColor: bot.primaryColor }}><BotIcon className="h-5 w-5" /></span>
                    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${isActive ? "bg-mint-500/15 text-mint-600" : "bg-muted text-muted-foreground"}`}><span className={`h-1.5 w-1.5 rounded-full ${isActive ? "bg-mint-500" : "bg-muted-foreground"}`} />{isActive ? "Active" : "Idle"}</span>
                  </div>
                  <h3 className="mt-4 truncate font-display text-lg text-foreground">{bot.name}</h3>
                  <p className="mt-0.5 text-xs text-muted-foreground">{lastActive ? `Last active ${timeAgo(lastActive)}` : "No conversations yet"}</p>
                  <div className="mt-4 flex items-center gap-4 border-t border-border pt-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><MessageSquare className="h-3.5 w-3.5" />{bot._count.conversations} convo</span>
                    <span className="flex items-center gap-1"><FileText className="h-3.5 w-3.5" />{bot._count.knowledgeChunks} chunks</span>
                  </div>
                  <div className="mt-3 flex items-center gap-2 text-xs font-medium text-brand-500 opacity-0 transition group-hover:opacity-100"><Settings2 className="h-3.5 w-3.5" />Open setup<ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" /></div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
