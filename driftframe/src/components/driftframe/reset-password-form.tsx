"use client";

import * as React from "react";
import { toast } from "sonner";
import { Mail } from "lucide-react";
import { GradientButton } from "@/components/driftframe/gradient-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ResetPasswordForm() {
  const [email, setEmail] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [done, setDone] = React.useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "reset_failed");
      setDone(true);
      toast.success("Reset link sent (demo: no email actually sent).");
    } catch {
      toast.error("Could not request reset. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className="rounded-xl border border-border bg-muted/40 p-5 text-sm text-muted-foreground">
        If an account exists for <span className="text-foreground">{email}</span>,
        a reset link is on its way. In this demo no email is actually sent —
        sign in with your existing password instead.
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <div className="relative">
          <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="pl-9 min-h-[44px]"
            placeholder="you@example.com"
          />
        </div>
      </div>
      <GradientButton type="submit" className="w-full" loading={loading}>
        Send reset link
      </GradientButton>
    </form>
  );
}
