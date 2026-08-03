import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { DashboardTopbar } from "@/components/dashboard/sidebar";
import { HelpClient } from "./help-client";

export default async function HelpPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.workspaceId) redirect("/signin");
  return (
    <>
      <DashboardTopbar title="Help & Support" subtitle="Find answers and reach our team" />
      <div className="container-loopline py-6">
        <HelpClient userEmail={session.user.email!} />
      </div>
    </>
  );
}
