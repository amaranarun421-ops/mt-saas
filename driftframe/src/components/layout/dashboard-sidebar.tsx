"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Wand2,
  Clock,
  Heart,
  Globe2,
  Sparkles,
  Receipt,
  Settings,
  BarChart3,
  X,
} from "lucide-react";
import { Logo } from "@/components/driftframe/logo";

const SHOWCASE_MODE = process.env.NEXT_PUBLIC_SHOWCASE_MODE !== "0";

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const NAV_PRIMARY: NavItem[] = [
  { href: "/dashboard", label: "Generate", icon: Wand2 },
  { href: "/dashboard/history", label: "History", icon: Clock },
  { href: "/dashboard/favorites", label: "Favorites", icon: Heart },
  { href: "/dashboard/showcase", label: "Showcase", icon: Globe2 },
];

const NAV_ACCOUNT: NavItem[] = [
  { href: "/dashboard/credits", label: "Credits", icon: Sparkles },
  { href: "/dashboard/billing", label: "Billing", icon: Receipt },
];

const NAV_INSIGHTS: NavItem[] = [
  { href: "/dashboard/usage", label: "Usage", icon: BarChart3 },
];

const NAV_BOTTOM: NavItem[] = [{ href: "/dashboard/settings", label: "Settings", icon: Settings }];

function isActive(pathname: string | null, href: string): boolean {
  if (!pathname) return false;
  if (href === "/dashboard") return pathname === "/dashboard";
  return pathname.startsWith(href);
}

function NavGroup({ items, title, onNavigate }: { items: NavItem[]; title?: string; onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <div>
      {title && (
        <p className="px-3 pb-1 pt-4 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/70">
          {title}
        </p>
      )}
      <nav className="space-y-0.5">
        {items.map((item) => {
          const active = isActive(pathname, item.href);
          const Icon = item.icon;

          return (
            <Link key={item.href} href={item.href} onClick={onNavigate} data-active={active} className="driftframe-sidebar-item">
              <Icon className="h-4 w-4 shrink-0" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

export function DashboardSidebar({ mobileOpen, onMobileClose }: { mobileOpen: boolean; onMobileClose: () => void }) {
  return (
    <>
      <aside className="hidden h-screen w-64 shrink-0 overflow-hidden border-r border-border bg-card/60 backdrop-blur-xl lg:sticky lg:top-0 lg:flex lg:flex-col">
        <div className="flex h-16 shrink-0 items-center border-b border-border px-5">
          <Link href="/dashboard" aria-label="Driftframe dashboard">
            <Logo size="sm" />
          </Link>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto driftframe-scroll px-3 py-2">
          <NavGroup items={NAV_PRIMARY} />
          <NavGroup items={NAV_ACCOUNT} title="Account" />
          <NavGroup items={NAV_INSIGHTS} title="Insights" />
          <NavGroup items={NAV_BOTTOM} title="System" />
        </div>
        <div className="shrink-0 border-t border-border p-4">
          <div className="rounded-xl bg-muted/40 p-3 text-xs text-muted-foreground">
            <p className="font-medium text-foreground">Driftframe showcase</p>
            <p className="mt-0.5">
              {SHOWCASE_MODE ? "Demo-safe routes only." : "Full dashboard enabled."}
            </p>
          </div>
        </div>
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onMobileClose} aria-hidden />
          <aside className="absolute left-0 top-0 flex h-full w-72 max-w-[85vw] flex-col overflow-hidden border-r border-border bg-background/95 shadow-2xl backdrop-blur-xl">
            <div className="flex h-16 shrink-0 items-center justify-between border-b border-border px-5">
              <Logo size="sm" />
              <button type="button" aria-label="Close menu" onClick={onMobileClose} className="inline-flex min-h-[40px] min-w-[40px] items-center justify-center rounded-lg text-muted-foreground hover:bg-foreground/5">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto driftframe-scroll px-3 py-2">
              <NavGroup items={NAV_PRIMARY} onNavigate={onMobileClose} />
              <NavGroup items={NAV_ACCOUNT} title="Account" onNavigate={onMobileClose} />
              <NavGroup items={NAV_INSIGHTS} title="Insights" onNavigate={onMobileClose} />
              <NavGroup items={NAV_BOTTOM} title="System" onNavigate={onMobileClose} />
            </div>
          </aside>
        </div>
      )}
    </>
  );
}