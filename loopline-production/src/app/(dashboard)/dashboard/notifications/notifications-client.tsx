"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Bell, MessageSquare, AlertTriangle, CreditCard, Bot, Mail, Webhook, Check } from "lucide-react";
import { toast } from "sonner";
import { cn, timeAgo } from "@/lib/utils";

const CHANNELS = [
  { id: "email", label: "Email", desc: "demo@loopline.dev", icon: Mail },
  { id: "webhook", label: "Webhook", desc: "Configure in Webhooks tab", icon: Webhook },
  { id: "inapp", label: "In-app", desc: "Dashboard bell icon", icon: Bell },
];

const EVENTS = [
  { id: "new_conversation", label: "New conversation started", desc: "A visitor opened the widget and sent a message", icon: MessageSquare, default: true },
  { id: "needs_human", label: "Conversation needs human", desc: "A visitor tapped 'Talk to a human'", icon: AlertTriangle, default: true },
  { id: "bot_created", label: "Bot created", desc: "A new bot was added to the workspace", icon: Bot, default: false },
  { id: "payment_failed", label: "Payment failed", desc: "Stripe invoice payment failed", icon: CreditCard, default: true },
  { id: "plan_upgraded", label: "Plan upgraded", desc: "Workspace plan was upgraded", icon: CreditCard, default: false },
  { id: "kb_uploaded", label: "Knowledge base updated", desc: "New content uploaded to a bot", icon: Bot, default: false },
];

const RECENT = [
  { id: 1, icon: MessageSquare, color: "brand", title: "New conversation from Sarah Chen", body: "Started a chat with Acme Support Bot", time: "2 minutes ago", read: false },
  { id: 2, icon: AlertTriangle, color: "amber", title: "Marcus Patel requested human handoff", body: "Conversation flagged as needs human", time: "8 minutes ago", read: false },
  { id: 3, icon: Bot, color: "mint", title: "Billing Helper bot resolved a conversation", body: "AI resolved a billing question automatically", time: "23 minutes ago", read: false },
  { id: 4, icon: CreditCard, color: "brand", title: "Pro plan renewed", body: "Your subscription renewed for another month", time: "2 hours ago", read: true },
  { id: 5, icon: MessageSquare, color: "brand", title: "5 new conversations today", body: "Acme Support Bot handled 5 conversations", time: "6 hours ago", read: true },
  { id: 6, icon: Bot, color: "violet", title: "Knowledge base updated", body: "FAQ.md was updated for Acme Support Bot", time: "1 day ago", read: true },
];

export function NotificationsClient() {
  const [prefs, setPrefs] = useState<Record<string, Record<string, boolean>>>(() => {
    const init: Record<string, Record<string, boolean>> = {};
    for (const ev of EVENTS) {
      init[ev.id] = { email: ev.default, webhook: false, inapp: ev.default };
    }
    return init;
  });

  function toggle(eventId: string, channel: string, value: boolean) {
    setPrefs((prev) => ({
      ...prev,
      [eventId]: { ...prev[eventId], [channel]: value },
    }));
    toast.success("Notification preference updated");
  }

  function markAllRead() {
    toast.success("All notifications marked as read");
  }

  const colorMap: Record<string, string> = {
    brand: "bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-300",
    amber: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
    mint: "bg-mint-500/15 text-mint-600",
    violet: "bg-violet-50 text-violet-600 dark:bg-violet-500/15 dark:text-violet-300",
  };

  return (
    <div className="space-y-6">
      {/* Recent notifications */}
      <Card className="p-0 overflow-hidden">
        <div className="flex items-center justify-between border-b border-border p-5">
          <div>
            <h2 className="font-display text-lg text-foreground">Recent notifications</h2>
            <p className="text-xs text-muted-foreground">Latest activity across your workspace</p>
          </div>
          <Button variant="outline" size="sm" onClick={markAllRead}>
            <Check className="h-3.5 w-3.5" />
            Mark all read
          </Button>
        </div>
        <div className="divide-y divide-border">
          {RECENT.map((n) => (
            <div
              key={n.id}
              className={cn(
                "flex items-start gap-3 p-4 transition hover:bg-accent/50",
                !n.read && "bg-brand-50/30 dark:bg-brand-500/5",
              )}
            >
              <span className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-xl", colorMap[n.color])}>
                <n.icon className="h-4 w-4" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-foreground">{n.title}</p>
                  {!n.read && <span className="h-2 w-2 rounded-full bg-brand-500" />}
                </div>
                <p className="text-xs text-muted-foreground">{n.body}</p>
                <p className="mt-1 text-[10px] text-muted-foreground/70">{n.time}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Preferences */}
      <Card className="p-0 overflow-hidden">
        <div className="border-b border-border p-5">
          <h2 className="font-display text-lg text-foreground">Notification preferences</h2>
          <p className="text-xs text-muted-foreground">Choose which events trigger notifications and where they&apos;re delivered</p>
        </div>

        {/* Channel headers */}
        <div className="grid grid-cols-[1fr_repeat(3,80px)] items-center gap-2 border-b border-border bg-muted/30 px-5 py-2.5">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Event</p>
          {CHANNELS.map((c) => (
            <div key={c.id} className="text-center">
              <c.icon className="mx-auto h-3.5 w-3.5 text-muted-foreground" />
              <p className="mt-0.5 text-[10px] font-medium text-muted-foreground">{c.label}</p>
            </div>
          ))}
        </div>

        {/* Rows */}
        <div className="divide-y divide-border">
          {EVENTS.map((ev) => (
            <div key={ev.id} className="grid grid-cols-[1fr_repeat(3,80px)] items-center gap-2 px-5 py-3.5">
              <div className="flex items-start gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                  <ev.icon className="h-3.5 w-3.5" />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground">{ev.label}</p>
                  <p className="text-xs text-muted-foreground">{ev.desc}</p>
                </div>
              </div>
              {CHANNELS.map((c) => (
                <div key={c.id} className="flex justify-center">
                  <Switch
                    checked={prefs[ev.id]?.[c.id]}
                    onCheckedChange={(v) => toggle(ev.id, c.id, v)}
                    aria-label={`${ev.label} via ${c.label}`}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
