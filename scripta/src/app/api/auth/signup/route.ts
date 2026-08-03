import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { db } from '@/lib/db';
import { authValidation } from '@/lib/zod/auth.schema';
import { sendVerificationEmail } from '@/lib/email';
import { rateLimit } from '@/lib/rate-limit';

export async function POST(req: Request) {
  try {
    // Rate-limit by IP: max 10 signups per hour.
    const ip = req.headers.get('x-forwarded-for') ?? 'unknown';
    const rl = rateLimit({ key: `signup:${ip}`, limit: 10, windowMs: 60 * 60 * 1000 });
    if (!rl.ok) {
      return NextResponse.json(
        { error: 'Too many signup attempts. Please try again later.' },
        { status: 429 }
      );
    }

    const body = await req.json();
    const parsed = authValidation.register.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? 'Invalid input' },
        { status: 400 }
      );
    }

    const { firstName, lastName, email, password } = parsed.data;

    const existing = await db.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: 'An account with that email already exists.' },
        { status: 409 }
      );
    }

    const hashed = await bcrypt.hash(password, 12);
    const user = await db.user.create({
      data: {
        email,
        password: hashed,
        firstName,
        lastName,
        name: `${firstName} ${lastName}`,
        plan: 'free',
        creditsRemaining: 10,
      },
    });

    // Generate email verification token
    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h

    // Delete any previous token for this user, then create a new one.
    await db.verificationToken.deleteMany({ where: { userId: user.id } });
    await db.verificationToken.create({
      data: { userId: user.id, token, expires },
    });

    const result = await sendVerificationEmail({ to: user.email, token });

    // In dev (no Resend key), we return the verify URL so the UI can show it.
    return NextResponse.json({
      ok: true,
      message: 'Account created. Check your inbox to verify your email.',
      devVerifyUrl: result.devOnly ? result.url : null,
    });
  } catch (err) {
    console.error('[signup] error', err);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}
