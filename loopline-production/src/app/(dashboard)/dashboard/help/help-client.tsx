"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  HelpCircle,
  BookOpen,
  MessageSquare,
  Mail,
  Video,
  Zap,
  Search,
  ChevronRight,
  Send,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  { id: "getting-started", title: "Getting started", desc: "Set up your first bot and install the widget", icon: Zap, count: 8, color: "brand" },
  { id: "bots", title: "Bots & knowledge base", desc: "Configure bots, upload content, manage theming", icon: BookOpen, count: 12, color: "violet" },
  { id: "inbox", title: "Inbox & handoff", desc: "Reply as human, resolve, manage conversations", icon: MessageSquare, count: 7, color: "mint" },
  { id: "billing", title: "Billing & plans", desc: "Upgrade, downgrade, manage subscription", icon: Mail, count: 5, color: "amber" },
];

const POPULAR = [
  { q: "How do I install the widget on my site?", category: "Getting started" },
  { q: "What format should my knowledge base be in?", category: "Bots & knowledge base" },
  { q: "How does human handoff work?", category: "Inbox & handoff" },
  { q: "Can I cancel my subscription anytime?", category: "Billing & plans" },
  { q: "How do I add team members to my workspace?", category: "Getting started" },
  { q: "What's the conversation limit on the Free plan?", category: "Billing & plans" },
];

const RESOURCES = [
  { title: "Documentation", desc: "Full API reference and guides", icon: BookOpen, href: "/docs" },
  { title: "Video tutorials", desc: "Watch 2-minute walkthroughs", icon: Video, href: "#" },
  { title: "Community", desc: "Join our Discord for help", icon: MessageSquare, href: "#" },
  { title: "Email support", desc: "hello@loopline.dev", icon: Mail, href: "mailto:hello@loopline.dev" },
];

const colorMap: Record<string, string> = {
  brand: "bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-300",
  violet: "bg-violet-50 text-violet-600 dark:bg-violet-500/15 dark:text-violet-300",
  mint: "bg-mint-500/15 text-mint-600",
  amber: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
};

export function HelpClient({ userEmail }: { userEmail: string }) {
  const [search, setSearch] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  function submitTicket() {
    if (!subject.trim() || !message.trim()) {
      toast.error("Please fill in both subject and message");
      return;
    }
    toast.success("Support ticket submitted — we'll reply within 1 business day");
    setSubject("");
    setMessage("");
  }

  return (
    <div className="space-y-6">
      {/* Hero search */}
      <Card className="relative overflow-hidden p-8">
        <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-brand-500/10 blur-3xl" />
        <div className="relative text-center">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-300">
            <HelpCircle className="h-6 w-6" />
          </span>
          <h2 className="mt-4 font-display text-2xl text-foreground">How can we help?</h2>
          <p className="mt-1 text-sm text-muted-foreground">Search our knowledge base or browse by category</p>
          <div className="relative mx-auto mt-5 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search for help articles…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-12 pl-10"
            />
          </div>
        </div>
      </Card>

      {/* Categories */}
      <div>
        <h3 className="font-display text-lg text-foreground">Browse by category</h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CATEGORIES.map((c) => (
            <Card key={c.id} className="group cursor-pointer p-5 transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-soft)]">
              <div className="flex items-start justify-between">
                <span className={cn("flex h-10 w-10 items-center justify-center rounded-xl", colorMap[c.color])}>
                  <c.icon className="h-5 w-5" />
                </span>
                <span className="text-xs text-muted-foreground">{c.count} articles</span>
              </div>
              <h4 className="mt-3 font-display text-base text-foreground">{c.title}</h4>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{c.desc}</p>
              <div className="mt-3 flex items-center gap-1 text-xs font-medium text-brand-500 opacity-0 transition group-hover:opacity-100">
                Browse articles
                <ChevronRight className="h-3 w-3" />
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Popular articles + Resources */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-5">
          <h3 className="font-display text-base text-foreground">Popular articles</h3>
          <div className="mt-3 space-y-1">
            {POPULAR.map((a, i) => (
              <button
                key={i}
                type="button"
                className="flex w-full items-center gap-3 rounded-lg p-2.5 text-left transition hover:bg-accent"
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-muted text-[10px] font-semibold text-muted-foreground">
                  {i + 1}
                </span>
                <span className="flex-1 text-sm text-foreground">{a.q}</span>
                <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
              </button>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="font-display text-base text-foreground">Resources</h3>
          <div className="mt-3 space-y-2">
            {RESOURCES.map((r) => (
              <a
                key={r.title}
                href={r.href}
                className="flex items-center gap-3 rounded-lg p-2.5 transition hover:bg-accent"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-300">
                  <r.icon className="h-4 w-4" />
                </span>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{r.title}</p>
                  <p className="text-xs text-muted-foreground">{r.desc}</p>
                </div>
                <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
              </a>
            ))}
          </div>
        </Card>
      </div>

      {/* Contact support */}
      <Card className="p-5">
        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4 text-brand-500" />
          <h3 className="font-display text-base text-foreground">Contact support</h3>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">Can&apos;t find what you need? Send us a message.</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="support-email">Your email</Label>
            <Input id="support-email" type="email" defaultValue={userEmail} className="mt-1.5" readOnly />
          </div>
          <div>
            <Label htmlFor="support-subject">Subject</Label>
            <Input
              id="support-subject"
              placeholder="What do you need help with?"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="mt-1.5"
            />
          </div>
        </div>
        <div className="mt-4">
          <Label htmlFor="support-message">Message</Label>
          <Textarea
            id="support-message"
            rows={4}
            placeholder="Describe your issue in detail…"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="mt-1.5 resize-none"
          />
        </div>
        <Button onClick={submitTicket} className="mt-4">
          <Send className="h-3.5 w-3.5" />
          Submit ticket
        </Button>
      </Card>
    </div>
  );
}
