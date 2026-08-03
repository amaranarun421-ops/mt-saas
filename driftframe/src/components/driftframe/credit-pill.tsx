"use client";

import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";

interface CreditPillProps {
  credits?: number;
  className?: string;
  onClick?: () => void;
  hideWhileLoading?: boolean;
}

export function CreditPill({
  credits,
  className,
  onClick,
  hideWhileLoading = true,
}: CreditPillProps) {
  const { data: session, status } = useSession();

  if (status === "loading" && hideWhileLoading) return null;

  const value = credits ?? session?.user?.creditsRemaining ?? 0;

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "driftframe-gradient-pill group inline-flex min-h-[36px] items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-semibold text-white shadow-[0_0_18px_rgba(124,58,237,0.28)] transition-all hover:scale-[1.03] hover:shadow-[0_0_24px_rgba(124,58,237,0.45)] active:scale-95",
        className,
      )}
      aria-label={`${value} credits - buy more`}
      title="Buy more credits"
    >
      <Sparkles className="h-3.5 w-3.5" strokeWidth={2.5} />
      <span className="tabular-nums">{value}</span>
      <span className="hidden font-normal opacity-80 sm:inline">credits</span>
    </button>
  );
}