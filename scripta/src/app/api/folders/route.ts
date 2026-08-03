import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ folders: [] });
    }
    const folders = await db.folder.findMany({
      where: { userId: session.user.id },
      orderBy: { updatedAt: 'desc' },
      include: {
        _count: { select: { documents: true } },
      },
    });
    return NextResponse.json({ folders });
  } catch (err) {
    console.error('[folders/list] error', err);
    return NextResponse.json({ error: 'Failed to load folders' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const body = await req.json();
    const { name, color } = body as { name: string; color?: string };
    if (!name || name.trim().length === 0) {
      return NextResponse.json({ error: 'Folder name is required' }, { status: 400 });
    }

    const folder = await db.folder.create({
      data: {
        userId: session.user.id,
        name: name.trim(),
        color: color ?? '#7a5af8',
      },
    });
    return NextResponse.json({ folder });
  } catch (err) {
    console.error('[folders/create] error', err);
    return NextResponse.json({ error: 'Failed to create folder' }, { status: 500 });
  }
}
