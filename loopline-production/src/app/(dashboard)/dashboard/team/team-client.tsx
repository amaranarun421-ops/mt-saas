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
import { Users, UserPlus, Crown, Shield, Mail, MoreHorizontal, Trash2, Copy } from "lucide-react";
import { toast } from "sonner";
import { cn, formatDate } from "@/lib/utils";

interface Member {
  id: string;
  name: string;
  email: string;
  role: "OWNER" | "ADMIN" | "MEMBER";
  avatarColor: string;
  joinedAt: string;
  lastActive: string;
  status: "active" | "invited";
}

const INITIAL: Member[] = [
  { id: "1", name: "Demo User", email: "demo@loopline.dev", role: "OWNER", avatarColor: "#1a56db", joinedAt: "2026-07-15", lastActive: "Just now", status: "active" },
  { id: "2", name: "Sarah Chen", email: "sarah@loopline.dev", role: "ADMIN", avatarColor: "#8b5cf6", joinedAt: "2026-07-20", lastActive: "2 hours ago", status: "active" },
  { id: "3", name: "Marcus Patel", email: "marcus@loopline.dev", role: "MEMBER", avatarColor: "#22c55e", joinedAt: "2026-07-25", lastActive: "1 day ago", status: "active" },
  { id: "4", name: "Elena Rossi", email: "elena@loopline.dev", role: "MEMBER", avatarColor: "#f59e0b", joinedAt: "2026-08-01", lastActive: "—", status: "invited" },
];

const ROLES = [
  { id: "MEMBER", label: "Member", desc: "Can view and reply to conversations", icon: Users },
  { id: "ADMIN", label: "Admin", desc: "Can manage bots, team, and billing", icon: Shield },
  { id: "OWNER", label: "Owner", desc: "Full access, including deletion", icon: Crown },
];

export function TeamClient({ currentUserEmail }: { currentUserEmail: string }) {
  const [members, setMembers] = useState<Member[]>(INITIAL);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<"MEMBER" | "ADMIN">("MEMBER");

  function sendInvite() {
    if (!inviteEmail.trim() || !inviteEmail.includes("@")) {
      toast.error("Enter a valid email address");
      return;
    }
    const colors = ["#1a56db", "#8b5cf6", "#22c55e", "#f59e0b", "#ec4899", "#14b8a6"];
    const newMember: Member = {
      id: String(Date.now()),
      name: inviteEmail.split("@")[0],
      email: inviteEmail,
      role: inviteRole,
      avatarColor: colors[members.length % colors.length],
      joinedAt: new Date().toISOString().slice(0, 10),
      lastActive: "—",
      status: "invited",
    };
    setMembers((prev) => [...prev, newMember]);
    toast.success(`Invitation sent to ${inviteEmail}`);
    setInviteEmail("");
    setInviteOpen(false);
  }

  function removeMember(id: string) {
    setMembers((prev) => prev.filter((m) => m.id !== id));
    toast.success("Member removed");
  }

  function copyInviteLink() {
    navigator.clipboard.writeText("https://loopline.dev/invite/ws_abc123");
    toast.success("Invite link copied");
  }

  return (
    <div className="space-y-6">
      {/* Members */}
      <Card className="p-0 overflow-hidden">
        <div className="flex items-center justify-between border-b border-border p-5">
          <div>
            <h2 className="font-display text-lg text-foreground">Workspace members</h2>
            <p className="text-xs text-muted-foreground">{members.length} member{members.length === 1 ? "" : "s"} · Pro plan allows up to 5</p>
          </div>
          <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="h-4 w-4" />
                Invite member
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Invite a team member</DialogTitle>
                <DialogDescription>They&apos;ll receive an email with a join link.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-2">
                <div>
                  <Label htmlFor="invite-email">Email address</Label>
                  <Input
                    id="invite-email"
                    type="email"
                    placeholder="teammate@company.com"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    className="mt-1.5"
                    autoFocus
                  />
                </div>
                <div>
                  <Label>Role</Label>
                  <div className="mt-2 space-y-2">
                    {ROLES.filter((r) => r.id !== "OWNER").map((r) => (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => setInviteRole(r.id as "MEMBER" | "ADMIN")}
                        className={cn(
                          "flex w-full items-start gap-3 rounded-xl border p-3 text-left transition",
                          inviteRole === r.id ? "border-brand-500 bg-brand-50/50 dark:bg-brand-500/10" : "border-border hover:bg-accent",
                        )}
                      >
                        <r.icon className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" />
                        <div>
                          <p className="text-sm font-medium text-foreground">{r.label}</p>
                          <p className="text-xs text-muted-foreground">{r.desc}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setInviteOpen(false)}>Cancel</Button>
                <Button onClick={sendInvite}>Send invite</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="divide-y divide-border">
          {members.map((m) => (
            <div key={m.id} className="flex items-center gap-4 p-4">
              <span
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white"
                style={{ backgroundColor: m.avatarColor }}
              >
                {m.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate text-sm font-medium text-foreground">{m.name}</p>
                  {m.role === "OWNER" && <Crown className="h-3.5 w-3.5 text-amber-500" />}
                  {m.status === "invited" && (
                    <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                      Invited
                    </span>
                  )}
                </div>
                <p className="truncate text-xs text-muted-foreground">{m.email}</p>
              </div>
              <div className="hidden text-right sm:block">
                <p className="text-xs text-muted-foreground">Joined</p>
                <p className="text-xs font-medium text-foreground">{formatDate(m.joinedAt)}</p>
              </div>
              <div className="hidden text-right md:block">
                <p className="text-xs text-muted-foreground">Last active</p>
                <p className="text-xs font-medium text-foreground">{m.lastActive}</p>
              </div>
              <span className="rounded-lg bg-muted px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                {m.role}
              </span>
              {m.email !== currentUserEmail && m.role !== "OWNER" && (
                <button
                  type="button"
                  onClick={() => removeMember(m.id)}
                  className="rounded-lg p-1.5 text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive"
                  aria-label="Remove member"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Roles explanation */}
      <div className="grid gap-4 md:grid-cols-3">
        {ROLES.map((r) => (
          <Card key={r.id} className="p-5">
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-300">
                <r.icon className="h-4 w-4" />
              </span>
              <h3 className="font-display text-base text-foreground">{r.label}</h3>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">{r.desc}</p>
          </Card>
        ))}
      </div>

      {/* Invite link */}
      <Card className="p-5">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-mint-500/15 text-mint-600">
            <Mail className="h-5 w-5" />
          </span>
          <div className="flex-1">
            <h3 className="font-display text-base text-foreground">Invite via link</h3>
            <p className="text-xs text-muted-foreground">Share this link to invite anyone to your workspace</p>
          </div>
          <Input
            readOnly
            value="https://loopline.dev/invite/ws_abc123"
            className="max-w-xs font-mono text-xs"
          />
          <Button variant="outline" size="sm" onClick={copyInviteLink}>
            <Copy className="h-3.5 w-3.5" />
            Copy
          </Button>
        </div>
      </Card>
    </div>
  );
}
