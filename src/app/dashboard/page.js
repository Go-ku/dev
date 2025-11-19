import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { NavBar } from "@/components/layout/NavBar";
import { OverviewDashboard } from "@/components/dashboard/OverviewDashboard";

export const metadata = {
  title: "Dashboard · ZamReal"
};

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }

  return (
    <div className="space-y-8">
      <NavBar user={session.user} />
      <OverviewDashboard />
    </div>
  );
}
