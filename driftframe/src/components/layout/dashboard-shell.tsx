"use client";

import * as React from "react";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";

/**
 * Dashboard shell.
 *
 * Keeps the sidebar and header fixed within the viewport while the dashboard
 * content scrolls independently.
 */
export function DashboardShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = React.useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <DashboardSidebar
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <DashboardHeader onOpenSidebar={() => setMobileOpen(true)} />
        <main className="min-h-0 flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}