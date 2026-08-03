"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Search } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { ThemeToggle } from "@/components/brand/theme-toggle";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV = [
  { label: "Features", href: "/#features" },
  { label: "Pricing", href: "/pricing" },
  { label: "Docs", href: "/docs" },
  { label: "Changelog", href: "/#changelog" },
  { label: "Contact", href: "/contact" },
];

export function MarketingHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur-xl">
      <div className="container-loopline relative flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition hover:bg-accent hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {/* Cmd+K affordance — faux for marketing, wired in dashboard */}
          <button
            type="button"
            aria-label="Search (Cmd+K)"
            className="inline-flex h-9 items-center gap-2 rounded-full border border-border bg-card px-3 text-xs text-muted-foreground transition hover:bg-accent"
          >
            <Search className="h-3.5 w-3.5" />
            <span className="hidden lg:inline">Search…</span>
            <kbd className="hidden lg:inline">⌘K</kbd>
          </button>
          <ThemeToggle />
          <Button variant="ghost" size="sm" asChild>
            <Link href="/signin">Sign in</Link>
          </Button>
          <Button variant="default" size="sm" asChild>
            <Link href="/signup">Start free</Link>
          </Button>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            type="button"
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-foreground"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          "relative md:hidden overflow-hidden transition-[max-height] duration-300 ease-out border-b border-border bg-card",
          open ? "max-h-96" : "max-h-0",
        )}
      >
        <div className="container-loopline flex flex-col gap-1 py-4">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="rounded-xl px-4 py-3 text-base font-medium text-foreground transition hover:bg-accent"
            >
              {item.label}
            </Link>
          ))}
          <div className="mt-2 flex gap-2">
            <Button variant="outline" size="sm" asChild className="flex-1">
              <Link href="/signin" onClick={() => setOpen(false)}>
                Sign in
              </Link>
            </Button>
            <Button variant="default" size="sm" asChild className="flex-1">
              <Link href="/signup" onClick={() => setOpen(false)}>
                Start free
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
