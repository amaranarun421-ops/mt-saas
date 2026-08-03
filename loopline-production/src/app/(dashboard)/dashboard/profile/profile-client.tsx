"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  User,
  Mail,
  Calendar,
  Camera,
  Save,
  Loader2,
  Key,
  Trash2,
  AlertTriangle,
  Github,
} from "lucide-react";
import { toast } from "sonner";
import { cn, formatDate, initials } from "@/lib/utils";

interface Props {
  user: {
    id: string;
    name: string;
    email: string;
    image: string | null;
    createdAt: string;
  };
}

export function ProfileClient({ user }: Props) {
  const [name, setName] = useState(user.name);
  const [saving, setSaving] = useState(false);
  const [avatarColor] = useState("#1a56db");

  async function onSave() {
    if (!name.trim()) {
      toast.error("Name is required");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/user", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim() }),
      });
      if (!res.ok) throw new Error();
      toast.success("Profile updated");
    } catch (e) {
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-2xl space-y-6">
      {/* Avatar + identity */}
      <Card className="p-6">
        <div className="flex items-center gap-5">
          <div className="relative">
            <Avatar className="h-20 w-20 border-4 border-card shadow-[var(--shadow-soft)]">
              <AvatarFallback
                className="text-xl font-semibold text-white"
                style={{ backgroundColor: avatarColor }}
              >
                {initials(name || user.email)}
              </AvatarFallback>
            </Avatar>
            <button
              type="button"
              className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full border-2 border-card bg-brand-500 text-white transition hover:bg-brand-600"
              aria-label="Change avatar"
              onClick={() => toast.info("Avatar upload coming soon — use Gravatar for now")}
            >
              <Camera className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="font-display text-xl text-foreground">{name || "Unnamed"}</h2>
            <p className="truncate text-sm text-muted-foreground">{user.email}</p>
            <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                Joined {formatDate(user.createdAt)}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-mint-500/15 px-2 py-0.5 text-mint-600">
                <span className="h-1.5 w-1.5 rounded-full bg-mint-500" />
                Active
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Personal info */}
      <Card className="p-6">
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-brand-500" />
          <h3 className="font-display text-base text-foreground">Personal information</h3>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="profile-name">Display name</Label>
            <Input
              id="profile-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1.5"
              placeholder="Your name"
            />
          </div>
          <div>
            <Label htmlFor="profile-email">Email</Label>
            <Input
              id="profile-email"
              value={user.email}
              disabled
              className="mt-1.5 opacity-70"
            />
            <p className="mt-1 text-xs text-muted-foreground">Email changes require support</p>
          </div>
        </div>
        <Button onClick={onSave} disabled={saving || name === user.name} className="mt-4">
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving…
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Save changes
            </>
          )}
        </Button>
      </Card>

      {/* Connected accounts */}
      <Card className="p-6">
        <div className="flex items-center gap-2">
          <Github className="h-4 w-4 text-brand-500" />
          <h3 className="font-display text-base text-foreground">Connected accounts</h3>
        </div>
        <div className="mt-4 space-y-2">
          {[
            { provider: "Google", connected: false, icon: "G", color: "#4285F4" },
            { provider: "GitHub", connected: false, icon: "GH", color: "#181717" },
          ].map((acc) => (
            <div key={acc.provider} className="flex items-center gap-3 rounded-xl border border-border p-3">
              <span
                className="flex h-9 w-9 items-center justify-center rounded-lg text-xs font-bold text-white"
                style={{ backgroundColor: acc.color }}
              >
                {acc.icon}
              </span>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{acc.provider}</p>
                <p className="text-xs text-muted-foreground">
                  {acc.connected ? "Connected" : "Not connected"}
                </p>
              </div>
              <Button variant="outline" size="sm">
                {acc.connected ? "Disconnect" : "Connect"}
              </Button>
            </div>
          ))}
        </div>
      </Card>

      {/* Security */}
      <Card className="p-6">
        <div className="flex items-center gap-2">
          <Key className="h-4 w-4 text-brand-500" />
          <h3 className="font-display text-base text-foreground">Security</h3>
        </div>
        <div className="mt-4 space-y-2">
          <div className="flex items-center gap-3 rounded-xl border border-border p-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted text-muted-foreground">
              <Key className="h-4 w-4" />
            </span>
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">Password</p>
              <p className="text-xs text-muted-foreground">Last changed 2 weeks ago</p>
            </div>
            <Button variant="outline" size="sm" asChild>
              <a href="/reset-password">Change</a>
            </Button>
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-border p-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted text-muted-foreground">
              <Mail className="h-4 w-4" />
            </span>
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">Two-factor authentication</p>
              <p className="text-xs text-muted-foreground">Add an extra layer of security</p>
            </div>
            <Button variant="outline" size="sm">
              Enable
            </Button>
          </div>
        </div>
      </Card>

      {/* Danger zone */}
      <Card className="border-destructive/30 p-6">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-destructive" />
          <h3 className="font-display text-base text-foreground">Danger zone</h3>
        </div>
        <div className="mt-4 flex items-center gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
            <Trash2 className="h-4 w-4" />
          </span>
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground">Delete account</p>
            <p className="text-xs text-muted-foreground">Permanently delete your account, workspace, and all data</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="text-destructive hover:text-destructive"
            onClick={() => toast.info("Contact hello@loopline.dev to delete your account")}
          >
            Delete
          </Button>
        </div>
      </Card>
    </div>
  );
}
