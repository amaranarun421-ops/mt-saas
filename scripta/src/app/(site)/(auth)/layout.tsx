import { AuthCardShell } from '@/components/auth/auth-shell';
import { ContentCalendarIllustration } from '@/components/marketing/illustrations';

/**
 * Auth layout — two-column on desktop (form left, side illustration right),
 * single-column on mobile (illustration hidden, just the card).
 *
 * NOTE: The marketing header + footer are already rendered by the parent
 * `(site)/layout.tsx`. This nested layout only adds the auth-specific
 * two-column grid + side illustration. Do NOT re-render the header/footer
 * here — they would appear twice on auth pages.
 *
 * The side illustration is a unique flat unDraw-style SVG (recolored to
 * violet #7a5af8) — distinct from the hero's "writing at desk" illustration
 * and the documents-empty-state "blank draft" illustration.
 */
export default function AuthLayout({
  children,
}: { children: React.ReactNode }) {
  return (
    <main className="flex-1 flex items-stretch justify-center py-12 md:py-16 px-6 md:px-12 lg:px-20">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-12 items-center">
        {/* Left: form card */}
        <div className="w-full max-w-md mx-auto lg:mx-0">
          <AuthCardShell>{children}</AuthCardShell>
        </div>

        {/* Right: side illustration (desktop only) */}
        <aside className="hidden lg:flex flex-col items-center justify-center relative">
          {/* Decorative plum/violet panel background */}
          <div
            aria-hidden
            className="absolute inset-0 -z-10 rounded-3xl overflow-hidden"
            style={{
              background:
                'radial-gradient(circle at 30% 30%, rgba(122, 90, 248, 0.15) 0%, transparent 50%), radial-gradient(circle at 70% 70%, rgba(245, 166, 35, 0.1) 0%, transparent 50%), linear-gradient(180deg, var(--card) 0%, var(--muted) 100%)',
            }}
          />
          <div className="px-8 py-12 text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary-200 dark:border-primary-500/30 bg-primary-50 dark:bg-primary-500/10 px-3 py-1 text-xs font-medium text-primary-700 dark:text-primary-300">
              Plan your content
            </span>
            <h2 className="mt-4 text-2xl font-bold tracking-tight">
              Your content calendar, automated
            </h2>
            <p className="mt-2 text-sm text-muted-foreground max-w-xs mx-auto leading-relaxed">
              Scripta turns a single prompt into ready-to-publish blog
              posts, social captions, emails, and product copy — all
              saved, organized, and ready to ship.
            </p>
            <ContentCalendarIllustration className="mt-6 w-full max-w-md mx-auto" />
          </div>
        </aside>
      </div>
    </main>
  );
}
