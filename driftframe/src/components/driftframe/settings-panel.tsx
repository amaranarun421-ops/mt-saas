"use client";

import * as React from "react";
import { useSession, signOut } from "next-auth/react";
import { toast } from "sonner";
import {
  Sun,
  Moon,
  LogOut,
  User as UserIcon,
  Lock,
  Bell,
  Trash2,
  ShieldAlert,
} from "lucide-react";
import { GlassPanel } from "@/components/driftframe/glass-panel";
import { GradientButton } from "@/components/driftframe/gradient-button";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "next-themes";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface SettingsPanelProps {
  initialName: string | null;
  email: string;
}

export function SettingsPanel({ initialName, email }: SettingsPanelProps) {
  const { update } = useSession();
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  const [name, setName] = React.useState(initialName ?? "");
  const [saving, setSaving] = React.useState(false);

  // Password change state (demo — no backend wired)
  const [currentPassword, setCurrentPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [savingPwd, setSavingPwd] = React.useState(false);

  // Notification prefs (demo — local state only)
  const [prefs, setPrefs] = React.useState({
    creditsLow: true,
    generationComplete: false,
    productUpdates: true,
    weeklyDigest: false,
  });

  const isDark = mounted && resolvedTheme === "dark";
  const initials = (name || email || "U")
    .split(/[\s@.]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase())
    .join("");

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      if (!res.ok) throw new Error("update_failed");
      await update();
      toast.success("Profile updated.");
    } catch {
      toast.error("Could not update profile.");
    } finally {
      setSaving(false);
    }
  }

  async function savePassword(e: React.FormEvent) {
    e.preventDefault();
    if (newPassword.length < 8) {
      toast.error("New password must be at least 8 characters.");
      return;
    }
    setSavingPwd(true);
    // Demo: simulate success.
    await new Promise((r) => setTimeout(r, 600));
    setSavingPwd(false);
    setCurrentPassword("");
    setNewPassword("");
    toast.success("Password updated. (Demo — no actual change.)");
  }

  function prefChange(key: keyof typeof prefs, value: boolean) {
    setPrefs((prev) => ({ ...prev, [key]: value }));
    toast.success("Preference saved.");
  }

  return (
    <div className="driftframe-container-wide py-6 space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <UserIcon className="h-5 w-5 text-[#7c3aed]" />
          <h1 className="font-display text-2xl font-semibold tracking-tight">
            Settings
          </h1>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your profile, password, notifications, and account.
        </p>
      </div>

      {/* Profile */}
      <GlassPanel>
        <form onSubmit={saveProfile} className="space-y-4">
          <div className="flex items-center gap-2">
            <UserIcon className="h-4 w-4 text-muted-foreground" />
            <h2 className="font-display text-base font-medium">Profile</h2>
          </div>
          <div className="flex items-center gap-4">
            <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#7c3aed] text-lg font-semibold text-white">
              {initials || "U"}
            </span>
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">
                Avatar uses your initials. In production, upload a custom
                image (wired to S3/Cloudinary).
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Display name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-11"
                placeholder="Your name"
                maxLength={80}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={email}
                readOnly
                disabled
                className="h-11 opacity-70"
              />
              <p className="text-xs text-muted-foreground">
                Email changes are not supported in the demo.
              </p>
            </div>
          </div>
          <div className="flex justify-end">
            <GradientButton type="submit" loading={saving}>
              Save changes
            </GradientButton>
          </div>
        </form>
      </GlassPanel>

      {/* Password */}
      <GlassPanel>
        <form onSubmit={savePassword} className="space-y-4">
          <div className="flex items-center gap-2">
            <Lock className="h-4 w-4 text-muted-foreground" />
            <h2 className="font-display text-base font-medium">Password</h2>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="current-password">Current password</Label>
              <Input
                id="current-password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="h-11"
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password">New password</Label>
              <Input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="h-11"
                placeholder="At least 8 characters"
                autoComplete="new-password"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <GradientButton type="submit" loading={savingPwd}>
              Update password
            </GradientButton>
          </div>
        </form>
      </GlassPanel>

      {/* Appearance */}
      <GlassPanel>
        <h2 className="font-display text-base font-medium">Appearance</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Driftframe defaults to light mode. Toggle to suit your environment.
        </p>
        <div className="mt-4 flex items-center justify-between rounded-xl bg-muted/40 p-4">
          <div className="flex items-center gap-3">
            {mounted && isDark ? (
              <Moon className="h-5 w-5 text-muted-foreground" />
            ) : (
              <Sun className="h-5 w-5 text-muted-foreground" />
            )}
            <div>
              <p className="text-sm font-medium">
                {mounted ? (isDark ? "Dark mode" : "Light mode") : "Loading…"}
              </p>
              <p className="text-xs text-muted-foreground">
                {mounted
                  ? isDark
                    ? "Near-black canvas, vibrant accents."
                    : "Warm off-white, same accent identity."
                  : ""}
              </p>
            </div>
          </div>
          <GradientButton
            variant="outline"
            onClick={() => setTheme(isDark ? "light" : "dark")}
          >
            Switch to {mounted && isDark ? "light" : "dark"}
          </GradientButton>
        </div>
        <div className="mt-2 flex justify-end">
          <ThemeToggle />
        </div>
      </GlassPanel>

      {/* Notifications */}
      <GlassPanel>
        <div className="flex items-center gap-2">
          <Bell className="h-4 w-4 text-muted-foreground" />
          <h2 className="font-display text-base font-medium">
            Notification preferences
          </h2>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          Choose which updates you want to receive.
        </p>
        <div className="mt-4 divide-y divide-border">
          <PrefRow
            label="Credits running low"
            desc="Get notified when your balance drops below 8 credits."
            checked={prefs.creditsLow}
            onChange={(v) => prefChange("creditsLow", v)}
          />
          <PrefRow
            label="Generation complete"
            desc="Notify when a batch finishes generating."
            checked={prefs.generationComplete}
            onChange={(v) => prefChange("generationComplete", v)}
          />
          <PrefRow
            label="Product updates"
            desc="New features, improvements, and changelog highlights."
            checked={prefs.productUpdates}
            onChange={(v) => prefChange("productUpdates", v)}
          />
          <PrefRow
            label="Weekly digest"
            desc="A summary of your generations, sent every Monday."
            checked={prefs.weeklyDigest}
            onChange={(v) => prefChange("weeklyDigest", v)}
          />
        </div>
      </GlassPanel>

      {/* Session */}
      <GlassPanel>
        <h2 className="font-display text-base font-medium">Session</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Sign out of Driftframe on this device.
        </p>
        <div className="mt-4">
          <GradientButton
            variant="outline"
            onClick={() => signOut({ callbackUrl: "/" })}
          >
            <LogOut className="h-4 w-4" /> Sign out
          </GradientButton>
        </div>
      </GlassPanel>

      {/* Danger zone */}
      <GlassPanel className="ring-1 ring-destructive/20">
        <div className="flex items-center gap-2">
          <ShieldAlert className="h-4 w-4 text-destructive" />
          <h2 className="font-display text-base font-medium text-destructive">
            Danger zone
          </h2>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          Permanently delete your account and all associated data. This action
          is irreversible.
        </p>
        <div className="mt-4">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-xl border border-destructive/30 px-4 py-2.5 text-sm font-medium text-destructive hover:bg-destructive/5 transition-colors min-h-[44px]"
              >
                <Trash2 className="h-4 w-4" /> Delete account
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete your account?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently remove your account, all generations,
                  and all images. Credits are non-refundable. This action
                  cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => {
                    toast.success(
                      "Demo mode — your account was not actually deleted. Wire a DELETE /api/user endpoint in production.",
                    );
                  }}
                  className="bg-destructive text-white hover:bg-destructive/90"
                >
                  Yes, delete forever
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </GlassPanel>
    </div>
  );
}

function PrefRow({
  label,
  desc,
  checked,
  onChange,
}: {
  label: string;
  desc: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
      <div className="min-w-0">
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-muted-foreground">{desc}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}
