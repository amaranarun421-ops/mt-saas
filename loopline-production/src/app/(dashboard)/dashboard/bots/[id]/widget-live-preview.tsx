"use client";

import { useState } from "react";
import { Bot, MessageSquare, X, Send } from "lucide-react";
import { cn } from "@/lib/utils";

export function WidgetLivePreview({
  name,
  color,
  welcome,
}: {
  name: string;
  color: string;
  welcome: string;
}) {
  const [open, setOpen] = useState(true);

  return (
    <div className="relative mx-auto flex h-[420px] max-w-sm flex-col items-end justify-end">
      {/* Launcher button */}
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="loopline-pulse-ring relative flex h-14 w-14 items-center justify-center rounded-full text-white shadow-[var(--shadow-lift)] transition hover:scale-105"
          style={{ backgroundColor: color }}
          aria-label="Open chat"
        >
          <MessageSquare className="h-6 w-6" />
        </button>
      )}

      {/* Chat panel */}
      {open && (
        <div className="loopline-msg-in flex h-full w-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-pop)]">
          {/* Header */}
          <div
            className="flex items-center justify-between px-4 py-3 text-white"
            style={{ backgroundColor: color }}
          >
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
                <Bot className="h-4 w-4" />
              </span>
              <div>
                <p className="text-sm font-semibold">{name}</p>
                <p className="flex items-center gap-1 text-[10px] opacity-90">
                  <span className="h-1.5 w-1.5 rounded-full bg-mint-400" />
                  Online · replies instantly
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              className="rounded-full p-1 transition hover:bg-white/20"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 space-y-3 overflow-y-auto bg-muted/30 p-4 scrollbar-loopline">
            <div className="loopline-msg-in flex justify-start">
              <div
                className="max-w-[80%] rounded-2xl rounded-tl-sm px-3.5 py-2 text-sm text-foreground shadow-sm"
                style={{ backgroundColor: "white" }}
              >
                {welcome}
              </div>
            </div>
            <div className="loopline-msg-in flex justify-end">
              <div
                className="max-w-[80%] rounded-2xl rounded-tr-sm px-3.5 py-2 text-sm text-white shadow-sm"
                style={{ backgroundColor: color }}
              >
                How do I reset my password?
              </div>
            </div>
            <div className="loopline-msg-in flex justify-start">
              <div className="rounded-2xl rounded-tl-sm bg-white px-3.5 py-2 shadow-sm">
                <div className="flex items-center gap-1">
                  <span className="loopline-typing-dot h-1.5 w-1.5 rounded-full" style={{ backgroundColor: color, animationDelay: "0ms" }} />
                  <span className="loopline-typing-dot h-1.5 w-1.5 rounded-full" style={{ backgroundColor: color, animationDelay: "150ms" }} />
                  <span className="loopline-typing-dot h-1.5 w-1.5 rounded-full" style={{ backgroundColor: color, animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          </div>

          {/* Input */}
          <div className="border-t border-border bg-card p-3">
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Type a message…"
                disabled
                className="flex-1 rounded-full border border-border bg-background px-3.5 py-2 text-sm text-muted-foreground"
              />
              <button
                type="button"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white"
                style={{ backgroundColor: color }}
                aria-label="Send"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
