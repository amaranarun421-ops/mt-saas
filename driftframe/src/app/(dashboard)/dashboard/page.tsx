import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { GenerateStudio } from "@/components/driftframe/generate-studio";
import { DashboardHomeHeader } from "@/components/driftframe/dashboard-home-header";
import type { ImageCardData } from "@/components/driftframe/image-card";
import { redirect } from "next/navigation";

/**
 * /dashboard — main generation tool + home.
 *
 * v3: server component loads recent images + stats, then renders a top
 * section (welcome card + quick stats + recent activity feed) above the
 * generation studio.
 *
 * Supports ?prompt=&style=&ratio= query params (used by "generate
 * variation" from the history lightbox).
 */
export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ prompt?: string; style?: string; ratio?: string }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/signin?callbackUrl=/dashboard");

  const sp = await searchParams;

  // Load recent images, stats, and activity feed in parallel.
  const [recent, totalCount, favoriteCount, publicCount, recentGenerations] =
    await Promise.all([
      db.image.findMany({
        where: { generation: { userId: session.user.id } },
        orderBy: { createdAt: "desc" },
        take: 24,
        select: {
          id: true,
          url: true,
          width: true,
          height: true,
          isFavorite: true,
          isPublic: true,
          generation: {
            select: { prompt: true, style: true, aspectRatio: true, createdAt: true },
          },
        },
      }),
      db.image.count({ where: { generation: { userId: session.user.id } } }),
      db.image.count({
        where: { generation: { userId: session.user.id }, isFavorite: true },
      }),
      db.image.count({
        where: { generation: { userId: session.user.id }, isPublic: true },
      }),
      db.generation.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: "desc" },
        take: 5,
        select: {
          id: true,
          prompt: true,
          style: true,
          aspectRatio: true,
          createdAt: true,
          images: { take: 1, select: { url: true, width: true, height: true } },
        },
      }),
    ]);

  const initialImages: ImageCardData[] = recent.map((img) => ({
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

  const creditsRemaining = session.user.creditsRemaining ?? 0;
  // Demo: assume 100 starting credits (matches DEMO_CREDITS) — new users
  // start with 10, but for the home-card math we use 100 as a sensible
  // ceiling to keep the "used" stat meaningful.
  const startingCredits = 100;
  const creditsUsed = Math.max(0, startingCredits - creditsRemaining);

  const activity = recentGenerations.map((g) => ({
    id: g.id,
    prompt: g.prompt,
    style: g.style,
    aspectRatio: g.aspectRatio,
    createdAt: g.createdAt.toISOString(),
    thumb: g.images[0]?.url ?? null,
  }));

  return (
    <div className="driftframe-container-wide py-6">
      <DashboardHomeHeader
        name={session.user.name ?? null}
        creditsRemaining={creditsRemaining}
        creditsUsed={creditsUsed}
        imagesGenerated={totalCount}
        favoritesCount={favoriteCount}
        publicCount={publicCount}
        activity={activity}
      />
      <div className="mt-8">
        <GenerateStudio
          initialImages={initialImages}
          initialCredits={creditsRemaining}
          initialPrompt={sp.prompt}
          initialStyle={sp.style}
          initialAspectRatio={sp.ratio}
          embedded
        />
      </div>
    </div>
  );
}
