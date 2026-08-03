import { notFound } from 'next/navigation';
import { auth } from '@/auth';
import { db } from '@/lib/db';
import { DocumentEditorClient } from '@/components/dashboard/document-editor-client';

export default async function DocumentEditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  const { id } = await params;

  const doc = await db.document.findUnique({
    where: { id },
    include: { folder: { select: { id: true, name: true, color: true } } },
  });

  if (!doc || doc.userId !== session!.user.id) {
    notFound();
  }

  // Fetch user's folders for the folder selector
  const folders = await db.folder.findMany({
    where: { userId: session!.user.id },
    orderBy: { updatedAt: 'desc' },
    select: { id: true, name: true, color: true },
  });

  return (
    <DocumentEditorClient
      document={{
        id: doc.id,
        type: doc.type as 'blog' | 'social' | 'email' | 'product',
        title: doc.title,
        content: doc.content,
        tags: doc.tags,
        folderId: doc.folderId,
        folder: doc.folder,
        createdAt: doc.createdAt.toISOString(),
        updatedAt: doc.updatedAt.toISOString(),
      }}
      folders={folders}
    />
  );
}
