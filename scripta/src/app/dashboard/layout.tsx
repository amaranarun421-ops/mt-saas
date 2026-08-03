import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { DashboardShell } from '@/components/dashboard/dashboard-shell';
import { CommandPaletteClient } from '@/components/dashboard/command-palette-client';
import { db } from '@/lib/db';

export default async function DashboardLayout({
  children,
}: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) {
    redirect('/signin');
  }
  if (!session.user.isEmailVerified) {
    redirect('/verify-email');
  }

  let recent: Array<{ id: string; title: string; type: string }> = [];

  try {
    recent = await db.document.findMany({
      where: { userId: session.user.id },
      orderBy: { updatedAt: 'desc' },
      take: 5,
      select: { id: true, title: true, type: true },
    });
  } catch (error) {
    console.error('[dashboard layout] recent documents unavailable', error);
  }

  return (
    <>
      <DashboardShell
        user={{
          name: session.user.name ?? session.user.email!,
          email: session.user.email!,
          firstName: session.user.firstName ?? null,
          lastName: session.user.lastName ?? null,
          image: session.user.image ?? null,
          plan: session.user.plan,
          creditsRemaining: session.user.creditsRemaining,
        }}
        recentDocuments={recent}
      >
        {children}
      </DashboardShell>
      <CommandPaletteClient recentDocuments={recent} />
    </>
  );
}
