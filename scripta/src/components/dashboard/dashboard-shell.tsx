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

const NAV_GROUPS = [
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
] as const;

export function DashboardShell({
  user,
  recentDocuments,
  children,
}: DashboardShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const { credits, plan } = useCreditBadge(user.creditsRemaining, user.plan);

  const initials = React.useMemo(() => {
    if (user.firstName && user.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    return user.email.slice(0, 2).toUpperCase();
  }, [user]);

  const sidebarInner = (
    <nav className="flex h-full min-h-0 flex-col gap-5 p-4">
      <Link href="/dashboard" className="group flex shrink-0 items-center gap-2 px-2 py-1.5">
        <ScriptaLogo className="h-8 w-8" />
        <span className="text-lg font-bold tracking-tight">Scripta</span>
      </Link>

      <Button asChild className="h-10 shrink-0 bg-primary-500 text-white shadow-sm btn-press hover:bg-primary-600">
        <Link href="/dashboard/write/blog">
          <Plus className="mr-2 h-4 w-4" />
          New document
        </Link>
      </Button>

      <button
        type="button"
        onClick={() => {
          const ev = new KeyboardEvent('keydown', {
            key: 'k',
            metaKey: true,
            ctrlKey: true,
            bubbles: true,
          });
          document.dispatchEvent(ev);
        }}
        className="group flex shrink-0 items-center gap-2 rounded-lg border border-border/60 bg-muted/40 px-3 py-2 text-xs text-muted-foreground transition hover:bg-muted/80 hover:text-foreground"
      >
        <Search className="h-3.5 w-3.5" />
        <span className="flex-1 text-left">Search...</span>
        <kbd className="rounded border border-border bg-background px-1 py-0.5 text-[10px] font-mono">
          Ctrl/Cmd+K
        </kbd>
      </button>

      <div className="custom-scrollbar -mr-2 flex min-h-0 flex-1 flex-col gap-5 overflow-x-hidden overflow-y-auto pr-2">
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
                      ? 'bg-primary-500/10 font-medium text-primary-700 dark:bg-primary-500/15 dark:text-primary-200'
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

      {plan !== 'pro' && (
        <div className="relative shrink-0 overflow-hidden rounded-xl border border-primary-200 bg-gradient-to-br from-primary-50 to-amber-50 p-3 dark:border-primary-500/20 dark:from-primary-500/10 dark:to-amber-500/5">
          <div aria-hidden className="absolute -right-6 -top-6 h-16 w-16 rounded-full bg-primary-400/30 blur-2xl" />
          <div className="relative flex items-center gap-2">
            <span className="grid h-7 w-7 place-items-center rounded-md bg-primary-500 text-white shadow-sm">
              <Zap className="h-3.5 w-3.5" />
            </span>
            <span className="text-xs font-semibold">Upgrade to Pro</span>
          </div>
          <p className="relative mt-2 text-[11px] leading-relaxed text-muted-foreground">
            Unlimited generations + all 4 write modes.
          </p>
          <Button asChild size="sm" className="relative mt-2.5 h-8 w-full bg-primary-500 text-xs text-white btn-press hover:bg-primary-600">
            <Link href="/dashboard/billing">Upgrade</Link>
          </Button>
        </div>
      )}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="w-full cursor-pointer rounded-lg border border-transparent p-2 text-left transition hover:border-border/40 hover:bg-muted/60">
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8 ring-2 ring-background">
                <AvatarImage src={user.image ?? undefined} alt={user.name} />
                <AvatarFallback className="bg-primary-500 text-xs font-semibold text-white">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium">{user.name}</div>
                <div className="truncate text-xs text-muted-foreground">{user.email}</div>
              </div>
              <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
            </div>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel className="text-xs text-muted-foreground">
            Signed in as {user.email}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => router.push('/dashboard/settings')} className="cursor-pointer">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="cursor-pointer">
            {!mounted ? <Sun className="mr-2 h-4 w-4" /> : theme === 'dark' ? <Sun className="mr-2 h-4 w-4" /> : <Moon className="mr-2 h-4 w-4" />}
            Toggle theme
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push('/')} className="cursor-pointer">
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Back to site
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => signOut({ callbackUrl: '/' })} className="cursor-pointer text-red-600 focus:text-red-600">
            <LogOut className="mr-2 h-4 w-4" />
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </nav>
  );

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 p-3 lg:block">
        <div className="card-glass h-full overflow-hidden rounded-2xl">{sidebarInner}</div>
      </aside>

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 border-b border-border/40 bg-background/80 backdrop-blur-lg lg:hidden">
            <div className="flex h-14 items-center justify-between px-4">
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

          <header className="sticky top-0 z-30 hidden h-14 items-center justify-between border-b border-border/40 bg-background/80 px-6 backdrop-blur-lg lg:flex">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] font-medium">
                <Command className="inline h-3 w-3" /> K
              </kbd>
              <span>Quick jump</span>
            </div>
            <CreditPill credits={credits} plan={plan} />
          </header>

          <main className="flex-1 min-w-0 p-4 md:p-6 lg:p-8">{children}</main>
        </div>

        <SheetContent side="left" className="flex h-full w-72 flex-col p-0">
          <SheetHeader className="shrink-0 border-b border-border/40 px-4 py-3">
            <SheetTitle className="text-left">Menu</SheetTitle>
          </SheetHeader>
          <div className="min-h-0 flex-1">{sidebarInner}</div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

function CreditPill({ credits, plan }: { credits: number; plan: string }) {
  const unlimited = plan === 'pro';
  const display = unlimited ? 'Unlimited' : credits.toString();
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-500/15 dark:text-amber-300"
      title={unlimited ? 'Pro plan - unlimited credits' : `${credits} credits left this month`}
    >
      <Zap className="h-3 w-3" />
      {display}
      <span className="text-[10px] font-normal opacity-70">{unlimited ? 'plan' : 'credits'}</span>
    </span>
  );
}
