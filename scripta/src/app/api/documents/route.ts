import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/lib/db';

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ documents: [] });
    }

    const { searchParams } = new URL(req.url);
    const limit = Math.min(Number(searchParams.get('limit') ?? '50'), 100);
    const type = searchParams.get('type'); // optional filter
    const folderId = searchParams.get('folderId');
    const search = searchParams.get('search')?.trim();

    const documents = await db.document.findMany({
      where: {
        userId: session.user.id,
        ...(type ? { type } : {}),
        ...(folderId ? { folderId } : {}),
        ...(search
          ? {
              OR: [
                { title: { contains: search } },
                { content: { contains: search } },
              ],
            }
          : {}),
      },
      orderBy: { updatedAt: 'desc' },
      take: limit,
      include: { folder: { select: { id: true, name: true, color: true } } },
    });

    return NextResponse.json({ documents });
  } catch (err) {
    console.error('[documents/list] error', err);
    return NextResponse.json(
      { error: 'Failed to load documents' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { type, title, content, folderId, tags } = body as {
      type: string;
      title: string;
      content: string;
      folderId?: string;
      tags?: string;
    };

    if (!type || !title || !content) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const doc = await db.document.create({
      data: {
        userId: session.user.id,
        type,
        title,
        content,
        folderId: folderId ?? null,
        tags: tags ?? null,
      },
    });

    return NextResponse.json({ document: doc });
  } catch (err) {
    console.error('[documents/create] error', err);
    return NextResponse.json(
      { error: 'Failed to save document' },
      { status: 500 }
    );
  }
}
