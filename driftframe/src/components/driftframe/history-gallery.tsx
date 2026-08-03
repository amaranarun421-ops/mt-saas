"use client";

import * as React from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { MasonryGrid, MasonryItem } from "@/components/driftframe/masonry-grid";
import { ImageCard, type ImageCardData } from "@/components/driftframe/image-card";
import { Lightbox } from "@/components/driftframe/lightbox";
import { UndrawEmpty } from "@/components/driftframe/illustrations";
import { GradientLink } from "@/components/driftframe/gradient-button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Heart, Filter } from "lucide-react";

interface HistoryGalleryProps {
  images: ImageCardData[];
}

const STYLE_FILTERS = [
  { value: "all", label: "All styles" },
  { value: "photographic", label: "Photographic" },
  { value: "anime", label: "Anime" },
  { value: "3d-render", label: "3D Render" },
  { value: "painting", label: "Painting" },
  { value: "sketch", label: "Sketch" },
];

export function HistoryGallery({ images: initial }: HistoryGalleryProps) {
  const [images, setImages] = React.useState(initial);
  const [styleFilter, setStyleFilter] = React.useState("all");
  const [favoritesOnly, setFavoritesOnly] = React.useState(false);
  const [lightboxIndex, setLightboxIndex] = React.useState<number | null>(null);

  const filtered = images.filter((img) => {
    if (favoritesOnly && !img.isFavorite) return false;
    if (styleFilter !== "all" && img.style !== styleFilter) return false;
    return true;
  });

  async function toggleFavorite(image: ImageCardData) {
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

  if (initial.length === 0) {
    return (
      <div className="driftframe-container flex max-w-md flex-col items-center py-20 text-center">
        <div className="h-56 w-56">
          <UndrawEmpty />
        </div>
        <h2 className="mt-4 font-display text-2xl">No generations yet</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Your generated images will live here. Head to the studio to create
          your first batch.
        </p>
        <GradientLink href="/dashboard" className="mt-6">
          Start creating
        </GradientLink>
      </div>
    );
  }

  return (
    <div className="driftframe-container-wide py-6">
      {/* Filter bar */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Filter</span>
          <span className="driftframe-pill">
            {filtered.length} / {images.length}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Select value={styleFilter} onValueChange={setStyleFilter}>
            <SelectTrigger className="w-[180px] driftframe-glass h-10">
              <SelectValue placeholder="Style" />
            </SelectTrigger>
            <SelectContent>
              {STYLE_FILTERS.map((s) => (
                <SelectItem key={s.value} value={s.value}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex items-center gap-2 rounded-full driftframe-glass px-3 py-1.5 h-10">
            <Heart className="h-3.5 w-3.5 text-muted-foreground" />
            <Label htmlFor="fav-only" className="text-xs cursor-pointer">
              Favorites only
            </Label>
            <Switch
              id="fav-only"
              checked={favoritesOnly}
              onCheckedChange={setFavoritesOnly}
            />
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card/60 p-10 text-center text-sm text-muted-foreground">
          No images match these filters.
        </div>
      ) : (
        <MasonryGrid>
          {filtered.map((img, i) => (
            <MasonryItem key={img.id}>
              <ImageCard
                image={img}
                onOpen={() => setLightboxIndex(i)}
                onToggleFavorite={toggleFavorite}
                onTogglePublic={togglePublic}
                onGenerateVariation={(image) => {
                  // Variation on history → navigate to dashboard with prompt prefill.
                  const url = new URL("/dashboard", window.location.origin);
                  url.searchParams.set("prompt", image.prompt || "");
                  if (image.style) url.searchParams.set("style", image.style);
                  if (image.aspectRatio)
                    url.searchParams.set("ratio", image.aspectRatio);
                  window.location.href = url.toString();
                }}
              />
            </MasonryItem>
          ))}
        </MasonryGrid>
      )}

      <Lightbox
        images={filtered}
        index={lightboxIndex ?? 0}
        open={lightboxIndex !== null}
        onClose={() => setLightboxIndex(null)}
        onIndexChange={setLightboxIndex}
        onGenerateVariation={(image) => {
          const url = new URL("/dashboard", window.location.origin);
          url.searchParams.set("prompt", image.prompt || "");
          if (image.style) url.searchParams.set("style", image.style);
          if (image.aspectRatio)
            url.searchParams.set("ratio", image.aspectRatio);
          window.location.href = url.toString();
        }}
      />
    </div>
  );
}
