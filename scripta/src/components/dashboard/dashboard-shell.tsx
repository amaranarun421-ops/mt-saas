'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import {
  LayoutDashboard,
  FileText,
  Folder,
  CreditCard,
  Settings,
  Menu,
  Zap,
  LogOut,
  ChevronDown,
  Plus,
  Command,
  Sun,
  Moon,
  Search,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { PLANS } from '@/lib/stripe';
import { useCreditBadge } from './use-credits';
import { ScriptaLogo } from '@/components/icons/scripta-logo';

interface DashboardShellProps {
  user: {
    name: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
    image: string | null;
    plan: string;
    creditsRemaining: number;
  };
  recentDocuments: Array<{ id: string; title: string; type: string }>;
  children: React.ReactNode;
}

const NAV_GROUPS: Array<{
  label: string;
  items: Array<{
    href: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }>;
}> = [
  {
    label: 'Overview',
    items: [
      { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { href: '/dashboard/documents', label: 'Documents', icon: Folder },
    ],
  },
  {
    label: 'Write',
    items: [
      { href: '/dashboard/write/blog', label: 'Blog Post', icon: FileText },
      { href: '/dashboard/write/social', label: 'Social Caption', icon: FileText },
      { href: '/dashboard/write/email', label: 'Email Copy', icon: FileText },
      { href: '/dashboard/write/product', label: 'Product Desc', icon: FileText },
    ],
  },
  {
    label: 'Account',
    items: [
      { href: '/dashboard/billing', label: 'Billing', icon: CreditCard },
      { href: '/dashboard/settings', label: 'Settings', icon: Settings },
    ],
  },
];

export function DashboardShell({
  user,
  recentDocuments,
  children,
}: DashboardShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  // Suppress theme-dependent UI until the client has mounted — otherwise
  // next-themes returns `undefined` on SSR and the dropdown item icon
  // (Sun vs Moon) would mismatch and throw a hydration error.
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const { credits, plan } = useCreditBadge(
    user.creditsRemaining,
    user.plan
  );

  const initials = React.useMemo(() => {
    if (user.firstName && user.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    return user.email.slice(0, 2).toUpperCase();
  }, [user]);

  const SidebarInner = (
    <nav className="flex flex-col gap-5 p-4 h-full min-h-0">
      {/* Logo */}
      <Link
        href="/dashboard"
        className="flex items-center gap-2 px-2 py-1.5 group shrink-0"
      >
        <ScriptaLogo className="h-8 w-8" />
        <span className="text-lg font-bold tracking-tight">Scripta</span>
      </Link>

      {/* New document button */}
      <Button
        asChild
        className="bg-primary-500 hover:bg-primary-600 btn-press text-white h-10 shrink-0 shadow-sm"
      >
        <Link href="/dashboard/write/blog">
          <Plus className="mr-2 h-4 w-4" />
          New document
        </Link>
      </Button>

      {/* Quick search — opens Cmd+K */}
      <button
        type="button"
        onClick={() => {
          // Dispatch a synthetic Cmd+K so the existing command-palette hook picks it up
          const ev = new KeyboardEvent('keydown', {
            key: 'k',
            metaKey: true,
            bubbles: true,
          });
          document.dispatchEvent(ev);
        }}
        className="group flex items-center gap-2 rounded-lg border border-border/60 bg-muted/40 px-3 py-2 text-xs text-muted-foreground hover:bg-muted/80 hover:text-foreground transition cursor-pointer shrink-0"
      >
        <Search className="h-3.5 w-3.5" />
        <span className="flex-1 text-left">Search…</span>
        <kbd className="rounded border border-border bg-background px-1 py-0.5 text-[10px] font-mono">
          ⌘K
        </kbd>
      </button>

      {/* Nav groups — scrollable region with min-h-0 to allow flex shrinking */}
      <div className="flex-1 min-h-0 flex flex-col gap-5 overflow-y-auto overflow-x-hidden custom-scrollbar -mr-2 pr-2">
        {NAV_GROUPS.map((group) => (
          <div key={group.label} className="space-y-1">
            <p className="px-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground/60">
              {group.label}
            </p>
            {group.items.map((item) => {
              const active =
                pathname === item.href ||
                (item.href !== '/dashboard' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition',
                    active
                      ? 'bg-primary-500/10 text-primary-700 font-medium dark:bg-primary-500/15 dark:text-primary-200'
                      : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'
                  )}
                >
                  <item.icon
                    className={cn(
                      'h-4 w-4 shrink-0 transition-colors',
                      active ? 'text-primary-500' : 'text-muted-foreground group-hover:text-foreground'
                    )}
                  />
                  <span className="truncate">{item.label}</span>
                </Link>
              );
            })}
          </div>
        ))}
      </div>

      {/* Upgrade card for free users */}
      {plan !== 'pro' && (
        <div className="relative overflow-hidden rounded-xl border border-primary-200 dark:border-primary-500/20 bg-gradient-to-br from-primary-50 to-amber-50 dark:from-primary-500/10 dark:to-amber-500/5 p-3 shrink-0">
          <div aria-hidden className="absolute -top-6 -right-6 h-16 w-16 rounded-full bg-primary-400/30 blur-2xl" />
          <div className="relative flex items-center gap-2">
            <span className="grid h-7 w-7 place-items-center rounded-md bg-primary-500 text-white shadow-sm">
              <Zap className="h-3.5 w-3.5" />
            </span>
            <span className="text-xs font-semibold">Upgrade to Pro</span>
          </div>
          <p className="relative mt-2 text-[11px] text-muted-foreground leading-relaxed">
            Unlimited generations + all 4 write modes.
          </p>
          <Button
            asChild
            size="sm"
            className="relative mt-2.5 w-full bg-primary-500 hover:bg-primary-600 btn-press text-white h-8 text-xs"
          >
            <Link href="/dashboard/billing">Upgrade</Link>
          </Button>
        </div>
      )}

      {/* User menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-3 rounded-lg p-2 hover:bg-muted/60 transition w-full cursor-pointer text-left border border-transparent hover:border-border/40">
            <Avatar className="h-8 w-8 ring-2 ring-background">
              <AvatarImage src={user.image ?? undefined} alt={user.name} />
              <AvatarFallback className="bg-primary-500 text-white text-xs font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate">{user.name}</div>
              <div className="text-xs text-muted-foreground truncate">
                {user.email}
              </div>
            </div>
            <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel className="text-xs text-muted-foreground">
            Signed in as {user.email}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => router.push('/dashboard/settings')}
            className="cursor-pointer"
          >
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="cursor-pointer"
          >
            {/* Render a neutral icon until mounted — avoids SSR/CSR mismatch */}
            {!mounted ? (
              <Sun className="mr-2 h-4 w-4" />
            ) : theme === 'dark' ? (
              <Sun className="mr-2 h-4 w-4" />
            ) : (
              <Moon className="mr-2 h-4 w-4" />
            )}
            Toggle theme
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => router.push('/')}
            className="cursor-pointer"
          >
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Back to site
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => signOut({ callbackUrl: '/' })}
            className="cursor-pointer text-red-600 focus:text-red-600"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </nav>
  );

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop sidebar (glass card, sticky + independently scrollable) */}
      <aside className="hidden lg:block w-64 shrink-0 sticky top-0 h-screen p-3">
        <div className="card-glass h-full rounded-2xl overflow-hidden">
          {SidebarInner}
        </div>
      </aside>

      {/* Mobile sidebar (sheet) */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <div className="flex-1 flex flex-col min-w-0">
          {/* Mobile top bar */}
          <header className="lg:hidden sticky top-0 z-30 border-b border-border/40 bg-background/80 backdrop-blur-lg">
            <div className="flex items-center justify-between h-14 px-4">
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Open menu">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <Link href="/dashboard" className="flex items-center gap-2">
                <ScriptaLogo className="h-7 w-7" />
                <span className="font-bold">Scripta</span>
              </Link>
              <CreditPill credits={credits} plan={plan} />
            </div>
          </header>

          {/* Top bar (desktop) */}
          <header className="hidden lg:flex sticky top-0 z-30 h-14 items-center justify-between border-b border-border/40 bg-background/80 backdrop-blur-lg px-6">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] font-medium">
                <Command className="inline h-3 w-3" /> K
              </kbd>
              <span>Quick jump</span>
            </div>
            <div className="flex items-center gap-3">
              <CreditPill credits={credits} plan={plan} />
            </div>
          </header>

          <main className="flex-1 min-w-0 p-4 md:p-6 lg:p-8">{children}</main>
        </div>

        <SheetContent side="left" className="w-72 p-0 overflow-y-auto">
          <SheetHeader className="px-4 py-3 border-b border-border/40 shrink-0">
            <SheetTitle className="text-left">Menu</SheetTitle>
          </SheetHeader>
          <div className="h-[calc(100%-3.5rem)]">{SidebarInner}</div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

function CreditPill({
  credits,
  plan,
}: {
  credits: number;
  plan: string;
}) {
  const unlimited = plan === 'pro';
  const display = unlimited ? '∞' : credits.toString();
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-500/15 dark:text-amber-300"
      title={unlimited ? 'Pro plan — unlimited credits' : `${credits} credits left this month`}
    >
      <Zap className="h-3 w-3" />
      {display}
      <span className="text-[10px] font-normal opacity-70">
        {unlimited ? 'unlimited' : 'credits'}
      </span>
    </span>
  );
}
