"use client";

import * as React from "react";
import Link from "next/link";
import {
  Sparkles,
  Image as ImageIcon,
  Heart,
  Globe2,
  Wand2,
  Clock,
  CreditCard,
  ArrowRight,
} from "lucide-react";
import { GlassPanel } from "@/components/driftframe/glass-panel";
import { GradientLink } from "@/components/driftframe/gradient-button";
import { cn } from "@/lib/utils";
import { formatRelative } from "@/lib/format";

export interface DashboardActivityItem {
  id: string;
  prompt: string;
  style: string;
  aspectRatio: string;
  createdAt: string;
  thumb: string | null;
}

interface DashboardHomeHeaderProps {
  name: string | null;
  creditsRemaining: number;
  creditsUsed: number;
  imagesGenerated: number;
  favoritesCount: number;
  publicCount: number;
  activity: DashboardActivityItem[];
}

export function DashboardHomeHeader({
  name,
  creditsRemaining,
  creditsUsed,
  imagesGenerated,
  favoritesCount,
  publicCount,
  activity,
}: DashboardHomeHeaderProps) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  const greeting = name ? `Welcome back, ${name.split(" ")[0]}` : "Welcome back";

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
      <div className="space-y-4">
        <GlassPanel className="relative overflow-hidden">
          <div className="bg-radial-spotlight absolute inset-0 opacity-50" aria-hidden />
          <div className="relative flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                Driftframe Studio
              </p>
              <h1 className="mt-1 font-display text-2xl font-semibold tracking-tight sm:text-3xl">
                {greeting}.
              </h1>
              <p className="mt-2 max-w-md text-sm text-muted-foreground">
                Write a prompt, pick a style, and generate four variations in
                seconds. You have <span className="font-medium text-foreground">{creditsRemaining} credits</span> ready.
              </p>
            </div>
            <div className="flex flex-shrink-0 flex-col gap-2 sm:items-end">
              <GradientLink href="/dashboard/history" variant="glass" leftIcon={<Clock className="h-4 w-4" />}>
                View history
              </GradientLink>
              <GradientLink href="/dashboard/credits" variant="outline" leftIcon={<CreditCard className="h-4 w-4" />}>
                Buy credits
              </GradientLink>
            </div>
          </div>
        </GlassPanel>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard label="Images generated" value={imagesGenerated} icon={<ImageIcon className="h-4 w-4" />} />
          <StatCard label="Credits used" value={creditsUsed} icon={<Sparkles className="h-4 w-4" />} />
          <StatCard label="Credits left" value={creditsRemaining} icon={<CreditCard className="h-4 w-4" />} highlight />
          <StatCard label="Favorites" value={favoritesCount} icon={<Heart className="h-4 w-4" />} />
        </div>
      </div>

      <GlassPanel className="flex flex-col">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-sm font-semibold uppercase tracking-widest text-muted-foreground">
            Recent activity
          </h2>
          <Link href="/dashboard/history" className="inline-flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground">
            All <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        {activity.length === 0 ? (
          <div className="mt-6 flex flex-col items-center justify-center py-10 text-center">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-muted">
              <Wand2 className="h-5 w-5 text-muted-foreground" />
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              No generations yet - your recent prompts will appear here.
            </p>
          </div>
        ) : (
          <ul className="driftframe-scroll mt-3 max-h-96 space-y-2 overflow-y-auto">
            {activity.map((item) => (
              <li key={item.id}>
                <Link href="/dashboard/history" className="group flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-foreground/[0.04]">
                  <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-border bg-muted" aria-hidden>
                    {item.thumb && <img src={item.thumb} alt="" className="driftframe-img h-full w-full object-cover" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-1 text-xs font-medium text-foreground">{item.prompt}</p>
                    <p className="mt-0.5 text-[11px] text-muted-foreground">
                      <span className="capitalize">{item.style.replace("-", " ")}</span>
                      {" - "}
                      {item.aspectRatio}
                      {" - "}
                      {mounted ? formatRelative(item.createdAt) : "-"}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
        <div className="mt-3 border-t border-border pt-3 text-[11px] text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Globe2 className="h-3 w-3" /> {publicCount} public images
          </span>
        </div>
      </GlassPanel>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
  highlight,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  highlight?: boolean;
}) {
  return (
    <GlassPanel className={cn("flex flex-col gap-1", highlight && "ring-1 ring-[#7c3aed]/30")}>
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
        <span className="text-muted-foreground">{icon}</span>
      </div>
      <p className="font-display text-2xl font-semibold tabular-nums text-foreground">{value}</p>
    </GlassPanel>
  );
}