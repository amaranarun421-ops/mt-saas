import * as React from "react";
import { cn } from "@/lib/utils";

interface GlassPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Add inner padding (default true). */
  padded?: boolean;
}

/**
 * Reusable glass surface — `rgba(255,255,255,0.04)` over a blurred backdrop
 * with a 1px translucent border. Used for the prompt sidebar, modals, and
 * dashboard cards.
 */
export const GlassPanel = React.forwardRef<HTMLDivElement, GlassPanelProps>(
  ({ className, padded = true, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "driftframe-glass rounded-2xl",
        padded && "p-4 sm:p-6",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  ),
);
GlassPanel.displayName = "GlassPanel";
