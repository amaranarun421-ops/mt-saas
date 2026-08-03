import * as React from "react";

/**
 * (auth) layout — v3.
 *
 * Auth pages live under their OWN route group with a FULL-SCREEN layout:
 * NO site header, NO site footer. The AuthShell renders its own minimal
 * top bar (logo top-left on mobile + theme toggle top-right) and a split
 * panel (brand illustration on the left, form on the right).
 *
 * Marketing pages stay under (site)/ with SiteHeader + SiteFooter.
 * Dashboard pages stay under (dashboard)/ with their own sidebar layout.
 */
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen">{children}</div>;
}
