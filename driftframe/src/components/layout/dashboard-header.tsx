"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
  Menu,
  LogOut,
  User as UserIcon,
  CreditCard,
  Settings,
  Sun,
  Moon,
  ChevronRight,
} from "lucide-react";
import { Logo } from "@/components/driftframe/logo";
import { CreditPill } from "@/components/driftframe/credit-pill";
import { ThemeToggle } from "./theme-toggle";
import { BuyCreditsModal } from "@/components/driftframe/buy-credits-modal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

/** Maps a dashboard pathname to a human-readable breadcrumb title. */
function pageTitle(pathname: string | null): string {
  if (!pathname) return "Dashboard";
  if (pathname === "/dashboard") return "Generate";
  const seg = pathname.split("/").pop() ?? "";
  return seg
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export function DashboardHeader({
  onOpenSidebar,
}: {
  onOpenSidebar: () => void;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  const [buyOpen, setBuyOpen] = React.useState(false);

  const initials = (session?.user?.name || session?.user?.email || "U")
    .split(/[\s@.]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase())
    .join("");

  const isDark = mounted && resolvedTheme === "dark";
  const title = pageTitle(pathname);

  return (
    <>
      <header className="sticky top-0 z-30 w-full border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="flex h-16 items-center justify-between gap-3 px-4 sm:px-6">
          {/* Left — hamburger (mobile) + breadcrumb */}
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              aria-label="Open menu"
              onClick={onOpenSidebar}
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground hover:bg-foreground/5 lg:hidden min-h-[44px] min-w-[44px]"
            >
              <Menu className="h-5 w-5" />
            </button>
            <Link href="/dashboard" className="lg:hidden" aria-label="Driftframe dashboard">
              <Logo size="sm" withWordmark={false} />
            </Link>
            <nav aria-label="Breadcrumb" className="hidden min-w-0 items-center gap-1.5 text-sm sm:flex">
              <Link
                href="/dashboard"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Dashboard
              </Link>
              <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground/60" />
              <span className="truncate font-medium text-foreground">{title}</span>
            </nav>
            <span className="truncate text-sm font-medium sm:hidden">{title}</span>
          </div>

          {/* Right — credit pill, theme toggle, user menu */}
          <div className="flex items-center gap-2">
            <CreditPill onClick={() => setBuyOpen(true)} />
            <ThemeToggle />

            <DropdownMenu>
              <DropdownMenuTrigger
                className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#7c3aed] text-sm font-semibold text-white shadow-[0_0_14px_rgba(124,58,237,0.25)] hover:bg-[#6938ef] transition-colors min-h-[44px] min-w-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                aria-label="Account menu"
              >
                {initials || "U"}
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-60">
                <DropdownMenuLabel className="truncate font-normal">
                  <div className="flex flex-col gap-0.5">
                    <span className="truncate text-sm font-medium">
                      {session?.user?.name || "Account"}
                    </span>
                    <span className="truncate text-xs font-normal text-muted-foreground">
                      {session?.user?.email}
                    </span>
                    <span className="mt-1 inline-flex w-fit items-center gap-1 rounded-full driftframe-gradient-pill px-2 py-0.5 text-[10px] font-semibold text-white">
                      {session?.user?.creditsRemaining ?? 0} credits
                    </span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => router.push("/dashboard/settings")}
                  className="cursor-pointer min-h-[40px]"
                >
                  <Settings className="mr-2 h-4 w-4" /> Settings
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => router.push("/dashboard/billing")}
                  className="cursor-pointer min-h-[40px]"
                >
                  <CreditCard className="mr-2 h-4 w-4" /> Billing
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => router.push("/dashboard/usage")}
                  className="cursor-pointer min-h-[40px]"
                >
                  <UserIcon className="mr-2 h-4 w-4" /> Usage
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger className="min-h-[40px]">
                    {mounted && isDark ? (
                      <Moon className="mr-2 h-4 w-4" />
                    ) : (
                      <Sun className="mr-2 h-4 w-4" />
                    )}
                    <span>Theme</span>
                  </DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      <DropdownMenuItem
                        onClick={() => setTheme("light")}
                        className="cursor-pointer min-h-[36px]"
                      >
                        <Sun className="mr-2 h-4 w-4" /> Light
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setTheme("dark")}
                        className="cursor-pointer min-h-[36px]"
                      >
                        <Moon className="mr-2 h-4 w-4" /> Dark
                      </DropdownMenuItem>
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="cursor-pointer text-destructive focus:text-destructive min-h-[40px]"
                >
                  <LogOut className="mr-2 h-4 w-4" /> Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <BuyCreditsModal open={buyOpen} onOpenChange={setBuyOpen} />
    </>
  );
}
