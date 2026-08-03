"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Slack,
  Github,
  Mail,
  MessageCircle,
  Webhook,
  Calendar,
  FileText,
  Trello,
  Check,
  Plug,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Integration {
  id: string;
  name: string;
  desc: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  category: "Communication" | "DevOps" | "Productivity" | "Analytics";
  connected: boolean;
  popular?: boolean;
}

const INTEGRATIONS: Integration[] = [
  { id: "slack", name: "Slack", desc: "Get conversation alerts and reply directly from Slack channels", icon: Slack, color: "#611f69", category: "Communication", connected: true, popular: true },
  { id: "github", name: "GitHub", desc: "Link conversations to issues and sync bot config to your repo", icon: Github, color: "#181717", category: "DevOps", connected: false, popular: true },
  { id: "resend", name: "Resend", desc: "Send transactional emails for receipts, handoffs, and digests", icon: Mail, color: "#000000", category: "Communication", connected: false },
  { id: "discord", name: "Discord", desc: "Mirror conversations and alerts to your Discord server", icon: MessageCircle, color: "#5865f2", category: "Communication", connected: false },
  { id: "zapier", name: "Zapier", desc: "Connect Loopline to 5,000+ apps via Zapier workflows", icon: Webhook, color: "#ff4a00", category: "Productivity", connected: false, popular: true },
  { id: "calcom", name: "Cal.com", desc: "Book human-handoff calls directly from the widget", icon: Calendar, color: "#292929", category: "Productivity", connected: false },
  { id: "notion", name: "Notion", desc: "Sync knowledge base docs from Notion pages automatically", icon: FileText, color: "#000000", category: "Productivity", connected: false },
  { id: "trello", name: "Trello", desc: "Create Trello cards for conversations that need human follow-up", icon: Trello, color: "#0079bf", category: "Productivity", connected: false },
];

const CATEGORIES = ["All", "Communication", "DevOps", "Productivity", "Analytics"] as const;

export function IntegrationsClient() {
  const [integrations, setIntegrations] = useState<Integration[]>(INTEGRATIONS);
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>("All");
  const [connecting, setConnecting] = useState<string | null>(null);
  const [configOpen, setConfigOpen] = useState(false);
  const [selected, setSelected] = useState<Integration | null>(null);

  const filtered = category === "All" ? integrations : integrations.filter((i) => i.category === category);

  function connect(id: string) {
    const integ = integrations.find((i) => i.id === id);
    if (!integ) return;
    if (integ.connected) {
      // Disconnect
      setIntegrations((prev) => prev.map((i) => (i.id === id ? { ...i, connected: false } : i)));
      toast.success(`${integ.name} disconnected`);
    } else {
      // Open config dialog
      setSelected(integ);
      setConfigOpen(true);
    }
  }

  function confirmConnect() {
    if (!selected) return;
    setConnecting(selected.id);
    setTimeout(() => {
      setIntegrations((prev) => prev.map((i) => (i.id === selected.id ? { ...i, connected: true } : i)));
      toast.success(`${selected.name} connected successfully`);
      setConnecting(null);
      setConfigOpen(false);
      setSelected(null);
    }, 1200);
  }

  return (
    <div className="space-y-6">
      {/* Header summary */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="p-5">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-mint-500/15 text-mint-600">
              <Check className="h-5 w-5" />
            </span>
            <div>
              <p className="font-display text-2xl text-foreground tabular-nums">
                {integrations.filter((i) => i.connected).length}
              </p>
              <p className="text-xs text-muted-foreground">Connected</p>
            </div>
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-300">
              <Plug className="h-5 w-5" />
            </span>
            <div>
              <p className="font-display text-2xl text-foreground tabular-nums">{integrations.length}</p>
              <p className="text-xs text-muted-foreground">Available</p>
            </div>
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/15 text-amber-700 dark:text-amber-400">
              <Webhook className="h-5 w-5" />
            </span>
            <div>
              <p className="font-display text-2xl text-foreground tabular-nums">∞</p>
              <p className="text-xs text-muted-foreground">Via webhooks</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Category filter */}
      <div className="flex gap-1 overflow-x-auto no-scrollbar">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setCategory(c)}
            className={cn(
              "shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition",
              category === c
                ? "bg-foreground text-background"
                : "bg-muted text-muted-foreground hover:bg-accent",
            )}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Integration grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((integ) => (
          <Card key={integ.id} className="group p-5 transition hover:shadow-[var(--shadow-soft)]">
            <div className="flex items-start justify-between">
              <span
                className="flex h-11 w-11 items-center justify-center rounded-xl text-white"
                style={{ backgroundColor: integ.color }}
              >
                <integ.icon className="h-5 w-5" />
              </span>
              {integ.popular && (
                <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                  Popular
                </span>
              )}
              {integ.connected && (
                <span className="inline-flex items-center gap-1 rounded-full bg-mint-500/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-mint-600">
                  <span className="h-1.5 w-1.5 rounded-full bg-mint-500" />
                  Connected
                </span>
              )}
            </div>
            <h3 className="mt-3 font-display text-base text-foreground">{integ.name}</h3>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{integ.desc}</p>
            <div className="mt-4 flex items-center gap-2">
              <Button
                size="sm"
                variant={integ.connected ? "outline" : "default"}
                className="flex-1"
                onClick={() => connect(integ.id)}
                disabled={connecting === integ.id}
              >
                {connecting === integ.id ? "Connecting…" : integ.connected ? "Disconnect" : "Connect"}
              </Button>
              <Button size="sm" variant="ghost" className="px-2">
                <ExternalLink className="h-3.5 w-3.5" />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Config dialog */}
      <Dialog open={configOpen} onOpenChange={setConfigOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selected && (
                <span
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-white"
                  style={{ backgroundColor: selected.color }}
                >
                  <selected.icon className="h-4 w-4" />
                </span>
              )}
              Connect to {selected?.name}
            </DialogTitle>
            <DialogDescription>
              Enter your {selected?.name} credentials to enable the integration.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label htmlFor="integ-key">API key / Token</Label>
              <Input id="integ-key" type="password" placeholder={`Paste your ${selected?.name} token`} className="mt-1.5" autoFocus />
            </div>
            <div>
              <Label htmlFor="integ-webhook">Webhook URL (optional)</Label>
              <Input id="integ-webhook" type="url" placeholder="https://..." className="mt-1.5" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfigOpen(false)}>Cancel</Button>
            <Button onClick={confirmConnect} disabled={connecting !== null}>
              {connecting !== null ? "Connecting…" : `Connect ${selected?.name}`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
