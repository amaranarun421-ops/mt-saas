import Link from 'next/link';
import { auth } from '@/auth';
import { db } from '@/lib/db';
import { DocumentsListClient } from '@/components/dashboard/documents-list-client';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';

export default async function DocumentsPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; search?: string; folderId?: string }>;
}) {
  const session = await auth();
  const userId = session!.user.id;
  const params = await searchParams;

  const where = {
    userId,
    ...(params.type ? { type: params.type } : {}),
    ...(params.folderId ? { folderId: params.folderId } : {}),
    ...(params.search
      ? {
          OR: [
            { title: { contains: params.search } },
            { content: { contains: params.search } },
          ],
        }
      : {}),
  };

  let documents: Array<{
    id: string;
    type: string;
    title: string;
    content: string;
    tags: string | null;
    updatedAt: Date;
    createdAt: Date;
    folder: { id: string; name: string; color: string } | null;
  }> = [];
  let folders: Array<{ id: string; name: string; color: string; _count: { documents: number } }> = [];
  let typeCounts: Array<{ type: string; _count: { type: number } }> = [];

  try {
    [documents, folders, typeCounts] = await Promise.all([
      db.document.findMany({
        where,
        orderBy: { updatedAt: 'desc' },
        include: { folder: { select: { id: true, name: true, color: true } } },
      }),
      db.folder.findMany({
        where: { userId },
        orderBy: { updatedAt: 'desc' },
        include: { _count: { select: { documents: true } } },
      }),
      db.document.groupBy({ by: ['type'], where: { userId }, _count: { type: true } }),
    ]);
  } catch (error) {
    console.error('[documents page] showcase fallback', error);
  }

  const totalCount = documents.length;
  const typeMap = Object.fromEntries(typeCounts.map((t) => [t.type, t._count.type]));

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Documents</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {totalCount === 0
              ? 'Your saved documents will appear here.'
              : `${totalCount} document${totalCount === 1 ? '' : 's'} saved.`}
          </p>
        </div>
        <Button asChild className="h-10 text-white button-bg btn-press">
          <Link href="/dashboard/write/blog">
            <Sparkles className="mr-2 h-4 w-4" />
            New document
          </Link>
        </Button>
      </div>

      <DocumentsListClient
        documents={documents.map((d) => ({
          id: d.id,
          type: d.type,
          title: d.title,
          content: d.content,
          tags: d.tags,
          updatedAt: d.updatedAt.toISOString(),
          createdAt: d.createdAt.toISOString(),
          folder: d.folder ? { id: d.folder.id, name: d.folder.name, color: d.folder.color } : null,
        }))}
        folders={folders.map((f) => ({
          id: f.id,
          name: f.name,
          color: f.color,
          count: f._count.documents,
        }))}
        typeCounts={typeMap}
        currentType={params.type ?? null}
        currentFolderId={params.folderId ?? null}
        currentSearch={params.search ?? ''}
      />
    </div>
  );
}
