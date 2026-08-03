"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Loader2, Save, Trash2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
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
import type { BotData } from "./bot-setup-tabs";

const PRESET_COLORS = [
  "#1a56db",
  "#0ea5e9",
  "#8b5cf6",
  "#ec4899",
  "#f43f5e",
  "#f59e0b",
  "#22c55e",
  "#14b8a6",
  "#0f172a",
];

export function BotSettingsPanel({
  bot,
  color,
  setColor,
  name,
  setName,
  welcome,
  setWelcome,
}: {
  bot: BotData;
  color: string;
  setColor: (c: string) => void;
  name: string;
  setName: (n: string) => void;
  welcome: string;
  setWelcome: (w: string) => void;
}) {
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();

  const dirty =
    name !== bot.name ||
    color !== bot.primaryColor ||
    welcome !== bot.welcomeMessage;

  async function onSave() {
    if (!name.trim()) {
      toast.error("Bot name is required");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(`/api/bots/${bot.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          primaryColor: color,
          welcomeMessage: welcome.trim() || "Hi! How can I help you today?",
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        toast.error(json.error || "Save failed");
        setSaving(false);
        return;
      }
      toast.success("Bot updated");
      router.refresh();
    } catch (e) {
      toast.error("Save failed");
      setSaving(false);
    }
  }

  async function onDelete() {
    setDeleting(true);
    try {
      const res = await fetch(`/api/bots/${bot.id}`, { method: "DELETE" });
      if (!res.ok) {
        toast.error("Delete failed");
        setDeleting(false);
        return;
      }
      toast.success("Bot deleted");
      router.push("/dashboard/bots");
      router.refresh();
    } catch (e) {
      toast.error("Delete failed");
      setDeleting(false);
    }
  }

  return (
    <div className="space-y-5">
      <Card className="p-5 space-y-4">
        <div>
          <h3 className="font-display text-lg text-foreground">Bot settings</h3>
          <p className="text-xs text-muted-foreground">
            Updates apply instantly to the widget preview and to any installed widget.
          </p>
        </div>

        <div>
          <Label htmlFor="bot-name">Bot name</Label>
          <Input
            id="bot-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1.5"
            placeholder="Acme Support Bot"
          />
        </div>

        <div>
          <Label htmlFor="bot-welcome">Welcome message</Label>
          <Textarea
            id="bot-welcome"
            rows={2}
            value={welcome}
            onChange={(e) => setWelcome(e.target.value)}
            className="mt-1.5 resize-none"
            placeholder="Hi! How can I help you today?"
          />
          <p className="mt-1 text-xs text-muted-foreground">
            Shown to visitors the first time they open the widget.
          </p>
        </div>

        <div>
          <Label>Primary color</Label>
          <div className="mt-2 flex flex-wrap gap-2">
            {PRESET_COLORS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                className={`h-8 w-8 rounded-lg transition ${
                  color === c ? "ring-2 ring-offset-2 ring-offset-card ring-foreground" : ""
                }`}
                style={{ backgroundColor: c }}
                aria-label={`Color ${c}`}
              />
            ))}
            <label
              className="relative h-8 w-8 cursor-pointer overflow-hidden rounded-lg border border-border"
              style={{ backgroundColor: color }}
              title="Custom color"
            >
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="absolute inset-0 cursor-pointer opacity-0"
              />
            </label>
          </div>
        </div>

        <Button onClick={onSave} disabled={saving || !dirty}>
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

      <Card className="border-destructive/30 p-5">
        <div className="flex items-start gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
            <AlertTriangle className="h-4 w-4" />
          </span>
          <div className="flex-1">
            <h3 className="font-display text-base text-foreground">Delete bot</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Permanently delete this bot, its knowledge base, and all conversation history. This cannot be undone.
            </p>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm" className="mt-3 text-destructive hover:text-destructive">
                  <Trash2 className="h-4 w-4" />
                  Delete bot
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete &quot;{name}&quot;?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete the bot, all knowledge chunks,
                    and all conversations tied to it. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={onDelete}
                    disabled={deleting}
                    className="bg-destructive text-white hover:bg-destructive/90"
                  >
                    {deleting ? "Deleting…" : "Delete permanently"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </Card>
    </div>
  );
}
