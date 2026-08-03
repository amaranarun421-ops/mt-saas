import { cn } from "@/lib/utils";

interface WaveDividerProps {
  className?: string;
  fill?: string; // tailwind text-* color, applied via fill-current
  flip?: boolean;
  variant?: "soft" | "bold";
}

/**
 * WaveDivider — reusable sine-wave SVG separator.
 * Used between dark hero sections and white content below on marketing pages.
 */
export function WaveDivider({
  className,
  fill = "text-white dark:text-[#0b0f1a]",
  flip = false,
  variant = "soft",
}: WaveDividerProps) {
  return (
    <div
      className={cn(
        "pointer-events-none w-full overflow-hidden leading-none",
        className,
      )}
      style={{ transform: flip ? "scaleY(-1)" : undefined }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 1440 96"
        preserveAspectRatio="none"
        className={cn("block h-12 w-full md:h-16", fill)}
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        {variant === "soft" ? (
          <path
            d="M0,40 C180,90 360,90 540,60 C720,30 900,30 1080,55 C1260,80 1380,80 1440,60 L1440,96 L0,96 Z"
            fill="currentColor"
          />
        ) : (
          <path
            d="M0,48 C160,96 320,0 540,32 C760,64 880,96 1080,48 C1280,0 1380,16 1440,48 L1440,96 L0,96 Z"
            fill="currentColor"
          />
        )}
      </svg>
    </div>
  );
}
