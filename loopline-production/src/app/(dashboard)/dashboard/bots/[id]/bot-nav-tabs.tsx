"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { Settings2, Inbox, BarChart3 } from "lucide-react";

const TABS = [
  { id: "setup", label: "Setup", href: "setup", icon: Settings2 },
  { id: "inbox", label: "Inbox", href: "inbox", icon: Inbox },
  { id: "analytics", label: "Analytics", href: "analytics", icon: BarChart3 },
] as const;

export function BotNavTabs({
  botId,
  active,
}: {
  botId: string;
  active: "setup" | "inbox" | "analytics";
}) {
  return (
    <div className="mb-6 flex gap-1 border-b border-border">
      {TABS.map((tab) => {
        const isActive = tab.id === active;
        return (
          <Link
            key={tab.id}
            href={`/dashboard/bots/${botId}/${tab.href}`}
            className={cn(
              "flex items-center gap-2 border-b-2 px-4 py-2.5 text-sm font-medium transition",
              isActive
                ? "border-brand-500 text-brand-500"
                : "border-transparent text-muted-foreground hover:text-foreground",
            )}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
