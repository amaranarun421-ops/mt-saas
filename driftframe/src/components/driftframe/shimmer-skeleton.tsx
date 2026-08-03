import * as React from "react";
import { cn } from "@/lib/utils";

interface ShimmerSkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Apply an aspect ratio so the tile matches the incoming image. */
  aspectRatio?: string; // e.g. "1 / 1"
  rounded?: string;
}

/**
 * Animated placeholder tile shown in the masonry grid while a batch is
 * generating. Uses the `driftframe-shimmer` keyframes (translucent sweep).
 */
export function ShimmerSkeleton({
  className,
  aspectRatio = "1 / 1",
  rounded = "rounded-2xl",
  ...props
}: ShimmerSkeletonProps) {
  return (
    <div
      className={cn(
        "driftframe-shimmer w-full",
        rounded,
        className,
      )}
      style={{ aspectRatio }}
      {...props}
    />
  );
}
