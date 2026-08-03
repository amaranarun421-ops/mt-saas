import Link from 'next/link';
import { ScriptaLogo } from '@/components/icons/scripta-logo';

export function AuthCardShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full max-w-md">
      <div className="rounded-2xl border border-border/60 bg-card p-8 shadow-theme-md card-lift">
        <Link href="/" className="flex items-center gap-2 justify-center group">
          <ScriptaLogo className="h-9 w-9 transition-transform group-hover:scale-105" />
          <span className="text-xl font-bold tracking-tight">Scripta</span>
        </Link>
        <div className="mt-6">{children}</div>
      </div>
    </div>
  );
}
