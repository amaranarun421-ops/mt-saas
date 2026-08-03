import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DashboardTopbar } from "@/components/dashboard/sidebar";
import { EmptyBotsIllustration } from "@/components/brand/illustrations";
import { Bot, MessageSquare, TrendingUp, Users, ArrowRight, Plus, Activity } from "lucide-react";
import { timeAgo, formatDateTime } from "@/lib/utils";
import { PLANS } from "@/lib/billing";

export default async function DashboardOverviewPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.workspaceId) redirect("/signin");
  const wsId = session.user.workspaceId;

  let workspace: { name: string; subscription: { plan: keyof typeof PLANS } | null } | null = {
    name: "Loopline Demo Workspace",
    subscription: { plan: "FREE" as keyof typeof PLANS },
  };
  let bots: Array<any> = [];
  let conversations: Array<any> = [];
  let monthConversations = 0;

  try {
    const { db } = await import("@/lib/db");
    [workspace, bots, conversations, monthConversations] = await Promise.all([
      db.workspace.findUnique({ where: { id: wsId }, include: { subscription: true } }),
      db.bot.findMany({
        where: { workspaceId: wsId },
        include: {
          conversations: { orderBy: { updatedAt: "desc" }, take: 3, select: { id: true, status: true, updatedAt: true, visitorName: true, messages: { take: 1, orderBy: { createdAt: "desc" }, select: { content: true } } } },
          _count: { select: { conversations: true } },
        },
        orderBy: { createdAt: "desc" },
      }),
      db.conversation.findMany({
        where: { bot: { workspaceId: wsId } },
        orderBy: { updatedAt: "desc" },
        take: 6,
        include: { bot: { select: { name: true, primaryColor: true } }, messages: { take: 1, orderBy: { createdAt: "desc" }, select: { content: true, role: true } } },
      }),
      db.conversation.count({ where: { bot: { workspaceId: wsId }, createdAt: { gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) } } }),
    ]);
  } catch (error) {
    console.error("[loopline overview] showcase fallback", error);
  }

  const plan = (workspace?.subscription?.plan || "FREE") as keyof typeof PLANS;
  const planDef = PLANS[plan];
  const botCount = bots.length;
  const totalConversations = bots.reduce((s, b) => s + (b._count?.conversations ?? 0), 0);
  const needsHumanCount = conversations.filter((c) => c.status === "NEEDS_HUMAN").length;
  const resolvedRate = totalConversations === 0 ? 0 : Math.round(((totalConversations - needsHumanCount) / totalConversations) * 100);
  const hasBots = bots.length > 0;

  return (
    <>
      <DashboardTopbar
        title={`Welcome back, ${session.user.name?.split(" ")[0] || "there"}`}
        subtitle={`${workspace?.name || "Loopline Demo Workspace"} - ${planDef.name} plan`}
        actions={<Button asChild size="sm" withArrow><Link href="/dashboard/bots"><Plus className="h-4 w-4" />New bot</Link></Button>}
      />
      <div className="container-loopline space-y-6 py-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard icon={Bot} label="Active bots" value={String(botCount)} hint={planDef.botLimit === null ? "Unlimited on your plan" : `${Math.max(0, planDef.botLimit - botCount)} remaining`} color="brand" />
          <StatCard icon={MessageSquare} label="Conversations" value={String(totalConversations)} hint={`${monthConversations} this month`} color="brand" />
          <StatCard icon={Users} label="Needs human" value={String(needsHumanCount)} hint={needsHumanCount > 0 ? "Awaiting reply" : "All caught up"} color={needsHumanCount > 0 ? "amber" : "mint"} />
          <StatCard icon={Activity} label="Resolution rate" value={`${resolvedRate}%`} hint="AI-handled without escalation" color="mint" />
        </div>

        {!hasBots ? (
          <div className="rounded-3xl border border-border bg-card p-8 lg:p-12">
            <div className="grid items-center gap-8 lg:grid-cols-2">
              <div>
                <p className="text-sm font-semibold uppercase tracking-widest text-brand-500">Get started</p>
                <h2 className="mt-2 font-display text-3xl text-foreground">Create your first bot</h2>
                <p className="mt-3 text-muted-foreground">A bot is one chatbot tied to one site or product. Name it, pick a color, upload your FAQ, and paste the install snippet onto your site.</p>
                <Button asChild size="lg" withArrow className="mt-6"><Link href="/dashboard/bots">Create a bot</Link></Button>
              </div>
              <EmptyBotsIllustration />
            </div>
          </div>
        ) : (
          <>
            <div className="rounded-2xl border border-border bg-card">
              <div className="flex items-center justify-between border-b border-border p-5">
                <div>
                  <h2 className="font-display text-lg text-foreground">Your bots</h2>
                  <p className="text-xs text-muted-foreground">Each bot is a separate widget for one site or product.</p>
                </div>
                <Button asChild size="sm" variant="outline"><Link href="/dashboard/bots">View all</Link></Button>
              </div>
              <div className="divide-y divide-border">
                {bots.slice(0, 4).map((bot) => (
                  <Link key={bot.id} href={`/dashboard/bots/${bot.id}/setup`} className="flex items-center gap-4 p-5 transition hover:bg-accent">
                    <span className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white" style={{ backgroundColor: bot.primaryColor }}><Bot className="h-5 w-5" /></span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold text-foreground">{bot.name}</p>
                      <p className="text-xs text-muted-foreground">{bot._count.conversations} conversation{bot._count.conversations === 1 ? "" : "s"}{bot.conversations[0] && <> - last active {timeAgo(bot.conversations[0].updatedAt)}</>}</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </Link>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card">
              <div className="flex items-center justify-between border-b border-border p-5">
                <div>
                  <h2 className="font-display text-lg text-foreground">Recent conversations</h2>
                  <p className="text-xs text-muted-foreground">Latest activity across all your bots.</p>
                </div>
              </div>
              {conversations.length === 0 ? (
                <div className="p-10 text-center"><p className="text-sm text-muted-foreground">No conversations yet. Once visitors start chatting with your widget, conversations will appear here.</p></div>
              ) : (
                <div className="divide-y divide-border">
                  {conversations.map((c) => (
                    <div key={c.id} className="flex items-center gap-3 p-4">
                      <span className="h-9 w-9 shrink-0 rounded-lg" style={{ backgroundColor: c.bot.primaryColor, opacity: 0.15 }} />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2"><p className="truncate text-sm font-medium text-foreground">{c.visitorName || "Anonymous visitor"}</p></div>
                        <p className="truncate text-xs text-muted-foreground">{c.bot.name} - {c.messages[0]?.content || "No messages"}</p>
                      </div>
                      <span className="text-xs text-muted-foreground">{formatDateTime(c.updatedAt)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}

function StatCard({ icon: Icon, label, value, hint, color }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string; hint?: string; color: "brand" | "mint" | "amber" }) {
  const colorClasses = {
    brand: "bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-300",
    mint: "bg-mint-500/15 text-mint-600",
    amber: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
  }[color];
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center justify-between"><span className={`inline-flex h-9 w-9 items-center justify-center rounded-xl ${colorClasses}`}><Icon className="h-4 w-4" /></span></div>
      <p className="mt-3 font-display text-3xl text-foreground">{value}</p>
      <p className="text-xs font-medium text-foreground">{label}</p>
      {hint && <p className="mt-0.5 text-[11px] text-muted-foreground">{hint}</p>}
    </div>
  );
}
