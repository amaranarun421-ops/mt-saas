"use client";

import * as React from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import {
  Sparkles,
  SlidersHorizontal,
  Wand2,
  ImageOff,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { GlassPanel } from "@/components/driftframe/glass-panel";
import { GradientButton } from "@/components/driftframe/gradient-button";
import { StyleChip } from "@/components/driftframe/style-chip";
import { MasonryGrid, MasonryItem } from "@/components/driftframe/masonry-grid";
import { ImageCard, type ImageCardData } from "@/components/driftframe/image-card";
import { ShimmerSkeleton } from "@/components/driftframe/shimmer-skeleton";
import { ProgressRing } from "@/components/driftframe/progress-ring";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  STYLE_PRESETS,
  ASPECT_RATIOS,
  GENERATION_COST_CREDITS,
} from "@/lib/constants";
import { aspectToDimensions } from "@/lib/ai";

interface GenerateStudioProps {
  initialImages: ImageCardData[];
  initialCredits: number;
  initialPrompt?: string;
  initialStyle?: string;
  initialAspectRatio?: string;
  /** When true, omits the outer `driftframe-container-wide` wrapper so the
   *  studio can be embedded inside another page that already provides the
   *  container (e.g. /dashboard's home header). */
  embedded?: boolean;
}

interface PendingTile {
  id: string;
  aspectRatio: string;
}

export function GenerateStudio({
  initialImages,
  initialCredits,
  initialPrompt = "",
  initialStyle,
  initialAspectRatio,
  embedded = false,
}: GenerateStudioProps) {
  const { update } = useSession();
  const [prompt, setPrompt] = React.useState(initialPrompt);
  const [negativePrompt, setNegativePrompt] = React.useState("");
  const [style, setStyle] = React.useState(
    initialStyle && STYLE_PRESETS.some((s) => s.id === initialStyle)
      ? initialStyle
      : STYLE_PRESETS[0].id,
  );
  const [aspectRatio, setAspectRatio] = React.useState(
    initialAspectRatio && ASPECT_RATIOS.some((a) => a.id === initialAspectRatio)
      ? initialAspectRatio
      : ASPECT_RATIOS[0].id,
  );
  const [showAdvanced, setShowAdvanced] = React.useState(false);

  const [images, setImages] = React.useState<ImageCardData[]>(initialImages);
  const [pending, setPending] = React.useState<PendingTile[]>([]);
  const [progress, setProgress] = React.useState(0);
  const [generating, setGenerating] = React.useState(false);
  const [credits, setCredits] = React.useState(initialCredits);

  // Keep local credits in sync if the session updates (e.g. after buying).
  const { data: session } = useSession();
  React.useEffect(() => {
    if (typeof session?.user?.creditsRemaining === "number") {
      setCredits(session.user.creditsRemaining);
    }
  }, [session?.user?.creditsRemaining]);

  // Simulated progress while generating (the API sleeps ~1.4s).
  React.useEffect(() => {
    if (!generating) return;
    setProgress(8);
    const interval = setInterval(() => {
      setProgress((p) => (p >= 92 ? p : p + Math.max(1, (92 - p) / 8)));
    }, 120);
    return () => clearInterval(interval);
  }, [generating]);

  const canGenerate =
    prompt.trim().length >= 3 && !generating && credits >= GENERATION_COST_CREDITS;

  async function handleGenerate() {
    if (!canGenerate) {
      if (credits < GENERATION_COST_CREDITS) {
        toast.error("Not enough credits. Buy more to keep generating.");
      } else if (prompt.trim().length < 3) {
        toast.error("Describe what you want to generate (3+ characters).");
      }
      return;
    }

    const dims = aspectToDimensions(aspectRatio);
    // Render 4 shimmer tiles at the top of the grid.
    const tiles: PendingTile[] = Array.from({ length: 4 }, (_, i) => ({
      id: `pending-${Date.now()}-${i}`,
      aspectRatio: `${dims.width} / ${dims.height}`,
    }));
    setPending(tiles);
    setGenerating(true);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: prompt.trim(),
          negativePrompt: negativePrompt.trim() || null,
          style,
          aspectRatio,
        }),
      });
      const data = await res.json();

      if (res.status === 402) {
        toast.error("Not enough credits. Buy more to keep generating.");
        return;
      }
      if (!res.ok) {
        throw new Error(data?.error || "generation_failed");
      }

      // Prepend the new images to the grid.
      const newImages: ImageCardData[] = data.images.map((img: any) => ({
        id: img.id,
        url: img.url,
        width: img.width,
        height: img.height,
        isFavorite: img.isFavorite,
        isPublic: img.isPublic,
        prompt: prompt.trim(),
        style,
        aspectRatio,
      }));
      setImages((prev) => [...newImages, ...prev]);
      setCredits(data.creditsRemaining);
      setProgress(100);
      // Refresh the session JWT so the header credit pill updates.
      update();
      toast.success("4 images generated.");
    } catch (e: any) {
      toast.error(e.message || "Generation failed. Your credits were not charged.");
    } finally {
      // Brief delay so the 100% ring is visible.
      setTimeout(() => {
        setPending([]);
        setProgress(0);
        setGenerating(false);
      }, 250);
    }
  }

  async function toggleFavorite(image: ImageCardData) {
    // Optimistic
    setImages((prev) =>
      prev.map((i) =>
        i.id === image.id ? { ...i, isFavorite: !i.isFavorite } : i,
      ),
    );
    try {
      await fetch(`/api/images/${image.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ favorite: !image.isFavorite }),
      });
    } catch {
      // Revert on failure
      setImages((prev) =>
        prev.map((i) =>
          i.id === image.id ? { ...i, isFavorite: image.isFavorite } : i,
        ),
      );
      toast.error("Could not update favorite.");
    }
  }

  async function togglePublic(image: ImageCardData) {
    const next = !image.isPublic;
    setImages((prev) =>
      prev.map((i) => (i.id === image.id ? { ...i, isPublic: next } : i)),
    );
    try {
      await fetch(`/api/images/${image.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublic: next }),
      });
      toast.success(next ? "Image is now public." : "Image is now private.");
    } catch {
      setImages((prev) =>
        prev.map((i) => (i.id === image.id ? { ...i, isPublic: image.isPublic } : i)),
      );
      toast.error("Could not update visibility.");
    }
  }

  function generateVariation(image: ImageCardData) {
    setPrompt(image.prompt || prompt);
    if (image.style) setStyle(image.style);
    if (image.aspectRatio) setAspectRatio(image.aspectRatio);
    toast.info("Prompt loaded — press Generate to create variations.");
    // Scroll the prompt into view on mobile.
    document.getElementById("prompt-textarea")?.focus();
  }

  const promptPlaceholder =
    "A bioluminescent jellyfish drifting through a neon city skyline at dusk, cinematic, ultra-detailed…";

  return (
    <div className={cn(
      "gap-6 lg:grid lg:grid-cols-[340px_1fr]",
      embedded ? "py-0" : "driftframe-container-wide py-6",
    )}>
      {/* Prompt sidebar */}
      <aside className="mb-6 lg:mb-0">
        <GlassPanel className="lg:sticky lg:top-20">
          <div className="space-y-5">
            <div>
              <Label htmlFor="prompt-textarea" className="text-sm font-medium">
                Prompt
              </Label>
              <Textarea
                id="prompt-textarea"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={promptPlaceholder}
                className="mt-2 min-h-[120px] resize-none"
                maxLength={2000}
              />
              <div className="mt-1 text-right text-xs text-muted-foreground">
                {prompt.length}/2000
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium">Style</Label>
              <div className="mt-2 flex flex-wrap gap-2">
                {STYLE_PRESETS.map((s) => (
                  <StyleChip
                    key={s.id}
                    label={s.label}
                    selected={style === s.id}
                    onSelect={() => setStyle(s.id)}
                  />
                ))}
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium">Aspect ratio</Label>
              <div className="mt-2 flex flex-wrap gap-2">
                {ASPECT_RATIOS.map((a) => (
                  <StyleChip
                    key={a.id}
                    label={a.label}
                    selected={aspectRatio === a.id}
                    onSelect={() => setAspectRatio(a.id)}
                  />
                ))}
              </div>
            </div>

            <div>
              <button
                type="button"
                onClick={() => setShowAdvanced((v) => !v)}
                className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <SlidersHorizontal className="h-4 w-4" />
                Advanced
                {showAdvanced ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </button>
              {showAdvanced && (
                <div className="mt-3">
                  <Label htmlFor="negative-prompt" className="text-xs">
                    Negative prompt
                  </Label>
                  <Textarea
                    id="negative-prompt"
                    value={negativePrompt}
                    onChange={(e) => setNegativePrompt(e.target.value)}
                    placeholder="blurry, low quality, watermark…"
                    className="mt-1.5 min-h-[72px] resize-none"
                    maxLength={500}
                  />
                </div>
              )}
            </div>

            <div className="border-t border-border pt-4">
              <GradientButton
                className="w-full"
                onClick={handleGenerate}
                disabled={!canGenerate}
                loading={generating}
                leftIcon={!generating ? <Wand2 className="h-4 w-4" /> : undefined}
              >
                {generating ? "Generating…" : `Generate 4 images`}
              </GradientButton>
              <div className="mt-2 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                <Sparkles className="h-3 w-3" />
                Costs {GENERATION_COST_CREDITS} credits · you have{" "}
                <span className="text-foreground font-medium tabular-nums">{credits}</span>
              </div>
            </div>
          </div>
        </GlassPanel>
      </aside>

      {/* Canvas */}
      <section>
        {images.length === 0 && pending.length === 0 ? (
          <EmptyCanvas placeholder={promptPlaceholder} />
        ) : (
          <MasonryGrid>
            {pending.map((tile) => (
              <MasonryItem key={tile.id}>
                <div className="relative w-full overflow-hidden rounded-2xl">
                  <ShimmerSkeleton aspectRatio={tile.aspectRatio} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <ProgressRing progress={progress} size={64} label={`${Math.round(progress)}%`} />
                  </div>
                </div>
              </MasonryItem>
            ))}

            {images.map((img) => (
              <MasonryItem key={img.id}>
                <ImageCard
                  image={img}
                  onToggleFavorite={toggleFavorite}
                  onTogglePublic={togglePublic}
                  onGenerateVariation={generateVariation}
                />
              </MasonryItem>
            ))}
          </MasonryGrid>
        )}
      </section>
    </div>
  );
}

function EmptyCanvas({ placeholder }: { placeholder: string }) {
  return (
    <GlassPanel className="flex min-h-[400px] flex-col items-center justify-center text-center">
      <div className="rounded-2xl border border-border bg-card p-4">
        <ImageOff className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="mt-4 font-display text-xl">Your canvas is empty</h3>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        Describe an image in the prompt panel and hit Generate. You&apos;ll get
        4 variations in seconds.
      </p>
      <p className="mt-3 max-w-md text-xs italic text-muted-foreground/70">
        e.g. &ldquo;{placeholder}&rdquo;
      </p>
    </GlassPanel>
  );
}
