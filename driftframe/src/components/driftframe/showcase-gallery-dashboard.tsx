"use client";

import * as React from "react";
import { toast } from "sonner";
import { MasonryGrid, MasonryItem } from "@/components/driftframe/masonry-grid";
import { ImageCard, type ImageCardData } from "@/components/driftframe/image-card";
import { Lightbox } from "@/components/driftframe/lightbox";
import { UndrawEmpty } from "@/components/driftframe/illustrations";
import { GradientLink } from "@/components/driftframe/gradient-button";
import { Globe2 } from "lucide-react";

interface ShowcaseGalleryProps {
  images: ImageCardData[];
}

/**
 * User's public images — toggle publish/unpublish from the card.
 */
export function ShowcaseGallery({ images: initial }: ShowcaseGalleryProps) {
  const [images, setImages] = React.useState(initial);
  const [lightboxIndex, setLightboxIndex] = React.useState<number | null>(null);

  async function togglePublic(image: ImageCardData) {
    const next = !image.isPublic;
    setImages((prev) =>
      next
        ? prev.map((i) => (i.id === image.id ? { ...i, isPublic: true } : i))
        : prev.filter((i) => i.id !== image.id),
    );
    try {
      await fetch(`/api/images/${image.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublic: next }),
      });
      toast.success(
        next ? "Image is now public." : "Image removed from showcase.",
      );
    } catch {
      setImages(initial);
      toast.error("Could not update visibility.");
    }
  }

  if (images.length === 0) {
    return (
      <div className="driftframe-container-wide flex max-w-md flex-col items-center py-20 text-center">
        <div className="h-56 w-56">
          <UndrawEmpty />
        </div>
        <h2 className="mt-4 font-display text-2xl">Your showcase is empty</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Toggle any image public from your history to feature it in the
          community gallery.
        </p>
        <GradientLink href="/dashboard/history" className="mt-6">
          Open history
        </GradientLink>
      </div>
    );
  }

  return (
    <div className="driftframe-container-wide py-6">
      <div className="mb-6 flex items-center gap-2">
        <Globe2 className="h-4 w-4 text-[#7c3aed]" />
        <span className="text-sm font-medium">Public showcase</span>
        <span className="driftframe-pill">
          {images.length} public {images.length === 1 ? "image" : "images"}
        </span>
      </div>
      <MasonryGrid>
        {images.map((img, i) => (
          <MasonryItem key={img.id}>
            <ImageCard
              image={img}
              onOpen={() => setLightboxIndex(i)}
              onTogglePublic={togglePublic}
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
        showOwnerActions={false}
      />
    </div>
  );
}
