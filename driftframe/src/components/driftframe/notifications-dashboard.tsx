"use client";

import * as React from "react";
import {
  Bell,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Info,
  Trash2,
} from "lucide-react";
import { GlassPanel } from "@/components/driftframe/glass-panel";
import { cn } from "@/lib/utils";
import { formatRelative } from "@/lib/format";

interface NotificationItem {
  id: string;
  type: "success" | "warning" | "info" | "feature";
  title: string;
  body: string;
  createdAt: string;
  read: boolean;
}

const TYPE_META: Record<
  NotificationItem["type"],
  { icon: React.ComponentType<{ className?: string }>; color: string; bg: string; label: string }
> = {
  success: {
    icon: CheckCircle2,
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-500/10",
    label: "Success",
  },
  warning: {
    icon: AlertCircle,
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-500/10",
    label: "Warning",
  },
  info: {
    icon: Info,
    color: "text-[#7c3aed]",
    bg: "bg-[#7c3aed]/10",
    label: "Info",
  },
  feature: {
    icon: Sparkles,
    color: "text-[#7c3aed]",
    bg: "bg-[#7c3aed]/10",
    label: "New feature",
  },
};

export function NotificationsDashboard() {
  // Compute the seeded notifications ONCE per component instance via a
  // `useState` initializer. This is still called on both server and client
  // (producing slightly different `createdAt` ISO strings), but only the
  // formatted RELATIVE time is rendered — and that's gated behind `mounted`
  // below so the server render and first client render both produce the
  // same stable placeholder, eliminating any hydration mismatch.
  const [items, setItems] = React.useState<NotificationItem[]>(() => [
    {
      id: "n1",
      type: "warning",
      title: "Credits running low",
      body: "You have 8 credits left. Buy a pack to keep generating without interruption.",
      createdAt: new Date(Date.now() - 3600000).toISOString(),
      read: false,
    },
    {
      id: "n2",
      type: "success",
      title: "Generation complete",
      body: "Your batch of 4 images for \"Bioluminescent jellyfish over a neon skyline\" is ready.",
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      read: false,
    },
    {
      id: "n3",
      type: "feature",
      title: "New: API keys",
      body: "You can now generate Driftframe images programmatically. Visit API Keys to mint a key.",
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      read: true,
    },
    {
      id: "n4",
      type: "info",
      title: "Welcome to Driftframe v3",
      body: "We've refreshed the dashboard with a sidebar, billing, usage charts, and more.",
      createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
      read: true,
    },
    {
      id: "n5",
      type: "success",
      title: "100 credits added",
      body: "Your demo account was topped up with 100 credits. Have fun generating!",
      createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
      read: true,
    },
  ]);
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  function markAllRead() {
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  function dismiss(id: string) {
    setItems((prev) => prev.filter((n) => n.id !== id));
  }

  const unread = items.filter((n) => !n.read).length;

  return (
    <div className="driftframe-container-wide py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-[#7c3aed]" />
            <h1 className="font-display text-2xl font-semibold tracking-tight">
              Notifications
            </h1>
            {unread > 0 && (
              <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[#7c3aed] px-1.5 text-[10px] font-bold text-white">
                {unread}
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Credits alerts, generation completions, and product updates.
          </p>
        </div>
        {unread > 0 && (
          <button
            type="button"
            onClick={markAllRead}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-medium hover:bg-muted/60 transition-colors min-h-[36px]"
          >
            <CheckCircle2 className="h-3.5 w-3.5" /> Mark all as read
          </button>
        )}
      </div>

      {/* List */}
      {items.length === 0 ? (
        <GlassPanel className="flex flex-col items-center justify-center py-16 text-center">
          <Bell className="h-8 w-8 text-muted-foreground" />
          <h2 className="mt-3 font-display text-lg font-medium">All caught up</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            You have no notifications right now.
          </p>
        </GlassPanel>
      ) : (
        <div className="space-y-2">
          {items.map((n) => {
            const meta = TYPE_META[n.type];
            const Icon = meta.icon;
            return (
              <GlassPanel
                key={n.id}
                className={cn(
                  "flex items-start gap-4 transition-opacity",
                  !n.read && "ring-1 ring-[#7c3aed]/20",
                )}
              >
                <span
                  className={cn(
                    "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                    meta.bg,
                  )}
                >
                  <Icon className={cn("h-4 w-4", meta.color)} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-foreground">{n.title}</p>
                    {!n.read && (
                      <span className="inline-block h-2 w-2 rounded-full bg-[#7c3aed]" />
                    )}
                  </div>
                  <p className="mt-0.5 text-sm text-muted-foreground">{n.body}</p>
                  <p className="mt-1.5 text-xs text-muted-foreground">
                    {mounted ? formatRelative(n.createdAt) : "—"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => dismiss(n.id)}
                  aria-label="Dismiss notification"
                  title="Dismiss"
                  className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-foreground/5 transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </GlassPanel>
            );
          })}
        </div>
      )}

      <p className="text-center text-xs text-muted-foreground">
        Demo mode — notifications are illustrative. In production these would
        be persisted in the database and pushed via WebSocket.
      </p>
    </div>
  );
}
