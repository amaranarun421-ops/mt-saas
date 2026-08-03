import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { plan: true, creditsRemaining: true },
    });
    if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({
      plan: user.plan,
      creditsRemaining: user.creditsRemaining,
    });
  } catch (err) {
    console.error('[user/credits] error', err);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
