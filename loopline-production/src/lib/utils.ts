import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ─────────────────────────────────────────────────────────────────────────────
// String / formatting helpers
// ─────────────────────────────────────────────────────────────────────────────

export function slugify(s: string): string {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 60);
}

export function initials(name?: string | null): string {
  if (!name) return "LL";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function formatDate(d: Date | string | number): string {
  const date = typeof d === "object" ? d : new Date(d);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatDateTime(d: Date | string | number): string {
  const date = typeof d === "object" ? d : new Date(d);
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function timeAgo(d: Date | string | number): string {
  const date = typeof d === "object" ? d : new Date(d);
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return formatDate(date);
}

export function truncate(s: string, n: number): string {
  if (s.length <= n) return s;
  return s.slice(0, n).trimEnd() + "…";
}

// ─────────────────────────────────────────────────────────────────────────────
// ID / token generation
// ─────────────────────────────────────────────────────────────────────────────

export function generateToken(length = 32): string {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let out = "";
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  for (let i = 0; i < length; i++) {
    out += chars[bytes[i] % chars.length];
  }
  return out;
}

export function generateVisitorId(): string {
  return "vis_" + generateToken(20);
}

// ─────────────────────────────────────────────────────────────────────────────
// Knowledge-base retrieval — simple keyword overlap (top-N chunks)
// Vector search is the documented Pro upsell path.
// ─────────────────────────────────────────────────────────────────────────────

export function retrieveTopChunks(
  query: string,
  chunks: { content: string; sourceName: string }[],
  topN = 4,
): { content: string; sourceName: string; score: number }[] {
  const queryTerms = query
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((t) => t.length > 2);
  if (queryTerms.length === 0) return chunks.slice(0, topN).map((c) => ({ ...c, score: 0 }));

  const scored = chunks.map((chunk) => {
    const lower = chunk.content.toLowerCase();
    let score = 0;
    for (const term of queryTerms) {
      const matches = lower.split(term).length - 1;
      score += matches;
    }
    return { ...chunk, score };
  });

  return scored
    .filter((c) => c.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, topN);
}

// ─────────────────────────────────────────────────────────────────────────────
// Knowledge-base chunking — split long text/markdown into ~500-char chunks
// at paragraph boundaries.
// ─────────────────────────────────────────────────────────────────────────────

export function chunkText(text: string, sourceName: string): string[] {
  const paragraphs = text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  const chunks: string[] = [];
  let buffer = "";
  const TARGET = 500;
  const MAX = 900;

  for (const para of paragraphs) {
    if ((buffer + "\n\n" + para).length <= TARGET) {
      buffer = buffer ? `${buffer}\n\n${para}` : para;
    } else {
      if (buffer) chunks.push(buffer);
      if (para.length <= MAX) {
        buffer = para;
      } else {
        // hard-split very long paragraphs at sentence boundaries
        const sentences = para.split(/(?<=[.!?])\s+/);
        buffer = "";
        for (const s of sentences) {
          if ((buffer + " " + s).length <= MAX) {
            buffer = buffer ? `${buffer} ${s}` : s;
          } else {
            if (buffer) chunks.push(buffer);
            buffer = s;
          }
        }
      }
    }
  }
  if (buffer) chunks.push(buffer);
  return chunks.length ? chunks : [text.slice(0, MAX)];
}
