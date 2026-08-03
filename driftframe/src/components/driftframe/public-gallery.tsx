"use client";

import * as React from "react";
import { MasonryGrid, MasonryItem } from "@/components/driftframe/masonry-grid";
import { ImageCard, type ImageCardData } from "@/components/driftframe/image-card";
import { Lightbox } from "@/components/driftframe/lightbox";
import { GradientLink } from "@/components/driftframe/gradient-button";

interface PublicGalleryProps {
  images: ImageCardData[];
}

/** Read-only masonry + lightbox for the public /gallery page. */
export function PublicGallery({ images }: PublicGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = React.useState<number | null>(null);

  if (images.length === 0) {
    return (
      <div className="driftframe-container flex max-w-md flex-col items-center py-20 text-center">
        <h2 className="font-display text-2xl">No public showcases yet</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Once creators publish images, they&apos;ll appear here.
        </p>
        <GradientLink href="/signup" className="mt-6">
          Be the first
        </GradientLink>
      </div>
    );
  }

  return (
    <div className="driftframe-container-wide py-6">
      <div className="mb-6 flex items-center gap-2">
        <span className="driftframe-pill">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
          {images.length} public {images.length === 1 ? "image" : "images"}
        </span>
      </div>
      <MasonryGrid>
        {images.map((img, i) => (
          <MasonryItem key={img.id}>
            <ImageCard
              image={img}
              showActions={false}
              onOpen={() => setLightboxIndex(i)}
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
