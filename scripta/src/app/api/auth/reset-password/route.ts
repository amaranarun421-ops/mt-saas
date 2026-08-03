import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { db } from '@/lib/db';
import { authValidation } from '@/lib/zod/auth.schema';

export async function POST(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get('token');
    if (!token) {
      return NextResponse.json(
        { error: 'Missing reset token.' },
        { status: 400 }
      );
    }

    const body = await req.json();
    const parsed = authValidation.resetPassword.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? 'Invalid input' },
        { status: 400 }
      );
    }

    const record = await db.passwordResetToken.findUnique({
      where: { token },
    });
    if (!record || record.used || record.expires < new Date()) {
      return NextResponse.json(
        { error: 'Reset link is invalid or has expired.' },
        { status: 400 }
      );
    }

    const hashed = await bcrypt.hash(parsed.data.newPassword, 12);

    await db.$transaction([
      db.user.update({
        where: { id: record.userId },
        data: { password: hashed },
      }),
      db.passwordResetToken.update({
        where: { id: record.id },
        data: { used: true },
      }),
    ]);

    return NextResponse.json({
      ok: true,
      message: 'Password updated. You can now sign in.',
    });
  } catch (err) {
    console.error('[reset-password] error', err);
    return NextResponse.json(
      { error: 'Something went wrong.' },
      { status: 500 }
    );
  }
}
