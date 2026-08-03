import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { FavoritesGallery } from "@/components/driftframe/favorites-gallery";
import type { ImageCardData } from "@/components/driftframe/image-card";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function FavoritesPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/signin?callbackUrl=/dashboard/favorites");

  const rows = await db.image.findMany({
    where: { generation: { userId: session.user.id }, isFavorite: true },
    orderBy: { createdAt: "desc" },
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

  return <FavoritesGallery images={images} />;
}
