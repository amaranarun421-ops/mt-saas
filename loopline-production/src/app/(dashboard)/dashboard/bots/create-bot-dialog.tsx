"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Plus, Loader2, Lock } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

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

export function CreateBotDialog({
  canCreate,
  planName,
}: {
  canCreate: boolean;
  planName: string;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [color, setColor] = useState(PRESET_COLORS[0]);
  const [welcome, setWelcome] = useState("Hi! How can I help you today?");
  const router = useRouter();

  async function onCreate() {
    if (!name.trim()) {
      toast.error("Bot name is required");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/bots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          primaryColor: color,
          welcomeMessage: welcome.trim() || "Hi! How can I help you today?",
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        toast.error(json.error || "Failed to create bot");
        setLoading(false);
        return;
      }
      toast.success("Bot created!");
      setOpen(false);
      setName("");
      setWelcome("Hi! How can I help you today?");
      setColor(PRESET_COLORS[0]);
      router.push(`/dashboard/bots/${json.bot.id}/setup`);
      router.refresh();
    } catch (e) {
      toast.error("Something went wrong");
      setLoading(false);
    }
  }

  if (!canCreate) {
    return (
      <Button asChild>
        <Link href="/dashboard/billing">
          <Lock className="h-4 w-4" />
          Upgrade to add bots
        </Link>
      </Button>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4" />
          New bot
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create a new bot</DialogTitle>
          <DialogDescription>
            Each bot powers one widget on one site. You can theme it independently.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div>
            <Label htmlFor="bot-name">Bot name</Label>
            <Input
              id="bot-name"
              placeholder="Acme Support Bot"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1.5"
              autoFocus
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
            />
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
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={onCreate} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Creating…
              </>
            ) : (
              "Create bot"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
