import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { UsageDashboard } from "@/components/driftframe/usage-dashboard";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function UsagePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/signin?callbackUrl=/dashboard/usage");

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  let recentGens: Array<{ createdAt: Date; style: string }> = [];
  let allGens: Array<{ style: string }> = [];
  let imageCount = 0;
  let favCount = 0;
  let pubCount = 0;

  try {
    [recentGens, allGens, imageCount, favCount, pubCount] = await Promise.all([
      db.generation.findMany({ where: { userId: session.user.id, createdAt: { gte: thirtyDaysAgo } }, select: { createdAt: true, style: true } }),
      db.generation.findMany({ where: { userId: session.user.id }, select: { style: true } }),
      db.image.count({ where: { generation: { userId: session.user.id } } }),
      db.image.count({ where: { generation: { userId: session.user.id }, isFavorite: true } }),
      db.image.count({ where: { generation: { userId: session.user.id }, isPublic: true } }),
    ]);
  } catch (error) {
    console.error("[driftframe usage] showcase fallback", error);
  }

  const dailyMap = new Map<string, number>();
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    dailyMap.set(key, 0);
  }
  for (const g of recentGens) {
    const key = g.createdAt.toISOString().slice(0, 10);
    if (dailyMap.has(key)) dailyMap.set(key, (dailyMap.get(key) ?? 0) + 1);
  }
  const dailyGenerations = Array.from(dailyMap.entries()).map(([date, count]) => ({ date, count }));

  const styleMap = new Map<string, number>();
  for (const g of allGens) styleMap.set(g.style, (styleMap.get(g.style) ?? 0) + 1);
  const styleDistribution = Array.from(styleMap.entries()).map(([style, count]) => ({ style, count })).sort((a, b) => b.count - a.count);

  return (
    <UsageDashboard
      dailyGenerations={dailyGenerations}
      styleDistribution={styleDistribution}
      creditsUsed={imageCount}
      imagesGenerated={imageCount}
      favoritesCount={favCount}
      publicCount={pubCount}
    />
  );
}
