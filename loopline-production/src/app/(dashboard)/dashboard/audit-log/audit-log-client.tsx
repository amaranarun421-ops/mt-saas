"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download, Search, Shield, Lock, FileDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface LogEntry {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  resource: string;
  ip: string;
  result: "success" | "denied";
}

const ENTRIES: LogEntry[] = [
  { id: "1", timestamp: "2026-08-02 11:06:23", actor: "demo@loopline.dev", action: "user.login", resource: "auth.session", ip: "203.0.113.42", result: "success" },
  { id: "2", timestamp: "2026-08-02 10:42:11", actor: "sarah@loopline.dev", action: "bot.update", resource: "bot:cmsbnlooy", ip: "203.0.113.42", result: "success" },
  { id: "3", timestamp: "2026-08-02 10:38:55", actor: "demo@loopline.dev", action: "apikey.create", resource: "key:lk_live_a3f9", ip: "203.0.113.42", result: "success" },
  { id: "4", timestamp: "2026-08-02 10:15:02", actor: "unknown", action: "user.login", resource: "auth.session", ip: "198.51.100.7", result: "denied" },
  { id: "5", timestamp: "2026-08-02 09:58:33", actor: "marcus@loopline.dev", action: "conversation.reply", resource: "conv:cmsbnyfhw", ip: "203.0.113.42", result: "success" },
  { id: "6", timestamp: "2026-08-02 09:30:18", actor: "demo@loopline.dev", action: "workspace.update", resource: "ws:acme-support", ip: "203.0.113.42", result: "success" },
  { id: "7", timestamp: "2026-08-02 09:12:44", actor: "system", action: "subscription.renewed", resource: "sub:pro_monthly", ip: "—", result: "success" },
  { id: "8", timestamp: "2026-08-02 08:45:09", actor: "demo@loopline.dev", action: "webhook.create", resource: "wh:endpoint_1", ip: "203.0.113.42", result: "success" },
  { id: "9", timestamp: "2026-08-02 08:22:31", actor: "elena@loopline.dev", action: "team.invite", resource: "invite:elena@...", ip: "203.0.113.42", result: "success" },
  { id: "10", timestamp: "2026-08-02 07:58:02", actor: "unknown", action: "apikey.use", resource: "key:lk_live_a3f9", ip: "198.51.100.7", result: "denied" },
];

export function AuditLogClient() {
  return (
    <div className="space-y-6">
      {/* Info banner */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="p-5">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-300">
              <Shield className="h-5 w-5" />
            </span>
            <div>
              <p className="font-display text-base text-foreground">Immutable</p>
              <p className="text-xs text-muted-foreground">Append-only, tamper-evident</p>
            </div>
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-mint-500/15 text-mint-600">
              <Lock className="h-5 w-5" />
            </span>
            <div>
              <p className="font-display text-base text-foreground">90-day retention</p>
              <p className="text-xs text-muted-foreground">Export to extend</p>
            </div>
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/15 text-amber-700 dark:text-amber-400">
              <FileDown className="h-5 w-5" />
            </span>
            <div>
              <p className="font-display text-base text-foreground">CSV / JSON export</p>
              <p className="text-xs text-muted-foreground">For compliance reviews</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Log table */}
      <Card className="p-0 overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-lg text-foreground">Event log</h2>
            <p className="text-xs text-muted-foreground">{ENTRIES.length} events · last 24 hours</p>
          </div>
          <div className="flex gap-2">
            <div className="relative flex-1 sm:flex-initial">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Filter…" className="pl-9 sm:w-48" />
            </div>
            <Button variant="outline" size="sm">
              <Download className="h-3.5 w-3.5" />
              Export
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto scrollbar-loopline">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30 text-left">
                <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Timestamp</th>
                <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Actor</th>
                <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Action</th>
                <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Resource</th>
                <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">IP</th>
                <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Result</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {ENTRIES.map((e) => (
                <tr key={e.id} className="transition hover:bg-accent/50">
                  <td className="whitespace-nowrap px-4 py-2.5 font-mono text-xs text-muted-foreground">{e.timestamp}</td>
                  <td className="whitespace-nowrap px-4 py-2.5 text-foreground">{e.actor}</td>
                  <td className="whitespace-nowrap px-4 py-2.5">
                    <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">{e.action}</code>
                  </td>
                  <td className="whitespace-nowrap px-4 py-2.5 font-mono text-xs text-muted-foreground">{e.resource}</td>
                  <td className="whitespace-nowrap px-4 py-2.5 font-mono text-xs text-muted-foreground">{e.ip}</td>
                  <td className="px-4 py-2.5">
                    <span className={cn(
                      "inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
                      e.result === "success" ? "bg-mint-500/15 text-mint-600" : "bg-destructive/10 text-destructive",
                    )}>
                      {e.result}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
