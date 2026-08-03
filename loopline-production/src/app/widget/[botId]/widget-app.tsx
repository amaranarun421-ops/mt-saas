"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Bot, X, Send, Headset, MessageSquare, ArrowLeft, RefreshCw } from "lucide-react";
import { generateVisitorId } from "@/lib/utils";

interface Bot {
  id: string;
  name: string;
  avatarUrl: string | null;
  primaryColor: string;
  welcomeMessage: string;
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface Props {
  bot: Bot;
}

export function WidgetApp({ bot }: Props) {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [visitorId, setVisitorId] = useState<string>("");
  const [handoffRequested, setHandoffRequested] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Persist visitor ID across sessions
  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem(`loopline_visitor_${bot.id}`);
    if (stored) {
      setVisitorId(stored);
    } else {
      const id = generateVisitorId();
      localStorage.setItem(`loopline_visitor_${bot.id}`, id);
      setVisitorId(id);
    }
  }, [bot.id]);

  // Notify parent iframe (widget.js loader) of open/close state so it can
  // resize the iframe. Only send if we're actually embedded.
  const notifyParent = useCallback((isOpen: boolean) => {
    if (window.parent === window) return; // not embedded
    if (isOpen) {
      window.parent.postMessage(
        { type: "loopline:open", width: 380, height: 600 },
        "*",
      );
    } else {
      window.parent.postMessage({ type: "loopline:close" }, "*");
    }
  }, []);

  useEffect(() => {
    notifyParent(open);
  }, [open, notifyParent]);

  // Welcome message on first open
  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([
        {
          id: "welcome",
          role: "assistant",
          content: bot.welcomeMessage,
        },
      ]);
    }
  }, [open, messages.length, bot.welcomeMessage]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  // Focus input on open
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || streaming) return;
      setError(null);

      const userMsg: Message = {
        id: `u_${Date.now()}`,
        role: "user",
        content: text.trim(),
      };
      const placeholder: Message = {
        id: `a_${Date.now()}`,
        role: "assistant",
        content: "",
      };
      setMessages((prev) => [...prev, userMsg, placeholder]);
      setInput("");
      setStreaming(true);

      try {
        const res = await fetch(`/api/widget/${bot.id}/chat`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: [...messages, userMsg]
              .filter((m) => m.id !== "welcome")
              .map((m) => ({ role: m.role, content: m.content })),
            visitorId,
            conversationId,
          }),
        });

        if (res.status === 402) {
          setError("This bot has reached its monthly conversation limit.");
          setMessages((prev) => prev.filter((m) => m.id !== placeholder.id));
          setStreaming(false);
          return;
        }
        if (!res.ok || !res.body) {
          throw new Error("Stream failed");
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        let acc = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            if (!line.startsWith("data: ")) continue;
            const payload = line.slice(6);
            try {
              const data = JSON.parse(payload);
              if (data.conversationId) setConversationId(data.conversationId);
              if (data.delta) {
                acc += data.delta;
                setMessages((prev) =>
                  prev.map((m) => (m.id === placeholder.id ? { ...m, content: acc } : m)),
                );
              }
              if (data.done) {
                // Stream complete
              }
              if (data.error) {
                if (data.fallback) {
                  setMessages((prev) =>
                    prev.map((m) => (m.id === placeholder.id ? { ...m, content: data.fallback } : m)),
                  );
                } else {
                  throw new Error(data.error);
                }
              }
            } catch (e) {
              // ignore partial JSON
            }
          }
        }
      } catch (e: any) {
        setError("Connection failed. Please try again.");
        setMessages((prev) => prev.filter((m) => m.id !== placeholder.id));
      } finally {
        setStreaming(false);
      }
    },
    [messages, streaming, visitorId, conversationId, bot.id],
  );

  const requestHuman = useCallback(async () => {
    if (!conversationId) {
      // No conversation yet — just show the handoff UI
      setHandoffRequested(true);
      setMessages((prev) => [
        ...prev,
        {
          id: `h_${Date.now()}`,
          role: "assistant",
          content:
            "I've flagged this conversation for a human agent. They'll follow up via email shortly. Thanks for your patience!",
        },
      ]);
      return;
    }
    try {
      await fetch("/api/conversations", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversationId, status: "NEEDS_HUMAN" }),
      });
      setHandoffRequested(true);
      setMessages((prev) => [
        ...prev,
        {
          id: `h_${Date.now()}`,
          role: "assistant",
          content:
            "I've flagged this conversation for a human agent. They'll follow up shortly. Thanks for your patience!",
        },
      ]);
    } catch (e) {
      setError("Couldn't request handoff. Please try again.");
    }
  }, [conversationId]);

  // Render nothing until mounted (avoid hydration mismatch with localStorage)
  if (!mounted) {
    return <div className="h-0 w-0" />;
  }

  return (
    <div
      className="loopline-widget-root fixed inset-0 flex items-end justify-end"
      style={{ fontFamily: "ui-sans-serif, system-ui, -apple-system, sans-serif" }}
    >
      {/* Launcher */}
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="loopline-pulse-ring relative m-4 flex h-14 w-14 items-center justify-center rounded-full text-white shadow-lg transition hover:scale-105"
          style={{ backgroundColor: bot.primaryColor }}
          aria-label={`Open chat with ${bot.name}`}
        >
          <MessageSquare className="h-6 w-6" />
        </button>
      )}

      {/* Panel */}
      {open && (
        <div className="loopline-msg-in flex h-full w-full flex-col overflow-hidden bg-white"
          style={{ border: `1px solid rgba(0,0,0,0.08)` }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-4 py-3 text-white"
            style={{ backgroundColor: bot.primaryColor }}
          >
            <div className="flex items-center gap-2.5">
              {bot.avatarUrl ? (
                <img
                  src={bot.avatarUrl}
                  alt=""
                  className="h-8 w-8 rounded-full object-cover"
                />
              ) : (
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
                  <Bot className="h-4 w-4" />
                </span>
              )}
              <div>
                <p className="text-sm font-semibold leading-tight">{bot.name}</p>
                <p className="flex items-center gap-1 text-[10px] leading-tight opacity-90">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-300" />
                  Online · replies instantly
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              className="rounded-full p-1.5 transition hover:bg-white/20"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 space-y-3 overflow-y-auto bg-gray-50 p-4 scrollbar-loopline">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`loopline-msg-in flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-sm shadow-sm ${
                    m.role === "user"
                      ? "rounded-tr-sm text-white"
                      : "rounded-tl-sm bg-white text-gray-900"
                  }`}
                  style={m.role === "user" ? { backgroundColor: bot.primaryColor } : {}}
                >
                  <p className="whitespace-pre-wrap break-words">{m.content || "…"}</p>
                  {streaming && m.id.startsWith("a_") && m.content === "" && (
                    <div className="flex items-center gap-1 py-0.5">
                      <span className="loopline-typing-dot h-1.5 w-1.5 rounded-full bg-gray-400" style={{ animationDelay: "0ms" }} />
                      <span className="loopline-typing-dot h-1.5 w-1.5 rounded-full bg-gray-400" style={{ animationDelay: "150ms" }} />
                      <span className="loopline-typing-dot h-1.5 w-1.5 rounded-full bg-gray-400" style={{ animationDelay: "300ms" }} />
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Error */}
          {error && (
            <div className="border-t border-amber-200 bg-amber-50 px-4 py-2">
              <p className="text-xs text-amber-800">{error}</p>
            </div>
          )}

          {/* Handoff banner */}
          {handoffRequested ? (
            <div className="border-t border-gray-200 bg-gray-100 px-4 py-3">
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <Headset className="h-4 w-4" />
                <span>Conversation escalated to a human agent.</span>
                <button
                  type="button"
                  onClick={() => {
                    setHandoffRequested(false);
                    setMessages([{
                      id: "welcome",
                      role: "assistant",
                      content: bot.welcomeMessage,
                    }]);
                    setConversationId(null);
                  }}
                  className="ml-auto inline-flex items-center gap-1 font-medium text-gray-900 hover:underline"
                >
                  <RefreshCw className="h-3 w-3" />
                  Start over
                </button>
              </div>
            </div>
          ) : (
            <div className="border-t border-gray-200 px-3 py-2">
              <button
                type="button"
                onClick={requestHuman}
                className="flex w-full items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs font-medium text-gray-600 transition hover:bg-gray-100"
              >
                <Headset className="h-3.5 w-3.5" />
                Talk to a human
              </button>
            </div>
          )}

          {/* Input */}
          <div className="border-t border-gray-200 bg-white p-3">
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage(input);
                  }
                }}
                placeholder="Type a message…"
                disabled={streaming || handoffRequested}
                className="flex-1 rounded-full border border-gray-200 bg-white px-3.5 py-2 text-sm outline-none transition focus:border-gray-400 disabled:opacity-50"
              />
              <button
                type="button"
                onClick={() => sendMessage(input)}
                disabled={!input.trim() || streaming || handoffRequested}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white transition hover:opacity-90 disabled:opacity-40"
                style={{ backgroundColor: bot.primaryColor }}
                aria-label="Send message"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-1.5 text-center text-[9px] text-gray-400">
              Powered by Loopline
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
