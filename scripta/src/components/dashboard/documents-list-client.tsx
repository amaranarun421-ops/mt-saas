'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  FileText,
  MessageSquare,
  Mail,
  Package,
  Search,
  Trash2,
  Folder as FolderIcon,
  Plus,
  X,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { BlankDraftIllustration } from '@/components/marketing/illustrations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { relativeTime } from '@/lib/utils';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface DocRow {
  id: string;
  type: string;
  title: string;
  content: string;
  tags: string | null;
  updatedAt: string;
  createdAt: string;
  folder: { id: string; name: string; color: string } | null;
}

interface FolderRow {
  id: string;
  name: string;
  color: string;
  count: number;
}

const TYPE_META: Record<string, { label: string; icon: React.ComponentType<{ className?: string }>; color: string }> = {
  blog: { label: 'Blog Post', icon: FileText, color: 'bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300' },
  social: { label: 'Social Caption', icon: MessageSquare, color: 'bg-pink-100 text-pink-700 dark:bg-pink-500/15 dark:text-pink-300' },
  email: { label: 'Email Copy', icon: Mail, color: 'bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300' },
  product: { label: 'Product Description', icon: Package, color: 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300' },
};

export function DocumentsListClient({
  documents,
  folders,
  typeCounts,
  currentType,
  currentFolderId,
  currentSearch,
}: {
  documents: DocRow[];
  folders: FolderRow[];
  typeCounts: Record<string, number>;
  currentType: string | null;
  currentFolderId: string | null;
  currentSearch: string;
}) {
  const router = useRouter();
  const [search, setSearch] = React.useState(currentSearch);
  const [newFolderName, setNewFolderName] = React.useState('');
  const [creatingFolder, setCreatingFolder] = React.useState(false);
  const [showFolderInput, setShowFolderInput] = React.useState(false);

  // Debounced search — push to URL
  React.useEffect(() => {
    const id = setTimeout(() => {
      const params = new URLSearchParams();
      if (currentType) params.set('type', currentType);
      if (currentFolderId) params.set('folderId', currentFolderId);
      if (search.trim()) params.set('search', search.trim());
      const qs = params.toString();
      router.push(`/dashboard/documents${qs ? `?${qs}` : ''}`);
    }, 300);
    return () => clearTimeout(id);
  }, [search, currentType, currentFolderId, router]);

  const setTypeFilter = (type: string | null) => {
    const params = new URLSearchParams();
    if (type) params.set('type', type);
    if (currentFolderId) params.set('folderId', currentFolderId);
    if (search.trim()) params.set('search', search.trim());
    router.push(`/dashboard/documents?${params.toString()}`);
  };

  const setFolderFilter = (folderId: string | null) => {
    const params = new URLSearchParams();
    if (currentType) params.set('type', currentType);
    if (folderId) params.set('folderId', folderId);
    if (search.trim()) params.set('search', search.trim());
    router.push(`/dashboard/documents?${params.toString()}`);
  };

  const createFolder = async () => {
    if (!newFolderName.trim()) return;
    setCreatingFolder(true);
    try {
      const res = await fetch('/api/folders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newFolderName.trim() }),
      });
      if (!res.ok) {
        toast.error('Failed to create folder.');
        return;
      }
      toast.success('Folder created.');
      setNewFolderName('');
      setShowFolderInput(false);
      router.refresh();
    } finally {
      setCreatingFolder(false);
    }
  };

  const deleteDoc = async (id: string) => {
    const res = await fetch(`/api/documents/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      toast.error('Failed to delete.');
      return;
    }
    toast.success('Document deleted.');
    router.refresh();
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
      {/* Sidebar: filters + folders */}
      <aside className="space-y-6">
        <div>
          <h2 className="px-2 text-xs font-medium uppercase tracking-wider text-muted-foreground/70">
            Types
          </h2>
          <div className="mt-2 space-y-0.5">
            <FilterButton
              active={!currentType}
              onClick={() => setTypeFilter(null)}
              label="All documents"
              count={Object.values(typeCounts).reduce((a, b) => a + b, 0)}
            />
            {Object.entries(TYPE_META).map(([key, meta]) => (
              <FilterButton
                key={key}
                active={currentType === key}
                onClick={() => setTypeFilter(currentType === key ? null : key)}
                label={meta.label}
                count={typeCounts[key] ?? 0}
                icon={meta.icon}
              />
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between px-2">
            <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground/70">
              Folders
            </h2>
            <button
              type="button"
              onClick={() => setShowFolderInput((o) => !o)}
              className="text-muted-foreground hover:text-foreground transition"
              aria-label="New folder"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>

          {showFolderInput && (
            <div className="mt-2 px-2 flex gap-1.5">
              <Input
                placeholder="Folder name"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') createFolder();
                }}
                className="h-8 text-sm"
                disabled={creatingFolder}
              />
              <Button
                size="sm"
                onClick={createFolder}
                disabled={creatingFolder || !newFolderName.trim()}
                className="bg-primary-500 hover:bg-primary-600 text-white h-8 px-2"
              >
                Add
              </Button>
            </div>
          )}

          <div className="mt-2 space-y-0.5">
            <FilterButton
              active={!currentFolderId}
              onClick={() => setFolderFilter(null)}
              label="No folder"
              icon={FolderIcon}
            />
            {folders.map((folder) => (
              <FilterButton
                key={folder.id}
                active={currentFolderId === folder.id}
                onClick={() =>
                  setFolderFilter(
                    currentFolderId === folder.id ? null : folder.id
                  )
                }
                label={folder.name}
                count={folder.count}
                color={folder.color}
                icon={FolderIcon}
              />
            ))}
          </div>
        </div>
      </aside>

      {/* Documents grid */}
      <div className="space-y-4 min-w-0">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by title or content…"
            defaultValue={currentSearch}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-9"
          />
          {(currentSearch || search) && (
            <button
              type="button"
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {documents.length === 0 ? (
          <EmptyState
            hasSearch={!!search || !!currentSearch || !!currentType || !!currentFolderId}
          />
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {documents.map((doc) => {
              const meta = TYPE_META[doc.type] ?? TYPE_META.blog;
              return (
                <Card
                  key={doc.id}
                  className="border-border/60 hover:border-primary-300 card-lift group relative"
                >
                  <Link
                    href={`/dashboard/documents/${doc.id}`}
                    className="block p-5"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span
                        className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider ${meta.color}`}
                      >
                        <meta.icon className="h-3 w-3" />
                        {meta.label}
                      </span>
                      {doc.folder && (
                        <span
                          className="inline-flex items-center gap-1 text-[10px] text-muted-foreground"
                          title={doc.folder.name}
                        >
                          <span
                            className="h-2 w-2 rounded-full"
                            style={{ background: doc.folder.color }}
                          />
                          {doc.folder.name}
                        </span>
                      )}
                    </div>
                    <h3 className="mt-3 font-semibold text-sm line-clamp-2 group-hover:text-primary-600 transition">
                      {doc.title}
                    </h3>
                    <p className="mt-2 text-xs text-muted-foreground line-clamp-2">
                      {doc.content.replace(/[#*_`>-]/g, '').trim() || 'No preview'}
                    </p>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-[10px] text-muted-foreground">
                        Updated {relativeTime(doc.updatedAt)}
                      </span>
                      <ArrowRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition" />
                    </div>
                  </Link>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <button
                        className="absolute top-3 right-3 p-1 rounded-md text-muted-foreground/60 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition"
                        aria-label="Delete document"
                        onClick={(e) => e.preventDefault()}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete document?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently delete &ldquo;{doc.title}&rdquo;.
                          This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => deleteDoc(doc.id)}
                          className="bg-red-500 hover:bg-red-600 text-white"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function FilterButton({
  active,
  onClick,
  label,
  count,
  icon: Icon,
  color,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  count?: number;
  icon?: React.ComponentType<{ className?: string }>;
  color?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition cursor-pointer ${
        active
          ? 'bg-primary-50 text-primary-700 font-medium dark:bg-primary-500/10 dark:text-primary-300'
          : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'
      }`}
    >
      {Icon && <Icon className="h-3.5 w-3.5 shrink-0" />}
      {color && (
        <span
          className="h-2 w-2 rounded-full shrink-0"
          style={{ background: color }}
        />
      )}
      <span className="flex-1 text-left truncate">{label}</span>
      {typeof count === 'number' && (
        <span className="text-xs text-muted-foreground/70">{count}</span>
      )}
    </button>
  );
}

function EmptyState({ hasSearch }: { hasSearch: boolean }) {
  return (
    <div className="rounded-xl border border-dashed border-border/60 py-16 px-6 text-center">
      <div className="mx-auto max-w-sm">
        {/* unDraw-style flat illustration — blank page being drafted.
            Distinct from the hero (writing at desk) and auth side panel
            (content calendar) illustrations. Recolored to violet #7a5af8. */}
        {!hasSearch && (
          <BlankDraftIllustration className="mx-auto h-44 w-auto mb-2" />
        )}
        {hasSearch && (
          <svg
            viewBox="0 0 64 64"
            className="mx-auto h-16 w-16 text-primary-400/50"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <circle cx="28" cy="28" r="14" />
            <path d="M38 38l14 14" />
          </svg>
        )}
        <h3 className="mt-4 text-lg font-semibold">
          {hasSearch ? 'No matching documents' : 'No documents yet'}
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          {hasSearch
            ? 'Try adjusting your filters or search term.'
            : 'Generate your first piece of content and it will appear here.'}
        </p>
        {!hasSearch && (
          <Button
            asChild
            className="mt-4 btn-elevated btn-press h-10"
          >
            <Link href="/dashboard/write/blog">
              <Sparkles className="mr-2 h-4 w-4" />
              Start writing
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
}
