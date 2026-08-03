"use client";

import * as React from "react";
import { toast } from "sonner";
import { MasonryGrid, MasonryItem } from "@/components/driftframe/masonry-grid";
import { ImageCard, type ImageCardData } from "@/components/driftframe/image-card";
import { Lightbox } from "@/components/driftframe/lightbox";
import { UndrawEmpty } from "@/components/driftframe/illustrations";
import { GradientLink } from "@/components/driftframe/gradient-button";
import { Heart } from "lucide-react";

interface FavoritesGalleryProps {
  images: ImageCardData[];
}

/**
 * Read-only masonry of the user's favorited images. Clicking a tile opens
 * the lightbox. Toggling favorite from the card removes it from the view.
 */
export function FavoritesGallery({ images: initial }: FavoritesGalleryProps) {
  const [images, setImages] = React.useState(initial);
  const [lightboxIndex, setLightboxIndex] = React.useState<number | null>(null);

  async function toggleFavorite(image: ImageCardData) {
    const next = !image.isFavorite;
    setImages((prev) =>
      next
        ? prev.map((i) => (i.id === image.id ? { ...i, isFavorite: true } : i))
        : prev.filter((i) => i.id !== image.id),
    );
    try {
      await fetch(`/api/images/${image.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ favorite: next }),
      });
      if (!next) toast.success("Removed from favorites.");
    } catch {
      // Revert on failure
      setImages(initial);
      toast.error("Could not update favorite.");
    }
  }

  if (images.length === 0) {
    return (
      <div className="driftframe-container-wide flex max-w-md flex-col items-center py-20 text-center">
        <div className="h-56 w-56">
          <UndrawEmpty />
        </div>
        <h2 className="mt-4 font-display text-2xl">No favorites yet</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Tap the heart on any image to save it here for quick access.
        </p>
        <GradientLink href="/dashboard/history" className="mt-6">
          Browse your history
        </GradientLink>
      </div>
    );
  }

  return (
    <div className="driftframe-container-wide py-6">
      <div className="mb-6 flex items-center gap-2">
        <Heart className="h-4 w-4 text-[#ff3d81]" fill="currentColor" />
        <span className="text-sm font-medium">Favorites</span>
        <span className="driftframe-pill">
          {images.length} {images.length === 1 ? "image" : "images"}
        </span>
      </div>
      <MasonryGrid>
        {images.map((img, i) => (
          <MasonryItem key={img.id}>
            <ImageCard
              image={img}
              onOpen={() => setLightboxIndex(i)}
              onToggleFavorite={toggleFavorite}
            />
          </MasonryItem>
        ))}
      </MasonryGrid>

      <Lightbox
        images={images}
        index={lightboxIndex ?? 0}
        open={lightboxIndex !== null}
        onClose={() => setLightboxIndex(null)}
        onIndexChange={setLightboxIndex}
      />
    </div>
  );
}
