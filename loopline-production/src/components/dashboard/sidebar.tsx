"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Bot,
  Inbox,
  BarChart3,
  CreditCard,
  Settings,
  LogOut,
  ChevronsUpDown,
  Check,
  Plus,
  Search,
  Bell,
  Users,
  Key,
  Webhook,
  Puzzle,
  Activity,
  HelpCircle,
  ScrollText,
  UserCircle,
} from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { ThemeToggle } from "@/components/brand/theme-toggle";
import { Button } from "@/components/ui/button";
import { cn, initials, timeAgo } from "@/lib/utils";
import { useState, useTransition } from "react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "sonner";

export interface SidebarBot {
  id: string;
  name: string;
  primaryColor: string;
  hasConversations: boolean;
}

interface DashboardSidebarProps {
  bots: SidebarBot[];
  activeBotId?: string;
  workspaceName: string;
  plan: string;
}

const NAV_SECTIONS = [
  {
    label: "Workspace",
    items: [
      { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
      { label: "Bots", href: "/dashboard/bots", icon: Bot },
      { label: "Inbox", href: "/dashboard/inbox", icon: Inbox, badge: "live" },
      { label: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
    ],
  },
  {
    label: "Configure",
    items: [
      { label: "Team", href: "/dashboard/team", icon: Users },
      { label: "API Keys", href: "/dashboard/api-keys", icon: Key },
      { label: "Webhooks", href: "/dashboard/webhooks", icon: Webhook },
      { label: "Integrations", href: "/dashboard/integrations", icon: Puzzle },
    ],
  },
  {
    label: "Account",
    items: [
      { label: "Notifications", href: "/dashboard/notifications", icon: Bell },
      { label: "Activity", href: "/dashboard/activity", icon: Activity },
      { label: "Audit Log", href: "/dashboard/audit-log", icon: ScrollText },
      { label: "Billing", href: "/dashboard/billing", icon: CreditCard },
      { label: "Profile", href: "/dashboard/profile", icon: UserCircle },
      { label: "Settings", href: "/dashboard/settings", icon: Settings },
      { label: "Help", href: "/dashboard/help", icon: HelpCircle },
    ],
  },
];

export function DashboardSidebar({
  bots,
  activeBotId,
  workspaceName,
  plan,
}: DashboardSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const [, startTransition] = useTransition();
  const [botMenuOpen, setBotMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const activeBot = bots.find((b) => b.id === activeBotId) || bots[0];

  return (
    <aside className="flex h-screen w-72 shrink-0 flex-col border-r border-sidebar-border bg-sidebar">
      {/* Workspace + bot switcher */}
      <div className="border-b border-sidebar-border p-4">
        <p className="px-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
          Workspace
        </p>
        <p className="mt-1 truncate px-2 text-sm font-semibold text-foreground">
          {workspaceName}
        </p>

        <Popover open={botMenuOpen} onOpenChange={setBotMenuOpen}>
          <PopoverTrigger asChild>
            <button
              type="button"
              className="mt-3 flex w-full items-center gap-3 rounded-xl border border-border bg-card p-3 text-left transition hover:border-brand-300 hover:bg-accent"
            >
              <span
                className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-white"
                style={{ backgroundColor: activeBot?.primaryColor || "#1a56db" }}
              >
                <Bot className="h-4 w-4" />
                {activeBot?.hasConversations && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-2.5 w-2.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-mint-400 opacity-75" />
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-mint-500 ring-2 ring-card" />
                  </span>
                )}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-foreground">
                  {activeBot?.name || "No bot selected"}
                </p>
                <p className="flex items-center gap-1 text-[10px] text-muted-foreground">
                  {activeBot?.hasConversations ? (
                    <>
                      <span className="h-1 w-1 rounded-full bg-mint-500" />
                      Active
                    </>
                  ) : (
                    "Switch bot"
                  )}
                </p>
              </div>
              <ChevronsUpDown className="h-4 w-4 shrink-0 text-muted-foreground" />
            </button>
          </PopoverTrigger>
          <PopoverContent
            align="start"
            className="w-64 p-2"
            onCloseAutoFocus={(e) => e.preventDefault()}
          >
            <div className="flex items-center gap-2 px-2 pb-2 pt-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              <span>Switch bot</span>
            </div>
            <div className="max-h-64 overflow-y-auto scrollbar-loopline">
              {bots.length === 0 ? (
                <p className="px-2 py-4 text-center text-xs text-muted-foreground">
                  No bots yet. Create one to get started.
                </p>
              ) : (
                bots.map((bot) => (
                  <Link
                    key={bot.id}
                    href={`/dashboard/bots/${bot.id}/setup`}
                    onClick={() => setBotMenuOpen(false)}
                    className="flex items-center gap-2 rounded-lg px-2 py-2 text-sm transition hover:bg-accent"
                  >
                    <span
                      className="h-6 w-6 shrink-0 rounded-md"
                      style={{ backgroundColor: bot.primaryColor }}
                    />
                    <span className="min-w-0 flex-1 truncate text-foreground">
                      {bot.name}
                    </span>
                    {bot.hasConversations && (
                      <span className="h-1.5 w-1.5 rounded-full bg-mint-500" />
                    )}
                    {bot.id === activeBotId && (
                      <Check className="h-4 w-4 text-brand-500" />
                    )}
                  </Link>
                ))
              )}
            </div>
            <div className="mt-1 border-t border-border pt-1">
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="w-full justify-start"
                onClick={() => setBotMenuOpen(false)}
              >
                <Link href="/dashboard/bots">
                  <Plus className="h-4 w-4" />
                  New bot
                </Link>
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Nav — grouped sections */}
      <nav className="flex-1 space-y-4 overflow-y-auto p-3 scrollbar-loopline">
        {NAV_SECTIONS.map((section) => (
          <div key={section.label}>
            <p className="px-3 pb-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/70">
              {section.label}
            </p>
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const isActive =
                  item.href === "/dashboard"
                    ? pathname === "/dashboard"
                    : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "group flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition",
                      isActive
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : "text-muted-foreground hover:bg-accent hover:text-foreground",
                    )}
                  >
                    <item.icon
                      className={cn(
                        "h-4 w-4 shrink-0",
                        isActive ? "text-brand-500" : "text-muted-foreground group-hover:text-foreground",
                      )}
                    />
                    <span className="flex-1">{item.label}</span>
                    {item.badge && (
                      <span className="rounded-full bg-mint-500/15 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-mint-600">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}

        {/* Plan badge */}
        <div className="mt-2 rounded-xl border border-brand-200 bg-gradient-to-br from-brand-50 to-brand-50/30 p-3 dark:border-brand-500/30 dark:bg-brand-500/10">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-brand-600 dark:text-brand-300">
            Current plan
          </p>
          <p className="mt-0.5 font-display text-base text-foreground">{plan}</p>
          <Button
            asChild
            size="sm"
            variant="default"
            className="mt-3 w-full"
          >
            <Link href="/dashboard/billing">Upgrade plan</Link>
          </Button>
        </div>
      </nav>

      {/* User menu */}
      <div className="border-t border-sidebar-border p-3">
        <Popover open={userMenuOpen} onOpenChange={setUserMenuOpen}>
          <PopoverTrigger asChild>
            <button className="flex w-full items-center gap-3 rounded-xl p-2 text-left transition hover:bg-accent">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-500 text-xs font-semibold text-white">
                {initials(session?.user?.name || session?.user?.email)}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">
                  {session?.user?.name || session?.user?.email}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {session?.user?.email}
                </p>
              </div>
              <ChevronsUpDown className="h-4 w-4 shrink-0 text-muted-foreground" />
            </button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-56 p-2">
            <div className="px-2 py-1.5">
              <p className="text-sm font-medium text-foreground">
                {session?.user?.name || "Account"}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {session?.user?.email}
              </p>
            </div>
            <div className="my-1 h-px bg-border" />
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="w-full justify-start"
            >
              <Link href="/dashboard/settings">
                <Settings className="h-4 w-4" />
                Settings
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-destructive hover:text-destructive"
              onClick={() => {
                startTransition(() => {
                  signOut({ callbackUrl: "/" });
                });
              }}
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </Button>
          </PopoverContent>
        </Popover>
      </div>
    </aside>
  );
}

export function DashboardTopbar({ title, subtitle, actions }: { title: string; subtitle?: string; actions?: React.ReactNode }) {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-border glass-nav px-4 sm:px-6 lg:px-8">
      <div className="min-w-0">
        <h1 className="truncate font-display text-lg text-foreground">{title}</h1>
        {subtitle && (
          <p className="truncate text-xs text-muted-foreground">{subtitle}</p>
        )}
      </div>
      <div className="flex items-center gap-2">
        {actions}
        <ThemeToggle />
      </div>
    </header>
  );
}
