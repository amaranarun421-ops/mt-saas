import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { db } from '@/lib/db';
import { sendVerificationEmail } from '@/lib/email';
import { rateLimit } from '@/lib/rate-limit';
import { auth } from '@/auth';

export async function POST() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const rl = rateLimit({
      key: `resend:${session.user.id}`,
      limit: 3,
      windowMs: 60 * 60 * 1000, // 3 per hour
    });
    if (!rl.ok) {
      return NextResponse.json(
        { error: 'Too many resend attempts. Please try again later.' },
        { status: 429 }
      );
    }

    const user = await db.user.findUnique({
      where: { id: session.user.id },
    });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    if (user.emailVerified) {
      return NextResponse.json(
        { error: 'Your email is already verified.' },
        { status: 400 }
      );
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await db.verificationToken.deleteMany({ where: { userId: user.id } });
    await db.verificationToken.create({
      data: { userId: user.id, token, expires },
    });

    const result = await sendVerificationEmail({ to: user.email, token });

    return NextResponse.json({
      ok: true,
      message: 'Verification email sent. Check your inbox.',
      devVerifyUrl: result.devOnly ? result.url : null,
    });
  } catch (err) {
    console.error('[resend-verification] error', err);
    return NextResponse.json(
      { error: 'Something went wrong.' },
      { status: 500 }
    );
  }
}
