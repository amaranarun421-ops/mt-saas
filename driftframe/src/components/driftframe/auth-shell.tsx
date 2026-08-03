import * as React from "react";
import Link from "next/link";
import { Logo } from "@/components/driftframe/logo";
import { UndrawAuth } from "@/components/driftframe/illustrations";
import { ThemeToggle } from "@/components/layout/theme-toggle";

/**
 * Auth shell — v3 full-screen split panel.
 *
 * Used inside the (auth) route group, which has its OWN layout (no
 * SiteHeader / SiteFooter). This shell:
 *   - Left: full-bleed brand panel with a single subtle radial spotlight
 *     (no gradient mesh, complaint 9) + the unDraw-style illustration
 *     and a testimonial quote.
 *   - Right: the form area, scrollable if it overflows.
 *
 * A small logo top-left of the right panel + a theme toggle top-right
 * replace the missing site header.
 */
export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      {/* Brand panel — solid bg with a single subtle radial spotlight */}
      <div className="bg-radial-spotlight relative hidden flex-col justify-between overflow-hidden border-r border-border bg-[#fafafa] p-10 lg:flex dark:bg-[#111118]">
        <Link href="/" className="inline-flex w-fit">
          <Logo />
        </Link>

        <div className="flex flex-1 items-center justify-center py-10">
          <div className="h-72 w-72">
            <UndrawAuth />
          </div>
        </div>

        {/* Testimonial overlay at the bottom */}
        <figure className="max-w-md">
          <blockquote className="font-display text-lg font-medium leading-snug text-foreground">
            &ldquo;Driftframe replaced three of my stock subscriptions.
            Four variations per prompt is the sweet spot.&rdquo;
          </blockquote>
          <figcaption className="mt-3 flex items-center gap-3 text-sm text-muted-foreground">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#7c3aed] text-xs font-semibold text-white">
              AR
            </span>
            <span>
              <span className="block font-medium text-foreground">Ava R.</span>
              <span className="text-xs">Indie art director</span>
            </span>
          </figcaption>
        </figure>
      </div>

      {/* Form panel */}
      <div className="relative flex flex-col">
        {/* Top bar — small logo (mobile) + theme toggle */}
        <div className="flex items-center justify-between p-5 sm:p-6">
          <Link href="/" className="inline-flex lg:hidden">
            <Logo size="sm" />
          </Link>
          <div className="ml-auto">
            <ThemeToggle />
          </div>
        </div>

        {/* Form area — vertically centered, scrollable if it overflows */}
        <div className="flex flex-1 items-center overflow-y-auto">
          <div className="driftframe-container w-full py-8">
            <div className="mx-auto w-full max-w-md">
              <h1 className="font-display text-3xl font-semibold tracking-tight">
                {title}
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
              <div className="mt-8">{children}</div>
              {footer && (
                <div className="mt-6 text-sm text-muted-foreground">{footer}</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
