import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { ArrowRight } from "lucide-react"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-semibold transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          "bg-brand-500 text-white shadow-[var(--shadow-soft)] hover:bg-brand-600 hover:shadow-[var(--shadow-lift)] active:scale-[0.98]",
        cta:
          "bg-brand-500 text-white shadow-[var(--shadow-soft)] hover:bg-brand-600 hover:shadow-[var(--shadow-lift)] active:scale-[0.98] pr-3",
        destructive:
          "bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border border-border bg-card text-foreground shadow-xs hover:bg-accent hover:text-accent-foreground hover:border-brand-300 dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        outlineLight:
          "border border-white/30 bg-white/5 text-white shadow-xs hover:bg-white/10 hover:border-white/50 backdrop-blur-sm",
        secondary:
          "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-brand-500 underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-5 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-full gap-1.5 px-3 has-[>svg]:px-2.5 text-xs",
        lg: "h-12 rounded-full px-7 has-[>svg]:px-5 text-base",
        xl: "h-14 rounded-full px-8 has-[>svg]:px-6 text-base",
        icon: "size-10 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  children,
  withArrow = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
    withArrow?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  // When `asChild` is true, Slot requires exactly one child element.
  // Callers using `asChild + withArrow` should wrap their content in a
  // <span className="group inline-flex items-center gap-2">…</span> and
  // include the <ArrowRight /> themselves, OR just use `withArrow` without
  // `asChild`. To keep the simple case working we only auto-inject the arrow
  // when NOT using asChild.
  const inner = withArrow && !asChild ? (
    <>
      {children}
      <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
    </>
  ) : (
    children
  )

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    >
      {inner}
    </Comp>
  )
}

export { Button, buttonVariants }
