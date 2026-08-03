"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

type Variant = "gradient" | "solid" | "glass" | "ghost" | "outline";

interface GradientButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  loading?: boolean;
  /** Optional icon shown to the left of the label. */
  leftIcon?: React.ReactNode;
}

/**
 * Driftframe primary CTA button.
 *
 * v3 default: `solid` (#7c3aed background, white text). The `gradient`
 * variant is reserved for the rare sanctioned premium spots.
 */
export const GradientButton = React.forwardRef<
  HTMLButtonElement,
  GradientButtonProps
>(
  (
    { className, children, variant = "solid", loading, leftIcon, disabled, ...props },
    ref,
  ) => {
    const base =
      "inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px] active:scale-[0.98]";
    const variants: Record<Variant, string> = {
      solid:
        "bg-[#7c3aed] text-white hover:bg-[#6938ef] hover:shadow-[0_0_24px_rgba(124,58,237,0.25)]",
      gradient:
        "driftframe-gradient text-white hover:opacity-90 hover:shadow-[0_0_30px_rgba(124,58,237,0.30)]",
      glass:
        "driftframe-glass text-foreground hover:bg-foreground/[0.06]",
      outline:
        "border border-border bg-transparent text-foreground hover:bg-foreground/[0.04]",
      ghost:
        "text-foreground hover:bg-foreground/5",
    };
    return (
      <button
        ref={ref}
        className={cn(base, variants[variant], className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          leftIcon
        )}
        {children}
      </button>
    );
  },
);
GradientButton.displayName = "GradientButton";

interface GradientLinkProps
  extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
  variant?: Variant;
  leftIcon?: React.ReactNode;
  href: string;
  /** Pass through to next/link onClick (e.g. to close mobile nav). */
  onClick?: () => void;
}

/** Link-styled counterpart of GradientButton for navigation CTAs. Uses
 *  next/link so internal routes get client-side routing. */
export function GradientLink({
  className,
  children,
  variant = "solid",
  leftIcon,
  href,
  onClick,
  ...props
}: GradientLinkProps) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background min-h-[44px] active:scale-[0.98]";
  const variants: Record<Variant, string> = {
    solid:
      "bg-[#7c3aed] text-white hover:bg-[#6938ef] hover:shadow-[0_0_24px_rgba(124,58,237,0.25)]",
    gradient:
      "driftframe-gradient text-white hover:opacity-90 hover:shadow-[0_0_30px_rgba(124,58,237,0.30)]",
    glass: "driftframe-glass text-foreground hover:bg-foreground/[0.06]",
    outline:
      "border border-border bg-transparent text-foreground hover:bg-foreground/[0.04]",
    ghost: "text-foreground hover:bg-foreground/5",
  };
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(base, variants[variant], className)}
      {...props}
    >
      {leftIcon}
      {children}
    </Link>
  );
}
