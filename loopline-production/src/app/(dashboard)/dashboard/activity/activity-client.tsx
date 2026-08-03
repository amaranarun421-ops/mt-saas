"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Search,
  MessageSquare,
  Bot,
  User,
  CreditCard,
  Settings,
  FileText,
  LogIn,
  Webhook,
  Key,
  Users,
  Filter,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ActivityItem {
  id: string;
  user: string;
  action: string;
  target: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  time: string;
  meta?: string;
}

const ACTIVITY: ActivityItem[] = [
  { id: "1", user: "Sarah Chen", action: "replied to", target: "conversation with Marcus Patel", icon: MessageSquare, color: "brand", time: "2 min ago", meta: "Human agent reply" },
  { id: "2", user: "System", action: "resolved", target: "conversation with Sarah Chen", icon: Bot, color: "mint", time: "8 min ago", meta: "AI auto-resolved" },
  { id: "3", user: "Demo User", action: "updated knowledge base for", target: "Acme Support Bot", icon: FileText, color: "brand", time: "23 min ago", meta: "Added 3 chunks from FAQ.md" },
  { id: "4", user: "Marcus Patel", action: "flagged", target: "conversation as needs human", icon: User, color: "amber", time: "1 hour ago", meta: "Billing question" },
  { id: "5", user: "System", action: "renewed", target: "Pro subscription", icon: CreditCard, color: "brand", time: "2 hours ago", meta: "$29.00 charged via Stripe" },
  { id: "6", user: "Demo User", action: "created", target: "Billing Helper bot", icon: Bot, color: "violet", time: "4 hours ago", meta: "Color: #8b5cf6" },
  { id: "7", user: "Elena Rossi", action: "joined", target: "workspace", icon: Users, color: "brand", time: "6 hours ago", meta: "Accepted invite" },
  { id: "8", user: "Demo User", action: "generated", target: "API key 'Production'", icon: Key, color: "amber", time: "8 hours ago" },
  { id: "9", user: "System", action: "delivered webhook to", target: "https://api.acme.dev/...", icon: Webhook, color: "mint", time: "10 hours ago", meta: "200 OK" },
  { id: "10", user: "Demo User", action: "updated", target: "workspace settings", icon: Settings, color: "brand", time: "1 day ago", meta: "Renamed to 'Acme Support'" },
  { id: "11", user: "Sarah Chen", action: "signed in", target: "", icon: LogIn, color: "mint", time: "1 day ago" },
  { id: "12", user: "System", action: "resolved", target: "conversation with Elena Rossi", icon: Bot, color: "mint", time: "1 day ago", meta: "AI auto-resolved" },
];

const FILTERS = ["All activity", "Conversations", "Bots", "Billing", "Team", "System"];

const colorMap: Record<string, string> = {
  brand: "bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-300",
  amber: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
  mint: "bg-mint-500/15 text-mint-600",
  violet: "bg-violet-50 text-violet-600 dark:bg-violet-500/15 dark:text-violet-300",
};

export function ActivityClient() {
  const [filter, setFilter] = useState("All activity");
  const [search, setSearch] = useState("");

  const filtered = ACTIVITY.filter((a) => {
    if (search) {
      const q = search.toLowerCase();
      return (
        a.user.toLowerCase().includes(q) ||
        a.action.toLowerCase().includes(q) ||
        a.target.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-1 overflow-x-auto no-scrollbar">
          {FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={cn(
                "flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition",
                filter === f
                  ? "bg-foreground text-background"
                  : "bg-muted text-muted-foreground hover:bg-accent",
              )}
            >
              {f === "All activity" && <Filter className="h-3 w-3" />}
              {f}
            </button>
          ))}
        </div>
        <div className="relative sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search activity…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Timeline */}
      <Card className="p-0 overflow-hidden">
        <div className="divide-y divide-border">
          {filtered.map((item) => (
            <div key={item.id} className="flex items-start gap-3 p-4 transition hover:bg-accent/50">
              <span className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-xl", colorMap[item.color])}>
                <item.icon className="h-4 w-4" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm text-foreground">
                  <span className="font-semibold">{item.user}</span>{" "}
                  <span className="text-muted-foreground">{item.action}</span>{" "}
                  {item.target && <span className="font-medium">{item.target}</span>}
                </p>
                {item.meta && (
                  <p className="mt-0.5 text-xs text-muted-foreground">{item.meta}</p>
                )}
              </div>
              <span className="shrink-0 text-xs text-muted-foreground">{item.time}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
