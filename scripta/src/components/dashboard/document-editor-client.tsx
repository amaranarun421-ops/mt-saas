'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  ArrowLeft,
  Save,
  Trash2,
  Send,
  Loader2,
  FileText,
  MessageSquare,
  Mail,
  Package,
  RefreshCw,
  Sparkles,
  Folder as FolderIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { CustomDropdown } from './custom-dropdown';
import { useStreamingGeneration } from './use-streaming-generation';
import { useSession } from 'next-auth/react';
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
import { relativeTime } from '@/lib/utils';

type Mode = 'blog' | 'social' | 'email' | 'product';

const TYPE_META: Record<Mode, { label: string; icon: React.ComponentType<{ className?: string }>; color: string }> = {
  blog: { label: 'Blog Post', icon: FileText, color: 'bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300' },
  social: { label: 'Social Caption', icon: MessageSquare, color: 'bg-pink-100 text-pink-700 dark:bg-pink-500/15 dark:text-pink-300' },
  email: { label: 'Email Copy', icon: Mail, color: 'bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300' },
  product: { label: 'Product Description', icon: Package, color: 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300' },
};

interface DocumentEditorClientProps {
  document: {
    id: string;
    type: Mode;
    title: string;
    content: string;
    tags: string | null;
    folderId: string | null;
    folder: { id: string; name: string; color: string } | null;
    createdAt: string;
    updatedAt: string;
  };
  folders: Array<{ id: string; name: string; color: string }>;
}

export function DocumentEditorClient({
  document: doc,
  folders,
}: DocumentEditorClientProps) {
  const router = useRouter();
  const { update } = useSession();
  const meta = TYPE_META[doc.type];

  const [title, setTitle] = React.useState(doc.title);
  const [content, setContent] = React.useState(doc.content);
  const [folderId, setFolderId] = React.useState(doc.folderId ?? '');
  const [tags, setTags] = React.useState(doc.tags ?? '');
  const [isSaving, setIsSaving] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [regenInstructions, setRegenInstructions] = React.useState('');
  const [showRaw, setShowRaw] = React.useState(false);

  const { generate, stop, output, isStreaming, error } = useStreamingGeneration({
    mode: doc.type,
    onCreditChange: () => update?.().catch(() => {}),
  });

  // If a regeneration produces output, swap the editor content when streaming ends
  React.useEffect(() => {
    if (!isStreaming && output.trim()) {
      setContent(output);
    }
  }, [isStreaming, output]);

  const dirty =
    title !== doc.title ||
    content !== doc.content ||
    folderId !== (doc.folderId ?? '') ||
    tags !== (doc.tags ?? '');

  const save = async () => {
    if (!title.trim()) {
      toast.error('Title cannot be empty.');
      return;
    }
    setIsSaving(true);
    try {
      const res = await fetch(`/api/documents/${doc.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          content,
          folderId: folderId || null,
          tags: tags || null,
        }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        toast.error(j.error ?? 'Failed to save.');
        return;
      }
      toast.success('Saved.');
      router.refresh();
    } catch {
      toast.error('Network error.');
    } finally {
      setIsSaving(false);
    }
  };

  const del = async () => {
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/documents/${doc.id}`, { method: 'DELETE' });
      if (!res.ok) {
        toast.error('Failed to delete.');
        return;
      }
      toast.success('Document deleted.');
      router.push('/dashboard/documents');
    } finally {
      setIsDeleting(false);
    }
  };

  const regenerate = () => {
    if (isStreaming) {
      stop();
      return;
    }
    // The "instructions" field is the new instructions.
    // We pass the current title + tags as the input; the API uses it
    // to bias the regeneration.
    generate(
      {
        // Best-effort input shape — the API route will validate per-mode.
        topic: title,
        product: title,
        audience: title,
        platform: 'linkedin',
        tone: 'professional',
        goal: 'follow-up',
        keyPoint: regenInstructions || 'refine the existing document',
        features: tags || title,
        length: 'medium (~600 words)',
        keywords: tags,
      },
      regenInstructions || `Refine the existing document titled: ${title}`
    );
  };

  return (
    <div className="space-y-4 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <Link
          href="/dashboard/documents"
          className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition"
        >
          <ArrowLeft className="h-3 w-3" />
          Documents
        </Link>
        <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <span
              className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-[10px] font-medium uppercase tracking-wider ${meta.color}`}
            >
              <meta.icon className="h-3 w-3" />
              {meta.label}
            </span>
            <span className="text-xs text-muted-foreground">
              Updated {relativeTime(doc.updatedAt)}
            </span>
            {dirty && (
              <span className="inline-flex items-center gap-1 text-[10px] text-amber-700">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                Unsaved changes
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10">
                  <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete this document?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete &ldquo;{doc.title}&rdquo;. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={del}
                    className="bg-red-500 hover:bg-red-600 text-white"
                    disabled={isDeleting}
                  >
                    {isDeleting ? 'Deleting…' : 'Delete'}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <Button
              onClick={save}
              disabled={isSaving || !dirty}
              className="btn-elevated btn-press h-9"
              size="sm"
            >
              {isSaving ? (
                <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
              ) : (
                <Save className="mr-1.5 h-3.5 w-3.5" />
              )}
              {isSaving ? 'Saving…' : 'Save'}
            </Button>
          </div>
        </div>
      </div>

      {/* Split view: editor | regenerate chat */}
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        {/* Editor */}
        <Card className="border-border/60">
          <CardHeader className="pb-3 space-y-3">
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-lg font-semibold border-none px-0 h-auto focus-visible:ring-0"
              placeholder="Untitled document"
            />
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Folder</Label>
                <CustomDropdown
                  value={folderId}
                  onChange={setFolderId}
                  placeholder="No folder"
                  options={[
                    { value: '', label: 'No folder' },
                    ...folders.map((f) => ({
                      value: f.id,
                      label: f.name,
                    })),
                  ]}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Tags (comma-separated)</Label>
                <Input
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="seo, launch, q1"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 mb-3">
              <Button
                type="button"
                variant={showRaw ? 'outline' : 'ghost'}
                size="sm"
                className="h-7"
                onClick={() => setShowRaw(false)}
              >
                Preview
              </Button>
              <Button
                type="button"
                variant={showRaw ? 'ghost' : 'outline'}
                size="sm"
                className="h-7"
                onClick={() => setShowRaw(true)}
              >
                Markdown
              </Button>
            </div>
            {showRaw ? (
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={24}
                className="font-mono text-sm resize-y"
                placeholder="# Start writing…"
              />
            ) : (
              <div className="min-h-[60vh] rounded-md border border-border/60 bg-muted/20 p-4 prose prose-sm dark:prose-invert max-w-none">
                {content.trim() ? (
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {content}
                  </ReactMarkdown>
                ) : (
                  <p className="text-muted-foreground">
                    Start typing or generate content with the panel on the right.
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Regenerate chat (right column) */}
        <Card className="border-border/60 h-fit lg:sticky lg:top-20">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <RefreshCw className="h-4 w-4 text-primary-500" />
              Regenerate
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              Use the AI to refine the document. The new content replaces the editor.
            </p>
          </CardHeader>
          <CardContent className="space-y-3">
            {error && (
              <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
                {error}
              </div>
            )}
            {isStreaming && (
              <div className="rounded-md border border-primary-200 bg-primary-50 dark:bg-primary-500/10 dark:border-primary-500/30 p-3">
                <div className="flex items-center gap-2 text-xs text-primary-700 dark:text-primary-300">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary-400 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-primary-500" />
                  </span>
                  Streaming new output…
                </div>
                <div className="mt-2 space-y-1.5">
                  <div className="h-2 w-3/4 rounded skeleton-shimmer" />
                  <div className="h-2 w-1/2 rounded skeleton-shimmer" />
                  <div className="h-2 w-5/6 rounded skeleton-shimmer" />
                </div>
              </div>
            )}
            <div className="space-y-1.5">
              <Label htmlFor="instructions" className="text-xs">
                Instructions
              </Label>
              <Textarea
                id="instructions"
                rows={5}
                placeholder="e.g. make it shorter, more punchy, add a call-to-action…"
                value={regenInstructions}
                onChange={(e) => setRegenInstructions(e.target.value)}
                disabled={isStreaming}
              />
            </div>
            <div className="flex gap-2">
              {isStreaming ? (
                <Button
                  variant="outline"
                  className="flex-1 h-9"
                  onClick={stop}
                >
                  Stop
                </Button>
              ) : (
                <Button
                  onClick={regenerate}
                  disabled={isStreaming}
                  className="flex-1 btn-elevated btn-press h-9"
                >
                  <Sparkles className="mr-1.5 h-3.5 w-3.5" />
                  Regenerate
                </Button>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              <FolderIcon className="inline h-3 w-3 mr-1" />
              Each regeneration costs 1 credit (free plan) — Pro is unlimited.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
