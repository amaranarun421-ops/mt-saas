import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { DashboardTopbar } from "@/components/dashboard/sidebar";
import { ProfileClient } from "./profile-client";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/signin");

  let user: { id: string; name: string | null; email: string; image: string | null; createdAt: Date } | null = null;
  try {
    const { db } = await import("@/lib/db");
    user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, name: true, email: true, image: true, createdAt: true },
    });
  } catch (error) {
    console.error("[loopline profile] showcase fallback", error);
  }

  return (
    <>
      <DashboardTopbar title="Profile" subtitle="Your personal account information" />
      <div className="container-loopline py-6">
        <ProfileClient
          user={{
            id: user?.id ?? session.user.id,
            name: user?.name || session.user.name || "Loopline Demo",
            email: user?.email ?? session.user.email!,
            image: user?.image ?? null,
            createdAt: user?.createdAt.toISOString() ?? new Date().toISOString(),
          }}
        />
      </div>
    </>
  );
}
