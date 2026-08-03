export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-[calc(100vh-4rem)] overflow-hidden bg-loopline-rays">
      <div className="absolute inset-0 bg-loopline-navy-grid opacity-40" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-400/40 to-transparent" />

      <div className="container-loopline relative flex min-h-[calc(100vh-4rem)] justify-center py-12">
        <div className="w-full max-w-md">
          <div className="rounded-3xl border border-white/10 bg-white/95 p-8 shadow-[var(--shadow-pop)] backdrop-blur-xl dark:bg-navy-900/95">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
