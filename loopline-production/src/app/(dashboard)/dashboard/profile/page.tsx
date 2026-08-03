import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { DashboardTopbar } from "@/components/dashboard/sidebar";
import { ProfileClient } from "./profile-client";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/signin");

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, name: true, email: true, image: true, createdAt: true },
  });
  if (!user) redirect("/signin");

  return (
    <>
      <DashboardTopbar title="Profile" subtitle="Your personal account information" />
      <div className="container-loopline py-6">
        <ProfileClient
          user={{
            id: user.id,
            name: user.name || "",
            email: user.email,
            image: user.image,
            createdAt: user.createdAt.toISOString(),
          }}
        />
      </div>
    </>
  );
}
