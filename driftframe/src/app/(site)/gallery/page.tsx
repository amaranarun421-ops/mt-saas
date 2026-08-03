import { PublicGallery } from "@/components/driftframe/public-gallery";
import type { ImageCardData } from "@/components/driftframe/image-card";

export const dynamic = "force-dynamic";

export default async function GalleryPage() {
  let rows: Array<{
    id: string;
    url: string;
    width: number;
    height: number;
    isFavorite: boolean;
    isPublic: boolean;
    generation: {
      prompt: string;
      style: string;
      aspectRatio: string;
    };
  }> = [];

  if (!SHOWCASE_MODE && process.env.DATABASE_URL) {
  try {
    const { db } = await import("@/lib/db");
    rows = await db.image.findMany({
      where: { isPublic: true },
      orderBy: { createdAt: "desc" },
      take: 80,
      select: {
        id: true,
        url: true,
        width: true,
        height: true,
        isFavorite: true,
        isPublic: true,
        generation: {
          select: { prompt: true, style: true, aspectRatio: true },
        },
      },
    });
  } catch (error) {
    console.error("[driftframe gallery] showcase fallback", error);
  }
}

  const images: ImageCardData[] = rows.map((img) => ({
    id: img.id,
    url: img.url,
    width: img.width,
    height: img.height,
    isFavorite: img.isFavorite,
    isPublic: img.isPublic,
    prompt: img.generation.prompt,
    style: img.generation.style,
    aspectRatio: img.generation.aspectRatio,
  }));

  return (
    <div>
      <section className="bg-radial-spotlight">
        <div className="driftframe-container pb-10 pt-14">
          <span className="driftframe-pill">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Public showcase
          </span>
          <h1 className="mt-5 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
            See what creators are <span className="text-[#7c3aed]">making</span>.
          </h1>
          <p className="mt-3 max-w-xl text-sm text-muted-foreground sm:text-base">
            A live feed of images creators have chosen to share. Click any tile
            to view it full-size in the lightbox.
          </p>
        </div>
      </section>
      <PublicGallery images={images} />
    </div>
  );
}
