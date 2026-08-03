"use client";

import * as React from "react";
import { toast } from "sonner";
import {
  KeyRound,
  Copy,
  RefreshCw,
  Trash2,
  Plus,
  Eye,
  EyeOff,
  Check,
  Activity,
} from "lucide-react";
import { GlassPanel } from "@/components/driftframe/glass-panel";
import { GradientButton } from "@/components/driftframe/gradient-button";
import { cn } from "@/lib/utils";
import { formatDate, formatNumber } from "@/lib/format";

interface ApiKey {
  id: string;
  name: string;
  prefix: string;
  createdAt: string;
  lastUsedAt: string | null;
  requests: number;
  revoked: boolean;
}

/**
 * Mock API key manager — generate, copy, revoke, view usage stats.
 *
 * In production this would POST to /api/api-keys to mint a real key stored
 * hashed in the database. For the demo, keys are minted client-side and
 * never leave the browser session.
 */
export function ApiKeysDashboard() {
  // Initial state is computed inside the `useState` initializer so it runs
  // once per mount. The `createdAt`/`lastUsedAt` ISO strings still differ
  // between server and client, but only the FORMATTED dates are rendered
  // (via the stable `formatDate` helper) and those are gated behind
  // `mounted` below — so the server render and first client render both
  // produce the same stable placeholder (no hydration mismatch).
  const [keys, setKeys] = React.useState<ApiKey[]>(() => [
    {
      id: "key_demo_1",
      name: "Production",
      prefix: "df_live_8f2a",
      createdAt: new Date(Date.now() - 86400000 * 14).toISOString(),
      lastUsedAt: new Date(Date.now() - 3600000).toISOString(),
      requests: 1284,
      revoked: false,
    },
    {
      id: "key_demo_2",
      name: "Staging",
      prefix: "df_test_3b91",
      createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
      lastUsedAt: new Date(Date.now() - 86400000).toISOString(),
      requests: 47,
      revoked: false,
    },
  ]);
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  const [revealed, setRevealed] = React.useState<Set<string>>(new Set());
  const [copied, setCopied] = React.useState<string | null>(null);
  const [generating, setGenerating] = React.useState(false);
  const [newName, setNewName] = React.useState("");

  function generateKey() {
    setGenerating(true);
    setTimeout(() => {
      const id = `key_${Math.random().toString(36).slice(2, 10)}`;
      const prefix = `df_live_${Math.random().toString(36).slice(2, 6)}`;
      const newKey: ApiKey = {
        id,
        name: newName.trim() || "Untitled key",
        prefix,
        createdAt: new Date().toISOString(),
        lastUsedAt: null,
        requests: 0,
        revoked: false,
      };
      setKeys((prev) => [newKey, ...prev]);
      setRevealed((prev) => new Set(prev).add(id));
      setNewName("");
      setGenerating(false);
      toast.success("API key generated. Copy it now — you won't see it again.");
    }, 700);
  }

  function copyKey(key: ApiKey) {
    // Demo: copy the prefix (in production the full secret is shown once).
    navigator.clipboard.writeText(`${key.prefix}****************************`)
      .then(() => {
        setCopied(key.id);
        setTimeout(() => setCopied(null), 2000);
        toast.success("Key copied to clipboard.");
      })
      .catch(() => toast.error("Could not copy."));
  }

  function revokeKey(key: ApiKey) {
    setKeys((prev) =>
      prev.map((k) => (k.id === key.id ? { ...k, revoked: true } : k)),
    );
    toast.success(`Key "${key.name}" revoked.`);
  }

  return (
    <div className="driftframe-container-wide py-6 space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <KeyRound className="h-5 w-5 text-[#7c3aed]" />
          <h1 className="font-display text-2xl font-semibold tracking-tight">
            API Keys
          </h1>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          Generate keys to access the Driftframe API programmatically. Treat
          them like passwords — anyone with the key can spend your credits.
        </p>
      </div>

      {/* Generate new key */}
      <GlassPanel>
        <h2 className="font-display text-base font-medium">Generate a new key</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Give your key a name so you remember where it&apos;s used.
        </p>
        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="e.g. Production server"
            className="flex-1 rounded-xl border border-border bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring h-11"
          />
          <GradientButton
            onClick={generateKey}
            loading={generating}
            leftIcon={!generating ? <Plus className="h-4 w-4" /> : undefined}
          >
            Generate key
          </GradientButton>
        </div>
      </GlassPanel>

      {/* Key list */}
      <div className="space-y-3">
        <h2 className="font-display text-base font-medium">Your keys</h2>
        {keys.length === 0 ? (
          <GlassPanel className="text-center text-sm text-muted-foreground">
            No API keys yet. Generate one above to get started.
          </GlassPanel>
        ) : (
          keys.map((key) => (
            <GlassPanel key={key.id} className={cn(key.revoked && "opacity-60")}>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-foreground">{key.name}</p>
                    {key.revoked && (
                      <span className="rounded-full bg-destructive/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-destructive">
                        Revoked
                      </span>
                    )}
                  </div>
                  <div className="mt-1 flex items-center gap-2">
                    <code className="rounded-md bg-muted px-2 py-1 font-mono text-xs text-foreground">
                      {revealed.has(key.id)
                        ? `${key.prefix}****************************`
                        : `${key.prefix}••••••••••••••••••••••`}
                    </code>
                    <button
                      type="button"
                      onClick={() =>
                        setRevealed((prev) => {
                          const next = new Set(prev);
                          if (next.has(key.id)) next.delete(key.id);
                          else next.add(key.id);
                          return next;
                        })
                      }
                      aria-label={revealed.has(key.id) ? "Hide key" : "Reveal key"}
                      title={revealed.has(key.id) ? "Hide" : "Reveal"}
                      className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-foreground/5 transition-colors"
                    >
                      {revealed.has(key.id) ? (
                        <EyeOff className="h-3.5 w-3.5" />
                      ) : (
                        <Eye className="h-3.5 w-3.5" />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => copyKey(key)}
                      aria-label="Copy key"
                      title="Copy"
                      className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-foreground/5 transition-colors"
                    >
                      {copied === key.id ? (
                        <Check className="h-3.5 w-3.5 text-emerald-500" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    <span>Created {mounted ? formatDate(key.createdAt) : "—"}</span>
                    <span>·</span>
                    <span>
                      {key.lastUsedAt
                        ? `Last used ${mounted ? formatDate(key.lastUsedAt) : "—"}`
                        : "Never used"}
                    </span>
                    <span>·</span>
                    <span className="inline-flex items-center gap-1">
                      <Activity className="h-3 w-3" />
                      {formatNumber(key.requests)} requests
                    </span>
                  </div>
                </div>
                <div className="flex flex-shrink-0 items-center gap-2">
                  {!key.revoked && (
                    <button
                      type="button"
                      onClick={() => revokeKey(key)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-medium text-destructive hover:bg-destructive/5 transition-colors min-h-[36px]"
                    >
                      <Trash2 className="h-3.5 w-3.5" /> Revoke
                    </button>
                  )}
                </div>
              </div>
            </GlassPanel>
          ))
        )}
      </div>

      {/* Usage stats */}
      <GlassPanel>
        <h2 className="font-display text-base font-medium">Usage this month</h2>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <UsageStat label="Total requests" value={formatNumber(keys.reduce((s, k) => s + k.requests, 0))} />
          <UsageStat label="Active keys" value={keys.filter((k) => !k.revoked).length.toString()} />
          <UsageStat label="Credits used" value={formatNumber(keys.reduce((s, k) => s + k.requests, 0) * 4)} />
          <UsageStat label="Avg. latency" value="1.4s" />
        </div>
        <p className="mt-4 text-xs text-muted-foreground">
          Demo mode — usage stats are illustrative. In production these come
          from your API gateway logs.
        </p>
      </GlassPanel>
    </div>
  );
}

function UsageStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-muted/30 p-3">
      <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</p>
      <p className="mt-1 font-display text-xl font-semibold tabular-nums">{value}</p>
    </div>
  );
}
