"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Upload, Trash2, FileText, Loader2, Plus } from "lucide-react";
import { toast } from "sonner";
import { cn, formatDateTime, truncate } from "@/lib/utils";
import type { KnowledgeChunk } from "./bot-setup-tabs";

export function KnowledgeBasePanel({
  botId,
  initialChunks,
}: {
  botId: string;
  initialChunks: KnowledgeChunk[];
}) {
  const [chunks, setChunks] = useState<KnowledgeChunk[]>(initialChunks);
  const [content, setContent] = useState("");
  const [sourceName, setSourceName] = useState("");
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  async function onUpload() {
    if (!content.trim() || !sourceName.trim()) {
      toast.error("Source name and content are both required");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/bots/${botId}/knowledge`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: content.trim(),
          sourceName: sourceName.trim(),
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        toast.error(json.error || "Upload failed");
        setLoading(false);
        return;
      }
      toast.success(`Added ${json.count} chunk${json.count === 1 ? "" : "s"}`);
      setChunks((prev) => [...json.chunks, ...prev]);
      setContent("");
      setSourceName("");
    } catch (e) {
      toast.error("Upload failed");
      setLoading(false);
    }
  }

  async function onFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 500_000) {
      toast.error("File too large (max 500KB). Paste content instead.");
      e.target.value = "";
      return;
    }
    const text = await file.text();
    setContent(text);
    setSourceName(file.name.replace(/\.[^.]+$/, ""));
    toast.success("File loaded — review and click Upload to save");
    e.target.value = "";
  }

  async function onDeleteChunk(id: string) {
    setDeletingId(id);
    try {
      await fetch(`/api/bots/${botId}/knowledge?chunkId=${id}`, {
        method: "DELETE",
      });
      setChunks((prev) => prev.filter((c) => c.id !== id));
      toast.success("Chunk removed");
    } catch (e) {
      toast.error("Delete failed");
    } finally {
      setDeletingId(null);
    }
  }

  async function onDeleteAll() {
    if (!confirm("Remove all knowledge chunks? This cannot be undone.")) return;
    setLoading(true);
    try {
      await fetch(`/api/bots/${botId}/knowledge`, { method: "DELETE" });
      setChunks([]);
      toast.success("All chunks removed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-5">
      <Card className="p-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-display text-lg text-foreground">Add knowledge</h3>
            <p className="text-xs text-muted-foreground">
              Paste FAQ text, docs, or markdown. We chunk it into ~500-char passages
              and retrieve the top matches to ground AI responses.
            </p>
          </div>
          <input
            ref={fileRef}
            type="file"
            accept=".txt,.md,.markdown"
            onChange={onFileUpload}
            className="hidden"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => fileRef.current?.click()}
          >
            <Upload className="h-4 w-4" />
            Upload file
          </Button>
        </div>

        <div className="mt-4 space-y-3">
          <div>
            <Label htmlFor="source-name">Source name</Label>
            <Input
              id="source-name"
              placeholder="e.g. FAQ page, Onboarding docs"
              value={sourceName}
              onChange={(e) => setSourceName(e.target.value)}
              className="mt-1.5"
            />
          </div>
          <div>
            <Label htmlFor="kb-content">Content</Label>
            <Textarea
              id="kb-content"
              rows={8}
              placeholder={"Q: How do I reset my password?\nA: Go to Settings → Security → Reset password.\n\nQ: What payment methods do you accept?\nA: We accept Visa, Mastercard, and Amex via Stripe."}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="mt-1.5 resize-y font-mono text-xs scrollbar-loopline"
            />
            <p className="mt-1 text-xs text-muted-foreground">
              {content.length.toLocaleString()} characters · ~{Math.max(1, Math.ceil(content.length / 500))} chunks
            </p>
          </div>
          <Button onClick={onUpload} disabled={loading || !content.trim() || !sourceName.trim()}>
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Uploading…
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" />
                Add to knowledge base
              </>
            )}
          </Button>
        </div>
      </Card>

      <Card className="p-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-display text-lg text-foreground">
              Knowledge base ({chunks.length})
            </h3>
            <p className="text-xs text-muted-foreground">
              Top-matching chunks are injected into the AI system prompt per question.
            </p>
          </div>
          {chunks.length > 0 && (
            <Button variant="ghost" size="sm" onClick={onDeleteAll} className="text-destructive hover:text-destructive">
              <Trash2 className="h-4 w-4" />
              Clear all
            </Button>
          )}
        </div>

        {chunks.length === 0 ? (
          <div className="mt-4 rounded-xl border border-dashed border-border p-8 text-center">
            <FileText className="mx-auto h-8 w-8 text-muted-foreground" />
            <p className="mt-2 text-sm font-medium text-foreground">No knowledge yet</p>
            <p className="text-xs text-muted-foreground">
              Add FAQ content above to ground your bot&apos;s responses.
            </p>
          </div>
        ) : (
          <div className="mt-4 space-y-2">
            {chunks.map((chunk) => (
              <div
                key={chunk.id}
                className="group flex items-start gap-3 rounded-xl border border-border bg-card p-3 transition hover:border-brand-300"
              >
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-300">
                  <FileText className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-medium text-foreground">
                      {chunk.sourceName}
                    </p>
                    <span className="text-[10px] text-muted-foreground">
                      {formatDateTime(chunk.createdAt)}
                    </span>
                  </div>
                  <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
                    {truncate(chunk.content, 160)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onDeleteChunk(chunk.id)}
                  disabled={deletingId === chunk.id}
                  className="rounded-lg p-1.5 text-muted-foreground opacity-0 transition hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100 disabled:opacity-50"
                  aria-label="Delete chunk"
                >
                  {deletingId === chunk.id ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Trash2 className="h-3.5 w-3.5" />
                  )}
                </button>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
