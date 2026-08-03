import Link from 'next/link';
import { auth } from '@/auth';
import { db } from '@/lib/db';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  FileText,
  MessageSquare,
  Mail,
  Package,
  Zap,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Clock,
} from 'lucide-react';
import { relativeTime } from '@/lib/utils';

const MODES = [
  {
    id: 'blog',
    name: 'Blog Post',
    desc: 'Structured posts with H1, H2 sections, intro, conclusion.',
    icon: FileText,
    color: 'from-violet-500 to-purple-600',
    free: true,
  },
  {
    id: 'social',
    name: 'Social Caption',
    desc: 'Three variations + hashtags for IG, LinkedIn, X.',
    icon: MessageSquare,
    color: 'from-pink-500 to-rose-600',
    free: true,
  },
  {
    id: 'email',
    name: 'Email Copy',
    desc: 'Welcome, promo, follow-up, announcement emails.',
    icon: Mail,
    color: 'from-blue-500 to-indigo-600',
    free: false,
  },
  {
    id: 'product',
    name: 'Product Description',
    desc: 'Short + long benefits-led descriptions in one go.',
    icon: Package,
    color: 'from-amber-500 to-orange-600',
    free: false,
  },
] as const;

export default async function DashboardOverviewPage() {
  const session = await auth();
  const userId = session!.user.id;
  const plan = session!.user.plan;
  const credits = session!.user.creditsRemaining;

  let recentDocs: Array<{ id: string; title: string; type: string; updatedAt: Date }> = [];
  let totalCount = 0;
  let byType: Array<{ type: string; _count: { type: number } }> = [];

  try {
    [recentDocs, totalCount, byType] = await Promise.all([
      db.document.findMany({
        where: { userId },
        orderBy: { updatedAt: 'desc' },
        take: 5,
        select: { id: true, title: true, type: true, updatedAt: true },
      }),
      db.document.count({ where: { userId } }),
      db.document.groupBy({ by: ['type'], where: { userId }, _count: { type: true } }),
    ]);
  } catch (error) {
    console.error('[dashboard overview] document stats unavailable', error);
  }

  const typeMap = Object.fromEntries(byType.map((b) => [b.type, b._count.type]));

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            Welcome back, {session!.user.firstName ?? session!.user.name?.split(' ')[0] ?? 'writer'}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Pick a write mode or jump back into a recent document.
          </p>
        </div>
        <Button asChild className="h-10 text-white button-bg btn-press">
          <Link href="/dashboard/write/blog">
            <Sparkles className="mr-2 h-4 w-4" />
            New document
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Total documents" value={totalCount.toString()} icon={FileText} accent="bg-violet-500" />
        <StatCard label="Credits remaining" value={plan === 'pro' ? 'Unlimited' : credits.toString()} icon={Zap} accent="bg-amber-500" />
        <StatCard label="Current plan" value={plan === 'pro' ? 'Pro' : 'Free'} icon={TrendingUp} accent="bg-green-500" />
      </div>

      <Card className="border-border/60">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Quick start</CardTitle>
          <p className="text-sm text-muted-foreground">
            Choose a write mode to start generating content.
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {MODES.map((mode) => {
              const locked = !mode.free && plan !== 'pro';
              return (
                <Link
                  key={mode.id}
                  href={`/dashboard/write/${mode.id}`}
                  className="relative rounded-xl border border-border/60 bg-card p-4 transition hover:border-primary-300 hover:shadow-theme-md group card-lift"
                >
                  <div className="flex items-center justify-between">
                    <div className={`grid h-10 w-10 place-items-center rounded-lg bg-gradient-to-br ${mode.color} text-white shadow-theme-sm`}>
                      <mode.icon className="h-4 w-4" />
                    </div>
                    {locked && <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-medium text-amber-700">Pro</span>}
                  </div>
                  <h3 className="mt-3 text-sm font-semibold">{mode.name}</h3>
                  <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{mode.desc}</p>
                  <div className="mt-3 flex items-center gap-1 text-xs font-medium text-primary-600 opacity-0 transition group-hover:opacity-100">
                    Open
                    <ArrowRight className="h-3 w-3" />
                  </div>
                </Link>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/60">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-base">Recent documents</CardTitle>
          {totalCount > 0 && (
            <Button asChild variant="ghost" size="sm">
              <Link href="/dashboard/documents">
                View all
                <ArrowRight className="ml-1 h-3.5 w-3.5" />
              </Link>
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {recentDocs.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="divide-y divide-border/40">
              {recentDocs.map((doc) => (
                <Link
                  key={doc.id}
                  href={`/dashboard/documents/${doc.id}`}
                  className="-mx-2 flex items-center gap-4 rounded-md px-2 py-3 transition group hover:bg-muted/40"
                >
                  <div className="grid h-9 w-9 place-items-center rounded-md bg-primary-50 text-primary-600 dark:bg-primary-500/10 dark:text-primary-300">
                    <TypeIcon type={doc.type} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium transition group-hover:text-primary-600">{doc.title}</div>
                    <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="uppercase">{doc.type}</span>
                      <span>|</span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {relativeTime(doc.updatedAt)}
                      </span>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 transition group-hover:opacity-100" />
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {totalCount > 0 && (
        <Card className="border-border/60">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">By write mode</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {MODES.map((mode) => {
                const count = typeMap[mode.id] ?? 0;
                const pct = totalCount > 0 ? (count / totalCount) * 100 : 0;
                return (
                  <div key={mode.id} className="rounded-lg border border-border/60 p-3">
                    <div className="flex items-center gap-2">
                      <mode.icon className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-xs font-medium">{mode.name}</span>
                    </div>
                    <div className="mt-2 flex items-baseline gap-1">
                      <span className="text-xl font-bold">{count}</span>
                      <span className="text-xs text-muted-foreground">docs</span>
                    </div>
                    <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                      <div className="h-full rounded-full transition-all button-bg" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
  accent,
}: {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  accent: string;
}) {
  return (
    <Card className="border-border/60 card-lift">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
            <p className="mt-2 text-2xl font-bold">{value}</p>
          </div>
          <div className={`grid h-10 w-10 place-items-center rounded-lg ${accent}/10 text-white`}>
            <span className={`grid h-10 w-10 place-items-center rounded-lg ${accent} text-white`}>
              <Icon className="h-4 w-4" />
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function EmptyState() {
  return (
    <div className="rounded-xl border border-dashed border-border/60 px-6 py-12 text-center">
      <div className="mx-auto max-w-sm">
        <svg viewBox="0 0 64 64" className="mx-auto h-16 w-16 text-primary-400/60" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="12" y="14" width="40" height="44" rx="4" />
          <path d="M22 28h20M22 36h20M22 44h12" />
        </svg>
        <h3 className="mt-4 text-lg font-semibold">No documents yet</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Generate your first piece of content and it&apos;ll show up here.
        </p>
        <Button asChild className="mt-4 h-10 text-white button-bg btn-press">
          <Link href="/dashboard/write/blog">
            <Sparkles className="mr-2 h-4 w-4" />
            Start writing
          </Link>
        </Button>
      </div>
    </div>
  );
}

function TypeIcon({ type }: { type: string }) {
  switch (type) {
    case 'blog':
      return <FileText className="h-4 w-4" />;
    case 'social':
      return <MessageSquare className="h-4 w-4" />;
    case 'email':
      return <Mail className="h-4 w-4" />;
    case 'product':
      return <Package className="h-4 w-4" />;
    default:
      return <FileText className="h-4 w-4" />;
  }
}
