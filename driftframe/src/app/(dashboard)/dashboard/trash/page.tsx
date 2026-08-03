import { Trash2, RotateCcw, Sparkles } from "lucide-react";
import { GlassPanel } from "@/components/driftframe/glass-panel";
import { GradientLink } from "@/components/driftframe/gradient-button";

export const metadata = {
  title: "Trash — Driftframe",
};

export default function TrashPage() {
  return (
    <div className="driftframe-container-wide py-6 space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <Trash2 className="h-5 w-5 text-[#7c3aed]" />
          <h1 className="font-display text-2xl font-semibold tracking-tight">
            Trash
          </h1>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          Deleted images are kept here for 30 days before being permanently
          removed.
        </p>
      </div>

      {/* Empty state */}
      <GlassPanel className="flex flex-col items-center justify-center py-16 text-center">
        <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-muted">
          <Trash2 className="h-6 w-6 text-muted-foreground" />
        </span>
        <h2 className="mt-4 font-display text-xl font-medium">Trash is empty</h2>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          Deleted images will appear here for 30 days. You can restore them or
          permanently remove them at any time.
        </p>
        <div className="mt-6">
          <GradientLink href="/dashboard" leftIcon={<Sparkles className="h-4 w-4" />}>
            Back to studio
          </GradientLink>
        </div>
      </GlassPanel>

      {/* What's restorable — explainer card */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <GlassPanel>
          <RotateCcw className="h-5 w-5 text-[#7c3aed]" />
          <h3 className="mt-3 font-display text-sm font-medium">Restore anytime</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Within 30 days, any image you deleted can be brought back to your
            gallery.
          </p>
        </GlassPanel>
        <GlassPanel>
          <Trash2 className="h-5 w-5 text-muted-foreground" />
          <h3 className="mt-3 font-display text-sm font-medium">Auto-purge after 30 days</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            After 30 days, deleted images are permanently removed from our
            servers.
          </p>
        </GlassPanel>
        <GlassPanel>
          <Sparkles className="h-5 w-5 text-[#7c3aed]" />
          <h3 className="mt-3 font-display text-sm font-medium">Credits not refunded</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Deleting an image doesn&apos;t refund the credits used to generate
            it. Be sure before you trash.
          </p>
        </GlassPanel>
      </div>
    </div>
  );
}
