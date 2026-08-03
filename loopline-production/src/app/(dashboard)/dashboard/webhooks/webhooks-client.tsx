"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Webhook, Plus, Copy, Check, Trash2, Activity, CheckCircle2, XCircle, Clock } from "lucide-react";
import { toast } from "sonner";
import { cn, formatDateTime, truncate } from "@/lib/utils";

interface WebhookEndpoint {
  id: string;
  url: string;
  events: string[];
  active: boolean;
  created: string;
}

const EVENTS = [
  { id: "conversation.created", desc: "A new conversation was started" },
  { id: "conversation.needs_human", desc: "A visitor requested human handoff" },
  { id: "conversation.resolved", desc: "A conversation was marked resolved" },
  { id: "message.created", desc: "Any new message (user or assistant)" },
  { id: "bot.created", desc: "A new bot was created" },
  { id: "bot.updated", desc: "Bot config was updated" },
  { id: "subscription.updated", desc: "Stripe subscription changed" },
];

const INITIAL: WebhookEndpoint[] = [
  { id: "1", url: "https://api.acme.dev/webhooks/loopline", events: ["conversation.created", "conversation.needs_human"], active: true, created: "2026-07-20T10:00:00Z" },
  { id: "2", url: "https://staging.acme.dev/hooks/ll", events: ["conversation.created"], active: false, created: "2026-07-28T14:30:00Z" },
];

const DELIVERIES = [
  { id: "evt_1", event: "conversation.created", url: "https://api.acme.dev/webhooks/loopline", status: "success", code: 200, time: "2 minutes ago", attempts: 1 },
  { id: "evt_2", event: "conversation.needs_human", url: "https://api.acme.dev/webhooks/loopline", status: "success", code: 200, time: "8 minutes ago", attempts: 1 },
  { id: "evt_3", event: "conversation.created", url: "https://api.acme.dev/webhooks/loopline", status: "success", code: 200, time: "23 minutes ago", attempts: 1 },
  { id: "evt_4", event: "message.created", url: "https://api.acme.dev/webhooks/loopline", status: "failed", code: 500, time: "1 hour ago", attempts: 3 },
  { id: "evt_5", event: "conversation.resolved", url: "https://api.acme.dev/webhooks/loopline", status: "success", code: 200, time: "2 hours ago", attempts: 1 },
  { id: "evt_6", event: "bot.updated", url: "https://api.acme.dev/webhooks/loopline", status: "pending", code: 0, time: "3 hours ago", attempts: 0 },
];

export function WebhooksClient() {
  const [endpoints, setEndpoints] = useState<WebhookEndpoint[]>(INITIAL);
  const [createOpen, setCreateOpen] = useState(false);
  const [newUrl, setNewUrl] = useState("");
  const [newEvents, setNewEvents] = useState<string[]>(["conversation.created"]);
  const [copied, setCopied] = useState<string | null>(null);

  function createEndpoint() {
    if (!newUrl.trim() || !newUrl.startsWith("http")) {
      toast.error("Enter a valid HTTPS URL");
      return;
    }
    const ep: WebhookEndpoint = {
      id: String(Date.now()),
      url: newUrl,
      events: newEvents,
      active: true,
      created: new Date().toISOString(),
    };
    setEndpoints((prev) => [...prev, ep]);
    toast.success("Webhook endpoint created");
    setNewUrl("");
    setNewEvents(["conversation.created"]);
    setCreateOpen(false);
  }

  function toggleEndpoint(id: string, active: boolean) {
    setEndpoints((prev) => prev.map((e) => (e.id === id ? { ...e, active } : e)));
    toast.success(active ? "Webhook enabled" : "Webhook disabled");
  }

  function removeEndpoint(id: string) {
    if (!confirm("Remove this webhook endpoint?")) return;
    setEndpoints((prev) => prev.filter((e) => e.id !== id));
    toast.success("Endpoint removed");
  }

  function copySigningSecret() {
    navigator.clipboard.writeText("whsec_" + Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2));
    setCopied("secret");
    toast.success("Signing secret copied");
    setTimeout(() => setCopied(null), 2000);
  }

  function toggleEvent(eventId: string) {
    setNewEvents((prev) => prev.includes(eventId) ? prev.filter((e) => e !== eventId) : [...prev, eventId]);
  }

  const statusIcons: Record<string, React.ReactNode> = {
    success: <CheckCircle2 className="h-3.5 w-3.5 text-mint-500" />,
    failed: <XCircle className="h-3.5 w-3.5 text-destructive" />,
    pending: <Clock className="h-3.5 w-3.5 text-amber-500" />,
  };

  return (
    <div className="space-y-6">
      {/* Signing secret */}
      <Card className="p-5">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-300">
            <Webhook className="h-5 w-5" />
          </span>
          <div className="flex-1">
            <h3 className="font-display text-base text-foreground">Signing secret</h3>
            <p className="text-xs text-muted-foreground">Verify webhook payloads are from Loopline</p>
          </div>
          <Input
            readOnly
            type="password"
            value="whsec_••••••••••••••••••••••••"
            className="max-w-xs font-mono text-xs"
          />
          <Button variant="outline" size="sm" onClick={copySigningSecret}>
            {copied === "secret" ? <Check className="h-3.5 w-3.5 text-mint-500" /> : <Copy className="h-3.5 w-3.5" />}
            Copy
          </Button>
        </div>
      </Card>

      {/* Endpoints */}
      <Card className="p-0 overflow-hidden">
        <div className="flex items-center justify-between border-b border-border p-5">
          <div>
            <h2 className="font-display text-lg text-foreground">Endpoints</h2>
            <p className="text-xs text-muted-foreground">{endpoints.length} endpoint{endpoints.length === 1 ? "" : "s"} configured</p>
          </div>
          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4" />
                Add endpoint
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Add webhook endpoint</DialogTitle>
                <DialogDescription>We&apos;ll POST event payloads to this URL.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-2">
                <div>
                  <Label htmlFor="wh-url">Endpoint URL</Label>
                  <Input
                    id="wh-url"
                    type="url"
                    placeholder="https://api.yourapp.com/webhooks/loopline"
                    value={newUrl}
                    onChange={(e) => setNewUrl(e.target.value)}
                    className="mt-1.5"
                    autoFocus
                  />
                </div>
                <div>
                  <Label>Events to subscribe</Label>
                  <div className="mt-2 max-h-48 space-y-1 overflow-y-auto scrollbar-loopline">
                    {EVENTS.map((ev) => (
                      <label
                        key={ev.id}
                        className={cn(
                          "flex cursor-pointer items-start gap-2 rounded-lg border p-2.5 transition",
                          newEvents.includes(ev.id) ? "border-brand-500 bg-brand-50/50 dark:bg-brand-500/10" : "border-border hover:bg-accent",
                        )}
                      >
                        <Switch
                          checked={newEvents.includes(ev.id)}
                          onCheckedChange={() => toggleEvent(ev.id)}
                        />
                        <div className="flex-1">
                          <p className="font-mono text-xs text-foreground">{ev.id}</p>
                          <p className="text-[11px] text-muted-foreground">{ev.desc}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
                <Button onClick={createEndpoint}>Add endpoint</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="divide-y divide-border">
          {endpoints.map((ep) => (
            <div key={ep.id} className="p-4">
              <div className="flex items-center gap-3">
                <span className={cn("h-2 w-2 shrink-0 rounded-full", ep.active ? "bg-mint-500" : "bg-muted-foreground")} />
                <code className="flex-1 truncate font-mono text-sm text-foreground">{ep.url}</code>
                <div className="flex gap-1">
                  {ep.events.slice(0, 2).map((e) => (
                    <span key={e} className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                      {truncate(e, 24)}
                    </span>
                  ))}
                  {ep.events.length > 2 && (
                    <span className="rounded-md bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
                      +{ep.events.length - 2}
                    </span>
                  )}
                </div>
                <Switch
                  checked={ep.active}
                  onCheckedChange={(v) => toggleEndpoint(ep.id, v)}
                  aria-label="Toggle endpoint"
                />
                <button
                  type="button"
                  onClick={() => removeEndpoint(ep.id)}
                  className="rounded-lg p-1.5 text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive"
                  aria-label="Remove endpoint"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Recent deliveries */}
      <Card className="p-0 overflow-hidden">
        <div className="flex items-center justify-between border-b border-border p-5">
          <div>
            <h2 className="font-display text-lg text-foreground">Recent deliveries</h2>
            <p className="text-xs text-muted-foreground">Last 24 hours · auto-retry on failure (3 attempts)</p>
          </div>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="divide-y divide-border">
          {DELIVERIES.map((d) => (
            <div key={d.id} className="flex items-center gap-3 p-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-muted">
                {statusIcons[d.status]}
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-mono text-xs text-foreground">{d.event}</p>
                <p className="truncate text-[11px] text-muted-foreground">{d.url}</p>
              </div>
              <span className={cn(
                "rounded-md px-2 py-0.5 font-mono text-[10px] font-semibold",
                d.status === "success" && "bg-mint-500/15 text-mint-600",
                d.status === "failed" && "bg-destructive/10 text-destructive",
                d.status === "pending" && "bg-amber-500/15 text-amber-700 dark:text-amber-400",
              )}>
                {d.code || "..."}
              </span>
              <span className="hidden text-[10px] text-muted-foreground sm:block">{d.attempts} attempt{d.attempts === 1 ? "" : "s"}</span>
              <span className="text-[10px] text-muted-foreground">{d.time}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
