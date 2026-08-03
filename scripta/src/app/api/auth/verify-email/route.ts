import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get('token');
    if (!token) {
      return NextResponse.json(
        { error: 'Missing verification token.' },
        { status: 400 }
      );
    }

    const record = await db.verificationToken.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!record) {
      return NextResponse.redirect(
        new URL('/signin?error=invalid-token', req.url)
      );
    }

    if (record.expires < new Date()) {
      await db.verificationToken.delete({ where: { id: record.id } });
      return NextResponse.redirect(
        new URL('/signin?error=expired-token', req.url)
      );
    }

    // Mark user as verified, remove token
    await db.user.update({
      where: { id: record.userId },
      data: { emailVerified: new Date() },
    });
    await db.verificationToken.delete({ where: { id: record.id } });

    return NextResponse.redirect(
      new URL('/signin?verified=1', req.url)
    );
  } catch (err) {
    console.error('[verify-email] error', err);
    return NextResponse.redirect(
      new URL('/signin?error=unknown', req.url)
    );
  }
}
