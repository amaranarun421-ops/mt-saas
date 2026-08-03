'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import {
  Menu,
  X,
  Moon,
  Sun,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { ScriptaLogo } from '@/components/icons/scripta-logo';

export function MarketingHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const { data: session } = useSession();
  const router = useRouter();
  // Suppress theme-dependent UI until mounted — next-themes returns
  // `undefined` on SSR which would mismatch on the client.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/80 backdrop-blur-lg">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <ScriptaLogo className="h-8 w-8 transition-transform group-hover:scale-105" />
          <span className="text-lg font-bold tracking-tight">Scripta</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          <NavItem href="/#features" label="Features" />
          <NavItem href="/#modes" label="Write modes" />
          <NavItem href="/pricing" label="Pricing" />
          <NavItem href="/contact" label="Contact" />
        </nav>

        {/* Right actions */}
        <div className="hidden md:flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            aria-label="Toggle theme"
            className="h-9 w-9"
          >
            {!mounted ? (
              <Sun className="h-4 w-4 opacity-0" />
            ) : theme === 'dark' ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button>

          {session?.user ? (
            <Button
              onClick={() => router.push('/dashboard')}
              className="btn-elevated btn-press"
              size="sm"
            >
              Open dashboard
            </Button>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link href="/signin">Sign in</Link>
              </Button>
              <Button
                asChild
                size="sm"
                className="btn-elevated btn-press"
              >
                <Link href="/signup">Start free</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile menu toggle */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-muted transition"
          onClick={() => setMobileOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border/40 bg-background">
          <nav className="max-w-7xl mx-auto px-6 py-4 flex flex-col gap-1">
            <MobileNavItem
              href="/#features"
              label="Features"
              onClick={() => setMobileOpen(false)}
            />
            <MobileNavItem
              href="/#modes"
              label="Write modes"
              onClick={() => setMobileOpen(false)}
            />
            <MobileNavItem
              href="/pricing"
              label="Pricing"
              onClick={() => setMobileOpen(false)}
            />
            <MobileNavItem
              href="/contact"
              label="Contact"
              onClick={() => setMobileOpen(false)}
            />
            <div className="mt-3 flex flex-col gap-2">
              <Button
                variant="ghost"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="justify-start"
              >
                {!mounted ? (
                  <Sun className="mr-2 h-4 w-4 opacity-0" />
                ) : theme === 'dark' ? (
                  <Sun className="mr-2 h-4 w-4" />
                ) : (
                  <Moon className="mr-2 h-4 w-4" />
                )}
                Toggle theme
              </Button>
              {session?.user ? (
                <Button
                  onClick={() => {
                    setMobileOpen(false);
                    router.push('/dashboard');
                  }}
                  className="btn-elevated btn-press"
                >
                  Open dashboard
                </Button>
              ) : (
                <>
                  <Button
                    asChild
                    variant="outline"
                    onClick={() => setMobileOpen(false)}
                  >
                    <Link href="/signin">Sign in</Link>
                  </Button>
                  <Button
                    asChild
                    onClick={() => setMobileOpen(false)}
                    className="btn-elevated btn-press"
                  >
                    <Link href="/signup">Start free</Link>
                  </Button>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

function NavItem({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition rounded-md hover:bg-muted/60"
    >
      {label}
    </Link>
  );
}

function MobileNavItem({
  href,
  label,
  onClick,
}: {
  href: string;
  label: string;
  onClick: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="px-3 py-2 text-base font-medium rounded-md hover:bg-muted transition"
    >
      {label}
    </Link>
  );
}
