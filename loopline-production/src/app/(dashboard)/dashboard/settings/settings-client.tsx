"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Loader2, Save, Building2, User as UserIcon, Calendar, Hash } from "lucide-react";
import { toast } from "sonner";
import { formatDate } from "@/lib/utils";

interface Props {
  workspace: { id: string; name: string; createdAt: string };
  user: { id: string; name: string; email: string; image: string | null };
}

export function SettingsClient({ workspace, user }: Props) {
  const [wsName, setWsName] = useState(workspace.name);
  const [userName, setUserName] = useState(user.name);
  const [savingWs, setSavingWs] = useState(false);
  const [savingUser, setSavingUser] = useState(false);

  async function saveWorkspace() {
    if (!wsName.trim()) {
      toast.error("Workspace name is required");
      return;
    }
    setSavingWs(true);
    try {
      const res = await fetch("/api/workspace", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: wsName.trim() }),
      });
      if (!res.ok) {
        toast.error("Save failed");
        setSavingWs(false);
        return;
      }
      toast.success("Workspace updated");
    } catch (e) {
      toast.error("Save failed");
    } finally {
      setSavingWs(false);
    }
  }

  async function saveUser() {
    if (!userName.trim()) {
      toast.error("Name is required");
      return;
    }
    setSavingUser(true);
    try {
      const res = await fetch("/api/user", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: userName.trim() }),
      });
      if (!res.ok) {
        toast.error("Save failed");
        setSavingUser(false);
        return;
      }
      toast.success("Profile updated");
    } catch (e) {
      toast.error("Save failed");
    } finally {
      setSavingUser(false);
    }
  }

  return (
    <div className="max-w-2xl space-y-6">
      {/* Workspace */}
      <Card className="p-6">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-300">
            <Building2 className="h-5 w-5" />
          </span>
          <div>
            <h2 className="font-display text-lg text-foreground">Workspace</h2>
            <p className="text-xs text-muted-foreground">The container for all your bots and billing.</p>
          </div>
        </div>

        <div className="mt-5 space-y-4">
          <div>
            <Label htmlFor="ws-name">Workspace name</Label>
            <Input
              id="ws-name"
              value={wsName}
              onChange={(e) => setWsName(e.target.value)}
              className="mt-1.5"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-3.5 w-3.5" />
              Created {formatDate(workspace.createdAt)}
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Hash className="h-3.5 w-3.5" />
              <code className="font-mono text-xs">{workspace.id.slice(-8)}</code>
            </div>
          </div>

          <Button onClick={saveWorkspace} disabled={savingWs || wsName === workspace.name}>
            {savingWs ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving…
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save workspace
              </>
            )}
          </Button>
        </div>
      </Card>

      {/* Profile */}
      <Card className="p-6">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-mint-500/15 text-mint-600">
            <UserIcon className="h-5 w-5" />
          </span>
          <div>
            <h2 className="font-display text-lg text-foreground">Profile</h2>
            <p className="text-xs text-muted-foreground">Your personal account information.</p>
          </div>
        </div>

        <div className="mt-5 space-y-4">
          <div>
            <Label htmlFor="user-name">Display name</Label>
            <Input
              id="user-name"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="mt-1.5"
            />
          </div>
          <div>
            <Label htmlFor="user-email">Email</Label>
            <Input
              id="user-email"
              value={user.email}
              disabled
              className="mt-1.5 opacity-70"
            />
            <p className="mt-1 text-xs text-muted-foreground">
              Email changes require support — contact hello@loopline.dev.
            </p>
          </div>

          <Button onClick={saveUser} disabled={savingUser || userName === user.name}>
            {savingUser ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving…
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save profile
              </>
            )}
          </Button>
        </div>
      </Card>
    </div>
  );
}
