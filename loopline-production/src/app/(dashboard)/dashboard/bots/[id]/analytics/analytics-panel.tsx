"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  MessageSquare,
  Activity,
  Users,
  FileText,
  TrendingUp,
} from "lucide-react";
import { EmptyBotsIllustration } from "@/components/brand/illustrations";

interface AnalyticsData {
  summary: {
    totalConversations: number;
    messageCount: number;
    chunkCount: number;
    resolved: number;
    needsHuman: number;
    aiHandled: number;
    resolutionRate: number;
  };
  volumeByDay: { date: string; count: number }[];
  topQuestions: { question: string; count: number }[];
}

export function AnalyticsPanel({
  botId,
  botName,
  botColor,
}: {
  botId: string;
  botName: string;
  botColor: string;
}) {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/bots/${botId}/analytics`);
        const json = await res.json();
        setData(json);
      } catch (e) {
        // silent
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [botId]);

  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="h-32 animate-pulse bg-muted/40" />
        ))}
      </div>
    );
  }

  if (!data || data.summary.totalConversations === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-border bg-card p-12">
        <div className="grid items-center gap-8 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-2xl text-foreground">No data yet</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Once {botName} starts receiving conversations, you&apos;ll see volume
              trends, resolution rate, and the top questions visitors are asking.
            </p>
          </div>
          <EmptyBotsIllustration primary={botColor} />
        </div>
      </div>
    );
  }

  const maxVolume = Math.max(...data.volumeByDay.map((d) => d.count), 1);
  const maxQuestion = Math.max(...data.topQuestions.map((q) => q.count), 1);

  return (
    <div className="space-y-6">
      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={MessageSquare}
          label="Total conversations"
          value={data.summary.totalConversations}
          color="brand"
        />
        <StatCard
          icon={Activity}
          label="Resolution rate"
          value={`${data.summary.resolutionRate}%`}
          hint={`${data.summary.needsHuman} needed human`}
          color="mint"
        />
        <StatCard
          icon={Users}
          label="Needs human"
          value={data.summary.needsHuman}
          color="amber"
        />
        <StatCard
          icon={FileText}
          label="Knowledge chunks"
          value={data.summary.chunkCount}
          color="brand"
        />
      </div>

      {/* Volume chart */}
      <Card className="p-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-display text-lg text-foreground">Conversation volume</h3>
            <p className="text-xs text-muted-foreground">Last 14 days</p>
          </div>
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <TrendingUp className="h-3.5 w-3.5" />
            {data.volumeByDay.reduce((s, d) => s + d.count, 0)} total
          </span>
        </div>
        <div className="mt-6 flex h-44 items-end gap-1.5">
          {data.volumeByDay.map((d, i) => {
            const height = d.count === 0 ? 4 : Math.max(8, (d.count / maxVolume) * 160);
            return (
              <div
                key={i}
                className="group flex flex-1 flex-col items-center gap-2"
                title={`${d.date}: ${d.count} conversations`}
              >
                <div className="relative flex w-full flex-1 items-end justify-center">
                  <div
                    className="w-full rounded-t-md transition-all duration-500 group-hover:opacity-80"
                    style={{
                      height: `${height}px`,
                      backgroundColor: botColor,
                    }}
                  />
                </div>
                <span className="text-[9px] text-muted-foreground">{d.date}</span>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Top questions */}
      <Card className="p-5">
        <h3 className="font-display text-lg text-foreground">Top questions</h3>
        <p className="text-xs text-muted-foreground">
          Most common opening questions from visitors.
        </p>
        {data.topQuestions.length === 0 ? (
          <p className="mt-4 text-sm text-muted-foreground">No questions yet.</p>
        ) : (
          <div className="mt-4 space-y-2">
            {data.topQuestions.map((q, i) => (
              <div
                key={i}
                className="flex items-center gap-3 rounded-xl border border-border p-3"
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-xs font-semibold text-brand-600 dark:bg-brand-500/15 dark:text-brand-300">
                  {i + 1}
                </span>
                <p className="flex-1 truncate text-sm text-foreground">{q.question}</p>
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-20 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${(q.count / maxQuestion) * 100}%`,
                        backgroundColor: botColor,
                      }}
                    />
                  </div>
                  <span className="w-6 text-right text-xs font-semibold text-foreground">
                    {q.count}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  hint,
  color,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | number;
  hint?: string;
  color: "brand" | "mint" | "amber";
}) {
  const colorClasses = {
    brand: "bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-300",
    mint: "bg-mint-500/15 text-mint-600",
    amber: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
  }[color];
  return (
    <Card className="p-5">
      <span className={`inline-flex h-9 w-9 items-center justify-center rounded-xl ${colorClasses}`}>
        <Icon className="h-4 w-4" />
      </span>
      <p className="mt-3 font-display text-3xl text-foreground">{value}</p>
      <p className="text-xs font-medium text-foreground">{label}</p>
      {hint && <p className="mt-0.5 text-[11px] text-muted-foreground">{hint}</p>}
    </Card>
  );
}
