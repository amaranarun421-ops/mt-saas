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
import { Key, Plus, Copy, Eye, EyeOff, Trash2, Check, AlertTriangle, Code2 } from "lucide-react";
import { toast } from "sonner";
import { cn, formatDate } from "@/lib/utils";

interface ApiKey {
  id: string;
  name: string;
  prefix: string;
  created: string;
  lastUsed: string;
  revealed?: string;
}

const INITIAL: ApiKey[] = [
  { id: "1", name: "Production", prefix: "lk_live_a3f9", created: "2026-07-15", lastUsed: "2 minutes ago" },
  { id: "2", name: "Staging", prefix: "lk_test_8b2c", created: "2026-07-22", lastUsed: "1 hour ago" },
  { id: "3", name: "CI / CD", prefix: "lk_test_f1e7", created: "2026-07-28", lastUsed: "3 days ago" },
];

export function ApiKeysClient() {
  const [keys, setKeys] = useState<ApiKey[]>(INITIAL);
  const [createOpen, setCreateOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [revealed, setRevealed] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  function createKey() {
    if (!newName.trim()) {
      toast.error("Enter a key name");
      return;
    }
    const full = "lk_live_" + Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
    const newKey: ApiKey = {
      id: String(Date.now()),
      name: newName,
      prefix: full.slice(0, 12),
      created: new Date().toISOString().slice(0, 10),
      lastUsed: "Never",
      revealed: full,
    };
    setKeys((prev) => [newKey, ...prev]);
    setNewName("");
    setCreateOpen(false);
    toast.success("API key created — copy it now, you won't see it again");
  }

  function copyKey(id: string, value: string) {
    navigator.clipboard.writeText(value);
    setCopied(id);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(null), 2000);
  }

  function revoke(id: string) {
    if (!confirm("Revoke this API key? Any services using it will stop working immediately.")) return;
    setKeys((prev) => prev.filter((k) => k.id !== id));
    toast.success("API key revoked");
  }

  return (
    <div className="space-y-6">
      {/* Security warning */}
      <div className="rounded-2xl border border-amber-300 bg-amber-50 p-4 dark:border-amber-500/30 dark:bg-amber-500/10">
        <div className="flex items-start gap-3">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
          <div className="flex-1 text-sm">
            <p className="font-semibold text-amber-900 dark:text-amber-200">Keep your API keys secret</p>
            <p className="mt-0.5 text-amber-700 dark:text-amber-300">
              Treat keys like passwords. Never commit them to git or expose them in client-side code.
              Keys are shown in full only once at creation — store them securely.
            </p>
          </div>
        </div>
      </div>

      {/* Keys list */}
      <Card className="p-0 overflow-hidden">
        <div className="flex items-center justify-between border-b border-border p-5">
          <div>
            <h2 className="font-display text-lg text-foreground">API keys</h2>
            <p className="text-xs text-muted-foreground">{keys.length} active key{keys.length === 1 ? "" : "s"}</p>
          </div>
          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4" />
                Create key
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Create new API key</DialogTitle>
                <DialogDescription>Give it a name that describes where it will be used.</DialogDescription>
              </DialogHeader>
              <div className="py-2">
                <Label htmlFor="key-name">Key name</Label>
                <Input
                  id="key-name"
                  placeholder="e.g. Production server"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="mt-1.5"
                  autoFocus
                />
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
                <Button onClick={createKey}>Create key</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="divide-y divide-border">
          {keys.map((k) => (
            <div key={k.id} className="p-4">
              <div className="flex items-center gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-300">
                  <Key className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-foreground">{k.name}</p>
                    {k.revealed && (
                      <span className="rounded-full bg-mint-500/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-mint-600">
                        New
                      </span>
                    )}
                  </div>
                  <div className="mt-1 flex items-center gap-2">
                    <code className="rounded bg-muted px-2 py-0.5 font-mono text-xs text-foreground">
                      {revealed === k.id && k.revealed ? k.revealed : `${k.prefix}${"•".repeat(24)}`}
                    </code>
                    {k.revealed && (
                      <button
                        type="button"
                        onClick={() => setRevealed(revealed === k.id ? null : k.id)}
                        className="rounded p-1 text-muted-foreground hover:bg-accent hover:text-foreground"
                        aria-label={revealed === k.id ? "Hide key" : "Reveal key"}
                      >
                        {revealed === k.id ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                      </button>
                    )}
                    {k.revealed && (
                      <button
                        type="button"
                        onClick={() => copyKey(k.id, k.revealed!)}
                        className="rounded p-1 text-muted-foreground hover:bg-accent hover:text-foreground"
                        aria-label="Copy key"
                      >
                        {copied === k.id ? <Check className="h-3.5 w-3.5 text-mint-500" /> : <Copy className="h-3.5 w-3.5" />}
                      </button>
                    )}
                  </div>
                </div>
                <div className="hidden text-right sm:block">
                  <p className="text-xs text-muted-foreground">Created</p>
                  <p className="text-xs font-medium text-foreground">{formatDate(k.created)}</p>
                </div>
                <div className="hidden text-right md:block">
                  <p className="text-xs text-muted-foreground">Last used</p>
                  <p className="text-xs font-medium text-foreground">{k.lastUsed}</p>
                </div>
                <button
                  type="button"
                  onClick={() => revoke(k.id)}
                  className="rounded-lg p-2 text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive"
                  aria-label="Revoke key"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Usage example */}
      <Card className="p-0 overflow-hidden">
        <div className="border-b border-border bg-muted/30 p-4">
          <div className="flex items-center gap-2">
            <Code2 className="h-4 w-4 text-brand-500" />
            <h3 className="font-display text-base text-foreground">Quick start</h3>
          </div>
        </div>
        <pre className="overflow-x-auto bg-navy-900 p-5 text-sm scrollbar-loopline">
          <code className="font-mono text-slate-200">{`# List all bots
curl https://your-loopline-deployment.app/api/bots \\
  -H "Authorization: Bearer lk_live_..."

# Send a chat message
curl -X POST https://your-loopline-deployment.app/api/widget/bot_abc/chat \\
  -H "Content-Type: application/json" \\
  -d '{"messages":[{"role":"user","content":"Hi"}]}'`}</code>
        </pre>
      </Card>
    </div>
  );
}
