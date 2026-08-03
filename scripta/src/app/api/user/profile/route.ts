import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { auth } from '@/auth';
import { db } from '@/lib/db';
import { authValidation } from '@/lib/zod/auth.schema';

export async function PATCH(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { action } = body as { action: 'update-profile' | 'update-password' | 'delete-account' };

    if (action === 'update-profile') {
      const parsed = authValidation.update.safeParse(body.payload);
      if (!parsed.success) {
        return NextResponse.json(
          { error: parsed.error.issues[0]?.message ?? 'Invalid input' },
          { status: 400 }
        );
      }
      const { firstName, lastName } = parsed.data;
      const updated = await db.user.update({
        where: { id: session.user.id },
        data: {
          firstName,
          lastName,
          name: `${firstName} ${lastName}`,
        },
        select: { id: true, firstName: true, lastName: true },
      });
      return NextResponse.json({ user: updated });
    }

    if (action === 'update-password') {
      const parsed = authValidation.updatePasswordRoute.safeParse(body.payload);
      if (!parsed.success) {
        return NextResponse.json(
          { error: parsed.error.issues[0]?.message ?? 'Invalid input' },
          { status: 400 }
        );
      }
      const { oldPassword, newPassword } = parsed.data;
      const user = await db.user.findUnique({
        where: { id: session.user.id },
        select: { password: true },
      });
      if (!user?.password) {
        return NextResponse.json(
          { error: 'Password change is unavailable for OAuth-only accounts.' },
          { status: 400 }
        );
      }
      const valid = await bcrypt.compare(oldPassword, user.password);
      if (!valid) {
        return NextResponse.json(
          { error: 'Current password is incorrect.' },
          { status: 400 }
        );
      }
      const hashed = await bcrypt.hash(newPassword, 12);
      await db.user.update({
        where: { id: session.user.id },
        data: { password: hashed },
      });
      return NextResponse.json({ ok: true });
    }

    if (action === 'delete-account') {
      await db.user.delete({ where: { id: session.user.id } });
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  } catch (err) {
    console.error('[user/profile] error', err);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
