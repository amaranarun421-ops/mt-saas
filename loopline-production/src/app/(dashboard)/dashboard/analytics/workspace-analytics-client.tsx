"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { MessageSquare, Activity, Users, Bot as BotIcon } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface Bot {
  id: string;
  name: string;
  primaryColor: string;
}

interface AnalyticsData {
  bot: { id: string; name: string; primaryColor: string };
  summary: {
    totalConversations: number;
    messageCount: number;
    resolved: number;
    needsHuman: number;
    aiHandled: number;
    resolutionRate: number;
  };
  volumeByDay: { date: string; count: number }[];
}

export function WorkspaceAnalyticsClient({ bots }: { bots: Bot[] }) {
  const [selectedBot, setSelectedBot] = useState<string>(bots[0]?.id || "");
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!selectedBot) return;
    setLoading(true);
    fetch(`/api/bots/${selectedBot}/analytics`)
      .then((r) => r.json())
      .then((d) => setData(d))
      .finally(() => setLoading(false));
  }, [selectedBot]);

  const activeBot = bots.find((b) => b.id === selectedBot) || bots[0];
  const maxVolume = Math.max(...(data?.volumeByDay.map((d) => d.count) || [1]), 1);

  return (
    <div className="space-y-6">
      {/* Bot selector */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar">
        {bots.map((bot) => (
          <button
            key={bot.id}
            type="button"
            onClick={() => setSelectedBot(bot.id)}
            className={cn(
              "flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition",
              selectedBot === bot.id
                ? "border-brand-500 bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-200"
                : "border-border bg-card text-muted-foreground hover:bg-accent",
            )}
          >
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: bot.primaryColor }} />
            {bot.name}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="h-32 animate-pulse bg-muted/40" />
          ))}
        </div>
      ) : data ? (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard icon={MessageSquare} label="Conversations" value={data.summary.totalConversations} color="brand" />
            <StatCard icon={Activity} label="Resolution rate" value={`${data.summary.resolutionRate}%`} color="mint" />
            <StatCard icon={Users} label="Needs human" value={data.summary.needsHuman} color="amber" />
            <StatCard icon={BotIcon} label="Messages sent" value={data.summary.messageCount} color="brand" />
          </div>

          <Card className="p-5">
            <h3 className="font-display text-lg text-foreground">Volume · last 14 days</h3>
            <div className="mt-6 flex h-44 items-end gap-1.5">
              {data.volumeByDay.map((d, i) => {
                const height = d.count === 0 ? 4 : Math.max(8, (d.count / maxVolume) * 160);
                return (
                  <div key={i} className="group flex flex-1 flex-col items-center gap-2" title={`${d.date}: ${d.count}`}>
                    <div className="relative flex w-full flex-1 items-end justify-center">
                      <div
                        className="w-full rounded-t-md transition-all duration-500 group-hover:opacity-80"
                        style={{ height: `${height}px`, backgroundColor: activeBot?.primaryColor }}
                      />
                    </div>
                    <span className="text-[9px] text-muted-foreground">{d.date}</span>
                  </div>
                );
              })}
            </div>
          </Card>

          <Card className="p-5">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg text-foreground">{activeBot?.name}</h3>
              <Link
                href={`/dashboard/bots/${selectedBot}/analytics`}
                className="text-xs font-medium text-brand-500 hover:underline"
              >
                View full analytics →
              </Link>
            </div>
          </Card>
        </>
      ) : null}
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | number;
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
    </Card>
  );
}
