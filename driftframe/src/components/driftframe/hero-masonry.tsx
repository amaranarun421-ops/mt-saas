"use client";

import * as React from "react";
import { MasonryGrid, MasonryItem } from "@/components/driftframe/masonry-grid";
import { ImageCard, type ImageCardData } from "@/components/driftframe/image-card";
import { Lightbox } from "@/components/driftframe/lightbox";
import { generateSvgArt } from "@/lib/ai/image-model";

const DEMO_TILES = [
  {
    prompt: "Bioluminescent jellyfish over a neon skyline at dusk",
    style: "photographic",
    seed: 1001,
    w: 600,
    h: 800,
  },
  {
    prompt: "Ancient forest cathedral, god rays through mist",
    style: "painting",
    seed: 1002,
    w: 600,
    h: 600,
  },
  {
    prompt: "Cyberpunk samurai in the rain, reflective puddles",
    style: "anime",
    seed: 1003,
    w: 600,
    h: 800,
  },
  {
    prompt: "Desert oasis mirage, floating geometric ruins",
    style: "3d-render",
    seed: 1004,
    w: 600,
    h: 450,
  },
  {
    prompt: "Underwater coral city inhabited by translucent fish",
    style: "painting",
    seed: 1005,
    w: 600,
    h: 750,
  },
  {
    prompt: "Volcanic glass palace on a floating island",
    style: "3d-render",
    seed: 1006,
    w: 600,
    h: 600,
  },
  {
    prompt: "Aurora over a mirror lake, lone wooden cabin",
    style: "photographic",
    seed: 1007,
    w: 600,
    h: 800,
  },
  {
    prompt: "Retro-futuristic diner on Mars at twilight",
    style: "sketch",
    seed: 1008,
    w: 600,
    h: 500,
  },
];

/** Static demo masonry used on the landing hero. Uses LOCAL SVG generative
 *  art (no network) so it always renders, even in sandboxed browsers. */
export function HeroMasonry() {
  const [lightboxIndex, setLightboxIndex] = React.useState<number | null>(null);

  const images: ImageCardData[] = React.useMemo(
    () =>
      DEMO_TILES.map((t, i) => ({
        id: `demo-${i}`,
        url: generateSvgArt({
          prompt: t.prompt,
          style: t.style,
          seed: t.seed,
          width: t.w,
          height: t.h,
        }),
        width: t.w,
        height: t.h,
        isFavorite: false,
        isPublic: true,
        prompt: t.prompt,
        style: t.style,
        aspectRatio: "1:1",
      })),
    [],
  );

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
