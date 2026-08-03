import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { db } from '@/lib/db';
import { authValidation } from '@/lib/zod/auth.schema';
import { sendPasswordResetEmail } from '@/lib/email';
import { rateLimit } from '@/lib/rate-limit';

export async function POST(req: Request) {
  try {
    const ip = req.headers.get('x-forwarded-for') ?? 'unknown';
    const rl = rateLimit({
      key: `forgot:${ip}`,
      limit: 5,
      windowMs: 60 * 60 * 1000,
    });
    if (!rl.ok) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    const body = await req.json();
    const parsed = authValidation.forgotPasswordForm.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Enter a valid email address.' },
        { status: 400 }
      );
    }

    const { email } = parsed.data;
    const user = await db.user.findUnique({ where: { email } });

    // Always return success — never reveal whether an email exists.
    if (user) {
      const token = crypto.randomBytes(32).toString('hex');
      const expires = new Date(Date.now() + 60 * 60 * 1000); // 1h

      await db.passwordResetToken.deleteMany({ where: { userId: user.id } });
      await db.passwordResetToken.create({
        data: { userId: user.id, token, expires },
      });

      const result = await sendPasswordResetEmail({ to: user.email, token });
      return NextResponse.json({
        ok: true,
        message: 'If an account exists for that email, a reset link is on its way.',
        devResetUrl: result.devOnly ? result.url : null,
      });
    }

    return NextResponse.json({
      ok: true,
      message: 'If an account exists for that email, a reset link is on its way.',
    });
  } catch (err) {
    console.error('[forgot-password] error', err);
    return NextResponse.json(
      { error: 'Something went wrong.' },
      { status: 500 }
    );
  }
}
