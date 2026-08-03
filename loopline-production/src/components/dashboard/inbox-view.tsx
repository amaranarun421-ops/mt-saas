"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn, formatDateTime, timeAgo, truncate } from "@/lib/utils";
import {
  Search,
  Send,
  RefreshCw,
  MessageSquare,
  User,
  Bot,
  Headset,
  CheckCircle2,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { EmptyInboxIllustration } from "@/components/brand/illustrations";
import type { ConversationStatus } from "@prisma/client";

interface Message {
  id: string;
  role: "USER" | "ASSISTANT" | "HUMAN_AGENT";
  content: string;
  createdAt: string;
}

interface Conversation {
  id: string;
  status: ConversationStatus;
  visitorId: string;
  visitorName: string | null;
  createdAt: string;
  updatedAt: string;
  bot: { id: string; name: string; primaryColor: string };
  messages: Message[];
}

const STATUS_FILTERS: { id: "all" | ConversationStatus; label: string }[] = [
  { id: "all", label: "All" },
  { id: "NEEDS_HUMAN", label: "Needs human" },
  { id: "AI", label: "AI handling" },
  { id: "RESOLVED", label: "Resolved" },
];

export function InboxView({
  botId,
  workspaceBots,
}: {
  botId?: string;
  workspaceBots: { id: string; name: string; primaryColor: string }[];
}) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<"all" | ConversationStatus>("all");
  const [filterBotId, setFilterBotId] = useState<string | "all">(botId || "all");
  const [search, setSearch] = useState("");
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);
  const [mobileShowThread, setMobileShowThread] = useState(false);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const loadConversations = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (statusFilter !== "all") params.set("status", statusFilter);
      if (filterBotId !== "all") params.set("botId", filterBotId);
      const res = await fetch(`/api/conversations?${params}`);
      const json = await res.json();
      setConversations(json.conversations || []);
    } catch (e) {
      // silent — poll again
    } finally {
      setLoading(false);
    }
  }, [statusFilter, filterBotId]);

  useEffect(() => {
    setLoading(true);
    loadConversations();
  }, [loadConversations]);

  // Poll for new conversations every 8s
  useEffect(() => {
    pollRef.current = setInterval(loadConversations, 8000);
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [loadConversations]);

  // Auto-select first conversation on desktop
  useEffect(() => {
    if (!selectedId && conversations.length > 0 && window.innerWidth >= 768) {
      setSelectedId(conversations[0].id);
    }
  }, [conversations, selectedId]);

  const selected = conversations.find((c) => c.id === selectedId);

  const filtered = search
    ? conversations.filter((c) =>
        c.messages.some((m) => m.content.toLowerCase().includes(search.toLowerCase())),
      )
    : conversations;

  async function sendReply() {
    if (!selected || !reply.trim()) return;
    setSending(true);
    try {
      const res = await fetch(`/api/conversations/${selected.id}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: reply.trim() }),
      });
      const json = await res.json();
      if (!res.ok) {
        toast.error(json.error || "Failed to send");
        setSending(false);
        return;
      }
      setReply("");
      // Optimistic update
      setConversations((prev) =>
        prev.map((c) =>
          c.id === selected.id
            ? {
                ...c,
                status: "NEEDS_HUMAN",
                updatedAt: new Date().toISOString(),
                messages: [...c.messages, { ...json.message, createdAt: json.message.createdAt }],
              }
            : c,
        ),
      );
      toast.success("Reply sent");
    } catch (e) {
      toast.error("Failed to send");
    } finally {
      setSending(false);
    }
  }

  async function markResolved() {
    if (!selected) return;
    try {
      await fetch("/api/conversations", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversationId: selected.id, status: "RESOLVED" }),
      });
      setConversations((prev) =>
        prev.map((c) => (c.id === selected.id ? { ...c, status: "RESOLVED" } : c)),
      );
      toast.success("Marked as resolved");
    } catch (e) {
      toast.error("Failed to update");
    }
  }

  return (
    <div className="container-loopline flex h-[calc(100vh-4rem-3.5rem)] gap-0 overflow-hidden rounded-2xl border border-border bg-card pb-6">
      {/* Conversation list */}
      <div
        className={cn(
          "flex w-full flex-col border-r border-border md:w-80 lg:w-96",
          mobileShowThread && "hidden md:flex",
        )}
      >
        {/* Filters */}
        <div className="border-b border-border p-3 space-y-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search conversations…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex gap-1">
            {STATUS_FILTERS.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setStatusFilter(f.id)}
                className={cn(
                  "rounded-full px-2.5 py-1 text-xs font-medium transition",
                  statusFilter === f.id
                    ? "bg-brand-500 text-white"
                    : "bg-muted text-muted-foreground hover:bg-accent",
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
          {!botId && workspaceBots.length > 1 && (
            <div className="flex gap-1 overflow-x-auto no-scrollbar">
              <button
                type="button"
                onClick={() => setFilterBotId("all")}
                className={cn(
                  "shrink-0 rounded-full px-2.5 py-1 text-xs font-medium transition",
                  filterBotId === "all"
                    ? "bg-foreground text-background"
                    : "bg-muted text-muted-foreground hover:bg-accent",
                )}
              >
                All bots
              </button>
              {workspaceBots.map((b) => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => setFilterBotId(b.id)}
                  className={cn(
                    "flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium transition",
                    filterBotId === b.id
                      ? "bg-foreground text-background"
                      : "bg-muted text-muted-foreground hover:bg-accent",
                  )}
                >
                  <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: b.primaryColor }} />
                  {b.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto scrollbar-loopline">
          {loading ? (
            <div className="flex h-full items-center justify-center">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-6 text-center">
              <MessageSquare className="mx-auto h-8 w-8 text-muted-foreground" />
              <p className="mt-2 text-sm font-medium text-foreground">No conversations</p>
              <p className="text-xs text-muted-foreground">
                {statusFilter === "NEEDS_HUMAN"
                  ? "All caught up — no conversations need human attention."
                  : "Conversations will appear here as visitors chat with your widget."}
              </p>
            </div>
          ) : (
            filtered.map((c) => {
              const lastMsg = c.messages[c.messages.length - 1];
              const isSelected = c.id === selectedId;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => {
                    setSelectedId(c.id);
                    setMobileShowThread(true);
                  }}
                  className={cn(
                    "flex w-full items-start gap-3 border-b border-border p-3 text-left transition",
                    isSelected ? "bg-accent" : "hover:bg-accent/50",
                  )}
                >
                  <span
                    className="mt-0.5 h-9 w-9 shrink-0 rounded-lg"
                    style={{ backgroundColor: c.bot.primaryColor, opacity: 0.15 }}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate text-sm font-semibold text-foreground">
                        {c.visitorName || "Anonymous"}
                      </p>
                      <span className="shrink-0 text-[10px] text-muted-foreground">
                        {timeAgo(c.updatedAt)}
                      </span>
                    </div>
                    <p className="truncate text-xs text-muted-foreground">
                      {lastMsg ? truncate(lastMsg.content, 70) : "No messages"}
                    </p>
                    <div className="mt-1 flex items-center gap-1.5">
                      <span className="text-[10px] text-muted-foreground">{c.bot.name}</span>
                      {c.status === "NEEDS_HUMAN" && (
                        <span className="rounded-full bg-amber-500/15 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                          Needs human
                        </span>
                      )}
                      {c.status === "RESOLVED" && (
                        <span className="rounded-full bg-muted px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">
                          Resolved
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>

        <div className="border-t border-border p-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={loadConversations}
            className="w-full justify-center text-xs text-muted-foreground"
          >
            <RefreshCw className="h-3 w-3" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Thread */}
      <div
        className={cn(
          "flex-1 flex-col",
          mobileShowThread ? "flex" : "hidden md:flex",
        )}
      >
        {!selected ? (
          <div className="flex h-full flex-col items-center justify-center p-8 text-center">
            <EmptyInboxIllustration className="max-w-xs" />
            <h3 className="mt-4 font-display text-lg text-foreground">
              No conversation selected
            </h3>
            <p className="mt-1 max-w-xs text-sm text-muted-foreground">
              Pick a conversation from the list to see the full transcript and reply as a human agent.
            </p>
          </div>
        ) : (
          <>
            {/* Thread header */}
            <div className="flex items-center justify-between border-b border-border p-4">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  className="md:hidden rounded-lg p-1 text-muted-foreground hover:bg-accent"
                  onClick={() => setMobileShowThread(false)}
                  aria-label="Back to list"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
                <div>
                  <p className="font-display text-base text-foreground">
                    {selected.visitorName || "Anonymous visitor"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {selected.bot.name} · started {formatDateTime(selected.createdAt)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {selected.status === "NEEDS_HUMAN" && (
                  <span className="rounded-full bg-amber-500/15 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                    Needs human
                  </span>
                )}
                {selected.status !== "RESOLVED" && (
                  <Button variant="outline" size="sm" onClick={markResolved}>
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Resolve
                  </Button>
                )}
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 space-y-3 overflow-y-auto bg-muted/30 p-4 scrollbar-loopline">
              {selected.messages.map((m) => (
                <MessageBubble key={m.id} message={m} botColor={selected.bot.primaryColor} />
              ))}
            </div>

            {/* Reply box */}
            <div className="border-t border-border p-3">
              <div className="flex items-end gap-2">
                <textarea
                  rows={1}
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      sendReply();
                    }
                  }}
                  placeholder="Reply as human agent…"
                  className="flex-1 resize-none rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm outline-none transition focus:border-brand-300 focus:ring-2 focus:ring-brand-500/20 scrollbar-loopline"
                  style={{ maxHeight: "120px" }}
                />
                <Button onClick={sendReply} disabled={sending || !reply.trim()} size="icon" className="h-10 w-10">
                  {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </Button>
              </div>
              <p className="mt-1.5 text-[10px] text-muted-foreground">
                Press Enter to send · Shift+Enter for newline · Replies are sent as a human agent and break this thread out of AI mode.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function MessageBubble({
  message,
  botColor,
}: {
  message: Message;
  botColor: string;
}) {
  const isUser = message.role === "USER";
  const isAssistant = message.role === "ASSISTANT";
  const isHuman = message.role === "HUMAN_AGENT";

  return (
    <div
      className={cn(
        "loopline-msg-in flex gap-2.5",
        isUser ? "justify-end" : "justify-start",
      )}
    >
      {!isUser && (
        <span
          className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-white"
          style={{ backgroundColor: isHuman ? "#0f172a" : botColor }}
        >
          {isHuman ? <Headset className="h-3.5 w-3.5" /> : <Bot className="h-3.5 w-3.5" />}
        </span>
      )}
      <div
        className={cn(
          "max-w-[75%] rounded-2xl px-3.5 py-2 text-sm shadow-sm",
          isUser
            ? "rounded-tr-sm bg-brand-500 text-white"
            : isHuman
              ? "rounded-tl-sm bg-foreground text-background"
              : "rounded-tl-sm bg-card text-foreground",
        )}
      >
        <p className="whitespace-pre-wrap break-words">{message.content}</p>
        <p
          className={cn(
            "mt-1 text-[10px]",
            isUser ? "text-white/70" : isHuman ? "text-background/60" : "text-muted-foreground",
          )}
        >
          {isHuman && "Human agent · "}
          {formatDateTime(message.createdAt)}
        </p>
      </div>
      {isUser && (
        <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <User className="h-3.5 w-3.5" />
        </span>
      )}
    </div>
  );
}
