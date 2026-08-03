import * as React from "react";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { DashboardShell } from "@/components/layout/dashboard-shell";

/**
 * Dashboard layout — wraps every route under (dashboard)/.
 * Server component: checks the session and redirects to /signin if missing.
 * Renders the v3 sidebar + top bar shell via <DashboardShell />.
 */
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/signin?callbackUrl=/dashboard");
  }

  return <DashboardShell>{children}</DashboardShell>;
}
