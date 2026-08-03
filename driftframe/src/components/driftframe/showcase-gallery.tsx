"use client";

import * as React from "react";
import { MasonryGrid, MasonryItem } from "@/components/driftframe/masonry-grid";
import { ImageCard, type ImageCardData } from "@/components/driftframe/image-card";
import { Lightbox } from "@/components/driftframe/lightbox";

interface ShowcaseGalleryProps {
  images: ImageCardData[];
}

/**
 * Read-only masonry + lightbox for the landing-page showcase section.
 * Same read-only card style as the public /gallery page.
 */
export function ShowcaseGallery({ images }: ShowcaseGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = React.useState<number | null>(null);

  return (
    <>
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
    </>
  );
}
