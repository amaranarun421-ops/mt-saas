import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { HistoryGallery } from "@/components/driftframe/history-gallery";
import type { ImageCardData } from "@/components/driftframe/image-card";
import { redirect } from "next/navigation";

export default async function HistoryPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/signin?callbackUrl=/dashboard/history");

  const rows = await db.image.findMany({
    where: { generation: { userId: session.user.id } },
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

  return <HistoryGallery images={images} />;
}
